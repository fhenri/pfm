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

import React, { useState } from "react";
import { useFormStatus, useFormState } from 'react-dom'
import { format } from "date-fns"
import { setFormAccount } from "@/actions/account-action";
import { IAccount } from '@/types/bAccount';
import { ITransaction } from '@/types/bTransaction';
import { DateRangePicker } from '@/components/ui/custom/date-range-picker';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const AccountSelectionClient = ({ account, accounts, transactions }:
    { account: IAccount, accounts: IAccount[], transactions: ITransaction[] }) => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const accountChange = (event: string) => {
        const params = new URLSearchParams(searchParams);
        if (event) {
          params.set('accountId', event);
        } else {
          params.delete('accountId');
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const dateChange = (range: any) => {
        const params = new URLSearchParams(searchParams);

        let fromDay: Date | undefined
        let toDay: Date | undefined

        if (range?.from) {
          params.set("dateFrom", format(range.from, "yyyy-MM-dd"))
        } else {
          params.delete("dateFrom")
        }

        if (range?.to) {
          params.set("dateTo", format(range.to, "yyyy-MM-dd"))
        } else {
          params.delete("dateTo")
        }

        replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        })
    }

    return (
    <header className="flex flex-wrap w-full justify-center my-5 space-x-5">
        <Select onValueChange={accountChange} defaultValue={account ? account.accountNumber : ''}>
          <SelectTrigger className="w-96 h-8">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value=""> -- All Account -- </SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account._id} value={account.accountNumber}>
                  {account.bankName} - {account.accountNumber} ({account.currency})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DateRangePicker
              triggerSize="sm"
              triggerClassName="ml-auto w-52"
              align="end"
              callback={dateChange} />
    </header>
    )
}

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


export default AccountSelectionClient;