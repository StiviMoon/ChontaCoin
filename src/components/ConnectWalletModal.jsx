// /components/ConnectWalletModal.jsx
import { useState, useEffect } from 'react';
import { useConnect } from 'wagmi';
import { Wallet, X, Loader2, AlertCircle } from 'lucide-react';

export default function ConnectWalletModal({ isOpen, onClose }) {
  const { connectors, connect, isPending, error } = useConnect();
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  
  useEffect(() => {
    // Verificar si MetaMask está instalado
    setHasMetaMask(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined');
  }, []);
  
  if (!isOpen) return null;
  
  const handleConnect = async (connector) => {
    console.log('Attempting to connect with:', connector.name);
    setSelectedConnector(connector.id);
    
    try {
      const result = await connect({ connector });
      console.log('Connection successful:', result);
      onClose();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setSelectedConnector(null);
    }
  };
  
  const handleManualConnect = async () => {
    if (!window.ethereum) {
      alert('Por favor instala MetaMask primero');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      console.log('Connected accounts:', accounts);
      
      if (accounts.length > 0) {
        // Intenta conectar con el primer conector disponible
        const connector = connectors[0];
        if (connector) {
          await handleConnect(connector);
        }
      }
    } catch (error) {
      console.error('Manual connection error:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Conecta tu Wallet</h2>
          <p className="mt-2 text-gray-600">
            Conecta tu wallet para acceder al dashboard de ChontaToken
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-600">
              {error.message || 'Error al conectar la wallet'}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          {!hasMetaMask ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">MetaMask no está instalado</p>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Instalar MetaMask
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ) : (
            <>
             {connectors
                .filter((connector, index, self) =>
                  connector.name === 'MetaMask' &&
                  index === self.findIndex((c) => c.name === connector.name)
                )
                .map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    disabled={isPending}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 hover:border-green-400 hover:bg-green-50 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        <img 
                          src="/metamask.svg" 
                          alt="MetaMask" 
                          className="h-8 w-8"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="text-left cursor-pointer">
                        <p className="font-semibold text-gray-900">{connector.name}</p>
                        <p className="text-sm text-gray-500">Conectar con MetaMask</p>
                      </div>
                    </div>
                    {isPending && selectedConnector === connector.id && (
                      <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    )}
                  </button>
              ))}

              
              {/* Botón de conexión manual como respaldo */}
              <button
                onClick={handleManualConnect}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2 cursor-pointer"
              >
                ¿Problemas? Intenta conexión manual
              </button>
            </>
          )}
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-500">
          Al conectar tu wallet, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}