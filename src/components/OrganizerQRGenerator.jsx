// /components/OrganizerQRGenerator.jsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Copy, 
  RefreshCw, 
  Download,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

export default function OrganizerQRGenerator({ 
  activity, 
  organizerKey = "default_key", 
  onCodeGenerated 
}) {
  const [qrCode, setQrCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  // Validar que activity existe
  if (!activity) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error: Actividad no encontrada
          </h3>
          <p className="text-red-700">
            No se ha seleccionado ninguna actividad para generar el código QR.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Validar campos requeridos de la actividad
  const requiredFields = ['id', 'name'];
  const missingFields = requiredFields.filter(field => !activity[field]);
  
  if (missingFields.length > 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Datos de actividad incompletos
          </h3>
          <p className="text-yellow-700 mb-3">
            Faltan los siguientes campos: {missingFields.join(', ')}
          </p>
          <div className="bg-white p-3 rounded border text-left text-sm">
            <strong>Datos recibidos:</strong>
            <pre className="mt-2 text-xs overflow-auto max-h-32">
              {JSON.stringify(activity, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generar código QR
  const generateQRCode = async () => {
    setIsGenerating(true);
    
    try {
      const timestamp = Date.now();
      const expirationTime = timestamp + (24 * 60 * 60 * 1000); // 24 horas
      
      const qrData = {
        activityId: activity.id,
        activityName: activity.name,
        timestamp,
        organizerCode: `CHT${activity.id}${timestamp.toString().slice(-6)}`,
        signature: `${activity.id}-${timestamp}-${organizerKey}`,
        version: '1.0',
        location: activity.location || 'No especificada',
        date: activity.date || new Date().toISOString()
      };

      const displayCode = qrData.organizerCode;
      
      console.log('🔗 Generando QR con datos:', qrData);
      
      setQrCode({
        data: JSON.stringify(qrData),
        displayCode,
        activityId: activity.id,
        expiresAt: expirationTime,
        rawData: qrData
      });
      setExpiresAt(expirationTime);
      
      if (onCodeGenerated) {
        onCodeGenerated(qrData);
      }

    } catch (error) {
      console.error('Error generando QR:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = expiresAt - now;
      
      if (remaining <= 0) {
        setTimeLeft('Expirado');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const copyCode = () => {
    if (qrCode?.displayCode) {
      navigator.clipboard.writeText(qrCode.displayCode);
      alert('Código copiado al portapapeles');
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(qrCode.data);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chontacoin-qr-${activity.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const resetQR = () => {
    setQrCode(null);
    setExpiresAt(null);
    setTimeLeft('');
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString || 'Fecha no válida';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center">
            <QrCode className="h-5 w-5 text-blue-600" />
            Código de Actividad
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Info de la actividad */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">{activity.name}</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  {activity.currentParticipants || 0}/{activity.maxParticipants || 'N/A'} inscritos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDate(activity.date)} • {activity.time || 'Hora no especificada'}</span>
              </div>
            </div>
          </div>

          {/* Generar o mostrar código */}
          {!qrCode ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                Genera un código QR para que los participantes puedan completar la actividad
              </p>
              <Button 
                onClick={generateQRCode}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generar Código QR
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Code Display Simulado */}
              <div className="text-center space-y-4">
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200 flex flex-col items-center">
                  <QrCode className="h-32 w-32 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Código QR Visual</p>
                  <p className="text-xs text-gray-400">(Aquí iría el QR real)</p>
                </div>
                
                {/* Código de texto */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Código alternativo:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="bg-white px-3 py-2 rounded border font-mono text-lg font-bold">
                      {qrCode.displayCode}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Estado y expiración */}
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                  
                  {timeLeft !== 'Expirado' ? (
                    <div className="text-sm text-gray-600">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Expira en: {timeLeft}
                    </div>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Expirado
                    </Badge>
                  )}
                </div>

                {/* Acciones */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={downloadQR}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetQR}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Nuevo Código
                  </Button>
                </div>

                {/* Debug Info */}
                <div className="bg-gray-50 rounded p-3 text-left">
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 mb-2">
                      Ver datos del QR (Debug)
                    </summary>
                    <pre className="text-xs overflow-auto bg-white p-2 rounded border max-h-32">
                      {JSON.stringify(qrCode.rawData, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          )}

          {/* Instrucciones */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">📱 Instrucciones:</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Muestra el código QR a los participantes al finalizar</li>
              <li>Los participantes escanean o ingresan el código</li>
              <li>Se valida automáticamente y reciben sus recompensas</li>
              <li>El código expira en 24 horas por seguridad</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}