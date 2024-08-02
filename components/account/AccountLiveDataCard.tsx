import { useState, useEffect } from "react";
import { Card, CardHeader } from "../ui/card";
import { Toggle } from "../ui/toggle";
import useManabars from "@/api/accountPage/useManabars";
import useAccountDetails from "@/api/accountPage/useAccountDetails";
import useAccountAuthorities from "@/api/accountPage/useAccountAuthorities";
import useRcDelegations from "@/api/common/useRcDelegations";
import useVestingDelegations from "@/api/common/useVestingDelegations";
import useWitnessVoters from "@/api/common/useWitnessVoters";
import useWitnessVotesHistory from "@/api/common/useWitnessVotesHistory";
import moment from "moment";
interface AccountLiveDataProps {
  accountName: string;
  liveDataOperations: boolean;
  setLiveDataOperations: (state: boolean) => void;
  refetchAccountOperations: any;
}

const AccountLiveData: React.FC<AccountLiveDataProps> = ({ 
    accountName, 
    liveDataOperations,
    setLiveDataOperations,
    refetchAccountOperations }) => {
  const [liveDataManabars, setLiveDataManabars] = useState(false);
  const { manabarsData, refetchManabars } = useManabars(accountName);
  const [liveDataDetails, setLiveDataDetails] = useState(false);
  const {accountDetails, isAccountDetailsLoading, isAccountDetailsError, notFound, refetchAccountDetails} = useAccountDetails(accountName);
  const [liveDataAuth, setLiveDataAuth] = useState(false);
  const {accountAuthoritiesData, accountAuthoritiesDataLoading, accountAuthoritiesDataError, refetchAccountAuthorities} = useAccountAuthorities(accountName);
  const [liveDataRc, setLiveDataRc] =  useState(false);
  const {rcDelegationsData, isRcDelegationsLoading, isRcDelegationsError, refetchRcDelegations} = useRcDelegations(accountName, 1000);
  const [liveDataVesting, setLiveDataVesting] = useState(false);
  const {vestingDelegationsData, isVestingDelegationsLoading, isVestingDelegationsError, refetchVestingDelegations} = useVestingDelegations(accountName, null, 1000);
  const [liveDataWitnessVoters, setLiveDataWitnessVoters] = useState(false);
  const {witnessVoters, isWitnessVotersLoading, isWitnessVotersError, refetchWitnessVoters,} = useWitnessVoters(accountName, false, true, "vests");
  const [liveDataWitnessVotesHistory, setLiveDataWitnessVotesHistory] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(
    moment().subtract(7, "days").toDate()
  );
  const [toDate, setToDate] = useState<Date>(moment().toDate());
  const {votesHistory, isVotesHistoryLoading, isVotesHistoryError, refetchVotesHistory} = useWitnessVotesHistory(accountName, false, fromDate, toDate);
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
  
    if (liveDataManabars) {
      intervals.push(setInterval(() => {
        refetchManabars();
      }, 20000)); 
    }
    
    if (liveDataDetails) {
      intervals.push(setInterval(() => {
        refetchAccountDetails();
      }, 20000)); 
    }
    
    if (liveDataOperations) {
      intervals.push(setInterval(() => {
        refetchAccountOperations();
      }, 20000)); 
    }
    
    if (liveDataAuth) {
      intervals.push(setInterval(() => {
        refetchAccountAuthorities();
      }, 20000));
    }
    
    if (liveDataRc) {
      intervals.push(setInterval(() => {
        refetchRcDelegations();
      }, 20000));
    }
    
    if (liveDataVesting) {
      intervals.push(setInterval(() => {
        refetchVestingDelegations();
      }, 20000)); 
    }
    
    if (liveDataWitnessVoters) {
      intervals.push(setInterval(() => {
        refetchWitnessVoters();
      }, 20000)); 
    }
    
    if (liveDataWitnessVotesHistory) {
      intervals.push(setInterval(() => {
        refetchVotesHistory();
      }, 20000)); 
    }
  
    return () => {
      intervals.forEach(clearInterval);
    };
  }, [
    liveDataManabars, refetchManabars,
    liveDataDetails, refetchAccountDetails,
    liveDataOperations, refetchAccountOperations,
    liveDataAuth, refetchAccountAuthorities,
    liveDataRc, refetchRcDelegations,
    liveDataVesting, refetchVestingDelegations,
    liveDataWitnessVoters, refetchWitnessVoters,
    liveDataWitnessVotesHistory, refetchVotesHistory
  ]);
  
  return (
    <Card data-testid="account-live-data" className="col-span-4 md:col-span-1">
      <CardHeader>
        <Toggle
          checked={[
            liveDataManabars, 
            liveDataDetails, 
            liveDataOperations, 
            liveDataAuth,
            liveDataRc,
            liveDataVesting,
            liveDataWitnessVoters,
            liveDataWitnessVotesHistory
        ]}
          onClick={[
            () => setLiveDataManabars(!liveDataManabars),
            () => setLiveDataDetails(!liveDataDetails),
            () => setLiveDataOperations(!liveDataOperations),
            () => setLiveDataAuth(!liveDataAuth),
            () => setLiveDataRc(!liveDataRc),
            () => setLiveDataVesting(!liveDataVesting),
            () => setLiveDataWitnessVoters(!liveDataWitnessVoters),
            () => setLiveDataWitnessVotesHistory(!liveDataWitnessVotesHistory)
        ]}
          className="text-base"
          leftLabel="Live data"
        />
      </CardHeader>
    </Card>
  );
};

export default AccountLiveData;