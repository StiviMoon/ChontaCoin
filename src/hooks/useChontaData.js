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

  // ===== FUNCIONES HELPER PARA DATOS REALES =====
  const formatWalletAddress = useCallback((address) => {
    if (!address) return 'Usuario Conectado';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const generateUserName = useCallback((address, ensName) => {
    if (ensName) return ensName;
    if (address) return formatWalletAddress(address);
    return 'Usuario Conectado';
  }, [formatWalletAddress]);

  // ===== INICIALIZACIÓN DEL USUARIO CON DATOS REALES =====
  useEffect(() => {
    const initializeUser = async () => {
      console.log('🔄 Inicializando usuario con datos reales...', { address, isConnected });
      
      if (!isConnected || !address) {
        console.log('❌ Wallet no conectada, limpiando usuario');
        clearUser();
        setIsInitialized(true);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('📡 Creando usuario con datos reales para:', address);
        
        // Crear usuario completamente basado en datos reales de la wallet
        const realUserData = {
          id: address, // Usar address como ID único
          name: generateUserName(address, ensName),
          email: null, // Sin email real desde wallet
          address: address,
          ensName: ensName || null,
          joinedDate: new Date().toISOString(), // Fecha actual
          neighborhood: 'Yumbo, Valle del Cauca', // Tu ubicación real
          tokens: 0, // Empezar con 0 tokens reales
          completedActivities: 0, // Sin actividades completadas inicialmente
          level: 'Ciudadano Nuevo', // Nivel inicial
          avatar: null,
          // Datos adicionales de la wallet
          walletBalance: balance?.formatted || '0',
          walletSymbol: balance?.symbol || 'ETH',
          walletBalanceUSD: balance?.value ? (parseFloat(balance.formatted) * 2000).toFixed(2) : '0', // Estimación
          isRealUser: true // Flag para identificar usuario real
        };

        console.log('✅ Usuario real creado:', realUserData);

        // Intentar obtener datos adicionales del servicio (si existen)
        try {
          const serviceData = await dataService.getCurrentUser(address, ensName);
          if (serviceData && serviceData.tokens > 0) {
            // Si hay datos guardados, usar tokens reales
            realUserData.tokens = serviceData.tokens;
            realUserData.completedActivities = serviceData.completedActivities || 0;
            realUserData.level = serviceData.level || 'Ciudadano Nuevo';
            console.log('📊 Datos del servicio integrados:', serviceData.tokens, 'tokens');
          }
        } catch (serviceError) {
          console.log('ℹ️ No hay datos previos del servicio, usando datos frescos');
        }

        // Actualizar stores con datos reales
        setUser(realUserData);
        setTokens(realUserData.tokens);
        setIsInitialized(true);

        console.log('🎉 Usuario inicializado con datos reales:', realUserData.name);

      } catch (err) {
        console.error('❌ Error al inicializar usuario:', err);
        
        // Crear usuario básico con datos mínimos reales
        const fallbackUser = {
          id: address,
          name: generateUserName(address, ensName),
          email: null,
          address: address,
          ensName: ensName || null,
          joinedDate: new Date().toISOString(),
          neighborhood: 'Yumbo, Valle del Cauca',
          tokens: 0,
          completedActivities: 0,
          level: 'Ciudadano Nuevo',
          walletBalance: balance?.formatted || '0',
          walletSymbol: balance?.symbol || 'ETH',
          isRealUser: true
        };
        
        console.log('🔄 Usando usuario fallback con datos reales:', fallbackUser);
        setUser(fallbackUser);
        setTokens(0);
        setError('Usuario creado con datos básicos');
        setIsInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    // Solo inicializar si cambió la dirección o el estado de conexión
    if (!isInitialized || storeUser?.address !== address) {
      initializeUser();
    }
  }, [address, isConnected, ensName, balance?.formatted, balance?.symbol, generateUserName]);

  // ===== EFECTO PARA ACTUALIZAR DATOS CUANDO CAMBIE LA WALLET =====
  useEffect(() => {
    if (isConnected && address && storeUser && storeUser.address === address) {
      // Actualizar datos de wallet en tiempo real
      const updatedUser = {
        ...storeUser,
        name: generateUserName(address, ensName),
        ensName: ensName || null,
        walletBalance: balance?.formatted || '0',
        walletSymbol: balance?.symbol || 'ETH',
        walletBalanceUSD: balance?.value ? (parseFloat(balance.formatted) * 2000).toFixed(2) : '0'
      };
      
      if (JSON.stringify(updatedUser) !== JSON.stringify(storeUser)) {
        console.log('🔄 Actualizando datos de wallet en tiempo real');
        setUser(updatedUser);
      }
    }
  }, [ensName, balance, address, isConnected, storeUser, generateUserName, setUser]);

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
      
      // Llamar al servicio con datos reales
      const result = await dataService.enrollInActivity(
        activity.id, 
        currentUser.id, // Usar address como ID
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

        // Actualizar nivel del usuario basado en tokens
        const updatedUser = {
          ...currentUser,
          tokens: newTokenCount,
          completedActivities: (currentUser.completedActivities || 0) + 1,
          level: calculateUserLevel(newTokenCount)
        };
        setUser(updatedUser);

        console.log('🎉 Actividad completada! Tokens ganados:', result.tokensEarned);
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
  }, [storeUser, completeActivity, storeTokens, setTokens, setUser]);

  // ===== FUNCIÓN PARA CALCULAR NIVEL BASADO EN TOKENS =====
  const calculateUserLevel = useCallback((tokens) => {
    if (tokens >= 500) return 'Ciudadano Gold';
    if (tokens >= 300) return 'Ciudadano Silver';
    if (tokens >= 100) return 'Ciudadano Bronze';
    if (tokens >= 50) return 'Ciudadano Activo';
    return 'Ciudadano Nuevo';
  }, []);

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

        // Actualizar nivel si es necesario
        const updatedUser = {
          ...currentUser,
          tokens: newTokenCount,
          level: calculateUserLevel(newTokenCount)
        };
        setUser(updatedUser);

        console.log('🎁 Recompensa canjeada:', reward.name);
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
  }, [storeUser, storeTokens, setTokens, setUser, calculateUserLevel]);

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

  // ===== INFORMACIÓN ADICIONAL DE LA WALLET =====
  const getWalletInfo = useCallback(() => {
    if (!address || !isConnected) return null;
    
    return {
      address: address,
      shortAddress: formatWalletAddress(address),
      ensName: ensName,
      balance: balance?.formatted || '0',
      symbol: balance?.symbol || 'ETH',
      balanceUSD: balance?.value ? (parseFloat(balance.formatted) * 2000).toFixed(2) : '0',
      isConnected: isConnected
    };
  }, [address, ensName, balance, isConnected, formatWalletAddress]);

  return {
    // Estado del usuario real
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
    getWalletInfo,
    calculateUserLevel,
    
    // Configuración
    categories: dataService.getCategories(),
    systemConfig: dataService.getSystemConfig(),
    isMockMode: dataService.isMockMode()
  };
};