// /app/dashboard/overview/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuthCheck } from '@/middleware/authMiddleware';
import useUserStore from '@/lib/userStore';
import { useAccount, useBalance, useEnsName } from 'wagmi';
import { formatAddress } from '@/lib/web3';
import { Activity, TrendingUp, Users, Calendar, Wallet, Coins, Globe, Loader2 } from 'lucide-react';

export default function OverviewPage() {
  const { user } = useAuthCheck();
  const { tokens, activities } = useUserStore();
  const { address } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  
  const [ethPrice, setEthPrice] = useState(null);
  const [joinDays, setJoinDays] = useState(0);
  
  useEffect(() => {
    // Calcular días desde que se unió
    if (user?.joinedDate) {
      const joined = new Date(user.joinedDate);
      const today = new Date();
      const diffTime = Math.abs(today - joined);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setJoinDays(diffDays);
    }
    
    // Obtener precio de ETH (opcional)
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setEthPrice(data.ethereum?.usd))
      .catch(console.error);
  }, [user]);
  
  // Estadísticas actualizadas con datos reales
  const stats = [
    {
      title: 'Balance ETH',
      value: balanceLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        `${parseFloat(balance?.formatted || '0').toFixed(4)} ${balance?.symbol || 'ETH'}`
      ),
      subValue: ethPrice && balance ? 
        `$${(parseFloat(balance.formatted) * ethPrice).toFixed(2)} USD` : null,
      icon: Wallet,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Chonta Tokens',
      value: tokens,
      subValue: 'CHT',
      icon: Coins,
      color: 'bg-green-500',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Actividades',
      value: activities.filter(a => a.completed).length,
      subValue: 'Completadas',
      icon: Activity,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Días Activo',
      value: joinDays,
      subValue: 'En la plataforma',
      icon: Calendar,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50'
    }
  ];
  
  // Información de la wallet
  const walletInfo = [
    {
      label: 'Dirección',
      value: formatAddress(address),
      fullValue: address
    },
    {
      label: 'ENS',
      value: ensName || 'No configurado'
    },
    {
      label: 'Red',
      value: 'Ethereum Mainnet'
    },
    {
      label: 'Estado',
      value: 'Conectado',
      status: 'success'
    }
  ];
  
  // Top ciudadanos actualizado
  const topCitizens = [
    { rank: 1, name: 'María García', tokens: 342, address: '0x1234...5678' },
    { rank: 2, name: 'Juan Pérez', tokens: 289, address: '0x2345...6789' },
    { rank: 3, name: 'Ana López', tokens: 245, address: '0x3456...7890' },
    { rank: 4, name: 'Carlos Ruiz', tokens: 201, address: '0x4567...8901' },
    { rank: 5, name: ensName || user?.name || 'Tú', tokens: tokens, address: formatAddress(address), isYou: true }
  ];
  
  // Actividades recientes
  const recentActivities = activities.slice(-3).reverse();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
                  )}
                </div>
                <div className={`${stat.bgLight} rounded-lg p-3`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Información de Wallet */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Información de tu Wallet
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {walletInfo.map((info) => (
            <div key={info.label} className="space-y-1">
              <p className="text-sm text-gray-500">{info.label}</p>
              <p className="font-medium text-gray-900" title={info.fullValue}>
                {info.value}
                {info.status === 'success' && (
                  <span className="ml-2 inline-flex h-2 w-2 bg-green-500 rounded-full"></span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Gráfico o estadísticas adicionales */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Tu Impacto Ambiental
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{activities.length * 2}</p>
            <p className="text-sm text-gray-600">kg CO₂ reducidos</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{activities.length * 5}</p>
            <p className="text-sm text-gray-600">Personas impactadas</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
            <p className="text-sm text-gray-600">Horas voluntariado</p>
          </div>
        </div>
      </div>
      
      {/* Tres columnas: Actividades recientes, Ranking y Próximos eventos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Actividades Recientes */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Actividades Recientes
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{activity.name}</p>
                    <p className="text-xs text-gray-500">{activity.location}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    +{activity.tokensEarned} CHT
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay actividades aún
            </p>
          )}
        </div>
        
        {/* Top Ciudadanos */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Top 5 Ciudadanos
          </h3>
          <div className="space-y-2">
            {topCitizens.map((citizen) => (
              <div
                key={citizen.rank}
                className={`flex items-center justify-between rounded-lg p-2.5 text-sm ${
                  citizen.isYou ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${
                    citizen.rank <= 3 ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    #{citizen.rank}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{citizen.name}</p>
                    <p className="text-xs text-gray-500">{citizen.address}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-700">
                  {citizen.tokens} CHT
                </span>
              </div>
            ))}
          </div>
        </div>

        
        
        {/* Próximos Eventos */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Próximos Eventos
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3">
              <h4 className="font-semibold text-gray-900 text-sm">
                Limpieza Comunitaria
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                Sábado 15 de Enero • Parque Central
              </p>
              <p className="mt-2 text-xs font-medium text-green-600">
                +10 CHT
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <h4 className="font-semibold text-gray-900 text-sm">
                Taller de Reciclaje
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                Domingo 16 de Enero • Centro Comunitario
              </p>
              <p className="mt-2 text-xs font-medium text-green-600">
                +5 CHT
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <h4 className="font-semibold text-gray-900 text-sm">
                Siembra de Árboles
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                Martes 18 de Enero • Cerros de Cali
              </p>
              <p className="mt-2 text-xs font-medium text-green-600">
                +15 CHT
              </p>
            </div>
          </div>
        </div>
      </div>
      
      
    </div>
  );
}