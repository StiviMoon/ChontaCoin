// /lib/dataService.js

import mockData, { 
  mockActivities, 
  mockUsers, 
  mockRewards,
  mockParticipations,
  categories,
  systemConfig,
  calculateStats,
  getTopUsers,
  getUpcomingActivities,
  getActivitiesByCategory
} from '@/data/mockData';

// Configuración del servicio
const config = {
  USE_MOCK_DATA: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  ETHEREUM_RPC: process.env.NEXT_PUBLIC_ETHEREUM_RPC,
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
};

class DataService {
  constructor() {
    this.mockMode = config.USE_MOCK_DATA;
    this.apiUrl = config.API_BASE_URL;
  }

  // ===== CONFIGURACIÓN =====
  setMockMode(enabled) {
    this.mockMode = enabled;
  }

  isMockMode() {
    return this.mockMode;
  }

  // ===== USUARIOS =====
  async getUsers() {
    if (this.mockMode) {
      return Promise.resolve(mockUsers);
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockUsers;
    }
  }

  async getUserById(id) {
    if (this.mockMode) {
      return Promise.resolve(mockUsers.find(user => user.id === id));
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/users/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockUsers.find(user => user.id === id);
    }
  }

  async getCurrentUser(walletAddress, ensName = null) {
  console.log('🔍 getCurrentUser llamado con:', walletAddress);
  
  if (this.mockMode) {
    console.log('📊 Modo mock activado');
    
    // En lugar de usar Usuario Demo, crear usuario con datos reales de la wallet
    const realUserData = {
      id: 1, // Mantener ID para compatibilidad
      name: ensName || this.formatWalletAddress(walletAddress), // Usar ENS o wallet formateada
      email: null, // No hay email real desde la wallet
      address: walletAddress,
      ensName: ensName,
      joinedDate: new Date().toISOString(), // Fecha actual de "registro"
      neighborhood: 'Yumbo, Valle del Cauca', // Tu ubicación
      tokens: 0, // Empezar con 0 tokens para usuario real
      completedActivities: 0,
      level: 'Ciudadano Nuevo',
      avatar: null
    };
    
    console.log('✅ Usuario real creado:', realUserData.name);
    return Promise.resolve(realUserData);
  }
  
  try {
    console.log('🌐 Intentando conectar a API real...');
    const response = await fetch(`${this.apiUrl}/users/wallet/${walletAddress}`);
    if (!response.ok) {
      console.log('📝 Usuario no existe, creando nuevo...');
      return this.createUserFromWallet(walletAddress, ensName);
    }
    const userData = await response.json();
    console.log('✅ Usuario real obtenido:', userData);
    return userData;
  } catch (error) {
    console.warn('⚠️ API call failed, creando usuario real:', error);
    
    // Fallback con datos reales de la wallet
    return {
      id: Date.now(),
      name: ensName || this.formatWalletAddress(walletAddress),
      email: null,
      address: walletAddress,
      ensName: ensName,
      joinedDate: new Date().toISOString(),
      neighborhood: 'Yumbo, Valle del Cauca',
      tokens: 0,
      completedActivities: 0,
      level: 'Ciudadano Nuevo',
      avatar: null
    };
  }
}

// Agregar función helper para formatear direcciones de wallet
formatWalletAddress(address) {
  if (!address) return 'Usuario Conectado';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Modificar createUserFromWallet para incluir ENS
async createUserFromWallet(walletAddress, ensName = null) {
  if (this.mockMode) {
    const newUser = {
      id: Date.now(),
      name: ensName || this.formatWalletAddress(walletAddress),
      email: null,
      address: walletAddress,
      ensName: ensName,
      joinedDate: new Date().toISOString(),
      neighborhood: 'Yumbo, Valle del Cauca',
      tokens: 0,
      completedActivities: 0,
      level: 'Ciudadano Nuevo',
      avatar: null
    };
    return Promise.resolve(newUser);
  }
  
  try {
    const response = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address: walletAddress,
        ensName: ensName 
      })
    });
    if (!response.ok) throw new Error('Failed to create user');
    return await response.json();
  } catch (error) {
    console.warn('Failed to create user, using real wallet data:', error);
    return {
      id: Date.now(),
      name: ensName || this.formatWalletAddress(walletAddress),
      address: walletAddress,
      ensName: ensName,
      tokens: 0,
      completedActivities: 0,
      level: 'Ciudadano Nuevo'
    };
  }
}

  async createUserFromWallet(walletAddress) {
    if (this.mockMode) {
      const newUser = {
        id: Date.now(),
        name: 'Nuevo Usuario',
        email: null,
        address: walletAddress,
        ensName: null,
        joinedDate: new Date().toISOString(),
        neighborhood: 'Cali, Valle del Cauca',
        tokens: 0,
        completedActivities: 0,
        level: 'Ciudadano Nuevo',
        avatar: null
      };
      return Promise.resolve(newUser);
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress })
      });
      if (!response.ok) throw new Error('Failed to create user');
      return await response.json();
    } catch (error) {
      console.warn('Failed to create user, using mock:', error);
      return {
        id: Date.now(),
        name: 'Nuevo Usuario',
        address: walletAddress,
        tokens: 0,
        completedActivities: 0
      };
    }
  }

  // ===== ACTIVIDADES =====
  async getActivities(filters = {}) {
    if (this.mockMode) {
      let activities = [...mockActivities];
      
      if (filters.category && filters.category !== 'all') {
        activities = activities.filter(a => a.category === filters.category);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        activities = activities.filter(a => 
          a.name.toLowerCase().includes(searchTerm) ||
          a.location.toLowerCase().includes(searchTerm) ||
          a.organizer.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.status) {
        activities = activities.filter(a => a.status === filters.status);
      }
      
      // Ordenar por fecha
      activities.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return Promise.resolve(activities);
    }
    
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${this.apiUrl}/activities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return getActivitiesByCategory(filters.category || 'all');
    }
  }

  async getActivityById(id) {
    if (this.mockMode) {
      return Promise.resolve(mockActivities.find(activity => activity.id == id));
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/activities/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch activity ${id}`);
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockActivities.find(activity => activity.id == id);
    }
  }

  // Verificar si el usuario está inscrito en una actividad
  async isUserEnrolledInActivity(userId, activityId) {
    if (this.mockMode) {
      const participation = mockParticipations.find(p => 
        p.userId === userId && p.activityId === activityId
      );
      return Promise.resolve(!!participation);
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/participations/check?userId=${userId}&activityId=${activityId}`);
      if (!response.ok) return false;
      const result = await response.json();
      return result.enrolled;
    } catch (error) {
      console.warn('API call failed, checking mock data:', error);
      return mockParticipations.some(p => p.userId === userId && p.activityId === activityId);
    }
  }

  async enrollInActivity(activityId, userId, walletAddress) {
    if (this.mockMode) {
      // Verificar si ya está inscrito
      const alreadyEnrolled = mockParticipations.some(p => 
        p.userId === userId && p.activityId === activityId
      );
      
      if (alreadyEnrolled) {
        return Promise.resolve({
          success: false,
          message: 'Ya estás inscrito en esta actividad'
        });
      }
      
      // Simular inscripción
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Agregar a participaciones mock
      const newParticipation = {
        id: Date.now(),
        userId,
        activityId,
        status: 'enrolled',
        enrolledAt: new Date().toISOString(),
        completedAt: null,
        tokensEarned: 0,
        rating: null,
        feedback: null
      };
      
      mockParticipations.push(newParticipation);
      
      return Promise.resolve({
        success: true,
        participationId: newParticipation.id,
        tokensEarned: 0,
        message: 'Inscripción exitosa'
      });
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/activities/${activityId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, walletAddress })
      });
      
      if (!response.ok) throw new Error('Failed to enroll in activity');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, using mock response:', error);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        success: true,
        participationId: Date.now(),
        tokensEarned: 0,
        message: 'Inscripción exitosa (modo mock)'
      };
    }
  }

  async completeActivity(participationId, activityId, userId) {
    if (this.mockMode) {
      const activity = mockActivities.find(a => a.id == activityId);
      const tokensEarned = activity?.tokensReward || 0;
      
      // Actualizar participación
      const participationIndex = mockParticipations.findIndex(p => p.id === participationId);
      if (participationIndex !== -1) {
        mockParticipations[participationIndex] = {
          ...mockParticipations[participationIndex],
          status: 'completed',
          completedAt: new Date().toISOString(),
          tokensEarned
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve({
        success: true,
        tokensEarned,
        message: 'Actividad completada exitosamente'
      });
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/participations/${participationId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) throw new Error('Failed to complete activity');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, using mock response:', error);
      return {
        success: true,
        tokensEarned: 10,
        message: 'Actividad completada (modo mock)'
      };
    }
  }

  // ===== PARTICIPACIONES =====
  async getUserParticipations(userId) {
    if (this.mockMode) {
      return Promise.resolve(mockParticipations.filter(p => p.userId === userId));
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}/participations`);
      if (!response.ok) throw new Error('Failed to fetch user participations');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockParticipations.filter(p => p.userId === userId);
    }
  }

  // ===== RECOMPENSAS =====
  async getRewards(filters = {}) {
    if (this.mockMode) {
      let rewards = [...mockRewards];
      
      if (filters.category) {
        rewards = rewards.filter(r => r.category === filters.category);
      }
      
      if (filters.available !== undefined) {
        rewards = rewards.filter(r => r.available === filters.available);
      }
      
      return Promise.resolve(rewards);
    }
    
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${this.apiUrl}/rewards?${params}`);
      if (!response.ok) throw new Error('Failed to fetch rewards');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockRewards;
    }
  }

  async redeemReward(rewardId, userId, tokensToSpend) {
    if (this.mockMode) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return Promise.resolve({
        success: true,
        message: 'Recompensa canjeada exitosamente',
        transactionId: 'mock_tx_' + Date.now()
      });
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/rewards/${rewardId}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tokensToSpend })
      });
      
      if (!response.ok) throw new Error('Failed to redeem reward');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, using mock response:', error);
      return {
        success: true,
        message: 'Recompensa canjeada (modo mock)',
        transactionId: 'mock_tx_' + Date.now()
      };
    }
  }

  // ===== ESTADÍSTICAS =====
  async getStats() {
    if (this.mockMode) {
      return Promise.resolve(calculateStats());
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return calculateStats();
    }
  }

  async getTopUsers(limit = 5) {
    if (this.mockMode) {
      // Obtener usuarios únicos y ordenados
      const uniqueUsers = mockUsers.reduce((acc, user) => {
        const exists = acc.find(u => u.address === user.address);
        if (!exists) {
          acc.push(user);
        }
        return acc;
      }, []);
      
      const topUsers = uniqueUsers
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, limit)
        .map((user, index) => ({
          ...user,
          rank: index + 1,
          uniqueKey: `user-${user.id}-${user.address?.slice(-6)}-${index}` // Clave única adicional
        }));
      
      return Promise.resolve(topUsers);
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/users/top?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch top users');
      const users = await response.json();
      return users.map((user, index) => ({
        ...user,
        uniqueKey: `user-${user.id}-${user.address?.slice(-6)}-${index}`
      }));
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return getTopUsers(limit);
    }
  }

  async getUpcomingActivities(limit = 3) {
    if (this.mockMode) {
      return Promise.resolve(getUpcomingActivities(limit));
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/activities/upcoming?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch upcoming activities');
      return await response.json();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return getUpcomingActivities(limit);
    }
  }

  // ===== UTILIDADES =====
  getCategories() {
    return categories;
  }

  getSystemConfig() {
    return systemConfig;
  }
}

// Singleton instance
const dataService = new DataService();

export default dataService;