import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import BlockPageNavigation from "@/components/block/BlockPageNavigation";
import DetailedOperationCard from "@/components/DetailedOperationCard";
import PageNotFound from "@/components/PageNotFound";
import { useUserSettingsContext } from "@/components/contexts/UserSettingsContext";
import JSONView from "@/components/JSONView";
import useBlockData from "@/api/blockPage/useBlockData";
import useBlockOperations from "@/api/common/useBlockOperations";
import useOperationsTypes from "@/api/common/useOperationsTypes";
import BlockDetails from "@/components/block/BlockDetails";
import Hive from "@/types/Hive";
import ScrollTopButton from "@/components/ScrollTopButton";
import CustomPagination from "@/components/CustomPagination";
import { useURLParams } from "@/utils/Hooks";

interface BlockSearchParams {
  blockId?: number;
  page: number;
  filters?: number[];
}

const defaultParams: BlockSearchParams = {
  page: 1,
  filters: undefined,
};

export default function Block() {
  const router = useRouter();

  const { blockId } = router.query;

  const [blockDate, setBlockDate] = useState<Date>();
  const { paramsState, setParams } = useURLParams({
    ...defaultParams,
    blockId: blockId,
  });

  const { settings } = useUserSettingsContext();

  const { blockDetails, loading } = useBlockData(Number(blockId));

  const { blockOperations: totalOperations, trxLoading: totalLoading } =
    useBlockOperations(Number(blockId), undefined, paramsState.page || 1);

  const { blockError, blockOperations, trxLoading } = useBlockOperations(
    Number(blockId),
    paramsState.filters,
    paramsState.page || 1
  );

  const { operationsTypes } = useOperationsTypes();

  useEffect(() => {
    if (blockDetails && blockDetails.created_at) {
      setBlockDate(new Date(blockDetails.created_at + "Z"));
    }
  }, [blockDetails]);

  const getSplitOperations = useCallback(
    (operations?: Hive.TotalOperationsResponse) => {
      if (operations && operations.operations_result) {
        return {
          virtualOperations: operations.operations_result?.filter(
            (operation) => operation.virtual_op
          ),
          nonVirtualOperations: operations.operations_result?.filter(
            (operation) => !operation.virtual_op
          ),
        };
      } else return { virtualOperations: [], nonVirtualOperations: [] };
    },
    []
  );

  const {
    virtualOperations: totalVirtualOperations,
    nonVirtualOperations: totalNonVirtualOperations,
  } = getSplitOperations(totalOperations);

  const handleGoToBlock = (blockNumber: string) => {
    router.push({
      pathname: "[blockId]",
      query: { ...router.query, blockId: blockNumber },
    });
  };

  const handleFilterChange = (filters: number[]) => {
    setParams({ ...paramsState, page: 1, filters: filters });
  };

  if ((trxLoading === false && !blockOperations) || blockError) {
    return (
      <PageNotFound
        message={
          blockError
            ? `Error code: ${blockError}`
            : `Block ${blockId} couldn't be found.`
        }
      />
    );
  }

  return !blockDate ? (
    <div>Loading ...</div>
  ) : (
    <div
      className="w-full h-full"
      style={{ scrollMargin: "100px" }}
      id="block-page-top"
    >
      <BlockPageNavigation
        blockNumber={Number(blockId)}
        goToBlock={handleGoToBlock}
        timeStamp={blockDate}
        setFilters={handleFilterChange}
        operationTypes={operationsTypes || []}
        selectedOperationIds={paramsState.filters || []}
      />
      <BlockDetails
        operations={totalOperations?.operations_result}
        virtualOperationLength={totalVirtualOperations?.length}
        nonVirtualOperationLength={totalNonVirtualOperations?.length}
        blockDetails={blockDetails}
      />
      <div className="fixed top-[calc(100vh-90px)] md:top-[calc(100vh-100px)] w-full flex flex-col items-end px-3 md:px-12">
        <ScrollTopButton />
      </div>
      {loading !== false || trxLoading || totalLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin mt-1 h-16 w-16 ml-3 ... " />
        </div>
      ) : settings.rawJsonView ? (
        <JSONView
          json={{
            details: { ...blockDetails },
            operations: { ...blockOperations },
          }}
          className="w-full md:w-[962px] mt-6 m-auto py-2 px-4 bg-explorer-dark-gray rounded text-white text-xs break-words break-all"
        />
      ) : (
        <section className="md:px-10 flex flex-col items-center justify-center text-white" data-testid="block-page-operation-list">
          {totalOperations?.total_operations &&
            totalOperations?.total_operations > 1000 && (
              <CustomPagination
                currentPage={paramsState.page}
                onPageChange={(newPage: number) =>
                  setParams({ ...paramsState, page: newPage })
                }
                pageSize={1000}
                totalCount={blockOperations?.total_operations || 0}
                className="text-black"
              />
            )}
          <div className="w-full px-4 md:p-0 md:w-4/5 flex flex-col">
            {blockOperations?.operations_result?.map((operation, index) => {
              return (
                <DetailedOperationCard
                  isVirtualOperation={operation.virtual_op}
                  operation={operation.operation}
                  operationId={operation.operation_id}
                  date={new Date(operation.timestamp)}
                  blockNumber={operation.block_num}
                  transactionId={operation.trx_id}
                  key={operation.timestamp + index}
                  skipBlock
                  skipDate
                  isShortened={operation.is_modified}
                />
              );
            })}
            <div
              className="text-center mt-4"
              style={{ scrollMargin: "100px" }}
            >
              <p className="text-3xl text-black">
                {!!blockOperations &&
                  !blockOperations?.operations_result?.length &&
                  "No operations were found"}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
