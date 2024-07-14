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

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
  categoryList
}: DataTableToolbarProps<TData>) {
    return (
      <div className="flex items-center py-4">
        <datalist id="categories">
            {categoryList.map((category) => (
                <option key={category} value={category} />
            ))}
        </datalist>
        <Input placeholder="Search transactions..."
               value={(table.getColumn("Description")?.getFilterValue() as string) ?? ""}
               className="h-8 max-w-sm mr-3"
               onChange={(event) =>
                 table.getColumn("Description")?.setFilterValue(event.target.value)
               } />
        {table.getColumn("Categories") && (
          <DataTableFacetedFilter
            column={table.getColumn("Categories")}
            title="Categories"
            options={categoryList}
          />
        )}
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