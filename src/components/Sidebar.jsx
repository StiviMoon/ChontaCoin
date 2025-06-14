// /components/Sidebar.jsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDisconnect } from 'wagmi';
import useUserStore from '@/lib/userStore';
import { useState, useEffect } from 'react';
import { 
  Home, 
  Activity, 
  Coins, 
  Gift, 
  Map, 
  User,
  LogOut,
  Loader2,
  X,
  QrCode,
  TrendingUp
} from 'lucide-react';

const menuItems = [
  { 
    name: 'Resumen', 
    icon: Home, 
    path: '/dashboard/overview' 
  },
  { 
    name: 'Actividades', 
    icon: Activity, 
    path: '/dashboard/actividades' 
  },
  { 
    name: 'Escáner QR', 
    icon: QrCode, 
    path: '/scanner' 
  },
  { 
    name: 'Mis Tokens', 
    icon: Coins, 
    path: '/dashboard/mis-tokens' 
  },
  { 
    name: 'Recompensas', 
    icon: Gift, 
    path: '/dashboard/recompensas' 
  },
  { 
    name: 'Mapa', 
    icon: Map, 
    path: '/dashboard/mapa' 
  },
  { 
    name: 'Admin', 
    icon: User, 
    path: '/dashboard/admin' 
  },{ 
    name: 'User', 
    icon: User, 
    path: '/dashboard/user' 
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { user, tokens, clearUser } = useUserStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTokens, setCurrentTokens] = useState(tokens || 0);

  // Efecto para actualizar tokens cuando cambien en el store
  useEffect(() => {
    setCurrentTokens(tokens || 0);
  }, [tokens]);

  // Efecto para escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chonta-user-storage' || e.storageArea === localStorage) {
        try {
          const stored = localStorage.getItem('chonta-user-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            const userData = parsed.state || parsed;
            if (userData.tokens !== undefined) {
              setCurrentTokens(userData.tokens);
            }
          }
        } catch (error) {
          console.warn('Error parsing storage in sidebar:', error);
        }
      }
    };

    // Escuchar cambios de storage de otras pestañas
    window.addEventListener('storage', handleStorageChange);
    
    // Polling para cambios en la misma pestaña (fallback)
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('chonta-user-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          const userData = parsed.state || parsed;
          if (userData.tokens !== undefined && userData.tokens !== currentTokens) {
            setCurrentTokens(userData.tokens);
          }
        }
      } catch (error) {
        // Silently handle errors
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentTokens]);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      clearUser();
      await disconnect();
      router.push('/');
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = '/';
    }
  };

  const handleLinkClick = () => {
    // Cerrar sidebar en móvil cuando se hace clic en un enlace
    if (onClose) {
      onClose();
    }
  };

  const getTokenBadgeColor = () => {
    if (currentTokens >= 100) return 'bg-gold-500 text-yellow-900';
    if (currentTokens >= 50) return 'bg-green-500 text-green-900';
    return 'bg-blue-500 text-blue-900';
  };
  
  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-40
      `}>
        <div className="flex h-full flex-col">
          {/* Header con botón de cierre en móvil */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
            <h1 className="text-2xl font-bold text-green-600">ChontaCoin</h1>
            
            {/* Botón de cierre - Solo visible en móvil */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Token Balance Card en Sidebar */}
          <div className="p-4 border-b border-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Mi Balance</p>
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    <span className="text-2xl font-bold">{currentTokens}</span>
                  </div>
                  <p className="text-xs opacity-75">CHT Tokens</p>
                </div>
                <div className="text-right opacity-80">
                  <TrendingUp className="h-6 w-6 mb-1" />
                  <p className="text-xs">
                    {user?.completedActivities || 0} actividades
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {/* Badge especial para Escáner QR */}
                  {item.path === '/scanner' && (
                    <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                      Nuevo
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User Info */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.neighborhood || 'Ubicación no disponible'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Logout */}
          <div className="p-3">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
                  Cerrando sesión...
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  Cerrar sesión
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
