// /middleware/authMiddleware.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useEnsName } from 'wagmi';
import useUserStore from '@/lib/userStore';

export const useAuthCheck = (requireAuth = true) => {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const initRealUser = useUserStore((state) => state.initRealUser);
  const clearUser = useUserStore((state) => state.clearUser);
  
  useEffect(() => {
    console.log('🔐 AuthCheck:', { requireAuth, isConnected, address: address?.slice(0, 8), user: user?.name });

    // Si se requiere autenticación pero no hay wallet conectada
    if (requireAuth && !isConnected) {
      console.log('❌ Auth requerida pero wallet no conectada, redirigiendo...');
      // Pequeño delay para evitar redirecciones inmediatas
      const timer = setTimeout(() => {
        router.push('/');
      }, 100);
      return () => clearTimeout(timer);
    } 
    
    // Si hay wallet conectada pero no hay usuario en el store, O si cambió la address
    if (isConnected && address && (!user || user.address !== address)) {
      console.log('🆕 Creando usuario real para:', address.slice(0, 8));
      
      // Crear usuario con datos reales de la wallet
      const realUser = {
        id: address,
        address: address,
        name: ensName || `${address.slice(0, 6)}...${address.slice(-4)}`,
        ensName: ensName || null,
        email: null, // Sin email fake
        joinedDate: new Date().toISOString(),
        neighborhood: 'Yumbo, Valle del Cauca',
        tokens: 0, // Empezar con 0 tokens reales
        completedActivities: 0,
        level: 'Ciudadano Nuevo',
        avatar: null,
        isRealUser: true
      };

      console.log('✅ Usuario real creado:', realUser.name);
      setUser(realUser);
    }
    
    // Si no está conectado y hay usuario en el store, limpiar
    if (!isConnected && user) {
      console.log('🧹 Wallet desconectada, limpiando usuario');
      clearUser();
    }

    // Si cambió el ENS name, actualizar el usuario
    if (isConnected && user && user.address === address && user.ensName !== ensName) {
      console.log('🏷️ Actualizando ENS name:', ensName);
      setUser({
        ...user,
        name: ensName || `${address.slice(0, 6)}...${address.slice(-4)}`,
        ensName: ensName || null
      });
    }

  }, [isConnected, address, user, requireAuth, router, setUser, clearUser, ensName]);
  
  return { 
    isConnected, 
    address, 
    user,
    ensName,
    isAuthenticated: isConnected && !!address && !!user
  };
};

// Hook adicional para obtener información completa del usuario autenticado
export const useAuth = () => {
  const { isConnected, address, user, ensName, isAuthenticated } = useAuthCheck(false);
  
  return {
    // Estado de conexión
    isConnected,
    isAuthenticated,
    
    // Datos de wallet
    address,
    walletAddress: address,
    shortAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    ensName,
    
    // Datos de usuario
    user,
    userName: user?.name || null,
    userTokens: user?.tokens || 0,
    userLevel: user?.level || 'Ciudadano Nuevo',
    userEmail: user?.email || null,
    userNeighborhood: user?.neighborhood || null,
    completedActivities: user?.completedActivities || 0,
    joinedDate: user?.joinedDate || null,
    
    // Métodos útiles
    isRealUser: user?.isRealUser || false,
    hasTokens: (user?.tokens || 0) > 0,
    canAfford: (cost) => (user?.tokens || 0) >= cost
  };
};

// Componente wrapper para proteger rutas
export const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated } = useAuthCheck(true);
  
  if (!isAuthenticated && fallback) {
    return fallback;
  }
  
  // El useAuthCheck ya maneja la redirección si no está autenticado
  return children;
};

// HOC para envolver páginas que requieren autenticación
export const withAuth = (Component, options = {}) => {
  const { requireAuth = true, fallback = null } = options;
  
  return function AuthenticatedComponent(props) {
    const { isAuthenticated } = useAuthCheck(requireAuth);
    
    if (requireAuth && !isAuthenticated) {
      return fallback || <div>Conectando...</div>;
    }
    
    return <Component {...props} />;
  };
};

export default useAuthCheck;