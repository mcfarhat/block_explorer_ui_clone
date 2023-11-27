import Explorer from "@/types/Explorer"
import Hive from "@/types/Hive";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Dialog } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import OperationTypesDialog from "@/components/OperationTypesDialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { Select, SelectContent, SelectTrigger, SelectItem } from "../ui/select";
import { Loader2, X } from "lucide-react";
import SingleOperationTypeDialog from "../SingleOperationTypeDialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";


interface BlockSearchSectionProps {
  getBlockDataForSearch: (blockSearchProps?: Explorer.BlockSearchProps, commentSearchProps?: Explorer.CommentSearchProps) => void;
  getOperationKeys: (operationId: number | null) => void;
  setSelectedKeys: (index: number| null) => void;
  operationsTypes: Hive.OperationPattern[];
  foundBlocksIds: number[] | null;
  currentOperationKeys: string[][] | null;
  operationKeysChain?: string[];
  loading: boolean;
}


const BlockSearchSection: React.FC<BlockSearchSectionProps> = ({
  getBlockDataForSearch, 
  getOperationKeys, 
  setSelectedKeys,
  operationsTypes, 
  foundBlocksIds, 
  currentOperationKeys, 
  operationKeysChain,
  loading,
}) => {

  const [accountName, setAccountName] = useState<string | undefined>(undefined);
  const [fromBlock, setFromBlock] = useState<number | undefined>(undefined);
  const [toBlock, setToBlock] = useState<number | undefined>(undefined);
  const [selectedOperationTypes, setSelectedOperationTypes] = useState<number[]>([]);
  const [fieldContent, setFieldContent] = useState<string | undefined>(undefined);
  const [permlink, setPermlink] = useState<string | undefined>(undefined);
  const [accordionValue, setAccordionValue] = useState<string>("");

  const startSearch = () => {
    if (accordionValue === "comment" && accountName) {
      const commentSearchProps: Explorer.CommentSearchProps = {
        accountName,
        permlink,
        fromBlock,
        toBlock
      };
      getBlockDataForSearch(undefined, commentSearchProps);
    } else {
      const blockSearchProps: Explorer.BlockSearchProps = {
        accountName,
        operations: selectedOperationTypes.length ? selectedOperationTypes : [],
        fromBlock,
        toBlock,
        limit: 100,
        deepProps: {
          keys: operationKeysChain,
          content: fieldContent
        }
      }
      getBlockDataForSearch(blockSearchProps);
    }
  }

  const changeSelectedOperationTypes = (operationTypesIds: number[]) => {
    if (operationTypesIds.length === 1) {
      getOperationKeys(operationTypesIds[0]);
    } else {
      setFieldContent(undefined);
      getOperationKeys(null);
    }
    setSelectedOperationTypes(operationTypesIds);
  }

  const onSelect = (newValue: string) => {
    setSelectedKeys(Number(newValue));
  }

  const getOperationButtonTitle = (): string => {
    if (selectedOperationTypes && selectedOperationTypes.length === 1) return operationsTypes[selectedOperationTypes[0]].operation_name
    if (selectedOperationTypes && selectedOperationTypes.length > 1) return `${selectedOperationTypes.length} operations`
    return "Operations"
  } 

  const setNumericValue = (value: number, fieldSetter: Function) => {
    if (value === 0) {
      fieldSetter(undefined);
    } else {
      fieldSetter(value);
    }
  }

  return(
    <div className='mt-6 col-start-1 col-span-4 md:col-span-1 mb-6 md:mb-0'>
      <div className=' bg-explorer-dark-gray p-2 rounded-["6px] h-fit rounded'>
      <div className="text-center text-xl">Block Search</div>
        <div className="flex items-center m-2">
          <OperationTypesDialog 
            operationTypes={operationsTypes} 
            selectedOperations={selectedOperationTypes} 
            setSelectedOperations={changeSelectedOperationTypes} 
            colorClass="bg-gray-500"
            triggerTitle={getOperationButtonTitle()} 
          />   
        </div>
        <div className="flex flex-col m-2">
          <label className="mx-2">Account name</label>      
          <Input
            className="w-1/2"
            type="text"
            value={accountName || ""}
            onChange={(e) => setAccountName(e.target.value === "" ? undefined : e.target.value)}
            placeholder="---"
          />
        </div>
        <div className="flex items-center  m-2">
          <div className="flex flex-col w-full">
            <label className="mx-2">From block</label>
            <Input
              type="number"
              value={fromBlock || ""}
              onChange={(e) => setNumericValue(Number(e.target.value), setFromBlock)}
              placeholder="1"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="mx-2">To block</label>
            <Input
              type="number"
              value={toBlock || ""}
              onChange={(e) => setNumericValue(Number(e.target.value), setToBlock)}
              placeholder={"Headblock"}
            />
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full" value={accordionValue} onValueChange={setAccordionValue}>
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced search</AccordionTrigger>
            <AccordionContent>
            <div className="flex flex-col  m-2">
              <label className="mx-2">Key</label>
              <div className="flex">

              <Select onValueChange={onSelect}>
                <SelectTrigger className="justify-normal" disabled={!selectedOperationTypes || selectedOperationTypes.length !== 1}>
                  {(operationKeysChain && !!operationKeysChain.length) ? operationKeysChain.map((key, index) => ( key !== "value" &&
                  <div key={key} className={"mx-1"}>{index !== 1 && "/"} {key}</div>
                  )) : (
                    <div className="text-blocked">{!selectedOperationTypes || selectedOperationTypes.length !== 1 ? "Select exactly 1 operation to use key-value search" : "Pick a property"} </div>
                  )}
                </SelectTrigger>
                <SelectContent className="bg-white text-black rounded-[2px] max-h-[31rem] overflow-y-scroll">
                  {currentOperationKeys?.map((keys, index) => (
                    <SelectItem className="m-1 text-center" key={index} value={index.toFixed(0)} defaultChecked={false} >
                      <div className="flex gap-x-2">
                        {keys.map((key, index) => ( key !== "value" && 
                          <div key={key}>{index !== 1 && "/"} {key} </div>
                        ))}
                      </div>
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {operationKeysChain && !!operationKeysChain.length &&
              
                <Button onClick={() => {setSelectedKeys(null)}}>Clear</Button>
              }
            </div>
          </div>
          <div className="flex m-2 flex-col">
            <label className="mx-2">Value</label>
            <Input
              className="w-1/2"
              type="text"
              value={fieldContent || ""}
              onChange={(e) => setFieldContent(e.target.value)}
              placeholder="---"
              disabled={!selectedOperationTypes || selectedOperationTypes.length !== 1}
            />     
          </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="comment">
              <AccordionTrigger>Comment search</AccordionTrigger>
              <AccordionContent>
                <div className="flex m-2 flex-col">
                  <label className="mx-2">Permlink</label>
                  <Input
                    className="w-full"
                    type="text"
                    value={permlink}
                    onChange={(e) => setPermlink(e.target.value)}
                    placeholder="---"
                  />     
                </div>
              </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex items-center  m-2">
          <Button className=" bg-blue-800 hover:bg-blue-600 rounded-[4px]" onClick={startSearch} disabled={!selectedOperationTypes.length}>
            <span>Search</span> {loading && <Loader2 className="animate-spin mt-1 h-4 w-4 ml-3 ..." />}
          </Button>
          {!selectedOperationTypes.length && <label className="ml-2 text-muted-foreground">Pick operation type</label>}
        </div>
      </div>
      {foundBlocksIds && (
        <div className=' bg-explorer-dark-gray p-2 rounded-["6px] md:mx-2 h-fit rounded mt-4'>
          <div className="text-center">Results:</div>
          <div className="flex flex-wrap">
            {foundBlocksIds.length > 0 ? foundBlocksIds.map((blockId) => (
              <Link key={blockId} href={`block/${blockId}`}>

                <div className="m-1 border border-solid p-1" >{blockId}</div>
              </Link>
            )) : (
              <div className="flex justify-center w-full my-2">No blocks matching given criteria</div>
            )}
          </div>
          
        </div>
      )}
    </div>
  )        
}

export default BlockSearchSection