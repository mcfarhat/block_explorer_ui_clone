import { useQuery, UseQueryResult } from "@tanstack/react-query";
import fetchingService from "@/services/FetchingService";
import Hive from "@/types/Hive";
import { config } from "@/Config";

const useVestingDelegations = (
  delegatorAccount: string,
  liveDataEnabled: boolean
) => {
  const {
    data: vestingDelegationsData,
    isLoading: isVestingDelegationsLoading,
    isError: isVestingDelegationsError,
  }: UseQueryResult<Hive.VestingDelegations[]> = useQuery({
    queryKey: ["vestingDelegations", delegatorAccount],
    queryFn: () =>
      fetchingService.getVestingDelegations(
        delegatorAccount
      ),
    refetchInterval: liveDataEnabled ? config.accountRefreshInterval : false,
    enabled: !!delegatorAccount,
    select: (data) => {
    const sortedData = data.sort(
        (a: Hive.VestingDelegations, b: Hive.VestingDelegations) =>
          a.delegatee.toLowerCase().localeCompare(b.delegatee.toLowerCase())
      );
      return sortedData;
    },
    
    refetchOnWindowFocus: false,
  });

  return {
    vestingDelegationsData,
    isVestingDelegationsLoading,
    isVestingDelegationsError,
  };
};

export default useVestingDelegations;
