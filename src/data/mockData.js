// /data/mockData.js

// ===== USUARIOS MOCK =====
export const mockUsers = [
  {
    id: 1,
    name: 'María García',
    email: 'maria.garcia@chontacoin.com',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    ensName: null,
    joinedDate: '2024-11-15T08:00:00Z',
    neighborhood: 'San Fernando, Cali',
    tokens: 342,
    completedActivities: 15,
    level: 'Ciudadano Gold',
    avatar: null
  },
  {
    id: 2,
    name: 'Juan Pérez',
    email: 'juan.perez@chontacoin.com',
    address: '0x2345678901abcdef2345678901abcdef23456789',
    ensName: 'juan.eth',
    joinedDate: '2024-10-20T10:30:00Z',
    neighborhood: 'Granada, Cali',
    tokens: 289,
    completedActivities: 12,
    level: 'Ciudadano Silver',
    avatar: null
  },
  {
    id: 3,
    name: 'Ana López',
    email: 'ana.lopez@chontacoin.com',
    address: '0x3456789012abcdef3456789012abcdef34567890',
    ensName: null,
    joinedDate: '2024-12-01T14:15:00Z',
    neighborhood: 'El Peñón, Cali',
    tokens: 245,
    completedActivities: 8,
    level: 'Ciudadano Bronze',
    avatar: null
  }
];

// ===== ACTIVIDADES MOCK =====
export const mockActivities = [
  {
    id: 1,
    name: 'Limpieza Comunitaria Parque Central',
    description: 'Jornada de limpieza y mantenimiento del parque principal de la ciudad. Incluye recolección de basura, poda de plantas y pintura de bancas.',
    date: '2025-01-15',
    time: '08:00 AM',
    location: 'Parque Central, Yumbo',
    maxParticipants: 25,
    currentParticipants: 18,
    tokensReward: 10,
    category: 'limpieza',
    status: 'available',
    organizer: 'Alcaldía de Yumbo',
    requirements: ['Ropa cómoda', 'Protector solar', 'Botella de agua'],
    duration: '4 horas',
    difficulty: 'Fácil',
    coordinates: { lat: 3.2676, lng: -76.4951 },
    image: null,
    createdAt: '2024-12-20T09:00:00Z',
    updatedAt: '2025-01-05T12:00:00Z'
  },
  {
    id: 2,
    name: 'Taller de Reciclaje Creativo',
    description: 'Aprende a crear objetos útiles a partir de materiales reciclados. Taller práctico para toda la familia.',
    date: '2025-01-16',
    time: '02:00 PM',
    location: 'Centro Comunitario La Esperanza',
    maxParticipants: 15,
    currentParticipants: 8,
    tokensReward: 5,
    category: 'educacion',
    status: 'available',
    organizer: 'Fundación Verde',
    requirements: ['Materiales reciclables', 'Creatividad'],
    duration: '2 horas',
    difficulty: 'Fácil',
    coordinates: { lat: 3.4516, lng: -76.5320 },
    image: null,
    createdAt: '2024-12-18T11:30:00Z',
    updatedAt: '2025-01-03T16:45:00Z'
  },
  {
    id: 3,
    name: 'Siembra de Árboles - Cerros de Cali',
    description: 'Actividad de reforestación en las laderas de los cerros. Incluye transporte, herramientas y refrigerio.',
    date: '2025-01-18',
    time: '06:00 AM',
    location: 'Cerros Orientales de Cali',
    maxParticipants: 30,
    currentParticipants: 12,
    tokensReward: 15,
    category: 'reforestacion',
    status: 'available',
    organizer: 'CVC Valle del Cauca',
    requirements: ['Ropa de trabajo', 'Botas', 'Guantes'],
    duration: '6 horas',
    difficulty: 'Moderado',
    coordinates: { lat: 3.4372, lng: -76.5225 },
    image: null,
    createdAt: '2024-12-15T08:20:00Z',
    updatedAt: '2025-01-02T10:15:00Z'
  },
  {
    id: 4,
    name: 'Campaña de Concientización Ambiental',
    description: 'Actividad educativa en colegios sobre el cuidado del medio ambiente y manejo de residuos.',
    date: '2025-01-20',
    time: '09:00 AM',
    location: 'I.E. Técnico Industrial',
    maxParticipants: 10,
    currentParticipants: 10,
    tokensReward: 8,
    category: 'educacion',
    status: 'full',
    organizer: 'Secretaría de Educación',
    requirements: ['Habilidades de comunicación', 'Conocimiento ambiental'],
    duration: '3 horas',
    difficulty: 'Fácil',
    coordinates: { lat: 3.4314, lng: -76.5197 },
    image: null,
    createdAt: '2024-12-10T13:45:00Z',
    updatedAt: '2025-01-08T09:30:00Z'
  },
  {
    id: 5,
    name: 'Limpieza Río Cauca - Sector Yumbo',
    description: 'Jornada especial de limpieza de las riberas del río Cauca. Actividad de alto impacto ambiental.',
    date: '2025-01-22',
    time: '07:00 AM',
    location: 'Malecón del Río Cauca',
    maxParticipants: 40,
    currentParticipants: 22,
    tokensReward: 20,
    category: 'limpieza',
    status: 'available',
    organizer: 'CVC Valle del Cauca',
    requirements: ['Ropa que se pueda ensuciar', 'Botas de caucho', 'Guantes'],
    duration: '5 horas',
    difficulty: 'Moderado',
    coordinates: { lat: 3.2833, lng: -76.4833 },
    image: null,
    createdAt: '2024-12-05T07:15:00Z',
    updatedAt: '2025-01-01T14:20:00Z'
  },
  {
    id: 6,
    name: 'Huerta Comunitaria Urbana',
    description: 'Construcción y mantenimiento de una huerta comunitaria en el barrio. Aprende sobre agricultura urbana.',
    date: '2025-01-25',
    time: '08:30 AM',
    location: 'Barrio El Porvenir',
    maxParticipants: 20,
    currentParticipants: 5,
    tokensReward: 12,
    category: 'reforestacion',
    status: 'available',
    organizer: 'Junta de Acción Comunal',
    requirements: ['Ropa de trabajo', 'Ganas de aprender'],
    duration: '4 horas',
    difficulty: 'Fácil',
    coordinates: { lat: 3.4206, lng: -76.5052 },
    image: null,
    createdAt: '2024-11-28T16:00:00Z',
    updatedAt: '2024-12-30T11:45:00Z'
  },
  {
    id: 7,
    name: 'Feria de Intercambio Sostenible',
    description: 'Organización de feria donde los ciudadanos intercambian objetos usados en buen estado.',
    date: '2025-01-28',
    time: '10:00 AM',
    location: 'Plaza de Mercado',
    maxParticipants: 15,
    currentParticipants: 7,
    tokensReward: 6,
    category: 'educacion',
    status: 'available',
    organizer: 'Colectivo Sostenible Yumbo',
    requirements: ['Objetos para intercambiar', 'Actitud colaborativa'],
    duration: '6 horas',
    difficulty: 'Fácil',
    coordinates: { lat: 3.2744, lng: -76.4889 },
    image: null,
    createdAt: '2024-11-25T12:30:00Z',
    updatedAt: '2024-12-28T15:10:00Z'
  }
];

