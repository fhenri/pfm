"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useFormStatus, useFormState } from 'react-dom'
import { setFormAccount } from "@/actions/account-action";
import { IAccount } from '@/types/bAccount';

const AccountDetails = ({ account }: { account: IAccount }) => {

    /*
    const accountDescription = account.description;
    const { status, setStatus } = useFormStatus();
    const [state, formAccountAction] = useFormState(setFormAccount, { message: "" });
    const [actDescription, setActDescription] = useState(() => account ? account.description : '' );

    const descriptionKeyDown = (event) => {
        if (event.key === "Tab") {
            let formData = new FormData();
            formData.append('id', account._id);
            formData.append('description', event.target.value);
            formAccountAction(formData);
        }
    }
    */

    return (
        <div className="ml-5 mt-2 flex flex-wrap justify-between items-baseline">
            <h4 className="text-xl font-semibold tracking-tight text-left mr-2 underline">
              {account.bankName && <a href={account.url}>{account.bankName} </a> }
            </h4>
            <span className="mr-5">
                {account.accountNumber} ({ account.currency }) { account.description }
            </span>
            {/*}
            <form action={formAccountAction}>
                <input type="hidden" name="id" value={account._id} />
                <input type="text" value={actDescription} name="actDescription"
                       onKeyDown={descriptionKeyDown}
                       onChange={e => setActDescription(e.target.value)} />
            </form>
            */}
        </div>
    )
}

const AccountSelectionClient = ({ account, accounts }: { account: IAccount, accounts: IAccount[] }) => {

    const router = useRouter();
    const accountChange = (event: string) => {
        //router.push(`/banking?accountId=${event}`)
        return (event === '_' ? router.push('/banking') : router.push(`/banking?accountId=${event}`));
    }

    return (
    <header className="flex flex-wrap mx-auto items-center">
        <Select onValueChange={accountChange} defaultValue={account ? account.accountNumber : ''}>
          <SelectTrigger className="w-64 h-8">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="_"> -- All Account -- </SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account._id} value={account.accountNumber}>
                  {account.accountNumber}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        { account && <AccountDetails account={account}/> }
    </header>
    )
}

export default AccountSelectionClient;