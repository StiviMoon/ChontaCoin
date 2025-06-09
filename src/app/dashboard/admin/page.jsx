// /app/dashboard/admin/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthCheck } from '@/middleware/authMiddleware';
import { useChontaData } from '@/hooks/useChontaData';
import OrganizerQRGenerator from '@/components/OrganizerQRGenerator';
import CreateActivityForm from '@/components/CreateActivityForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar,
  MapPin,
  Users,
  QrCode,
  Eye,
  Settings,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuthCheck();
  const { getActivities } = useChontaData();
  
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar actividades al inicializar
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const activitiesData = await getActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error cargando actividades:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [getActivities]);

  const handleSelectActivity = (activity) => {
    setSelectedActivity(activity);
    setShowQRGenerator(true);
  };

  const handleActivityCreated = (newActivity) => {
    setActivities(prev => [newActivity, ...prev]);
    setSuccessMessage(`Actividad "${newActivity.name}" creada exitosamente`);
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateFull = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (activity) => {
    if (activity.status === 'full') {
      return <Badge variant="destructive" className="text-xs">Completo</Badge>;
    }
    
    const today = new Date();
    const activityDate = new Date(activity.date);
    
    if (activityDate < today) {
      return <Badge variant="secondary" className="text-xs">Finalizado</Badge>;
    }
    
    return <Badge variant="default" className="text-xs">Activo</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm">Cargando panel de administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header - Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Panel de Organizador</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gestiona actividades y genera códigos QR para completar eventos
          </p>
        </div>
        <CreateActivityForm
          onActivityCreated={handleActivityCreated}
          trigger={
            <Button className="flex items-center gap-2 self-start sm:self-auto" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nueva Actividad</span>
              <span className="sm:hidden">Nueva</span>
            </Button>
          }
        />
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 flex items-center justify-between">
            <span>{successMessage}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuccessMessage('')}
              className="h-auto p-0 hover:bg-transparent text-green-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* QR Generator Modal/Panel - Responsivo */}
      {showQRGenerator && selectedActivity && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Generador de Código QR
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowQRGenerator(false);
                  setSelectedActivity(null);
                }}
                className="self-start sm:self-auto"
              >
                <X className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrganizerQRGenerator 
              activity={selectedActivity}
              organizerKey="demo_organizer_key_123"
              onCodeGenerated={(code) => {
                console.log('Código QR generado:', code);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Lista de Actividades */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Actividades para Gestionar</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={`admin-activity-${activity.id || index}`}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Header de la actividad */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {activity.name}
                        </h3>
                        {getStatusBadge(activity)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Información de la actividad - Stack en móvil */}
                  <div className="space-y-2 mb-3 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">
                        <span className="sm:hidden">{formatDate(activity.date)}</span>
                        <span className="hidden sm:inline">{formatDateFull(activity.date)}</span>
                        {' • '}{activity.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{activity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{activity.currentParticipants}/{activity.maxParticipants} inscritos</span>
                    </div>
                  </div>

                  {/* Botones de acción - Stack en móvil */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectActivity(activity)}
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
                      Generar QR
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No hay actividades disponibles
              </h3>
              <p className="text-sm text-gray-600">
                Las actividades aparecerán aquí cuando se creen
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional para organizadores - Stack completo en móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
              ¿Cómo funciona el código QR?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs sm:text-sm text-gray-600 space-y-2">
              <div className="flex gap-2">
                <span className="font-bold flex-shrink-0">1.</span>
                <span>Selecciona una actividad y genera el código QR</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold flex-shrink-0">2.</span>
                <span>Al finalizar el evento, muestra el QR a los participantes</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold flex-shrink-0">3.</span>
                <span>Los participantes escanean el código o ingresan el texto</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold flex-shrink-0">4.</span>
                <span>Automáticamente reciben sus tokens y NFT POAP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              Configuración de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs sm:text-sm text-gray-600 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-base">🔒</span>
                <span>Los códigos expiran en 24 horas</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">🔐</span>
                <span>Cada código está firmado criptográficamente</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">⏰</span>
                <span>Incluyen timestamp para evitar reutilización</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base">✅</span>
                <span>Validación automática en blockchain</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}