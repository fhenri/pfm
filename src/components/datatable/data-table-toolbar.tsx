"use client"

import { ChevronDownIcon } from '@radix-ui/react-icons'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IAccount } from '@/types/bAccount'
import { DateRangePicker } from '@/components/ui/custom/date-range-picker'
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>,
  categoryList: string[],
  accountList: IAccount[]
}

export function DataTableToolbar<TData>({
  table,
  categoryList,
  accountList
}: DataTableToolbarProps<TData>) {
    return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input placeholder="Search transactions..."
               value={(table.getColumn("Description")?.getFilterValue() as string) ?? ""}
               className="h-8 w-auto"
               onChange={(event) =>
                 table.getColumn("Description")?.setFilterValue(event.target.value)
               } />
        {table.getColumn("AccountNumber") && (
          <DataTableFacetedFilter
            column={table.getColumn("AccountNumber")}
            title="Select Account"
            options={accountList} />
        )}
        {table.getColumn("Categories") && (
          <DataTableFacetedFilter
            column={table.getColumn("Categories")}
            title="Categories"
            options={categoryList} />
        )}
        <datalist id="categories">
            {categoryList.map((category: string) => (
                <option key={category} value={category} />
            ))}
        </datalist>
        {table.getColumn("TransactionDate") && (
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-52"
            align="end"
            column={table.getColumn("TransactionDate")} />
        )}
      </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            { table.getAllColumns()
                   .filter((column) => column.getCanHide())
                   .map((column) => {
                     return (
                       <DropdownMenuCheckboxItem
                         key={column.id}
                         className="capitalize"
                         checked={column.getIsVisible()}
                         onCheckedChange={(value) =>
                           column.toggleVisibility(!!value)
                         }>
                         {column.id}
                       </DropdownMenuCheckboxItem>
                     )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
}