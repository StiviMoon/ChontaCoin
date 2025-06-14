// /components/QRScannerIntegrated.jsx (Versión integrada con useActivities)
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  XCircle, 
  Coins, 
  User, 
  MapPin, 
  Calendar,
  Loader2,
  Trophy,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { useActivities } from '@/hooks/useActivities';

// Datos simulados de códigos QR válidos
const validQRCodes = {
  'CHT124567890': {
    activityId: 1,
    activityName: 'Limpieza del Río Cali - Tramo Centro',
    organizerCode: 'CHT124567890',
    tokensReward: 15,
    location: 'Riberas del Río Cali - Sector Malecón',
    date: '2025-01-25',
    organizer: 'CVC Valle del Cauca',
    expiresAt: Date.now() + (24 * 60 * 60 * 1000),
    isValid: true
  },
  'CHT298765432': {
    activityId: 2,
    activityName: 'Taller de Educación Ambiental',
    organizerCode: 'CHT298765432',
    tokensReward: 12,
    location: 'I.E. Técnico Industrial - Sede Norte',
    date: '2025-01-28',
    organizer: 'Secretaría de Educación de Cali',
    expiresAt: Date.now() + (48 * 60 * 60 * 1000),
    isValid: true
  },
  'CHT387654321': {
    activityId: 3,
    activityName: 'Reforestación Cerros Orientales',
    organizerCode: 'CHT387654321',
    tokensReward: 20,
    location: 'Cerros Orientales - Zona de Reforestación',
    date: '2025-02-02',
    organizer: 'DAGMA - Cali',
    expiresAt: Date.now() + (72 * 60 * 60 * 1000),
    isValid: true
  }
};

export default function QRScannerIntegrated() {
  const {
    user,
    isLoading,
    error,
    validateQRAndComplete,
    getUserStats,
    clearError
  } = useActivities();

  const [scanMode, setScanMode] = useState('camera');
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [userStats, setUserStats] = useState(null);

  // Actualizar estadísticas del usuario
  useEffect(() => {
    setUserStats(getUserStats());
  }, [getUserStats]);

  // Simular escaneo de cámara
  const simulateCameraScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    clearError();
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const codes = Object.keys(validQRCodes);
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    
    setIsScanning(false);
    await validateQRCode(randomCode);
  };

  // Validar código QR usando el hook integrado
  const validateQRCode = async (code) => {
    setScanResult(null);
    clearError();

    // Simular validación inicial
    await new Promise(resolve => setTimeout(resolve, 2000));

    const qrData = validQRCodes[code];
    
    if (!qrData) {
      setScanResult({
        success: false,
        error: 'Código QR no válido o no reconocido',
        code: code
      });
      return;
    }

    // Verificar expiración
    if (Date.now() > qrData.expiresAt) {
      setScanResult({
        success: false,
        error: 'Este código QR ha expirado',
        code: code,
        expired: true
      });
      return;
    }

    try {
      // Usar el hook integrado para validar y completar
      const result = await validateQRAndComplete(code, qrData);
      
      if (result.success) {
        setScanResult({
          success: true,
          message: '¡Validación exitosa! Tus ChontaTokens se han enviado a tu wallet',
          tokensEarned: result.tokensEarned,
          newBalance: userStats?.currentTokens + result.tokensEarned,
          activityData: qrData,
          code: code
        });
        
        // Actualizar estadísticas
        setUserStats(getUserStats());
      } else {
        throw new Error(result.message || 'Error en la validación');
      }
    } catch (err) {
      setScanResult({
        success: false,
        error: err.message,
        code: code,
        activityData: qrData
      });
    }
  };

  const handleManualScan = async () => {
    if (manualCode.trim()) {
      await validateQRCode(manualCode.trim());
      setManualCode('');
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setManualCode('');
    clearError();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header del usuario con estadísticas */}
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{user?.name || 'Usuario'}</h3>
                <p className="text-sm opacity-90">{user?.neighborhood}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Coins className="h-5 w-5" />
                <span className="text-2xl font-bold">{userStats?.currentTokens || 0}</span>
              </div>
              <p className="text-xs opacity-90">CHT Tokens</p>
            </div>
          </div>
          
          {/* Estadísticas adicionales */}
          {userStats && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span className="font-bold">{userStats.completedActivities}</span>
                  </div>
                  <p className="text-xs opacity-75">Completadas</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-bold">{userStats.totalTokensEarned}</span>
                  </div>
                  <p className="text-xs opacity-75">Tokens ganados</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Escáner QR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center">
            <QrCode className="h-5 w-5 text-blue-600" />
            Escanear Código de Actividad
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Selector de modo */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setScanMode('camera')}
              className="flex-1"
              disabled={isLoading}
            >
              <Camera className="h-4 w-4 mr-2" />
              Cámara
            </Button>
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setScanMode('manual')}
              className="flex-1"
              disabled={isLoading}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Manual
            </Button>
          </div>

          {/* Modo cámara */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                {isScanning ? (
                  <div className="space-y-3">
                    <Loader2 className="h-12 w-12 text-blue-500 mx-auto animate-spin" />
                    <p className="text-gray-600">Escaneando código QR...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Presiona para simular escaneo</p>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={simulateCameraScan}
                disabled={isScanning || isLoading}
                className="w-full"
              >
                {isScanning ? 'Escaneando...' : 'Simular Escaneo'}
              </Button>
            </div>
          )}

          {/* Modo manual */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Ingresa el código manualmente:
                </label>
                <Input
                  type="text"
                  placeholder="Ej: CHT124567890"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                onClick={handleManualScan}
                disabled={!manualCode.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  'Validar Código'
                )}
              </Button>
            </div>
          )}

          {/* Error general */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultado del escaneo */}
      {scanResult && (
        <Card className={`border-2 ${scanResult.success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {scanResult.success ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      ¡Validación Exitosa!
                    </h3>
                    <p className="text-green-700 mb-4">{scanResult.message}</p>
                    
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tokens ganados:</span>
                        <Badge className="bg-green-100 text-green-800">
                          <Coins className="h-3 w-3 mr-1" />
                          +{scanResult.tokensEarned} CHT
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Nuevo balance:</span>
                        <span className="font-bold text-green-600">
                          {scanResult.newBalance} CHT
                        </span>
                      </div>
                      
                      <div className="border-t pt-3 space-y-2">
                        <h4 className="font-semibold text-gray-800">
                          {scanResult.activityData.activityName}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{scanResult.activityData.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(scanResult.activityData.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-3 w-3" />
                            <span>{scanResult.activityData.organizer}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      Error de Validación
                    </h3>
                    <p className="text-red-700 mb-4">{scanResult.error}</p>
                    
                    {scanResult.code && (
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-gray-600">
                          Código escaneado: <code className="bg-gray-100 px-2 py-1 rounded">{scanResult.code}</code>
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              <Button onClick={resetScan} className="w-full">
                Escanear Otro Código
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Códigos de prueba */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-800">
            🧪 Códigos de Prueba (Demo)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-blue-700">
            Puedes usar estos códigos para probar el sistema:
          </p>
          <div className="space-y-1 text-xs">
            {Object.entries(validQRCodes).map(([code, data]) => (
              <div key={code} className="flex justify-between bg-white rounded p-2">
                <code className="font-mono">{code}</code>
                <span className="text-green-600">+{data.tokensReward} CHT</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}