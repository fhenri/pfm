"use client";

import { useState } from "react"
import Link from "next/link";

import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserAuth0 {
    name: string;
    nickname: string;
    picture: string;
}

import FileImportDialog from "@/components/nav/FileImportDialog"
import FileImportForm from "@/components/nav/FileImportForm"
import ProfileSettingsDialog from "@/components/nav/ProfileSettingsDialog"
import MenuProfileList from "@/components/nav/MenuProfileList"

import bankFileConfig from '@/config/parser.config.json';

const LoggedInUserMenu = ({ user, serializedList, profileSelected }) => {
//:{ user: Any, profileList:Any, profileSelected: string } => {

    /*
    // used to display active link but required use client code
    const pathname = usePathname();

    function isActive (linkPathName: string) {
        return pathname === linkPathName;
    }
    aria-current="page"
    */
    //const [user, profileSelected] = [props.user, props.profileSelected];
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const profileList = JSON.parse(serializedList);

    return (
    <>
      <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        <FileImportDialog config={bankFileConfig}/>
        <ProfileSettingsDialog
                isOpen={isProfileDialogOpen}
                callback={setIsProfileDialogOpen}
                profileList={profileList}/>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user?.picture} />
                <AvatarFallback>PFM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.nickname}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.name}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <MenuProfileList
                    profileList={profileList}
                    profileSelected={profileSelected}
                    onSelectItem={() => setIsProfileDialogOpen(true)}/>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                {/* we need to use a on server as Link will fetch and return error */}
                <a href="/api/auth/logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-user" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
      </div>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <Link href="/dashboard" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 uppercase">Dashboard</Link>
          </li>
          <li>
            <Link href="/analysis" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 uppercase">Analysis</Link>
          </li>
          <li>
            <Link href="/banking" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 uppercase">Banking</Link>
          </li>
          <li>
            <Link href="/budget" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 uppercase">Budget</Link>
          </li>
        </ul>
      </div>
    </>
    )
}

export default LoggedInUserMenu;