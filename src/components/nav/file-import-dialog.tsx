"use client";

//import { FilePlusIcon, UploadIcon } from "@radix-ui/react-icons"
import { FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FileImportForm from "./file-import-form";

import React from 'react';

type FileImportDialogProps = {
};

const FileImportDialog: React.FC<FileImportDialogProps> = (props) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mx-4">
            <FileUp className="mr-2 h-4 w-4" />Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import a Bank Transaction File</DialogTitle>
          <DialogDescription>
            Select a file and import to load transactions.
          </DialogDescription>
        </DialogHeader>
        <FileImportForm {...props} />
      </DialogContent>
    </Dialog>
  )
}

export default FileImportDialog;