// /components/ActivitySummaryCard.jsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Coins,
  Star,
  Eye,
  Edit
} from 'lucide-react';

export default function ActivitySummaryCard({ activity, onView, onEdit, className = '' }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      limpieza: 'bg-blue-100 text-blue-800 border-blue-200',
      educacion: 'bg-green-100 text-green-800 border-green-200',
      reforestacion: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Fácil': 'bg-green-100 text-green-700',
      'Moderado': 'bg-yellow-100 text-yellow-700',
      'Difícil': 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-2">
              {activity.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={getCategoryColor(activity.category)}>
                {activity.category}
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(activity.difficulty)}>
                {activity.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{formatDate(activity.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{activity.time}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{activity.currentParticipants || 0}/{activity.maxParticipants}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-green-600" />
            <span className="text-green-600 font-medium">+{activity.tokensReward} CHT</span>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">
            Organiza: {activity.organizer}
          </span>
          {activity.duration && (
            <span className="text-xs text-gray-500">
              {activity.duration}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(activity)}
              className="flex-1 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(activity)}
              className="flex-1 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Editar
            </Button>
          )}
        </div>

        {/* Requirements preview */}
        {activity.requirements && activity.requirements.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-1">Requisitos:</p>
            <div className="flex flex-wrap gap-1">
              {activity.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {req}
                </Badge>
              ))}
              {activity.requirements.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{activity.requirements.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}