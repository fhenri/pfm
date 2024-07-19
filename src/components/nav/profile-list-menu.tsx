"use client";

import { GearIcon } from "@radix-ui/react-icons"
import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

import { useFormStatus, useFormState } from 'react-dom'
import { setUserProfileForm } from "@/actions/user-action";
import { IProfile } from "@/types/tenancy";

const MenuProfileList = (
  {profileList, profileSelected, onSelectItem} :
  {profileList: IProfile[], profileSelected: string, onSelectItem: (event: Event) => void}) => {

  const [state, userAction] = useFormState(setUserProfileForm, null)

  return (
    <>
    <DropdownMenuItem onSelect={onSelectItem}>
        <GearIcon className="mr-2 h-4 w-4" />
        <span>Profile Settings</span>
    </DropdownMenuItem>
    <DropdownMenuRadioGroup value={profileSelected} onValueChange={userAction}>
      { profileList && profileList.map((profile, index) => (
          <DropdownMenuRadioItem key={index} value={profile.name}>
              <span className="text-xs">{profile.name}</span>
          </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
    </>
  )
}

export default MenuProfileList;