// /components/Header.jsx
import { useAccount, useBalance } from 'wagmi';
import useUserStore from '@/lib/userStore';
import { formatAddress } from '@/lib/web3';
import { Wallet, Coins, HandMetal, Menu } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const user = useUserStore((state) => state.user);
  const tokens = useUserStore((state) => state.tokens);
  
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 flex h-16 items-center justify-between bg-white px-4 lg:px-6 border-b border-gray-200">
      {/* Left: Mobile Menu Button + User Info */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button - Solo visible en móvil */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-2">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">
            ¡Hola, {user?.name || 'Usuario'}!
          </h2>
          <HandMetal className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
      </div>

      {/* Right: Balances & Address */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Token Balance */}
        <div className="flex items-center gap-1 lg:gap-2 rounded-lg bg-green-50 px-2 lg:px-4 py-1.5 lg:py-2">
          <Coins className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
          <span className="text-xs lg:text-sm font-semibold text-green-700">
            {tokens} <span className="hidden sm:inline">CHT</span>
          </span>
        </div>

        {/* ETH Balance - Oculto en móvil muy pequeño */}
        {balance && (
          <div className="hidden sm:flex items-center gap-1 lg:gap-2 rounded-lg bg-blue-50 px-2 lg:px-4 py-1.5 lg:py-2">
            <Wallet className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
            <span className="text-xs lg:text-sm font-medium text-blue-700">
              {parseFloat(balance.formatted).toFixed(4)} 
              <span className="hidden md:inline ml-1">{balance.symbol}</span>
            </span>
          </div>
        )}

        {/* Wallet Address - Solo visible en desktop */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(address)}
          </span>
        </div>
      </div>
    </header>
  );
}