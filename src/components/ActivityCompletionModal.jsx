// /components/ActivityCompletionModal.jsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  CheckCircle, 
  Coins, 
  Award, 
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ActivityCompletionModal({ 
  isOpen, 
  onClose, 
  activity, 
  onComplete,
  isCompleting = false 
}) {
  const [completionCode, setCompletionCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    if (!completionCode.trim()) {
      setError('Por favor ingresa el código de finalización');
      return;
    }

    if (completionCode.length < 6) {
      setError('El código debe tener al menos 6 caracteres');
      return;
    }

    setError('');
    
    try {
      await onComplete(activity, completionCode);
      setCompletionCode('');
      setShowCodeInput(false);
    } catch (err) {
      setError(err.message || 'Error al completar actividad');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías mostrar un toast de "copiado"
  };

  if (!activity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Completar Actividad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la actividad */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{activity.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Ubicación:</span>
                  <span>{activity.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span>{new Date(activity.date).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Recompensa:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <Coins className="h-3 w-3 mr-1" />
                    +{activity.tokensReward} CHT
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              ¿Cómo completar la actividad?
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. Participa en la actividad presencialmente</p>
              <p>2. Al finalizar, obtén el código del organizador</p>
              <p>3. Ingresa el código aquí para recibir tus recompensas</p>
            </div>
          </div>

          {/* Recompensas */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">🎁 Recompensas que recibirás:</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">Tokens</span>
                </div>
                <p className="text-2xl font-bold text-green-700">+{activity.tokensReward}</p>
                <p className="text-xs text-green-600">ChontaTokens</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold text-purple-800">NFT POAP</span>
                </div>
                <p className="text-sm font-bold text-purple-700">Certificado</p>
                <p className="text-xs text-purple-600">de participación</p>
              </div>
            </div>
          </div>

          {/* Input del código */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Código de finalización
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className="text-xs"
              >
                {showCodeInput ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Mostrar
                  </>
                )}
              </Button>
            </div>
            
            <Input
              type={showCodeInput ? "text" : "password"}
              placeholder="Ingresa el código del organizador"
              value={completionCode}
              onChange={(e) => setCompletionCode(e.target.value.toUpperCase())}
              className="text-center font-mono tracking-wider"
              maxLength={12}
            />
            
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
          </div>

          {/* Información adicional */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              🔒 Las recompensas se enviarán directamente a tu wallet una vez verificado el código.
              El proceso puede tomar unos minutos para confirmarse en blockchain.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isCompleting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!completionCode.trim() || isCompleting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Completando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar Actividad
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}