"use client";

import { Settings, LogOut } from "lucide-react"
import {
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

import { useFormStatus, useFormState } from 'react-dom'
import { setUserProfileForm } from "@/actions/usAction";

const MenuProfileList = ({profileList, profileSelected, onSelectItem}) => {
    const [state, userAction] = useFormState(setUserProfileForm, null)

  return (
    <>
    <DropdownMenuItem onSelect={onSelectItem}>
        <Settings className="mr-2 h-4 w-4" />
        <span>Profile Settings</span>
    </DropdownMenuItem>
    <DropdownMenuRadioGroup value={profileSelected} onValueChange={userAction}>
      { profileList.map((profile, index) => (
          <DropdownMenuRadioItem key={index} value={profile.name}>
              <span className="text-xs">{profile.name}</span>
          </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
    </>
  )
}

export default MenuProfileList;