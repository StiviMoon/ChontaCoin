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
  TrendingUp,
  Sparkles
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
    path: '/dashboard/user' 
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
  },
  { 
    name: 'User', 
    icon: User, 
    path: '/dashboard/user' 
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { user, tokens, activities, clearUser } = useUserStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTokens, setCurrentTokens] = useState(tokens || 0);
  const [tokenAnimation, setTokenAnimation] = useState(false);

  // Efecto para actualizar tokens cuando cambien en el store
  useEffect(() => {
    if (tokens !== currentTokens && tokens > currentTokens) {
      setTokenAnimation(true);
      setTimeout(() => setTokenAnimation(false), 2000);
    }
    setCurrentTokens(tokens || 0);
  }, [tokens, currentTokens]);

  // Efecto para escuchar cambios en localStorage con sincronización mejorada
  useEffect(() => {
    let lastTokenValue = currentTokens;

    const handleStorageChange = (e) => {
      if (e.key === 'chonta-user-storage') {
        try {
          const stored = localStorage.getItem('chonta-user-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            const userData = parsed.state || parsed;
            if (userData.tokens !== undefined && userData.tokens !== lastTokenValue) {
              if (userData.tokens > lastTokenValue) {
                setTokenAnimation(true);
                setTimeout(() => setTokenAnimation(false), 2000);
              }
              setCurrentTokens(userData.tokens);
              lastTokenValue = userData.tokens;
            }
          }
        } catch (error) {
          console.warn('Error parsing storage in sidebar:', error);
        }
      }
    };

    const checkTokenUpdates = () => {
      try {
        const stored = localStorage.getItem('chonta-user-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          const userData = parsed.state || parsed;
          if (userData.tokens !== undefined && userData.tokens !== lastTokenValue) {
            if (userData.tokens > lastTokenValue) {
              setTokenAnimation(true);
              setTimeout(() => setTokenAnimation(false), 2000);
            }
            setCurrentTokens(userData.tokens);
            lastTokenValue = userData.tokens;
          }
        }
      } catch (error) {
        // Silently handle errors
      }
    };

    // Escuchar eventos personalizados del header
    const handleTokenUpdate = () => {
      setTimeout(checkTokenUpdates, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('chonta-tokens-updated', handleTokenUpdate);
    
    // Polling más frecuente para sincronización
    const interval = setInterval(checkTokenUpdates, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chonta-tokens-updated', handleTokenUpdate);
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

  // Obtener estadísticas de actividades
  const getActivityStats = () => {
    const completedActivities = activities?.filter(a => a.completed) || [];
    return {
      completed: completedActivities.length,
      pending: activities?.filter(a => !a.completed)?.length || 0,
      totalEarned: completedActivities.reduce((sum, a) => sum + (a.tokensEarned || 0), 0)
    };
  };

  const stats = getActivityStats();
  
  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-40
      `}>
        <div className="flex h-full flex-col">
          {/* Header responsivo con logo adaptativo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 lg:px-6">
            {/* Logo container responsivo */}
            <div className="flex items-center">
              <div className="relative">
                {/* Logo principal para desktop */}
                <div className="hidden sm:block w-24 h-10 lg:w-28 lg:h-12 xl:w-32 xl:h-14">
                  <img 
                    src="/Logo.png" 
                    alt="ChontaCoin Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  {/* Fallback text logo */}
                  <div className="hidden text-lg font-bold text-green-600">
                    ChontaCoin
                  </div>
                </div>

                {/* Logo compacto para móviles */}
                <div className="sm:hidden w-20 h-8">
                  <img 
                    src="/Logo.png" 
                    alt="ChontaCoin" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  {/* Fallback compacto */}
                  <div className="hidden text-sm font-bold text-green-600">
                    CHT
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botón de cierre - Solo visible en móvil */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Token Balance Card responsivo */}
          <div className="p-3 lg:p-4 border-b border-gray-100">
            <div className={`bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-3 lg:p-4 text-white transition-all duration-300 ${
              tokenAnimation ? 'ring-4 ring-green-300 ring-opacity-50 shadow-lg' : ''
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs lg:text-sm opacity-90">Mi Balance</p>
                  <div className="flex items-center gap-2">
                    <Coins className={`h-4 w-4 lg:h-5 lg:w-5 ${tokenAnimation ? 'animate-bounce' : ''}`} />
                    <span className={`text-xl lg:text-2xl font-bold ${tokenAnimation ? 'animate-pulse' : ''}`}>
                      {currentTokens}
                    </span>
                  </div>
                  <p className="text-xs opacity-75">CHT Tokens</p>
                </div>
                <div className="text-right opacity-80">
                  <TrendingUp className={`h-5 w-5 lg:h-6 lg:w-6 mb-1 ${tokenAnimation ? 'animate-pulse' : ''}`} />
                  <p className="text-xs">
                    {stats.completed} actividades
                  </p>
                </div>
              </div>

              {/* Estadísticas adicionales en una segunda fila para móvil */}
              <div className="mt-3 pt-3 border-t border-white/20 flex justify-between text-xs">
                <div className="text-center">
                  <div className="font-semibold">{stats.pending}</div>
                  <div className="opacity-75">Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{stats.totalEarned}</div>
                  <div className="opacity-75">Ganados</div>
                </div>
              </div>

              {/* Animación de éxito */}
              {tokenAnimation && (
                <div className="absolute inset-0 pointer-events-none">
                  <Sparkles className="absolute top-2 right-2 h-4 w-4 animate-spin text-yellow-300" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation responsiva */}
          <nav className="flex-1 space-y-1 px-2 lg:px-3 py-3 lg:py-4 overflow-y-auto">
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
                      ? 'bg-green-50 text-green-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  
                  {/* Badge especial para Escáner QR */}
                  {item.path === '/scanner' && (
                    <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                      Nuevo
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User Info responsiva */}
          <div className="p-3 lg:p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
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
            
            {/* Información adicional en móvil */}
            <div className="lg:hidden mb-3">
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Nivel:</span>
                  <span className="font-medium text-gray-700">{user?.level || 'Nuevo'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Miembro desde:</span>
                  <span className="font-medium text-gray-700">
                    {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString('es-ES') : 'Hoy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logout responsivo */}
          <div className="p-3 lg:p-4">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin flex-shrink-0" />
                  <span className="truncate">Cerrando sesión...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Cerrar sesión</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}