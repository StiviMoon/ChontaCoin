// /app/dashboard/overview/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthCheck } from '@/middleware/authMiddleware';
import { useChontaData } from '@/hooks/useChontaData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Calendar, 
  Wallet, 
  Coins, 
  Globe, 
  Loader2,
  RefreshCw,
  Waves
} from 'lucide-react';

export default function OverviewPage() {
  const { user } = useAuthCheck();
  const {
    // Estado
    user: currentUser,
    tokens,
    activities,
    walletBalance,
    ensName,
    balanceLoading,
    loading,
    isMockMode,
    
    // Funciones
    getStats,
    getTopUsers,
    getUpcomingActivities,
    refreshData
  } = useChontaData();
  
  const [stats, setStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [ethPrice, setEthPrice] = useState(null);
  const [joinDays, setJoinDays] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, topUsersData, upcomingData] = await Promise.all([
          getStats(),
          getTopUsers(5),
          getUpcomingActivities(3)
        ]);
        
        setStats(statsData);
        setTopUsers(topUsersData);
        setUpcomingActivities(upcomingData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [getStats, getTopUsers, getUpcomingActivities]);

  // Calcular días desde que se unió
  useEffect(() => {
    if (currentUser?.joinedDate) {
      const joined = new Date(currentUser.joinedDate);
      const today = new Date();
      const diffTime = Math.abs(today - joined);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setJoinDays(diffDays);
    }
  }, [currentUser]);

  // Obtener precio de ETH
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        if (!res.ok) throw new Error('No se pudo obtener el precio');
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch (err) {
        console.warn('No se pudo obtener el precio de ETH:', err);
        setEthPrice(null);
      }
    };
    fetchEthPrice();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    
    // Recargar datos del dashboard
    const [statsData, topUsersData, upcomingData] = await Promise.all([
      getStats(),
      getTopUsers(5),
      getUpcomingActivities(3)
    ]);
    
    setStats(statsData);
    setTopUsers(topUsersData);
    setUpcomingActivities(upcomingData);
    setIsRefreshing(false);
  };

  // Estadísticas principales
  const dashboardStats = [
    {
      title: 'Balance ETH',
      value: balanceLoading ? (
        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
      ) : (
        `${parseFloat(walletBalance?.formatted || '0').toFixed(4)} ${walletBalance?.symbol || 'ETH'}`
      ),
      subValue: ethPrice && walletBalance ? 
        `$${(parseFloat(walletBalance.formatted) * ethPrice).toFixed(2)}` : null,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'ChontaTokens',
      value: tokens,
      subValue: 'CHT',
      icon: Coins,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Actividades',
      value: activities.filter(a => a.completed).length,
      subValue: 'Completadas',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Días Activo',
      value: joinDays,
      subValue: 'En la plataforma',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Información de wallet
  const walletInfo = [
    {
      label: 'Dirección',
      value: currentUser?.address ? 
        `${currentUser.address.slice(0, 6)}...${currentUser.address.slice(-4)}` : 
        'No conectada',
      fullValue: currentUser?.address
    },
    {
      label: 'ENS',
      value: ensName || 'No configurado'
    },
    {
      label: 'Red',
      value: 'Ethereum Mainnet'
    },
    {
      label: 'Estado',
      value: currentUser?.address ? 'Conectado' : 'Desconectado',
      status: currentUser?.address ? 'success' : 'error'
    }
  ];

  // Actividades recientes
  const recentActivities = activities.slice(-3).reverse();

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header con info de modo - Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Waves className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600" />
            Dashboard Río Cali
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Bienvenido {currentUser?.name || 'Usuario'} 
            {isMockMode && <Badge variant="outline" className="ml-2 text-xs">Demo</Badge>}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Actualizar</span>
        </Button>
      </div>

      {/* Stats Grid - Totalmente responsivo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={`stat-${index}-${stat.title.replace(/\s+/g, '-').toLowerCase()}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.title}</p>
                    <div className="mt-1 sm:mt-2 text-sm sm:text-lg lg:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    {stat.subValue && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {stat.subValue}
                      </p>
                    )}
                  </div>
                  <div className={`${stat.bgColor} rounded-lg p-1.5 sm:p-2 lg:p-3 flex-shrink-0 ml-2`}>
                    <Icon className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Wallet Info - Mejor distribución móvil */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <h3 className="mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Wallet className="h-4 w-4 lg:h-5 lg:w-5" />
            Información de tu Wallet
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {walletInfo.map((info) => (
              <div key={info.label} className="space-y-1">
                <p className="text-xs text-gray-500">{info.label}</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate flex items-center" title={info.fullValue}>
                  <span className="truncate">{info.value}</span>
                  {info.status === 'success' && (
                    <span className="ml-2 inline-flex h-2 w-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  )}
                  {info.status === 'error' && (
                    <span className="ml-2 inline-flex h-2 w-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact - Grid responsivo */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <h3 className="mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
            Tu Impacto Ambiental
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div key="impact-co2" className="text-center p-3 lg:p-4 bg-green-50 rounded-lg">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {activities.filter(a => a.completed).length * 2}
              </p>
              <p className="text-xs text-gray-600">kg CO₂ reducidos</p>
            </div>
            <div key="impact-people" className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {activities.filter(a => a.completed).length * 5}
              </p>
              <p className="text-xs text-gray-600">Personas impactadas</p>
            </div>
            <div key="impact-hours" className="text-center p-3 lg:p-4 bg-purple-50 rounded-lg">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {activities.filter(a => a.completed).length}
              </p>
              <p className="text-xs text-gray-600">Horas voluntariado</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Three Column Layout - Stack completo en móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Activities */}
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <h3 className="mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
              Actividades Recientes
            </h3>
            {recentActivities.length > 0 ? (
              <div className="space-y-2 lg:space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={`recent-activity-${activity.id}-${index}-${activity.name?.slice(0, 10).replace(/\s+/g, '')}`} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{activity.name}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.location}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 flex-shrink-0 ml-2 text-xs">
                      +{activity.tokensEarned} CHT
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 lg:py-8">
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs sm:text-sm">No hay actividades aún</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Top Citizens */}
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <h3 className="mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
              Top 5 Ciudadanos
            </h3>
            {topUsers.length > 0 ? (
              <div className="space-y-2">
                {topUsers.map((citizen, index) => (
                  <div
                    key={`top-citizen-${citizen.id}-${index}-${citizen.address?.slice(-4) || 'unknown'}`}
                    className={`flex items-center justify-between rounded-lg p-2 text-xs sm:text-sm ${
                      citizen.isYou ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className={`font-bold flex-shrink-0 text-xs ${
                        citizen.rank <= 3 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        #{citizen.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate text-xs sm:text-sm">
                          {citizen.name} {citizen.isYou && '(Tú)'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {citizen.address?.slice(0, 6)}...{citizen.address?.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0 ml-2 text-xs">
                      {citizen.tokens} CHT
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 lg:py-8">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs sm:text-sm">Cargando ranking...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <h3 className="mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
              Próximos Eventos
            </h3>
            {upcomingActivities.length > 0 ? (
              <div className="space-y-2 lg:space-y-3">
                {upcomingActivities.map((activity, index) => (
                  <div key={`upcoming-activity-${activity.id || index}`} className="rounded-lg border border-gray-200 p-2 sm:p-3">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
                      {activity.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-600">
                      {new Date(activity.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })} • {activity.location}
                    </p>
                    <Badge variant="outline" className="mt-2 text-green-600 border-green-200 text-xs">
                      +{activity.tokensReward} CHT
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 lg:py-8">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs sm:text-sm">No hay eventos próximos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary Card */}
      {stats && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-blue-900">
                Estadísticas de la Plataforma
              </h3>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div key="stat-activities" className="text-center">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.activities?.total || 0}</p>
                <p className="text-xs text-blue-700">Actividades totales</p>
              </div>
              <div key="stat-users" className="text-center">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.users?.total || 0}</p>
                <p className="text-xs text-blue-700">Usuarios activos</p>
              </div>
              <div key="stat-tokens" className="text-center">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.users?.totalTokens || 0}</p>
                <p className="text-xs text-blue-700">Tokens distribuidos</p>
              </div>
              <div key="stat-spots" className="text-center">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.activities?.availableSpots || 0}</p>
                <p className="text-xs text-blue-700">Cupos disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blockchain verification footer */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardContent className="p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-gray-800 font-medium mb-1">
            🔗 Plataforma verificada por Ethereum
          </p>
          <p className="text-xs text-gray-600">
            Todos los datos están registrados de forma transparente en blockchain
          </p>
          {currentUser?.address && (
            <p className="text-xs text-gray-500 mt-2">
              Wallet: {currentUser.address.slice(0, 8)}...{currentUser.address.slice(-6)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}