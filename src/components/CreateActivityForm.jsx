// /components/CreateActivityForm.jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Coins,
  Tag,
  AlertCircle,
  Plus,
  Save,
  X,
  Info,
  Settings
} from 'lucide-react';

const categories = [
  { id: 'limpieza', name: 'Limpieza', color: 'blue' },
  { id: 'educacion', name: 'Educación', color: 'green' },
  { id: 'reforestacion', name: 'Reforestación', color: 'emerald' }
];

const difficulties = [
  { id: 'facil', name: 'Fácil', description: 'Accesible para todos' },
  { id: 'moderado', name: 'Moderado', description: 'Requiere condición física básica' },
  { id: 'dificil', name: 'Difícil', description: 'Requiere buena condición física' }
];

const organizadores = [
  'CVC Valle del Cauca',
  'Secretaría de Educación de Cali',
  'DAGMA - Cali',
  'Alcaldía de Cali',
  'Fundación Río Cali',
  'Otro'
];

export default function CreateActivityForm({ onActivityCreated, trigger }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    tokensReward: '',
    category: '',
    organizer: '',
    requirements: '',
    duration: '',
    difficulty: '',
    coordinates: {
      lat: '',
      lng: ''
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCoordinateChange = (coordinate, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [coordinate]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones requeridas
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.date) newErrors.date = 'La fecha es requerida';
    if (!formData.time) newErrors.time = 'La hora es requerida';
    if (!formData.location.trim()) newErrors.location = 'La ubicación es requerida';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.organizer) newErrors.organizer = 'El organizador es requerido';
    if (!formData.difficulty) newErrors.difficulty = 'La dificultad es requerida';

    // Validaciones numéricas
    const maxParticipants = parseInt(formData.maxParticipants);
    if (!maxParticipants || maxParticipants < 1 || maxParticipants > 200) {
      newErrors.maxParticipants = 'Debe ser entre 1 y 200 participantes';
    }

    const tokensReward = parseInt(formData.tokensReward);
    if (!tokensReward || tokensReward < 1 || tokensReward > 100) {
      newErrors.tokensReward = 'Debe ser entre 1 y 100 tokens';
    }

    // Validación de fecha (no puede ser en el pasado)
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'La fecha no puede ser en el pasado';
      }
    }

    // Validación de coordenadas (opcional pero si se pone una, ambas son requeridas)
    if (formData.coordinates.lat || formData.coordinates.lng) {
      const lat = parseFloat(formData.coordinates.lat);
      const lng = parseFloat(formData.coordinates.lng);
      
      if (!lat || lat < -90 || lat > 90) {
        newErrors.coordinates = 'Latitud debe estar entre -90 y 90';
      }
      if (!lng || lng < -180 || lng > 180) {
        newErrors.coordinates = 'Longitud debe estar entre -180 y 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Procesar requirements como array
      const requirements = formData.requirements
        .split(',')
        .map(req => req.trim())
        .filter(req => req.length > 0);

      // Crear objeto de actividad
      const newActivity = {
        id: Date.now(), // En producción sería generado por el backend
        name: formData.name.trim(),
        description: formData.description.trim(),
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        maxParticipants: parseInt(formData.maxParticipants),
        currentParticipants: 0,
        tokensReward: parseInt(formData.tokensReward),
        category: formData.category,
        status: 'available',
        organizer: formData.organizer,
        requirements: requirements,
        duration: formData.duration.trim(),
        difficulty: formData.difficulty,
        coordinates: formData.coordinates.lat && formData.coordinates.lng ? {
          lat: parseFloat(formData.coordinates.lat),
          lng: parseFloat(formData.coordinates.lng)
        } : { lat: 3.4516, lng: -76.5320 }, // Coordenadas por defecto de Cali
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Callback para actualizar la lista de actividades
      if (onActivityCreated) {
        onActivityCreated(newActivity);
      }

      // Limpiar formulario y cerrar modal
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        tokensReward: '',
        category: '',
        organizer: '',
        requirements: '',
        duration: '',
        difficulty: '',
        coordinates: { lat: '', lng: '' }
      });
      
      setOpen(false);

    } catch (error) {
      console.error('Error creando actividad:', error);
      setErrors({ submit: 'Error al crear la actividad. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Actividad
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Plus className="h-6 w-6 text-blue-600" />
            Crear Nueva Actividad
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Completa la información para crear una nueva actividad en la plataforma
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-8 pb-6">
            
            {/* Error general */}
            {errors.submit && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-base">{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Información básica */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Info className="h-5 w-5 text-blue-600" />
                  Información Básica
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Datos principales de la actividad
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nombre - Ancho completo */}
                <div>
                  <Label htmlFor="name" className="text-base font-medium text-gray-700 mb-2 block">
                    Nombre de la Actividad *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Limpieza del Río Cali - Sector Norte"
                    className={`h-12 text-base ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Descripción - Ancho completo */}
                <div>
                  <Label htmlFor="description" className="text-base font-medium text-gray-700 mb-2 block">
                    Descripción *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe detalladamente la actividad, qué se hará y qué se espera lograr..."
                    rows={4}
                    className={`text-base resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Categoría y Organizador - Dos columnas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-base font-medium text-gray-700 mb-2 block">
                      Categoría *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={`h-12 text-base ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="py-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={`bg-${category.color}-50 text-${category.color}-700 px-3 py-1`}>
                                {category.name}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="organizer" className="text-base font-medium text-gray-700 mb-2 block">
                      Organizador *
                    </Label>
                    <Select value={formData.organizer} onValueChange={(value) => handleInputChange('organizer', value)}>
                      <SelectTrigger className={`h-12 text-base ${errors.organizer ? 'border-red-500' : 'border-gray-300'}`}>
                        <SelectValue placeholder="Organizador" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizadores.map((org) => (
                          <SelectItem key={org} value={org} className="py-3 text-base">
                            {org}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.organizer && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.organizer}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fecha, Hora y Ubicación */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Cuándo y Dónde
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Programa la fecha, hora y ubicación del evento
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fecha, Hora y Duración - Tres columnas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="date" className="text-base font-medium text-gray-700 mb-2 block">
                      Fecha *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`h-12 text-base ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="time" className="text-base font-medium text-gray-700 mb-2 block">
                      Hora de Inicio *
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className={`h-12 text-base ${errors.time ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.time && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.time}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-base font-medium text-gray-700 mb-2 block">
                      Duración
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Ej: 3 horas"
                      className="h-12 text-base border-gray-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Tiempo aproximado</p>
                  </div>
                </div>

                {/* Ubicación - Ancho completo */}
                <div>
                  <Label htmlFor="location" className="text-base font-medium text-gray-700 mb-2 block">
                    Ubicación del Evento *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ej: Parque del Río - Sector La Babilla, Cali"
                    className={`h-12 text-base ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Coordenadas GPS - Sección opcional */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="text-base font-medium text-gray-700 mb-3 block">
                    📍 Coordenadas GPS (opcional)
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Añade las coordenadas exactas para mejorar la navegación
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lat" className="text-sm text-gray-600 mb-1 block">Latitud</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={formData.coordinates.lat}
                        onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                        placeholder="3.4516"
                        className="h-10 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lng" className="text-sm text-gray-600 mb-1 block">Longitud</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={formData.coordinates.lng}
                        onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                        placeholder="-76.5320"
                        className="h-10 text-base"
                      />
                    </div>
                  </div>
                  {errors.coordinates && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.coordinates}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Participación y Recompensas */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Users className="h-5 w-5 text-blue-600" />
                  Participación y Recompensas
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Configura los límites de participación y incentivos
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Participantes, Tokens y Dificultad - Tres columnas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="maxParticipants" className="text-base font-medium text-gray-700 mb-2 block">
                      Máximo Participantes *
                    </Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                      placeholder="25"
                      min="1"
                      max="200"
                      className={`h-12 text-base ${errors.maxParticipants ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.maxParticipants && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.maxParticipants}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Cupos disponibles</p>
                  </div>

                  <div>
                    <Label htmlFor="tokensReward" className="text-base font-medium text-gray-700 mb-2 block">
                      Tokens de Recompensa *
                    </Label>
                    <Input
                      id="tokensReward"
                      type="number"
                      value={formData.tokensReward}
                      onChange={(e) => handleInputChange('tokensReward', e.target.value)}
                      placeholder="15"
                      min="1"
                      max="100"
                      className={`h-12 text-base ${errors.tokensReward ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.tokensReward && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.tokensReward}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">CHT por completar</p>
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-base font-medium text-gray-700 mb-2 block">
                      Nivel de Dificultad *
                    </Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                      <SelectTrigger className={`h-12 text-base ${errors.difficulty ? 'border-red-500' : 'border-gray-300'}`}>
                        <SelectValue placeholder="Dificultad" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff.id} value={diff.name} className="py-4">
                            <div>
                              <div className="font-medium text-base ">{diff.name}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.difficulty && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.difficulty}
                      </p>
                    )}
                  </div>
                </div>

                {/* Requisitos - Ancho completo */}
                <div>
                  <Label htmlFor="requirements" className="text-base font-medium text-gray-700 mb-2 block">
                    Requisitos para Participar
                  </Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Ej: Ropa de trabajo, Botas de caucho, Guantes, Protector solar"
                    rows={3}
                    className="text-base resize-none border-gray-300"
                  />
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Lista los elementos que los participantes deben traer, separados por comas
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t bg-gray-50 -mx-6 px-6 py-4 sticky bottom-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-6 py-2 h-11 text-base"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="px-8 py-2 h-11 text-base bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando Actividad...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Actividad
                  </>
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}