// /lib/userStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      // Estado del usuario
      user: null,
      tokens: 0,
      activities: [],
      
      // Acciones básicas
      setUser: (userData) => set({ user: userData }),
      
      addTokens: (amount) => set((state) => ({
        tokens: state.tokens + amount
      })),
      
      subtractTokens: (amount) => set((state) => ({
        tokens: Math.max(0, state.tokens - amount)
      })),
      
      setTokens: (amount) => set({ tokens: amount }),
      
      // Gestión de actividades mejorada
      addActivity: (activity) => set((state) => {
        // Verificar si la actividad ya existe
        const existingActivity = state.activities.find(a => a.id === activity.id);
        
        if (existingActivity) {
          // Si existe, actualizar
          return {
            activities: state.activities.map(a => 
              a.id === activity.id 
                ? { ...a, ...activity, updatedAt: new Date().toISOString() }
                : a
            )
          };
        } else {
          // Si no existe, agregar nueva
          return {
            activities: [...state.activities, {
              ...activity,
              enrolledAt: new Date().toISOString(),
              status: activity.status || 'enrolled',
              completed: activity.completed || false
            }]
          };
        }
      }),
      
      // Actualizar actividad específica
      updateActivity: (activityId, updates) => set((state) => ({
        activities: state.activities.map(activity =>
          activity.id === activityId
            ? { ...activity, ...updates, updatedAt: new Date().toISOString() }
            : activity
        )
      })),
      
      // Completar actividad y ganar tokens
      completeActivity: (activityId, tokensEarned) => set((state) => {
        const updatedActivities = state.activities.map(activity =>
          activity.id === activityId
            ? { 
                ...activity, 
                completed: true, 
                completedAt: new Date().toISOString(),
                tokensEarned: tokensEarned || activity.tokensEarned || 0
              }
            : activity
        );

        const earnedTokens = tokensEarned || 0;
        
        return {
          activities: updatedActivities,
          tokens: state.tokens + earnedTokens
        };
      }),
      
      // Remover actividad
      removeActivity: (activityId) => set((state) => ({
        activities: state.activities.filter(activity => activity.id !== activityId)
      })),
      
      // Verificar si está inscrito en una actividad
      isEnrolledInActivity: (activityId) => {
        const state = get();
        return state.activities.some(activity => activity.id === activityId);
      },
      
      // Obtener actividades inscritas (no completadas)
      getEnrolledActivities: () => {
        const state = get();
        return state.activities.filter(activity => 
          !activity.completed && (activity.status === 'enrolled' || !activity.status)
        );
      },
      
      // Obtener actividades completadas
      getCompletedActivities: () => {
        const state = get();
        return state.activities.filter(activity => activity.completed);
      },
      
      // Obtener total de tokens ganados
      getTotalTokensEarned: () => {
        const state = get();
        return state.activities
          .filter(activity => activity.completed)
          .reduce((total, activity) => total + (activity.tokensEarned || 0), 0);
      },
      
      // Limpiar usuario
      clearUser: () => set({
        user: null,
        tokens: 0,
        activities: []
      }),
      
      // Mock data actualizado - coincide con mockData.js
      initRealUserData: (walletAddress, ensName = null) => set({
        user: {
          id: Date.now(),
          name: ensName || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          email: null,
          address: walletAddress,
          ensName: ensName,
          joinedDate: new Date().toISOString(),
          neighborhood: 'Yumbo, Valle del Cauca'
        },
        tokens: 0, // Empezar con 0 tokens reales
        activities: [] // Sin actividades previas
      }),

    }),
    {
      name: 'chonta-user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        activities: state.activities
      }),
      version: 1
    }
  )
);

export default useUserStore;