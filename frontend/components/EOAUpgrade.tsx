import { useWeb3Store } from '../stores/web3Store';
import { useEOAStatus, useUpgradeEOA, useSmartWallet, useNetwork } from '../hooks/eoa';
import { Button } from './ui/button';
import { CopyButton } from './ui/copy-button';

export function EOAUpgrade() {
  const { 
    connect, 
    disconnect, 
    address, 
    isConnecting, 
    error: connectionError, 
    isConnected,
    chainId 
  } = useWeb3Store();
  
  const { data: status, isLoading: isLoadingStatus } = useEOAStatus();
  const { 
    upgradeEOA, 
    isUpgrading, 
    error: upgradeError,
    isReady: canUpgrade 
  } = useUpgradeEOA();
  const { 
    mutate: switchNetwork, 
    isPending: isSwitching,
    error: switchError 
  } = useNetwork();
  const { 
    number, 
    setNumber, 
    isLoading: isLoadingNumber,
    isSettingNumber,
    isReady: smartWalletReady
  } = useSmartWallet();

  const isSepoliaNetwork = chainId === 11155111;

  // Handle connection errors
  if (connectionError) {
    return (
      <div className="p-4 text-red-500">
        Error: {connectionError.message}
      </div>
    );
  }

  // Handle wallet connection
  if (!isConnected) {
    return (
      <Button 
        onClick={() => connect()} 
        disabled={isConnecting}
        className="w-full"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  // Handle network switching
  if (!isSepoliaNetwork) {
    return (
      <div className="space-y-4">
        <div className="p-4 text-yellow-500">
          Please connect to Sepolia network
        </div>
        {switchError && (
          <div className="p-4 text-red-500">
            Failed to switch network: {switchError.message}
          </div>
        )}
        <Button
          onClick={() => switchNetwork()}
          disabled={isSwitching}
          className="w-full"
        >
          {isSwitching ? 'Switching Network...' : 'Switch to Sepolia'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Connected:</span>
          {address && <CopyButton value={address} />}
        </div>
        <Button variant="outline" onClick={disconnect}>
          Disconnect
        </Button>
      </div>

      {/* Account Status */}
      {isLoadingStatus ? (
        <div>Loading account status...</div>
      ) : (
        <div className="space-y-4">
          <div>
            Status: {status?.isUpgraded ? 'Upgraded' : 'Not Upgraded'}
          </div>

          {/* Upgrade Section */}
          {!status?.isUpgraded ? (
            <div className="space-y-2">
              {upgradeError && (
                <div className="p-2 text-sm text-red-500">
                  {upgradeError.message}
                </div>
              )}
              <Button
                onClick={() => upgradeEOA()}
                disabled={isUpgrading || !canUpgrade}
                className="w-full"
              >
                {isUpgrading ? 'Upgrading...' : 'Upgrade Account'}
              </Button>
            </div>
          ) : (
            /* Smart Wallet Section */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Smart Wallet Address:</span>
                {status?.delegatedAddress && (
                  <CopyButton value={status.delegatedAddress} />
                )}
              </div>
              <div>
                Current Number: {isLoadingNumber ? 'Loading...' : number?.toString()}
              </div>
              <Button
                onClick={() => setNumber.mutate(42)}
                disabled={isSettingNumber || !smartWalletReady}
                className="w-full"
              >
                {isSettingNumber ? 'Setting...' : 'Set Number to 42'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 