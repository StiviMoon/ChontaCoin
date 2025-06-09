// /components/ActivityLoadingOverlay.jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2, 
  CheckCircle, 
  Waves,
  Sparkles,
  Shield,
  Coins
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function ActivityLoadingOverlay({ 
  isVisible, 
  onComplete,
  activityName = ""
}) {
  const [stage, setStage] = useState('loading'); // 'loading' | 'success'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStage('loading');
      setProgress(0);
      return;
    }

    // Simular progreso de inscripción
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setStage('success');
          
          // Después de mostrar éxito, cerrar
          setTimeout(() => {
            onComplete?.();
          }, 8000);
          
          return 100;
        }
        return prev + 12; // Incrementar progreso más suave
      });
    }, 20);

    return () => clearInterval(progressInterval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Main Loading Card */}
      <Card className="relative w-full max-w-md mx-4 shadow-2xl border-2">
        <CardContent className="p-8">
          <div className="text-center">
            {stage === 'loading' ? (
              <>
                {/* Loading Header */}
                <div className="mb-6">
                  <div className="relative inline-block mb-4">
                    <div className="relative">
                      <Loader2 className="h-12 w-12 text-primary animate-spin" />
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
                    </div>
                    <Waves className="absolute -top-2 -right-2 h-6 w-6 text-blue-500 animate-bounce" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Inscribiendo al evento
                  </h3>
                  
                  {activityName && (
                    <Badge variant="secondary" className="mb-3">
                      {activityName}
                    </Badge>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    Registrando tu participación de forma segura...
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-muted-foreground">Progreso</span>
                    <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Loading Steps */}
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 text-sm transition-colors ${
                    progress >= 30 ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      progress >= 30 ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                    <span>Verificando disponibilidad</span>
                  </div>
                  <div className={`flex items-center gap-3 text-sm transition-colors ${
                    progress >= 60 ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      progress >= 60 ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                    <span>Registrando en blockchain</span>
                  </div>
                  <div className={`flex items-center gap-3 text-sm transition-colors ${
                    progress >= 90 ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      progress >= 90 ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`} />
                    <span>Confirmando inscripción</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success Animation */}
                <div className="mb-6">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-500">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping" />
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-green-400 animate-bounce" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    ¡Inscripción realizada con éxito!
                  </h3>
                  
                  {activityName && (
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 mb-3">
                      {activityName}
                    </Badge>
                  )}
                </div>

                {/* Success Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Verificado en Ethereum</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Coins className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Tokens programados</span>
                  </div>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    ¡Todo listo!
                  </p>
                  <p className="text-xs text-green-700">
                    Recibirás tus tokens al completar la actividad
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}