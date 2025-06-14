// /components/Header.jsx
import { useAccount, useBalance } from 'wagmi';
import useUserStore from '@/lib/userStore';
import { formatAddress } from '@/lib/web3';
import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Coins, 
  HandMetal, 
  Menu, 
  TrendingUp,
  Award,
  QrCode
} from 'lucide-react';
import Link from 'next/link';

export default function Header({ onMenuClick }) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { user, tokens, activities } = useUserStore();
  const [currentTokens, setCurrentTokens] = useState(tokens || 0);
  const [tokenChange, setTokenChange] = useState(0);
  
  // Efecto para actualizar tokens cuando cambien en el store
  useEffect(() => {
    if (tokens !== currentTokens) {
      const change = tokens - currentTokens;
      if (change > 0 && currentTokens > 0) {
        setTokenChange(change);
        // Limpiar el indicador de cambio después de 3 segundos
        setTimeout(() => setTokenChange(0), 3000);
      }
      setCurrentTokens(tokens || 0);
    }
  }, [tokens, currentTokens]);

  // Efecto para escuchar cambios en localStorage (similar al Sidebar)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chonta-user-storage' || e.storageArea === localStorage) {
        try {
          const stored = localStorage.getItem('chonta-user-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            const userData = parsed.state || parsed;
            if (userData.tokens !== undefined && userData.tokens !== currentTokens) {
              const change = userData.tokens - currentTokens;
              if (change > 0 && currentTokens > 0) {
                setTokenChange(change);
                setTimeout(() => setTokenChange(0), 3000);
              }
              setCurrentTokens(userData.tokens);
            }
          }
        } catch (error) {
          console.warn('Error parsing storage in header:', error);
        }
      }
    };

    // Escuchar cambios de storage
    window.addEventListener('storage', handleStorageChange);
    
    // Polling para cambios en la misma pestaña
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('chonta-user-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          const userData = parsed.state || parsed;
          if (userData.tokens !== undefined && userData.tokens !== currentTokens) {
            const change = userData.tokens - currentTokens;
            if (change > 0 && currentTokens > 0) {
              setTokenChange(change);
              setTimeout(() => setTokenChange(0), 3000);
            }
            setCurrentTokens(userData.tokens);
          }
        }
      } catch (error) {
        // Silently handle errors
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentTokens]);

  const getCompletedActivities = () => {
    return activities?.filter(a => a.completed) || [];
  };
  
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex h-16 items-center justify-between bg-white/95 backdrop-blur-sm px-4 lg:px-6 border-b border-gray-200">
      {/* Left: Mobile Menu Button + User Info */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button - Solo visible en móvil */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">
            ¡Hola, {user?.name || 'Usuario'}!
          </h2>
          <HandMetal className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
      </div>

      {/* Right: Balances, Stats & Actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Quick Stats - Solo visible en desktop */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Award className="h-4 w-4 text-green-600" />
            <span className="font-medium">{getCompletedActivities().length}</span>
            <span className="hidden 2xl:inline">actividades</span>
          </div>
        </div>

        {/* QR Scanner Button - Acceso rápido */}
        <Link 
          href="/scanner"
          className="hidden sm:flex items-center gap-1 lg:gap-2 rounded-lg bg-blue-50 hover:bg-blue-100 px-2 lg:px-3 py-1.5 lg:py-2 transition-colors"
          title="Escáner QR"
        >
          <QrCode className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
          <span className="hidden lg:inline text-sm font-medium text-blue-700">
            Escáner
          </span>
        </Link>

        {/* Token Balance con animación de cambio */}
        <div className="relative">
          <div className="flex items-center gap-1 lg:gap-2 rounded-lg bg-green-50 px-2 lg:px-4 py-1.5 lg:py-2">
            <Coins className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
            <span className="text-xs lg:text-sm font-semibold text-green-700">
              {currentTokens} <span className="hidden sm:inline">CHT</span>
            </span>
          </div>
          
          {/* Indicador de tokens ganados */}
          {tokenChange > 0 && (
            <div className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              +{tokenChange}
            </div>
          )}
        </div>

        {/* ETH Balance - Oculto en móvil muy pequeño */}
        {balance && (
          <div className="hidden sm:flex items-center gap-1 lg:gap-2 rounded-lg bg-blue-50 px-2 lg:px-4 py-1.5 lg:py-2">
            <Wallet className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
            <span className="text-xs lg:text-sm font-medium text-blue-700">
              {parseFloat(balance.formatted).toFixed(4)} 
              <span className="hidden md:inline ml-1">{balance.symbol}</span>
            </span>
          </div>
        )}

        {/* Wallet Address - Solo visible en desktop */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(address)}
          </span>
        </div>
      </div>
    </header>
  );
}