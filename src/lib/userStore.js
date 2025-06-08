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
      
      // Mock data para desarrollo - actualizado
      initMockData: () => set({
        user: {
          id: 1,
          name: 'Usuario Demo',
          email: 'usuario@chontacoin.com',
          address: '0x1234567890abcdef1234567890abcdef12345678',
          joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días atrás
          neighborhood: 'Centro, Yumbo'
        },
        tokens: 150,
        activities: [
          {
            id: 1,
            name: 'Limpieza del parque central',
            location: 'Parque Central',
            date: '2025-01-05',
            tokensEarned: 5,
            completed: true,
            completedAt: '2025-01-05T10:00:00Z',
            enrolledAt: '2025-01-01T08:00:00Z',
            status: 'completed',
            type: 'limpieza'
          },
          {
            id: 2,
            name: 'Campaña de reciclaje',
            location: 'Plaza Mayor',
            date: '2025-01-10',
            tokensEarned: 3,
            completed: true,
            completedAt: '2025-01-10T15:00:00Z',
            enrolledAt: '2025-01-08T09:00:00Z',
            status: 'completed',
            type: 'reciclaje'
          },
          {
            id: 3,
            name: 'Taller de compostaje',
            location: 'Centro Comunitario',
            date: '2025-01-15',
            tokensEarned: 7,
            completed: false,
            enrolledAt: '2025-01-12T14:00:00Z',
            status: 'enrolled',
            type: 'educacion'
          }
        ]
      })
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