// ===== PARTICIPACIONES MOCK =====
export const mockParticipations = [
  {
    id: 1,
    userId: 1,
    activityId: 1,
    status: 'completed',
    enrolledAt: '2024-12-20T10:00:00Z',
    completedAt: '2025-01-15T12:00:00Z',
    tokensEarned: 10,
    rating: 5,
    feedback: 'Excelente actividad, muy bien organizada'
  },
  {
    id: 2,
    userId: 1,
    activityId: 2,
    status: 'enrolled',
    enrolledAt: '2025-01-05T14:30:00Z',
    completedAt: null,
    tokensEarned: 0,
    rating: null,
    feedback: null
  }
];

// ===== RECOMPENSAS MOCK =====
export const mockRewards = [
  {
    id: 1,
    name: 'Camiseta ChontaCoin',
    description: 'Camiseta oficial de algodón orgánico con el logo de ChontaCoin',
    cost: 50,
    category: 'merchandise',
    stock: 25,
    image: null,
    available: true,
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Botella Reutilizable Río Cali',
    description: 'Botella de acero inoxidable con diseño exclusivo del Río Cali',
    cost: 30,
    category: 'eco-friendly',
    stock: 40,
    image: null,
    available: true,
    createdAt: '2024-11-05T11:15:00Z'
  },
  {
    id: 3,
    name: 'Descuento 20% Restaurante Verde',
    description: 'Descuento del 20% en Restaurante Verde, comida saludable y sostenible',
    cost: 25,
    category: 'discount',
    stock: 100,
    image: null,
    available: true,
    createdAt: '2024-11-10T09:30:00Z'
  },
  {
    id: 4,
    name: 'Tour Ecológico Farallones',
    description: 'Tour guiado por los Farallones de Cali con transporte incluido',
    cost: 150,
    category: 'experience',
    stock: 5,
    image: null,
    available: true,
    createdAt: '2024-10-25T16:45:00Z'
  }
];

