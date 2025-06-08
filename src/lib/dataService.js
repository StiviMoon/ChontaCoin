// /lib/dataService.js

import mockData, { 
  mockActivities, 
  mockUsers, 
  mockRewards,
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

  async getCurrentUser(walletAddress) {
    console.log('🔍 getCurrentUser llamado con:', walletAddress);
    
    if (this.mockMode) {
      console.log('📊 Modo mock activado');
      
      // Buscar si existe un usuario mock con esta wallet
      const existingMockUser = mockUsers.find(u => 
        u.address.toLowerCase() === walletAddress?.toLowerCase()
      );
      
      if (existingMockUser) {
        console.log('✅ Usuario mock encontrado:', existingMockUser.name);
        return Promise.resolve(existingMockUser);
      }
      
      // Crear nuevo usuario basado en la wallet conectada
      const newMockUser = {
        id: Date.now(),
        name: `Ciudadano ${walletAddress.slice(0, 6)}`,
        email: `user${walletAddress.slice(2, 8)}@chontacoin.com`,
        address: walletAddress,
        ensName: null,
        joinedDate: new Date().toISOString(),
        neighborhood: 'Cali, Valle del Cauca',
        tokens: Math.floor(Math.random() * 100) + 50, // Tokens aleatorios entre 50-150
        completedActivities: Math.floor(Math.random() * 5),
        level: 'Ciudadano Activo',
        avatar: null
      };
      
      console.log('🆕 Nuevo usuario mock creado:', newMockUser.name);
      return Promise.resolve(newMockUser);
    }
    
    try {
      console.log('🌐 Intentando conectar a API real...');
      const response = await fetch(`${this.apiUrl}/users/wallet/${walletAddress}`);
      if (!response.ok) {
        console.log('📝 Usuario no existe, creando nuevo...');
        return this.createUserFromWallet(walletAddress);
      }
      const userData = await response.json();
      console.log('✅ Usuario real obtenido:', userData);
      return userData;
    } catch (error) {
      console.warn('⚠️ API call failed, usando mock user:', error);
      
      // Fallback a usuario mock personalizado
      return {
        id: Date.now(),
        name: `Usuario ${walletAddress.slice(0, 6)}`,
        email: `user${walletAddress.slice(2, 8)}@chontacoin.com`,
        address: walletAddress,
        ensName: null,
        joinedDate: new Date().toISOString(),
        neighborhood: 'Cali, Valle del Cauca',
        tokens: 75, // Tokens iniciales
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
        neighborhood: null,
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

  async enrollInActivity(activityId, userId, walletAddress) {
    if (this.mockMode) {
      // Simular inscripción
      await new Promise(resolve => setTimeout(resolve, 1500));
      return Promise.resolve({
        success: true,
        participationId: Date.now(),
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
      return Promise.resolve(getTopUsers(limit));
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/users/top?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch top users');
      return await response.json();
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