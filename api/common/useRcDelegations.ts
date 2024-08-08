import { useQuery } from "@tanstack/react-query";
import fetchingService from "@/services/FetchingService";

const useRcDelegations = (delegatorAccount: string, limit: number, refetchInterval?: number|false) => {
  const {
    data: rcDelegationsData,
    isLoading: isRcDelegationsLoading,
    isError: isRcDelegationsError,
  } = useQuery({
    queryKey: ["RcDelegations", delegatorAccount, limit],
    queryFn: () => fetchingService.getRcDelegations(delegatorAccount, limit),
    refetchInterval,
    refetchOnWindowFocus: false,
  });

  return { rcDelegationsData, isRcDelegationsLoading, isRcDelegationsError};
};


export default useRcDelegations;
