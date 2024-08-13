import React, { useState } from "react";
import { Card, CardHeader } from "../ui/card";
import { Toggle } from "../ui/toggle";
import useManabars from "@/api/accountPage/useManabars";
import useAccountDetails from "@/api/accountPage/useAccountDetails";
import useAccountAuthorities from "@/api/accountPage/useAccountAuthorities";
import useRcDelegations from "@/api/common/useRcDelegations";
import useVestingDelegations from "@/api/common/useVestingDelegations";
import useWitnessVoters from "@/api/common/useWitnessVoters";
import useWitnessVotesHistory from "@/api/common/useWitnessVotesHistory";
import useAccountOperations from "@/api/accountPage/useAccountOperations";
import moment from "moment";
import { config } from "@/Config";

interface AccountLiveDataProps {
  accountName: string;
}

const AccountLiveData: React.FC<AccountLiveDataProps> = ({ accountName }) => {
  const [liveDataEnabled, setLiveDataEnabled] = useState(false);
  const [fromDate] = useState<Date>(moment().subtract(7, "days").toDate());
  const [toDate] = useState<Date>(moment().toDate());

  const accountOperationsProps = {
    accountName: accountName
  }
  useAccountOperations(accountOperationsProps, liveDataEnabled ? config.accountRefreshInterval : false);
  useManabars(accountName, liveDataEnabled ? config.accountRefreshInterval : false);
  useAccountDetails(accountName, liveDataEnabled ? config.accountRefreshInterval : false);
  useAccountAuthorities(accountName, liveDataEnabled ? config.accountRefreshInterval : false);
  useRcDelegations(accountName, 1000, liveDataEnabled ? config.accountRefreshInterval : false);
  useVestingDelegations(accountName, null, 1000, liveDataEnabled ? config.accountRefreshInterval : false);
  useWitnessVoters(accountName, false, true, "vests", liveDataEnabled ? config.accountRefreshInterval : false);
  useWitnessVotesHistory(accountName, false, fromDate, toDate, liveDataEnabled ? config.accountRefreshInterval : false);

  return (
    <Card data-testid="account-live-data" className="col-span-4 md:col-span-1">
      <CardHeader>
        <Toggle
          checked={liveDataEnabled}
          onClick={() => setLiveDataEnabled(!liveDataEnabled)}
          className="text-base"
          leftLabel="Live Data"
        />
      </CardHeader>
    </Card>
  );
};

export default AccountLiveData;
