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
import { 
  Search,
  AlertCircle,
  Waves,
  User,
  X,
  RefreshCw
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
    <div className="space-y-6">
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
            <span>{error}</span>
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
        <div className="flex items-center justify-center gap-2 mb-4">
          <Waves className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Río Cali</h1>
          {isMockMode && (
            <Badge variant="outline" className="text-xs">
              Modo Demo
            </Badge>
          )}
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Actividades comunitarias para cuidar nuestro río y ciudad. 
          {isConnected ? (
            <>Cada participación genera tokens verificados en blockchain.</>
          ) : (
            <>Conecta tu wallet para participar y ganar tokens.</>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalActivities}</p>
            <p className="text-sm text-muted-foreground">Actividades</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.tokensAvailable}</p>
            <p className="text-sm text-muted-foreground">CHT disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{tokens}</p>
            <p className="text-sm text-muted-foreground">Mis tokens</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar actividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Toggle */}
            <div>
              <Button
                variant={showMyActivities ? "default" : "outline"}
                onClick={() => setShowMyActivities(!showMyActivities)}
                className="w-full"
                disabled={!isConnected}
              >
                <User className="h-4 w-4 mr-2" />
                {showMyActivities ? 'Ver todas' : 'Mis actividades'}
                {showMyActivities && stats.myEnrolledCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {stats.myEnrolledCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Refresh */}
            <div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="w-full"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Warning */}
      {!isConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Conecta tu wallet para inscribirte en actividades y ganar ChontaTokens.
          </AlertDescription>
        </Alert>
      )}

      {/* Activities */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
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
          <CardContent className="p-12 text-center">
            <Waves className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {showMyActivities ? 'No tienes actividades' : 'No hay actividades'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {showMyActivities
                ? 'Explora las actividades disponibles'
                : 'Intenta cambiar los filtros'
              }
            </p>
            {showMyActivities && (
              <Button onClick={() => setShowMyActivities(false)}>
                Ver todas
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Blockchain info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-blue-800 font-medium mb-1">
            🔗 Verificado por Ethereum
          </p>
          <p className="text-xs text-blue-600">
            Cada participación queda registrada de forma transparente en blockchain
          </p>
          {currentUser?.address && (
            <p className="text-xs text-blue-500 mt-1">
              Wallet conectada: {currentUser.address.slice(0, 6)}...{currentUser.address.slice(-4)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}