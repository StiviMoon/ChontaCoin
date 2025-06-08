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
      
      // Acciones
      setUser: (userData) => set({ user: userData }),
      
      addTokens: (amount) => set((state) => ({
        tokens: state.tokens + amount
      })),
      
      subtractTokens: (amount) => set((state) => ({
        tokens: Math.max(0, state.tokens - amount)
      })),
      
      addActivity: (activity) => set((state) => ({
        activities: [...state.activities, {
          id: Date.now(),
          ...activity,
          date: new Date().toISOString()
        }]
      })),
      
      clearUser: () => set({
        user: null,
        tokens: 0,
        activities: []
      }),
      
      // Mock data para desarrollo
      initMockData: () => set({
        tokens: 150,
        activities: [
          {
            id: 1,
            type: 'limpieza',
            name: 'Limpieza del parque central',
            location: 'Parque Central',
            date: '2025-01-05',
            tokensEarned: 5,
            completed: true
          },
          {
            id: 2,
            type: 'reciclaje',
            name: 'Campaña de reciclaje',
            location: 'Plaza Mayor',
            date: '2025-01-10',
            tokensEarned: 3,
            completed: true
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
      })
    }
  )
);

export default useUserStore;