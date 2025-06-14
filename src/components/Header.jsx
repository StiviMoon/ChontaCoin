// /components/Header.jsx
import { useAccount, useBalance } from 'wagmi';
import useUserStore from '@/lib/userStore';
import { formatAddress } from '@/lib/web3';
import { useState, useEffect, useCallback } from 'react';
import { 
  Wallet, 
  Coins, 
  HandMetal, 
  Menu, 
  TrendingUp,
  Award,
  QrCode,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Header({ onMenuClick }) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { user, tokens, activities } = useUserStore();
  const [currentTokens, setCurrentTokens] = useState(tokens || 0);
  const [tokenChange, setTokenChange] = useState(0);
  const [isTokenAnimating, setIsTokenAnimating] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  // Función para manejar animaciones de tokens
  const animateTokenChange = useCallback((change) => {
    if (change > 0) {
      setTokenChange(change);
      setIsTokenAnimating(true);
      setShowSuccessAnimation(true);
      
      // Limpiar animaciones
      setTimeout(() => {
        setTokenChange(0);
        setIsTokenAnimating(false);
      }, 3000);
      
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
    }
  }, []);
  
  // Efecto para actualizar tokens cuando cambien en el store
  useEffect(() => {
    if (tokens !== currentTokens) {
      const change = tokens - currentTokens;
      if (change > 0 && currentTokens > 0) {
        console.log('🎉 Header detectó cambio de tokens:', change);
        animateTokenChange(change);
      }
      setCurrentTokens(tokens || 0);
    }
  }, [tokens, currentTokens, animateTokenChange]);

  // Efecto para escuchar cambios en localStorage con mejoras
  useEffect(() => {
    let lastTokens = currentTokens;
    
    const handleStorageChange = (e) => {
      // Manejar cambios de localStorage de otras pestañas
      if (e.key === 'chonta-user-storage') {
        try {
          const stored = localStorage.getItem('chonta-user-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            const userData = parsed.state || parsed;
            if (userData.tokens !== undefined && userData.tokens !== lastTokens) {
              const change = userData.tokens - lastTokens;
              console.log('🔄 Header detectó cambio en localStorage:', change);
              if (change > 0) {
                animateTokenChange(change);
              }
              setCurrentTokens(userData.tokens);
              lastTokens = userData.tokens;
            }
          }
        } catch (error) {
          console.warn('Error parsing storage in header:', error);
        }
      }
    };

    // Función para verificar cambios en la misma pestaña
    const checkLocalChanges = () => {
      try {
        const stored = localStorage.getItem('chonta-user-storage');
        if (stored) {
          const parsed = JSON.parse(stored);
          const userData = parsed.state || parsed;
          if (userData.tokens !== undefined && userData.tokens !== lastTokens) {
            const change = userData.tokens - lastTokens;
            if (change > 0) {
              console.log('🔄 Header detectó cambio local:', change);
              animateTokenChange(change);
            }
            setCurrentTokens(userData.tokens);
            lastTokens = userData.tokens;
          }
        }
      } catch (error) {
        // Silently handle errors
      }
    };

    // Escuchar cambios de storage entre pestañas
    window.addEventListener('storage', handleStorageChange);
    
    // Polling más frecuente para detectar cambios inmediatos
    const interval = setInterval(checkLocalChanges, 500); // Cada 500ms para mayor responsividad

    // Evento personalizado para forzar actualización inmediata
    const handleForceUpdate = (event) => {
      console.log('🎯 Header recibió evento de actualización forzada');
      checkLocalChanges();
    };
    
    window.addEventListener('chonta-tokens-updated', handleForceUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('chonta-tokens-updated', handleForceUpdate);
      clearInterval(interval);
    };
  }, [animateTokenChange]);

  // Función para obtener estadísticas de actividades
  const getCompletedActivities = useCallback(() => {
    return activities?.filter(a => a.completed) || [];
  }, [activities]);

  const getActivityStats = useCallback(() => {
    const completed = getCompletedActivities();
    const totalTokensEarned = completed.reduce((sum, activity) => 
      sum + (activity.tokensEarned || 0), 0
    );
    
    return {
      completedCount: completed.length,
      totalTokensEarned,
      recentActivity: completed.length > 0 ? completed[completed.length - 1] : null
    };
  }, [getCompletedActivities]);

  const stats = getActivityStats();
  
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
          
          {/* Indicador de actividad reciente */}
          {showSuccessAnimation && (
            <div className="flex items-center gap-1 animate-pulse">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium hidden sm:inline">
                ¡Actividad completada!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Balances, Stats & Actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Quick Stats - Solo visible en desktop */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Award className="h-4 w-4 text-green-600" />
            <span className="font-medium">{stats.completedCount}</span>
            <span className="hidden 2xl:inline">actividades</span>
          </div>
          
          {/* Indicador de tokens ganados totales */}
          {stats.totalTokensEarned > 0 && (
            <div className="flex items-center gap-1 text-sm text-blue-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{stats.totalTokensEarned}</span>
              <span className="hidden 2xl:inline">ganados</span>
            </div>
          )}
        </div>

        {/* QR Scanner Button - Acceso rápido con indicador de actividad */}
        <Link 
          href="/scanner"
          className={`hidden sm:flex items-center gap-1 lg:gap-2 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 transition-all ${
            showSuccessAnimation 
              ? 'bg-green-100 text-green-700 shadow-md' 
              : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
          }`}
          title="Escáner QR"
        >
          <QrCode className="h-4 w-4 lg:h-5 lg:w-5" />
          <span className="hidden lg:inline text-sm font-medium">
            Escáner
          </span>
          {showSuccessAnimation && (
            <Sparkles className="h-3 w-3 animate-spin" />
          )}
        </Link>

        {/* Token Balance con animaciones mejoradas */}
        <div className="relative">
          <div className={`flex items-center gap-1 lg:gap-2 rounded-lg px-2 lg:px-4 py-1.5 lg:py-2 transition-all duration-300 ${
            isTokenAnimating 
              ? 'bg-green-100 shadow-lg ring-2 ring-green-300 ring-opacity-50' 
              : 'bg-green-50'
          }`}>
            <Coins className={`h-4 w-4 lg:h-5 lg:w-5 text-green-600 ${
              isTokenAnimating ? 'animate-bounce' : ''
            }`} />
            <span className={`text-xs lg:text-sm font-semibold text-green-700 ${
              isTokenAnimating ? 'animate-pulse' : ''
            }`}>
              {currentTokens} <span className="hidden sm:inline">CHT</span>
            </span>
            
            {/* Efecto de brillo cuando se actualizan tokens */}
            {isTokenAnimating && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse rounded-lg"></div>
            )}
          </div>
          
          {/* Indicador de tokens ganados mejorado */}
          {tokenChange > 0 && (
            <div className="absolute -top-3 -right-2 z-10">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                +{tokenChange}
              </div>
            </div>
          )}
          
          {/* Partículas de celebración */}
          {showSuccessAnimation && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
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
          <div className={`w-2 h-2 rounded-full ${
            showSuccessAnimation ? 'bg-green-500 animate-pulse' : 'bg-green-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(address)}
          </span>
        </div>
      </div>

      {/* Notificación flotante de éxito */}
      {showSuccessAnimation && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">¡Tokens actualizados!</span>
          </div>
        </div>
      )}
    </header>
  );
}

// /lib/utils/headerSync.js (Utilidad para forzar actualización del header)
export const triggerHeaderUpdate = () => {
  console.log('🚀 Disparando evento de actualización del header');
  const event = new CustomEvent('chonta-tokens-updated', {
    detail: { timestamp: Date.now() }
  });
  window.dispatchEvent(event);
};

// Función para actualizar header inmediatamente después de escanear QR
export const notifyTokensUpdated = (tokensEarned) => {
  console.log('💰 Notificando actualización de tokens:', tokensEarned);
  
  // Disparar evento personalizado
  triggerHeaderUpdate();
  
  // También forzar un pequeño delay y re-disparar para asegurar sincronización
  setTimeout(() => {
    triggerHeaderUpdate();
  }, 100);
};

// /components/QRScannerPage.jsx (Actualización para sincronizar con header)
// Agregar esta línea en la función validateQRCode después de actualizar localStorage:

/*
// Después de actualizar el localStorage exitosamente:
if (updatedUser) {
  setCurrentUser(updatedUser);
  
  // ⭐ NUEVO: Notificar al header sobre la actualización
  import { notifyTokensUpdated } from '@/lib/utils/headerSync';
  notifyTokensUpdated(qrData.tokensReward);
  
  setScanResult({
    success: true,
    message: '¡Validación exitosa! Tus ChontaTokens se han enviado a tu wallet',
    tokensEarned: qrData.tokensReward,
    newBalance: newTokens,
    activityData: qrData,
    code: code
  });
}
*/