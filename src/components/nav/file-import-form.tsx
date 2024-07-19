"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select"

// uncomment for canary version and replace useFormState with useActionState
//import { useActionState } from "react";
import { useState } from "react";
import { useFormStatus, useFormState } from 'react-dom'
import { useRouter } from 'next/navigation';
import { importTransaction } from "@/actions/transaction-action";

/*
const initialState = {
  message: "",
};
*/

const FileImportForm = (props) => {
    //const [state, formAction] = useActionState(importTransaction, initialState);
    const [state, formActionImport] = useFormState(importTransaction, null)
    const { pending } = useFormStatus();
    const [extensionAccepted, setExtensionAccepted] = useState(".ofx, .csv, .xls");
    const router = useRouter();

    const fileList = props.config;
    const SelectItemListComponent = () => {
      let selectItems = [];
      for (const filetype in fileList) {
          const bankName = fileList[filetype].display ? fileList[filetype].display : fileList[filetype].bank;
          selectItems.push(
              <SelectItem key={filetype} value={filetype} >
                {bankName} - {fileList[filetype].file}
              </SelectItem>);
      }
      return selectItems;
    }

    const fileTypeChanged = (itemSelected: string) => {
      const fileTypeSelected = fileList[itemSelected]
      setExtensionAccepted(`.${fileTypeSelected.file}`);
    }

    const formActionClient = (event) => {
        let formData = new FormData();
        formData.append('txBank', 'txId');
        formData.append('txFile', 'txFile');
        formActionImport(formData)
        router.push('/banking');
    }

  return (
    <form action={formActionImport} id="import">
       <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="txBank" className="text-right">
              Bank
            </Label>
            <Select name="txBank" onValueChange={fileTypeChanged}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Select transaction file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>File type</SelectLabel>
                  <SelectItemListComponent />
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="txFile" className="text-right">
              File
            </Label>
            <Input id="txFile" name="txFile" type="file" className="col-span-3"
                   accept={extensionAccepted}
                   required />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" aria-disabled={pending}>
              Import File
            </Button>
          </DialogClose>
        </DialogFooter>
    </form>
  )
};

export default FileImportForm;