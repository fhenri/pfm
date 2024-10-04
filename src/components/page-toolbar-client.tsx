"use client"

import { format } from "date-fns"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { DateRangePicker } from '@/components/ui/custom/date-range-picker';
import AccountSelectionClient from '@/components/toolbar/account-selection';
import { IAccount } from "@/types/bAccount";
import { ITransaction } from "@/types/bTransaction";

const Toolbar = ({ selectedAccounts, availableAccounts }:
    { selectedAccounts: IAccount[], availableAccounts: IAccount[] }) => {

    const pathname      = usePathname();
    const searchParams  = useSearchParams();
    const { replace }   = useRouter();

    const dateChange = (range: any) => {
        const params = new URLSearchParams(searchParams);

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
      <header className="flex w-full justify-center my-5 space-x-5">
        <AccountSelectionClient
                selectedAccounts={selectedAccounts}
                availableAccounts={availableAccounts} />
        <DateRangePicker
              disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
              }
              triggerSize="sm"
              triggerClassName="ml-auto w-64 min-h-10"
              align="end"
              callback={dateChange} />
      </header>
    )
}

export default Toolbar;