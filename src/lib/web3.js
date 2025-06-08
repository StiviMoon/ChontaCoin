// /lib/web3.js
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Configuración de Wagmi para conectar wallets
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
});

// Función helper para formatear direcciones
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};