"use client";

import { useFormStatus, useFormState } from 'react-dom'

import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import ProfileDetailsElement from "./ProfileDetailsElement"

import { addProfile } from "@/actions/usAction";

const ProfileSettingsDialog = ({isOpen, callback, profileList}) => {

  const [state, formActionAddProfile] = useFormState(addProfile, null)

  const addProfileClient = (event) => {
      event.preventDefault();
      const profileName = event.target.profileName.value;
      let formData = new FormData();
      formData.append('profileName', profileName);
      formActionAddProfile(formData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={isOpen  && callback}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Profile Settings Definition</DialogTitle>
          <DialogDescription>
            Manage profile and bank account.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-[500px]">
          <TabsList className="">
            { profileList && profileList.map((profile, index) => (
            <TabsTrigger className="w-16" key={index} value={profile.name}>{profile.name}</TabsTrigger>
            ))}
            <TabsTrigger value="new">
                <CirclePlus className="w-4"/><span className="ml-2">Add</span>
            </TabsTrigger>
          </TabsList>
          { profileList && profileList.map((profile, index) => (
            <ProfileDetailsElement key={index} profile={profile}/>
          ))}
          <TabsContent value="new">
            <form onSubmit={addProfileClient}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="profileName">Name</Label>
              <Input id="profileName" type="text" required/>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button className="mt-4" type="submit">Add Profile</Button>
            </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileSettingsDialog;