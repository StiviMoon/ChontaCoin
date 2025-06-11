// /components/ActivityCard.jsx
import { 
  Calendar, 
  MapPin, 
  Users, 
  Coins, 
  CheckCircle,
  Loader2,
  Waves,
  TreePine,
  Recycle,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const categories = [
  { 
    id: 'limpieza', 
    name: 'Limpieza', 
    icon: Recycle,
    gradient: 'from-blue-500 to-cyan-400',
    color: 'blue'
  },
  { 
    id: 'educacion', 
    name: 'Educación', 
    icon: GraduationCap,
    gradient: 'from-emerald-500 to-teal-400',
    color: 'emerald'
  },
  { 
    id: 'reforestacion', 
    name: 'Reforestación', 
    icon: TreePine,
    gradient: 'from-green-500 to-emerald-400',
    color: 'green'
  }
];

export default function ActivityCard({ activity, isEnrolled, onEnroll, isLoading = false }) {
  const categoryData = categories.find(c => c.id === activity.category) || categories[0];
  const CategoryIcon = categoryData.icon;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const handleEnroll = () => {
    onEnroll(activity);
  };

  const progressValue = (activity.currentParticipants / activity.maxParticipants) * 100;
  const spotsLeft = activity.maxParticipants - activity.currentParticipants;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-sm">
      {/* Río Cali Theme Header */}
      <div className={`h-1 bg-gradient-to-r ${categoryData.gradient}`} />
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${categoryData.gradient} shadow-sm`}>
              <CategoryIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">
                {activity.name}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {categoryData.name}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{formatDate(activity.date)} • {activity.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Waves className="h-4 w-4 text-blue-500" />
            <span>{activity.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{activity.currentParticipants}/{activity.maxParticipants}</span>
            </div>
            
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Coins className="h-3 w-3 mr-1" />
              +{activity.tokensReward}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <Progress 
            value={progressValue} 
            className="h-2"
            // Puedes personalizar el color según el estado
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">
              {spotsLeft > 0 ? `${spotsLeft} cupos disponibles` : 'Completo'}
            </span>
            {spotsLeft <= 3 && spotsLeft > 0 && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                ¡Últimos cupos!
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        {isEnrolled ? (
          <Button 
            variant="outline" 
            className="w-full border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
            disabled
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Inscrito
          </Button>
        ) : (
          <Button
            onClick={handleEnroll}
            disabled={activity.status === 'full' || isLoading}
            className="w-full"
            variant={activity.status === 'full' ? 'secondary' : 'default'}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : activity.status === 'full' ? (
              'Completo'
            ) : (
              'Inscribirme'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}