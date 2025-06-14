// /hooks/useActivities.js (Versión actualizada)
import { useState, useMemo, useCallback } from 'react';
import useUserStore from '@/lib/userStore';
import dataService from '@/lib/dataService';

export const useActivities = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    user,
    activities: userActivities,
    tokens,
    addActivity,
    updateActivity,
    completeActivity,
    removeActivity,
    isEnrolledInActivity,
    getEnrolledActivities,
    getCompletedActivities,
    setTokens,
    setUser
  } = useUserStore();

  // Memoizar los arrays para evitar recreaciones
  const enrolledActivities = useMemo(() => getEnrolledActivities(), [userActivities]);
  const completedActivities = useMemo(() => getCompletedActivities(), [userActivities]);

  // Obtener todas las actividades disponibles
  const getAvailableActivities = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const activities = await dataService.getActivities(filters);
      return activities;
    } catch (err) {
      setError('Error al cargar actividades disponibles');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Inscribirse en una actividad
  const enrollInActivity = useCallback(async (activity) => {
    if (isEnrolledInActivity(activity.id)) {
      throw new Error('Ya estás inscrito en esta actividad');
    }

    if (!user?.address) {
      throw new Error('Usuario no conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Llamar al servicio de datos para inscripción real
      const result = await dataService.enrollInActivity(
        activity.id, 
        user.id, 
        user.address
      );

      if (result.success) {
        // Agregar actividad al store local
        addActivity({
          id: activity.id,
          name: activity.name,
          location: activity.location,
          date: activity.date,
          tokensEarned: activity.tokensReward,
          type: activity.category,
          status: 'enrolled',
          completed: false,
          participationId: result.participationId,
          enrolledAt: new Date().toISOString()
        });

        console.log('✅ Inscrito en actividad:', activity.name);
        return result;
      } else {
        throw new Error(result.message || 'Error en la inscripción');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isEnrolledInActivity, addActivity, user]);

  // Desinscribirse de una actividad
  const unenrollFromActivity = useCallback(async (activityId) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada a API para desinscripción
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      removeActivity(activityId);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [removeActivity]);

  // Completar actividad (usado por el escáner QR)
  const markActivityCompleted = useCallback(async (activityId, participationId, tokensEarned) => {
    if (!user?.id) {
      throw new Error('Usuario no conectado');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Llamar al servicio de datos para completar actividad
      const result = await dataService.completeActivity(
        participationId,
        activityId,
        user.id
      );

      if (result.success) {
        // Actualizar actividad en el store
        completeActivity(activityId, result.tokensEarned);
        
        // Actualizar tokens del usuario
        const newTokenCount = tokens + result.tokensEarned;
        setTokens(newTokenCount);

        // Actualizar nivel del usuario si es necesario
        const newLevel = calculateUserLevel(newTokenCount);
        if (user.level !== newLevel) {
          setUser({
            ...user,
            tokens: newTokenCount,
            completedActivities: (user.completedActivities || 0) + 1,
            level: newLevel
          });
        }

        console.log('🎉 Actividad completada! Tokens ganados:', result.tokensEarned);
        return result;
      } else {
        throw new Error(result.message || 'Error al completar actividad');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [completeActivity, tokens, setTokens, user, setUser]);

  // Validar código QR y completar actividad
  const validateQRAndComplete = useCallback(async (qrCode, qrData) => {
    if (!user) {
      throw new Error('Usuario no conectado');
    }

    // Verificar si ya completó esta actividad
    const alreadyCompleted = userActivities?.some(
      a => a.id === qrData.activityId && a.completed
    );

    if (alreadyCompleted) {
      throw new Error('Ya has completado esta actividad anteriormente');
    }

    // Verificar si está inscrito en la actividad
    const enrollment = userActivities?.find(a => a.id === qrData.activityId);
    
    setIsLoading(true);
    setError(null);

    try {
      if (enrollment && enrollment.participationId) {
        // Si está inscrito, completar actividad
        return await markActivityCompleted(
          qrData.activityId,
          enrollment.participationId,
          qrData.tokensReward
        );
      } else {
        // Si no está inscrito, inscribir y completar automáticamente
        const activity = {
          id: qrData.activityId,
          name: qrData.activityName,
          location: qrData.location,
          tokensReward: qrData.tokensReward,
          category: 'completion' // Categoría especial para completiones directas
        };

        // Inscribir primero
        const enrollResult = await enrollInActivity(activity);
        
        if (enrollResult.success) {
          // Luego completar
          return await markActivityCompleted(
            qrData.activityId,
            enrollResult.participationId,
            qrData.tokensReward
          );
        } else {
          throw new Error('Error en la inscripción automática');
        }
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, userActivities, markActivityCompleted, enrollInActivity]);

  // Función para calcular nivel basado en tokens
  const calculateUserLevel = useCallback((tokens) => {
    if (tokens >= 500) return 'Ciudadano Gold';
    if (tokens >= 300) return 'Ciudadano Silver';
    if (tokens >= 100) return 'Ciudadano Bronze';
    if (tokens >= 50) return 'Ciudadano Activo';
    return 'Ciudadano Nuevo';
  }, []);

  // Obtener estadísticas del usuario
  const getUserStats = useCallback(() => {
    return {
      totalActivities: userActivities?.length || 0,
      completedActivities: completedActivities.length,
      pendingActivities: enrolledActivities.length,
      totalTokensEarned: completedActivities.reduce(
        (sum, activity) => sum + (activity.tokensEarned || 0), 0
      ),
      currentTokens: tokens,
      userLevel: user?.level || 'Ciudadano Nuevo'
    };
  }, [userActivities, completedActivities, enrolledActivities, tokens, user?.level]);

  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    user,
    userActivities,
    isLoading,
    error,
    
    // Computed (memoized)
    enrolledActivities,
    completedActivities,
    
    // Actions (memoized)
    getAvailableActivities,
    enrollInActivity,
    unenrollFromActivity,
    markActivityCompleted,
    validateQRAndComplete, // Nueva función para QR
    isEnrolledInActivity,
    
    // Stats
    getUserStats,
    
    // Utils
    clearError,
    calculateUserLevel
  };
};