// /middleware/authMiddleware.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import useUserStore from '@/lib/userStore';

export const useAuthCheck = (requireAuth = true) => {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const initMockData = useUserStore((state) => state.initMockData);
  
  useEffect(() => {
    // Si se requiere autenticación pero no hay wallet conectada
    if (requireAuth && !isConnected) {
      // Pequeño delay para evitar redirecciones inmediatas
      const timer = setTimeout(() => {
        router.push('/');
      }, 100);
      return () => clearTimeout(timer);
    } 
    
    // Si hay wallet conectada pero no hay usuario en el store
    if (isConnected && address && !user) {
      // Crear sesión de usuario
      setUser({
        address,
        name: `Usuario ${address.slice(-4)}`,
        joinedDate: new Date().toISOString()
      });
      
      // Inicializar con datos mock para desarrollo
      if (process.env.NODE_ENV === 'development') {
        initMockData();
      }
    }
    
    // Si no está conectado y hay usuario en el store, limpiar
    if (!isConnected && user) {
      useUserStore.getState().clearUser();
    }
  }, [isConnected, address, user, requireAuth, router, setUser, initMockData]);
  
  return { isConnected, address, user };
};