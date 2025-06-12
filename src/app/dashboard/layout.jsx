// /app/dashboard/layout.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthCheck } from '@/middleware/authMiddleware';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ← Esta línea faltaba
  const { isConnected } = useAuthCheck(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Cerrar sidebar cuando se cambie de ruta en móvil
  useEffect(() => {
    setSidebarOpen(false);
  }, []);
  
  if (isLoading || !isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main Content Area */}
        <main className="flex-1 mt-16 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}