// ===== CATEGORÍAS =====
export const categories = [
  { 
    id: 'all', 
    name: 'Todas', 
    color: 'gray',
    gradient: 'from-gray-500 to-slate-500',
    description: 'Todas las categorías disponibles'
  },
  { 
    id: 'limpieza', 
    name: 'Limpieza', 
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-400',
    description: 'Actividades de limpieza y mantenimiento urbano'
  },
  { 
    id: 'educacion', 
    name: 'Educación', 
    color: 'green',
    gradient: 'from-green-500 to-emerald-400',
    description: 'Talleres educativos y de concientización ambiental'
  },
  { 
    id: 'reforestacion', 
    name: 'Reforestación', 
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-400',
    description: 'Siembra de árboles y recuperación de espacios verdes'
  }
];

// ===== CONFIGURACIÓN DEL SISTEMA =====
export const systemConfig = {
  app: {
    name: 'ChontaCoin',
    version: '1.0.0',
    description: 'Plataforma de participación ciudadana basada en blockchain',
    theme: 'rio-cali'
  },
  blockchain: {
    network: 'Ethereum Mainnet',
    tokenSymbol: 'CHT',
    tokenName: 'ChontaCoin Token',
    contractAddress: '0x0000000000000000000000000000000000000000' // Placeholder
  },
  location: {
    city: 'Cali',
    department: 'Valle del Cauca',
    country: 'Colombia',
    coordinates: { lat: 3.4516, lng: -76.5320 }
  },
  features: {
    activitiesEnabled: true,
    rewardsEnabled: true,
    mapEnabled: true,
    blockchainVerification: true,
    notifications: true
  }
};

// ===== ESTADÍSTICAS CALCULADAS =====
export const calculateStats = () => {
  const stats = {
    activities: {
      total: mockActivities.length,
      available: mockActivities.filter(a => a.status === 'available').length,
      full: mockActivities.filter(a => a.status === 'full').length,
      totalSpots: mockActivities.reduce((sum, a) => sum + a.maxParticipants, 0),
      availableSpots: mockActivities.reduce((sum, a) => 
        sum + (a.maxParticipants - a.currentParticipants), 0
      ),
      totalTokensAvailable: mockActivities.reduce((sum, a) => sum + a.tokensReward, 0),
      byCategory: {
        limpieza: mockActivities.filter(a => a.category === 'limpieza').length,
        educacion: mockActivities.filter(a => a.category === 'educacion').length,
        reforestacion: mockActivities.filter(a => a.category === 'reforestacion').length
      }
    },
    users: {
      total: mockUsers.length,
      totalTokens: mockUsers.reduce((sum, u) => sum + u.tokens, 0),
      averageTokens: Math.round(mockUsers.reduce((sum, u) => sum + u.tokens, 0) / mockUsers.length),
      totalActivitiesCompleted: mockUsers.reduce((sum, u) => sum + u.completedActivities, 0)
    },
    rewards: {
      total: mockRewards.length,
      available: mockRewards.filter(r => r.available).length,
      totalStock: mockRewards.reduce((sum, r) => sum + r.stock, 0),
      cheapest: Math.min(...mockRewards.map(r => r.cost)),
      mostExpensive: Math.max(...mockRewards.map(r => r.cost))
    }
  };
  
  return stats;
};

// ===== FUNCIONES DE UTILIDAD =====
export const getTopUsers = (limit = 5) => {
  return mockUsers
    .sort((a, b) => b.tokens - a.tokens)
    .slice(0, limit)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));
};

export const getUpcomingActivities = (limit = 3) => {
  const now = new Date();
  return mockActivities
    .filter(activity => new Date(activity.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);
};

export const getActivitiesByCategory = (category) => {
  if (category === 'all') return mockActivities;
  return mockActivities.filter(activity => activity.category === category);
};

export const getUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

export const getActivityById = (id) => {
  return mockActivities.find(activity => activity.id === id);
};

export const getRewardsByCategory = (category) => {
  if (!category) return mockRewards;
  return mockRewards.filter(reward => reward.category === category);
};

// ===== EXPORTACIONES POR DEFECTO =====
export default {
  users: mockUsers,
  activities: mockActivities,
  participations: mockParticipations,
  rewards: mockRewards,
  categories,
  systemConfig,
  stats: calculateStats(),
  utils: {
    getTopUsers,
    getUpcomingActivities,
    getActivitiesByCategory,
    getUserById,
    getActivityById,
    getRewardsByCategory
  }
};