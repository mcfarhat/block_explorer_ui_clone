import { useQuery } from "@tanstack/react-query";
import fetchingService from "@/services/FetchingService";
import { useEffect } from "react";

const useHeadBlockNumber = (liveUpdate?: boolean, refreshInterval = 3000) => {
  const {
    data: headBlockNumberData,
    isLoading: headBlockNumberDataLoading,
    isError: headBlockNumberDataError,
    refetch,
  } = useQuery({
    queryKey: ["headBlockNum"],
    queryFn: () => fetchingService.getHafbeLastSyncedBlock(),
    refetchOnWindowFocus: false,
    refetchInterval: liveUpdate ? refreshInterval : Infinity,
  });

  useEffect(() => {
    if (liveUpdate) {
      const interval = setInterval(() => {
        refetch();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [liveUpdate, refreshInterval, refetch]);

  const checkTemporaryHeadBlockNumber = async () => {
    return await fetchingService.getHeadBlockNum();
  };

  return {
    headBlockNumberData,
    headBlockNumberDataLoading,
    headBlockNumberDataError,
    checkTemporaryHeadBlockNumber,
    refetch,
  };
};

export default useHeadBlockNumber;
