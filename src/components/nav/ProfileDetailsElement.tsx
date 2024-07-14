"use client";

import { CirclePlus, CircleX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TabsContent
} from "@/components/ui/tabs"

import { useFormStatus, useFormState } from 'react-dom'
import * as userAction from "@/actions/usAction";

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
          <CircleX className="w-4 mr-2" onClick={removeAccountProfileClient}/>
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
      formData.append('accountId', accountId.value);
      formActionAddAccountProfile(formData);
    }

    return (
        <TabsContent value={profile.name}>
          Accounts available:
          <ul>
            { profile.accountList.map((account, index) => (
                <ProfileAccountElement key={index} profileName={profile.name} account={account}/>
            ))}
            <form onSubmit={addAccountProfileClient}>
            <div className="flex w-full max-w-sm items-center space-x-1 mt-4">
              <Input id="accountId" type="text" placeholder="Enter account number" required/>
              <Button variant="ghost" className="pl-0" type="submit"><CirclePlus /></Button>
            </div>
            </form>
          </ul>
          <Button className="mt-4" variant="secondary" onClick={deleteProfileClient}>Delete Profile</Button>
        </TabsContent>
    )
}

export default ProfileDetailsElement;
