// /app/dashboard/actividades/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthCheck } from '@/middleware/authMiddleware';
import { useChontaData } from '@/hooks/useChontaData';
import ActivityCard from '@/components/ActivityCard';
import ActivityLoadingOverlay from '@/components/ActivityLoadingOverlay';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { 
  Search,
  AlertCircle,
  Waves,
  User,
  X,
  RefreshCw,
  Shield,
  Filter
} from 'lucide-react';

export default function ActividadesPage() {
  const { user } = useAuthCheck();
  const {
    // Estado
    user: currentUser,
    tokens,
    activities: userActivities,
    loading,
    error,
    isConnected,
    categories,
    isMockMode,
    
    // Funciones
    getActivities,
    enrollInActivity,
    isEnrolledInActivity,
    clearError,
    refreshData
  } = useChontaData();
  
  // Estados locales
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyActivities, setShowMyActivities] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollingActivity, setEnrollingActivity] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Cargar actividades al inicializar
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setInitialLoading(true);
        const activitiesData = await getActivities();
        setActivities(activitiesData);
      } catch (err) {
        console.error('Error loading activities:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    loadActivities();
  }, [getActivities]);

  // Filtrar actividades
  useEffect(() => {
    let filtered = [...activities];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showMyActivities) {
      const myActivityIds = userActivities.map(a => a.id);
      filtered = filtered.filter(activity => myActivityIds.includes(activity.id));
    }

    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    setFilteredActivities(filtered);
  }, [activities, selectedCategory, searchTerm, showMyActivities, userActivities]);

  const handleEnroll = async (activity) => {
    setIsEnrolling(true);
    setEnrollingActivity(activity);

    try {
      await enrollInActivity(activity);
      
      // Actualizar lista de actividades para reflejar cambio de participantes
      setActivities(prev => prev.map(a => {
        if (a.id === activity.id) {
          return {
            ...a,
            currentParticipants: a.currentParticipants + 1,
            status: a.currentParticipants + 1 >= a.maxParticipants ? 'full' : 'available'
          };
        }
        return a;
      }));

    } catch (err) {
      // El error ya se maneja en el hook useChontaData
      console.error('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
      setEnrollingActivity(null);
    }
  };

  const handleRefresh = async () => {
    setInitialLoading(true);
    await refreshData();
    const activitiesData = await getActivities();
    setActivities(activitiesData);
    setInitialLoading(false);
  };

  const stats = {
    totalActivities: activities.length,
    myEnrolledCount: userActivities.length,
    tokensAvailable: activities.reduce((sum, activity) => sum + activity.tokensReward, 0)
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando actividades...</p>
          {isMockMode && (
            <p className="text-xs text-yellow-600 mt-2">Modo de desarrollo</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Loading Overlay */}
      <ActivityLoadingOverlay
        isVisible={isEnrolling}
        onComplete={() => {
          setIsEnrolling(false);
          setEnrollingActivity(null);
        }}
        activityName={enrollingActivity?.name}
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-auto p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <Waves className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Río Cali</h1>
          {isMockMode && (
            <Badge variant="outline" className="text-xs">
              Demo
            </Badge>
          )}
        </div>
        <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto mb-3 sm:mb-4 px-2">
          Actividades comunitarias para cuidar nuestro río y ciudad. 
          {isConnected ? (
            <>Cada participación genera tokens verificados en blockchain.</>
          ) : (
            <>Conecta tu wallet para participar y ganar tokens.</>
          )}
        </p>

        {/* Admin Access Button */}
        {isConnected && (
          <div className="flex justify-center mb-4">
            <Link href="/dashboard/admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Panel de Organizador</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats - Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalActivities}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Actividades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.tokensAvailable}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">CHT disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">{tokens}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Mis tokens</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros - Diseño móvil mejorado */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          {/* Search y Toggle de filtros en móvil */}
          <div className="flex gap-2 mb-3 sm:mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
            
            {/* Botón para mostrar filtros en móvil */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex-shrink-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filtros - Visibles en desktop, colapsables en móvil */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block space-y-3 sm:space-y-0`}>
            {/* Botones de acción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
              <Button
                variant={showMyActivities ? "default" : "outline"}
                onClick={() => setShowMyActivities(!showMyActivities)}
                className="w-full text-sm"
                disabled={!isConnected}
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                {showMyActivities ? 'Ver todas' : 'Mis actividades'}
                {showMyActivities && stats.myEnrolledCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {stats.myEnrolledCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleRefresh}
                className="w-full text-sm cursor-pointer"
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>

            {/* Categorías - Scroll horizontal en móvil */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap flex-shrink-0 text-sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Warning */}
      {!isConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Conecta tu wallet para inscribirte en actividades y ganar ChontaTokens.
          </AlertDescription>
        </Alert>
      )}

      {/* Activities - Grid responsivo */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredActivities.map((activity, index) => (
            <ActivityCard
              key={`activity-${activity.id || index}`}
              activity={activity}
              isEnrolled={isEnrolledInActivity(activity.id)}
              onEnroll={handleEnroll}
              isLoading={isEnrolling && enrollingActivity?.id === activity.id}
              disabled={!isConnected}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Waves className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
              {showMyActivities ? 'No tienes actividades' : 'No hay actividades'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {showMyActivities
                ? 'Explora las actividades disponibles'
                : 'Intenta cambiar los filtros'
              }
            </p>
            {showMyActivities && (
              <Button onClick={() => setShowMyActivities(false)} size="sm">
                Ver todas
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Blockchain info - Mejorado para móvil */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">
            🔗 Verificado por Ethereum
          </p>
          <p className="text-xs text-blue-600 mb-1">
            Cada participación queda registrada de forma transparente en blockchain
          </p>
          {currentUser?.address && (
            <p className="text-xs text-blue-500">
              Wallet: {currentUser.address.slice(0, 6)}...{currentUser.address.slice(-4)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}