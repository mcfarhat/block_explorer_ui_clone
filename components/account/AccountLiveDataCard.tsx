import { useState, useEffect } from 'react';
import Explorer from '@/types/Explorer';
import { useUserSettingsContext } from '../contexts/UserSettingsContext';
import { useBlockchainSyncInfo } from '@/utils/Hooks';
import { Toggle } from '../ui/toggle';
import { Card, CardHeader, CardContent } from '../ui/card';
import Link from 'next/link';
import { config } from '@/Config';

const AccountLiveDataCard: React.FC = () => {
  const { settings, setSettings } = useUserSettingsContext();
  const { explorerBlockNumber, hiveBlockNumber, loading: isLoading } = useBlockchainSyncInfo();

  const blockDifference = (hiveBlockNumber || 0) - (explorerBlockNumber || 0);
  const isLiveDataToggleDisabled = blockDifference > config.liveblockSecurityDifference || isLoading;

  useEffect(() => {
    if (settings.liveData) {
      const interval = setInterval(() => {
        // No need to explicitly call a fetch function, 
        // The hook will handle data updates
      }, 20000); // 20 seconds

      return () => clearInterval(interval);
    }
  }, [settings.liveData]);

  return (
    <Card className="col-span-4 md:col-span-1 bg-explorer-dark-gray p-4 rounded-lg mb-4">
      <CardHeader>
        <Toggle
          disabled={isLiveDataToggleDisabled}
          checked={settings.liveData}
          onClick={() => setSettings({
            ...settings,
            liveData: !settings.liveData,
          })}
          className="text-base"
          leftLabel="Live data"
        />
        <div className="text-explorer-turquoise text-2xl text-left">
          <Link href={`/block/${explorerBlockNumber}`} data-testid="block-number-link">
            Block: {explorerBlockNumber?.toLocaleString()}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        {/* Additional content can be added here if needed */}
      </CardContent>
    </Card>
  );
};

export default AccountLiveDataCard;
