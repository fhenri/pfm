"use client";

import { PlusCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TabsContent
} from "@/components/ui/tabs"

import { useFormStatus, useFormState } from 'react-dom'
import * as userAction from "@/actions/user-action";

const ProfileAccountElement = ({profileName, account}) => {
    const [remAccountstate, formActionRemAccountProfile] =
        useFormState(userAction.removeAccountToProfile, null)

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

const ProfileDetailsElement = ({profile}) => {

    const [deleteProfilestate, formActionDelProfile] = useFormState(userAction.deleteProfile, null)
    const [addAccountstate, formActionAddAccountProfile] = useFormState(userAction.addAccountToProfile, null)

    const deleteProfileClient = (event) => {
      event.preventDefault();
      let formData = new FormData();
      formData.append('profileName', profile.name);
      formActionDelProfile(formData);
    }

    const addAccountProfileClient = (event) => {
      event.preventDefault();
      let formData = new FormData();
      formData.append('profileName', profile.name);
      formData.append('accountId', event.target.accountId.value);
      formActionAddAccountProfile(formData);
    }

    return (
        <TabsContent value={profile.name}>
          <span className="text-sm text-muted-foreground">
            Accounts available:
          </span>
            { profile.accountList.map((account, index) => (
                <ProfileAccountElement key={index} profileName={profile.name} account={account}/>
            ))}
            <form onSubmit={addAccountProfileClient}>
            <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
              <Input id="accountId" type="text" placeholder="Enter account number" required/>
              <Button variant="ghost" className="pl-0" type="submit"><PlusCircledIcon /></Button>
            </div>
            </form>
          <Button className="mt-4" variant="secondary" onClick={deleteProfileClient}>Delete Profile</Button>
        </TabsContent>
    )
}

export default ProfileDetailsElement;
