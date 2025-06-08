// /components/MockDataInitializer.jsx
'use client';

import { useEffect } from 'react';
import useUserStore from '@/lib/userStore';

export default function MockDataInitializer({ children }) {
  const { user, tokens, initMockData } = useUserStore();

  useEffect(() => {
    // Inicializar datos mock solo si no hay usuario configurado
    if (!user && tokens === 0) {
      console.log('Inicializando datos mock...');
      initMockData();
    }
  }, [user, tokens, initMockData]);

  return children;
}