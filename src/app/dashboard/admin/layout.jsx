// /app/dashboard/admin/layout.jsx
'use client';

import { useAuthCheck } from '@/middleware/authMiddleware';
import { useChontaData } from '@/hooks/useChontaData';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user } = useAuthCheck();
  const { isConnected } = useChontaData();

  // En un sistema real, verificarías si el usuario es admin/organizador
  const isAdmin = true; // Por ahora siempre true para demo

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Wallet no conectada
          </h2>
          <p className="text-gray-600">
            Conecta tu wallet para acceder al panel de organizador
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso denegado
          </h2>
          <p className="text-gray-600">
            No tienes permisos para acceder al panel de organizador
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Panel de Organizador</span>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            Admin Mode
          </Badge>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Gestiona actividades y genera códigos para participantes
        </p>
      </div>

      {children}
    </div>
  );
}