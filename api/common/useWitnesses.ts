import { useQuery } from "@tanstack/react-query";
import fetchingService from "@/services/FetchingService";

const useWitnesses = (witnessesLimit: number) => {
  const {
    data: witnessesData,
    isLoading: isWitnessDataLoading,
    isError: isWitnessDataError,
  } = useQuery({
    queryKey: ["witnesses", witnessesLimit],
    queryFn: () => fetchingService.getWitnesses(witnessesLimit, 0, "votes", "desc"),
    refetchOnWindowFocus: false,
  });
  const {
    data: activeWitnessesData,
    isLoading: isActiveWitnessDataLoading,
    isError: isActiveWitnessDataError,
  } = useQuery({
    queryKey: ["activeWitnesses"],
    queryFn: async () => {
      const witnesses = await fetchingService.getWitnessesByVote();
      return witnesses.filter((witness: any) => witness.isActive);
    },
    refetchOnWindowFocus: false,
  });
  const isLoading = isWitnessDataLoading || isActiveWitnessDataLoading;
  const isError = isWitnessDataError || isActiveWitnessDataError;

  return {
    witnessesData,
    activeWitnessesData,
    isLoading,
    isError,
  };
};
export default useWitnesses;
