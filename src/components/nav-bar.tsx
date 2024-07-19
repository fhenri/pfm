import React from 'react';
import Image from "next/image";
import { getSession } from '@auth0/nextjs-auth0';
import { getUserAvailableProfile, getCurrentUserProfile } from "@/services/user-service";

import { Button } from "@/components/ui/button"
import LoggedInUserMenu from '@/components/nav/logged-in-user-menu';

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
              <span className="self-center whitespace-nowrap tracking-widest uppercase text-xl font-semibold dark:text-white">
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

/*
const NavBar = () => {
  return (<nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
      <Image src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" width="40" height="20"/>
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
  </a>
  <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get started</button>
      <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
    </button>
  </div>
  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
      </li>
      <li>
        <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
      <li>
        <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
      </li>
      <li>
        <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div>
  </div>
</nav>
  )
}
*/
export default NavBar;

