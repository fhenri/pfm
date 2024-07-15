import React from 'react';
import Image from "next/image";
import { getSession } from '@auth0/nextjs-auth0';
import { getUserAvailableProfile, getCurrentUserProfile } from "@/services/userService";

import { Button } from "@/components/ui/button"
import LoggedInUserMenu from '@/components/nav/LoggedInUserMenu';
import ProfileListClient from '@/components/nav/ProfileListClient';

import mongoose from "mongoose";

interface UserAuth0 {
    name: string;
    nickname: string;
    picture: string;
}

const NavBarUser = async () => {
    const user = (await getSession())?.user;

    if (user) {
        const profileSelected = await getCurrentUserProfile(user);
        const profileList = await getUserAvailableProfile(user);
        return (
        <LoggedInUserMenu
            user={user}
            serializedList={JSON.stringify(profileList)}
            profileSelected={profileSelected}/>
        )
    } else {
        //return (<Button asChild variant="destructive" className="mx-4">
        return (<Button asChild className="mx-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <a href="/api/auth/login">Login</a>
                </Button>);
    }
}

const NavBar = () => {

    return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <a href="https://cloud06.io/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/favicon.png" width="40" height="20" className="mr-3 h-6 sm:h-9" alt="cloud06.io" />
          <div className="flex flex-col">
              <span className="self-center whitespace-nowrap tracking-wider uppercase text-xl font-semibold dark:text-white">
                Cloud06 - PFM
              </span>
              <span className="self-center whitespace-nowrap text-xs text-gray-400 uppercase dark:text-white">
                personal finance manager
              </span>
          </div>
        </a>
        <NavBarUser />
      </div>
    </nav>
    );
}
            
export default NavBar;

