"use client"

import { createContext, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

import { DataTableColumns } from "./data-table-column-def"
import { DataTableToolbar } from "./data-table-toolbar"
import { ITransaction } from '@/types/bTransaction';
import { IAccount } from '@/types/bAccount';
import { ICategory } from '@/types/txCategory';

interface CategoryContextType {
  categoryList: string[];
  setCategoryList: (categories: string[]) => void;
}

const defaultContextValue: CategoryContextType = {
  categoryList: [],
  setCategoryList: () => {}
};

export const CategoryContext = createContext<CategoryContextType>(defaultContextValue);

const TransactionTableClient = (
    { accounts, transactions, categories }:
    { accounts: IAccount[], transactions: ITransaction[] | null, categories: ICategory[] }) => {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    AccountNumber: false,
    id: false,
  })

  const [categoryList, setCategoryList] = useState<string[]>(
      categories.map((category) => category.CategoryName)
  );

  const { toast } = useToast()

  const table = useReactTable({
    data: transactions,
    columns: DataTableColumns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },
  })

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar table={table} categoryList={categoryList} accountList={accounts}/>
      <div className="rounded-md border">
        <Table className="text-xs leading-3">
          <TableHeader className="">
            { table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                { headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="h-6 px-1 bg-gray-100" key={header.id}>
                      { header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                      )}
                    </TableHead>
                )})}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            { table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
              <CategoryContext.Provider key={row.id} value={{ categoryList, setCategoryList }}>
                <TableRow key={row.id}>
                  { row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2 pt-1 align-top">
                      { flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </CategoryContext.Provider>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={DataTableColumns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          { table.getFilteredRowModel().rows.length } transaction(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TransactionTableClient;
