// /app/dashboard/layout.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthCheck } from '@/middleware/authMiddleware';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAuthCheck(true);
  
  useEffect(() => {
    // Pequeño delay para asegurar que la verificación de auth se complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mostrar loading mientras verifica autenticación
  if (isLoading || !isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Header />
        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}