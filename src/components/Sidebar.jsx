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
  Loader2 
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const clearUser = useUserStore((state) => state.clearUser);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Limpiar estado del usuario primero
      clearUser();
      
      // Desconectar wallet
      await disconnect();
      
      // Forzar redirección inmediata
      router.push('/');
      
      // Recargar la página para limpiar cualquier estado residual
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Incluso si hay error, redirigir
      window.location.href = '/';
    }
  };
  
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <h1 className="text-2xl font-bold text-green-600">ChontaCoin</h1>
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Logout */}
        <div className=" p-3">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center text-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50  hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Cerrando sesión...
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}