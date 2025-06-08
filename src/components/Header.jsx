// /components/Header.jsx
import { useAccount, useBalance } from 'wagmi';
import useUserStore from '@/lib/userStore';
import { formatAddress } from '@/lib/web3';
import { Wallet, Coins, HandMetal } from 'lucide-react';

export default function Header() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const user = useUserStore((state) => state.user);
  const tokens = useUserStore((state) => state.tokens);
  
  return (
    <header className="fixed top-0 right-0 left-64 z-30 flex h-16 items-center justify-between bg-white px-6">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">
          ¡Hola, {user?.name || 'Usuario'}!
        </h2>
        <HandMetal />
      </div>

      {/* Right: Balances & Address */}
      <div className="flex items-center gap-4">
        {/* Token Balance */}
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2">
          <Coins className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-700">{tokens} CHT</span>
        </div>

        {/* ETH Balance */}
        {balance && (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2">
            <Wallet className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}

        {/* Wallet Address */}
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(address)}
          </span>
        </div>
      </div>
    </header>
  );
}