// /hooks/useChontaData.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useBalance, useEnsName } from 'wagmi';
import dataService from '@/lib/dataService';
import useUserStore from '@/lib/userStore';

export const useChontaData = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  
  const { 
    user: storeUser, 
    setUser, 
    tokens: storeTokens,
    setTokens,
    activities: storeActivities,
    addActivity,
    updateActivity,
    completeActivity,
    isEnrolledInActivity,
    clearUser
  } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ===== INICIALIZACIÓN DEL USUARIO =====
  useEffect(() => {
    const initializeUser = async () => {
      console.log('🔄 Inicializando usuario...', { address, isConnected });
      
      if (!isConnected || !address) {
        console.log('❌ Wallet no conectada, limpiando usuario');
        clearUser();
        setIsInitialized(true);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('📡 Obteniendo datos del usuario para:', address);
        
        // Obtener o crear usuario basado en wallet address
        const userData = await dataService.getCurrentUser(address);
        console.log('👤 Datos del usuario obtenidos:', userData);
        
        // Combinar con datos de wallet real
        const enhancedUser = {
          ...userData,
          address: address,
          ensName: ensName || userData.ensName || null,
          walletBalance: balance?.formatted || '0',
          walletSymbol: balance?.symbol || 'ETH',
          // Si no tiene nombre, usar ENS o generar uno basado en wallet
          name: userData.name || ensName || `Usuario ${address.slice(0, 6)}`,
          // Asegurar que tenga email si no existe
          email: userData.email || `user${address.slice(0, 8)}@chontacoin.com`
        };

        console.log('✨ Usuario final:', enhancedUser);

        // Actualizar stores
        setUser(enhancedUser);
        setTokens(userData.tokens || 0);
        setIsInitialized(true);

      } catch (err) {
        console.error('❌ Error al inicializar usuario:', err);
        
        // Crear usuario básico si hay error
        const fallbackUser = {
          id: Date.now(),
          name: ensName || `Usuario ${address.slice(0, 6)}`,
          email: `user${address.slice(0, 8)}@chontacoin.com`,
          address: address,
          ensName: ensName || null,
          joinedDate: new Date().toISOString(),
          neighborhood: 'Cali, Valle del Cauca',
          tokens: 0,
          completedActivities: 0,
          level: 'Ciudadano Nuevo',
          walletBalance: balance?.formatted || '0',
          walletSymbol: balance?.symbol || 'ETH'
        };
        
        console.log('🔄 Usando usuario fallback:', fallbackUser);
        setUser(fallbackUser);
        setTokens(0);
        setError('Usuario creado localmente');
        setIsInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    // Solo inicializar si cambió la dirección o el estado de conexión
    if (!isInitialized || storeUser?.address !== address) {
      initializeUser();
    }
  }, [address, isConnected, ensName, balance?.formatted, balance?.symbol]);

  // ===== EFECTO PARA LIMPIAR CUANDO SE DESCONECTA =====
  useEffect(() => {
    if (!isConnected && isInitialized) {
      console.log('🔌 Wallet desconectada, limpiando datos');
      clearUser();
    }
  }, [isConnected, isInitialized, clearUser]);

  // ===== ACTIVIDADES =====
  const getActivities = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const activities = await dataService.getActivities(filters);
      return activities;
    } catch (err) {
      setError('Error al cargar actividades');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const enrollInActivity = useCallback(async (activity) => {
    const currentUser = storeUser;
    
    if (!currentUser || !address) {
      throw new Error('Usuario no conectado');
    }

    if (isEnrolledInActivity(activity.id)) {
      throw new Error('Ya estás inscrito en esta actividad');
    }

    try {
      setLoading(true);
      
      // Llamar al servicio
      const result = await dataService.enrollInActivity(
        activity.id, 
        currentUser.id, 
        address
      );

      if (result.success) {
        // Actualizar store local
        addActivity({
          id: activity.id,
          name: activity.name,
          location: activity.location,
          date: activity.date,
          tokensEarned: activity.tokensReward,
          type: activity.category,
          status: 'enrolled',
          completed: false,
          participationId: result.participationId
        });

        return result;
      } else {
        throw new Error(result.message || 'Error en la inscripción');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storeUser, address, isEnrolledInActivity, addActivity]);

  const markActivityCompleted = useCallback(async (activityId, participationId) => {
    const currentUser = storeUser;
    
    if (!currentUser) {
      throw new Error('Usuario no conectado');
    }

    try {
      setLoading(true);
      
      const result = await dataService.completeActivity(
        participationId,
        activityId,
        currentUser.id
      );

      if (result.success) {
        // Actualizar store local
        completeActivity(activityId, result.tokensEarned);
        
        // Actualizar tokens del usuario
        const newTokenCount = storeTokens + result.tokensEarned;
        setTokens(newTokenCount);

        return result;
      } else {
        throw new Error(result.message || 'Error al completar actividad');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storeUser, completeActivity, storeTokens, setTokens]);

  // ===== RECOMPENSAS =====
  const getRewards = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const rewards = await dataService.getRewards(filters);
      return rewards;
    } catch (err) {
      setError('Error al cargar recompensas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const redeemReward = useCallback(async (reward) => {
    const currentUser = storeUser;
    
    if (!currentUser) {
      throw new Error('Usuario no conectado');
    }

    if (storeTokens < reward.cost) {
      throw new Error('Tokens insuficientes');
    }

    try {
      setLoading(true);
      
      const result = await dataService.redeemReward(
        reward.id,
        currentUser.id,
        reward.cost
      );

      if (result.success) {
        // Actualizar tokens del usuario
        const newTokenCount = storeTokens - reward.cost;
        setTokens(newTokenCount);

        return result;
      } else {
        throw new Error(result.message || 'Error en el canje');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storeUser, storeTokens, setTokens]);

  // ===== ESTADÍSTICAS =====
  const getStats = useCallback(async () => {
    try {
      const stats = await dataService.getStats();
      return stats;
    } catch (err) {
      setError('Error al cargar estadísticas');
      return null;
    }
  }, []);

  const getTopUsers = useCallback(async (limit = 5) => {
    try {
      const topUsers = await dataService.getTopUsers(limit);
      
      // Agregar el usuario actual si no está en el top
      if (storeUser && !topUsers.find(u => u.address?.toLowerCase() === storeUser.address?.toLowerCase())) {
        const userRank = await calculateUserRank(storeUser.tokens || 0);
        topUsers.push({
          ...storeUser,
          rank: userRank,
          isYou: true
        });
      }
      
      return topUsers;
    } catch (err) {
      setError('Error al cargar ranking');
      return [];
    }
  }, [storeUser]);

  const getUpcomingActivities = useCallback(async (limit = 3) => {
    try {
      const upcoming = await dataService.getUpcomingActivities(limit);
      return upcoming;
    } catch (err) {
      setError('Error al cargar próximas actividades');
      return [];
    }
  }, []);

  // ===== UTILIDADES =====
  const calculateUserRank = useCallback(async (userTokens) => {
    try {
      const allUsers = await dataService.getUsers();
      const sortedUsers = allUsers.sort((a, b) => b.tokens - a.tokens);
      const userRank = sortedUsers.findIndex(u => u.tokens <= userTokens) + 1;
      return userRank || allUsers.length + 1;
    } catch {
      return 999; // Fallback rank
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshData = useCallback(async () => {
    if (address && isConnected) {
      console.log('🔄 Refrescando datos del usuario...');
      setIsInitialized(false); // Forzar re-inicialización
    }
  }, [address, isConnected]);

  return {
    // Estado
    user: storeUser,
    tokens: storeTokens,
    activities: storeActivities,
    loading,
    error,
    isConnected,
    walletAddress: address,
    walletBalance: balance,
    ensName,
    balanceLoading,
    isInitialized,

    // Funciones de datos
    getActivities,
    enrollInActivity,
    markActivityCompleted,
    getRewards,
    redeemReward,
    getStats,
    getTopUsers,
    getUpcomingActivities,

    // Utilidades
    isEnrolledInActivity,
    clearError,
    refreshData,
    
    // Configuración
    categories: dataService.getCategories(),
    systemConfig: dataService.getSystemConfig(),
    isMockMode: dataService.isMockMode()
  };
};