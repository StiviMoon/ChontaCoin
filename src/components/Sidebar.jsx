// /components/Sidebar.jsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDisconnect } from 'wagmi';
import useUserStore from '@/lib/userStore';
import { useState } from 'react';
import { 
  Home, 
  Activity, 
  Coins, 
  Gift, 
  Map, 
  User,
  LogOut,
  Loader2,
  X 
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
    name: 'Perfil', 
    icon: User, 
    path: '/dashboard/perfil' 
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const clearUser = useUserStore((state) => state.clearUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
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
                </Link>
              );
            })}
          </nav>
          
          {/* Logout */}
          <div className="p-3">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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