import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useMediaQuery } from "@/utils/Hooks";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSettingsContext } from "../contexts/UserSettingsContext";
import SyncInfo from "./home/SyncInfo";
import ViewPopover from "./ViewPopover";

export default function Navbar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings, setSettings } = useUserSettingsContext();
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  return (
    <div
      className="fixed w-full top-0 left-0 z-50"
      data-testid="navbar"
    >
      <div className="flex p-2 justify-between bg-explorer-dark-gray text-white	items-center relative">
        {isMobile ? (
          <div className="flex items-center justify-between w-full">
            <Link
              href={"/"}
              className="relative pr-2"
            >
              <Image
                src="/hive-logo.png"
                alt="Hive logo"
                width={40}
                height={40}
              />
            </Link>
            {!searchBarOpen && <SyncInfo />}
            <div className="flex-grow flex items-center justify-end gap-x-3">
              <SearchBar
                open={searchBarOpen}
                onChange={setSearchBarOpen}
              />
              <Menu
                height={34}
                width={34}
                onClick={() => setMenuOpen(true)}
                className="flex-shrink-0 cursor-pointer"
              />
            </div>
            <div
              className={cn(
                "fixed top-0 right-0 p-5 bg-explorer-dark-gray w-full h-full translate-x-full duration-500 z-50",
                { "translate-x-0": menuOpen }
              )}
            >
              <div className="w-full flex items-center justify-end">
                <X
                  onClick={() => setMenuOpen(false)}
                  height={40}
                  width={40}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col text-2xl gap-y-2">
                <Link
                  href={"/witnesses"}
                  onClick={() => setMenuOpen(false)}
                >
                  Witnesses
                </Link>
                <div>
                  <ViewPopover isMobile={isMobile} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center pl-12 gap-x-4">
              <Link
                href={"/"}
                className="pr-2 flex justify-normal items-center text-explorer-turquoise font-medium"
              >
                <Image
                  src="/hive-logo.png"
                  alt="Hive logo"
                  width={50}
                  height={50}
                  data-testid="hive-logo"
                />
                <div
                  className="ml-4"
                  data-testid="hive-block-explorer"
                >
                  Hive Block Explorer
                </div>
              </Link>
              <ViewPopover />
              <SyncInfo />
              <Link
                href={"/witnesses"}
                data-testid="navbar-witnesses-link "
              >
                Witnesses
              </Link>
            </div>
            <SearchBar open={true} />
          </>
        )}
      </div>
    </div>
  );
}
