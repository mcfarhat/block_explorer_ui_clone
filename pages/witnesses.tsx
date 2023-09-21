import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import fetchingService from "@/services/FetchingService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import VotersDialog from "@/components/Witnesses/VotersDialog";
import Hive from "@/types/Hive";
import React, { useRef, useState } from "react";
import { MenuSquareIcon } from "lucide-react";

export default function Witnesses() {
  const [voters, setVoters] = useState<Hive.Voter[] | null>(null);
  const [voterAccount, setVoterAccount] = useState<string>("");
  const [isVotersOpen, setIsVotersOpen] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState<string>("vests");
  const [isAsc, setIsAsc] = useState<boolean>(false);
  const [voterLoading, setVoterLoading] = useState<boolean>(false);
  const votersRef = useRef<Hive.Voter[] | null>();
  const sortKeyRef = useRef<string>();
  const isAscRef = useRef<boolean>();

  votersRef.current = voters;
  sortKeyRef.current = sortKey;
  isAscRef.current = isAsc;

  const witnessesQuery = useQuery({
    queryKey: ["witnesses"],
    queryFn: () => fetchingService.getWitnesses(200, 0, "votes", "desc"),
    refetchOnWindowFocus: false,
  });

  const getVotersData = async (accountName: string) => {
    setVoterLoading(true);
    setVoterAccount(accountName);
    const direction = isAscRef.current ? "asc" : "desc";
    if (!votersRef.current) {
      const voters = await fetchingService.getWitnessVoters(accountName, sortKeyRef.current || sortKey, direction, 50);
      setVoters(voters);
    }
    const allVoters = await fetchingService.getWitnessVoters(accountName, sortKeyRef.current || sortKey, direction);
    setVoters(allVoters);
    setVoterLoading(false);
  }

  const changeVotersDialogue = (isOpen: boolean) => {
    setIsVotersOpen(isOpen);
    if (!isOpen) setVoters(null);
  }

  const changeSorter = async (newIsAsc: boolean, newSortKey: string) => {
    const isAscForChange = newSortKey === sortKey ? newIsAsc : false;
    await setSortKey(newSortKey);
    await setIsAsc(isAscForChange);
    getVotersData(voterAccount);
  }

  return (
    <div className="m-8 max-w-[100vw]">
      <VotersDialog 
        accountName={voterAccount} 
        isVotersOpen={isVotersOpen} 
        voters={voters} 
        sorterInfo={{isAsc, sortKey}}
        loading={voterLoading}
        changeVotersDialogue={changeVotersDialogue} 
        changeSorter={changeSorter}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-explorer-bg-start"></TableHead>
            <TableHead className="sticky left-6 bg-explorer-bg-start">Name</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Voters</TableHead>
            <TableHead>Block Size</TableHead>
            <TableHead>Price Feed</TableHead>
            <TableHead>Feed Age</TableHead>
            <TableHead>Signing Key</TableHead>
            <TableHead>Version</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {witnessesQuery.data?.map((singleWitness, index) => (
            <TableRow
              key={index}
              className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"}`}
            >
              <TableCell
                className={
                  `${index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"}` +
                  " sticky left-0"
                }
              >
                {index + 1}
              </TableCell>
              <TableCell
                className={
                  `${index % 2 === 0 ? "bg-gray-50" : "bg-gray-200"}` +
                  " text-blue-800 sticky left-6"
                }
              >
                {" "}
                <Link href={`/witness/${singleWitness.witness}`}>
                  {singleWitness.witness}
                </Link>
              </TableCell>
              <TableCell>{singleWitness.vests?.toLocaleString()}</TableCell>
              <TableCell onClick={() => {getVotersData(singleWitness.witness); setIsVotersOpen(true)}}><span  className="flex items-center cursor-pointer">{singleWitness.voters_num.toLocaleString()}<MenuSquareIcon className="w-4 ml-1" /></span></TableCell>
              <TableCell>
                {singleWitness.block_size
                  ? singleWitness.block_size.toLocaleString()
                  : "--"}
              </TableCell>
              <TableCell>
                {singleWitness.price_feed
                  ? singleWitness.price_feed.toLocaleString()
                  : "--"}
              </TableCell>
              <TableCell>
                {singleWitness.feed_age ? singleWitness.feed_age : "--"}
              </TableCell>
              <TableCell>
                {singleWitness.signing_key
                  ? `${singleWitness.signing_key.slice(0, 10)}...`
                  : "--"}
              </TableCell>
              <TableCell>{singleWitness.version}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
