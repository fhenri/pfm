"use client"

import { createContext, useState } from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
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
import { DataTablePagination } from "./data-table-pagination"
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
    { accounts: IAccount[], transactions: ITransaction[], categories: ICategory[] }) => {

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
    //getFacetedMinMaxValues: getFacetedMinMaxValues(),
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
        pageSize: 10,
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
      <DataTablePagination table={table} />
    </div>
  )
}

export default TransactionTableClient;
