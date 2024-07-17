"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table } from "@/components/ui/table"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
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
               className="h-8 max-w-sm"
               onChange={(event) =>
                 table.getColumn("Description")?.setFilterValue(event.target.value)
               } />
        {table.getColumn("AccountNumber") && (
          <DataTableFacetedFilter
            column={table.getColumn("AccountNumber")}
            title="Select Account"
            options={accountList}
          />
        )}
        {table.getColumn("Categories") && (
          <DataTableFacetedFilter
            column={table.getColumn("Categories")}
            title="Categories"
            options={categoryList}
          />
        )}
        <datalist id="categories">
            {categoryList.map((category: string) => (
                <option key={category} value={category} />
            ))}
        </datalist>
      </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
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