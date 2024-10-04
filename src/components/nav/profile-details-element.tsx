"use client";

import { PlusCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  TabsContent
} from "@/components/ui/tabs"

import { useFormStatus, useFormState } from 'react-dom'
import * as userAction from "@/actions/user-action";
import { IProfile } from "@/types/tenancy";

const initialState = {
  message: '',
}

const ProfileAccountElement = (
  {profileName, account} :
  {profileName: string, account: string}) => {
    const [remAccountstate, formActionRemAccountProfile] =
        useFormState(userAction.removeAccountToProfile, initialState)

    const removeAccountProfileClient = (event) => {
      event.preventDefault();
      let formData = new FormData();
      formData.append('profileName', profileName);
      formData.append('accountId', account);
      formActionRemAccountProfile(formData);
    }

    return (
        <>
        <div className="flex w-full max-w-sm items-center text-sm">
          <CrossCircledIcon className="w-3 mr-2 text-red-800 cursor-pointer" onClick={removeAccountProfileClient}/>
          {account}
        </div>
        </>
    )
}

const ProfileDetailsElement = ({profile}:{profile: IProfile}) => {

    const [deleteProfilestate, formActionDelProfile] = useFormState(userAction.deleteProfile, initialState)
    const [addAccountstate, formActionAddAccountProfile] = useFormState(userAction.addAccountToProfile, initialState)

    const deleteProfileClient = (event) => {
      event.preventDefault();
      /*
      const rawFormData = {
        profileName: profile.name,
      }
      */
      let formData = new FormData();
      formData.append('profileName', profile.name);
      formActionDelProfile(formData);
    }

    return (
        <TabsContent value={profile.name}>
          <span className="text-sm text-muted-foreground">
            Accounts available:
          </span>
            { profile.accountList.map((account, index) => (
                <ProfileAccountElement key={index} profileName={profile.name} account={account}/>
            ))}
            <form action={formActionAddAccountProfile}>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
              <input type="hidden" name="profileName" value={profile.name} />
              <Input id="accountId" name="accountId" type="text" placeholder="Enter account number" required/>
              <Button variant="ghost" className="pl-0" type="submit"><PlusCircledIcon /></Button>
            </div>
            </form>
          <div className="flex flex-row justify-between">
            <Button className="mt-4" onClick={deleteProfileClient}>
              Delete Profile
            </Button>
            <DialogClose asChild>
              <Button className="mt-4" variant="secondary">
                Done
              </Button>
            </DialogClose>

          </div>
        </TabsContent>
    )
}

export default ProfileDetailsElement;
