"use client"

import { MultiSelect } from "@/components/ui/custom/multi-select";

import { IAccount } from '@/types/bAccount';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const AccountSelectionClient = ({ selectedAccounts, availableAccounts }:
    { selectedAccounts: IAccount[], availableAccounts: IAccount[] }) => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const accountMultiChange = (event: string[]) => {
        const params = new URLSearchParams(searchParams);
        if (event.length > 0) {
          params.set('accountId', event.join('&'));
        } else {
          params.delete('accountId');
        }
        replace(`${pathname}?${params.toString()}`)
    };

    /*
    const accountChange = (event: string) => {
        const params = new URLSearchParams(searchParams);
        if (event && event !== '*') {
          params.set('accountId', event);
        } else {
          params.delete('accountId');
        }
        replace(`${pathname}?${params.toString()}`)
    }
    */

    return (
        <>
        <MultiSelect
          options={availableAccounts.map((account) => (
            { 
              value: account.accountNumber, 
              label: `${account.bankName} - ${account.accountNumber} (${account.currency})` 
            }
          ))}
          className="w-96"
          onValueChange={accountMultiChange}
          defaultValue={
            selectedAccounts.map((account) => account.accountNumber)
          }
          placeholder="Select Accounts"
          variant="inverted"
          maxCount={3}
        />
        {/*}
        <Select 
          onValueChange={accountChange} 
          defaultValue={selectedAccounts[0] ? selectedAccounts[0].accountNumber : ''}>
          <SelectTrigger className="w-96 h-10">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="*"> -- All Account -- </SelectItem>
              {availableAccounts.map((account) => (
                <SelectItem key={account._id} value={account.accountNumber}>
                  {account.bankName} - {account.accountNumber} ({account.currency})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        */}
        </>
    )
}

export default AccountSelectionClient;