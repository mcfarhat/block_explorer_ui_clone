import React, { useEffect } from "react";
import Link from "next/link";
import { Toggle } from "../ui/toggle";
import { Card, CardHeader } from "../ui/card";
import { useUserSettingsContext } from "../contexts/UserSettingsContext";
import { useBlockchainSyncInfo } from "@/utils/Hooks"; // Ensure this hook is properly defined
import { getBlockDifference } from "@/components/home/SyncInfo";
import { config } from "@/Config";
import Hive from "@/types/Hive";

interface CardHeaderProps {
  blockDetails?: Hive.BlockDetails;
}

const AccountLiveDataCard: React.FC<CardHeaderProps> = ({ blockDetails }) => {
  const { settings, setSettings } = useUserSettingsContext();
  const {
    explorerBlockNumber,
    hiveBlockNumber,
    loading: isLoading,
  } = useBlockchainSyncInfo(settings.liveData, 20000); // Pass settings.liveData and the interval

  const blockDifference = getBlockDifference(
    hiveBlockNumber,
    explorerBlockNumber
  );

  const isLiveDataToggleDisabled =
    blockDifference > config.liveblockSecurityDifference || isLoading;

  useEffect(() => {
    const interval = setInterval(() => {
      if (settings.liveData) {
        // Trigger the refetch here
        setSettings({ ...settings });
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [settings, setSettings]);

  return (
    <Card className="col-span-4 md:col-span-1" data-testid="head-block-card">
      <CardHeader>
        <Toggle
          disabled={isLiveDataToggleDisabled}
          checked={settings.liveData}
          onClick={() =>
            setSettings({
              ...settings,
              liveData: !settings.liveData,
            })
          }
          className="text-base"
          leftLabel="Live data"
        />
        <div className="text-explorer-turquoise text-2xl text-left">
          <Link
            href={`/block/${blockDetails?.block_num}`} // Adjusted template string syntax
            data-testid="block-number-link"
          >
            Block: {blockDetails?.block_num?.toLocaleString()}
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
};

export default AccountLiveDataCard;
