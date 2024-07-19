"use client"

import { CaretSortIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ITransaction } from '@/types/bTransaction';
import DataTableComment from './data-table-comment';
import DataTableCategory from './data-table-category';

export const DataTableColumns: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "_id",
    id: "id",
    enableHiding: false,
  },
  {
    accessorKey: "AccountNumber",
    header: ({ column }) => {
      return (
        <span className="uppercase font-bold">Account</span>
      )},
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("AccountNumber")}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "TransactionDate",
    enableResizing: true,
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button variant="ghost"
          className="p-0 h-4 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <CaretSortIcon className="mr-2 h-4 w-4" />
          <span className="uppercase font-bold">Date</span>
        </Button>
      )},
    cell: ({ row }) => {
      return (
          <div>{(new Date(row.getValue("TransactionDate"))).toLocaleDateString('fr-FR')}</div>
      )},
    filterFn: (row, id, value) => {
      const thisDate = new Date(row.getValue(id));
      if ((value.from && value.from > thisDate)
        ||(value.to && value.to < thisDate)) {
        return false
      };
      return true;
    },
  },
  {
    accessorKey: "Description",
    enableResizing: true,
    enableHiding: false,
    size: 60,
    maxSize: 80,
    header: ({ column }) => {
      return (
        <span className="uppercase font-bold">Description</span>
      )},
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("Description")}</div>
    ),
  },
  {
    accessorKey: "Amount",
    enableHiding: true,
    size: 70,
    header: ({ column }) => {
      return (
        <div className="text-right">
            <Button variant="ghost"
              className="p-0 h-4 text-xs"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              <CaretSortIcon className="mr-2 h-4 w-4" />
              <span className="uppercase font-bold">Amount</span>
            </Button>
        </div>
      )},
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("Amount"))
      const formatted = Intl.NumberFormat('fr-FR').format(amount)
      return <div className={ amount > 0 ? 'text-right text-lime-500' : 'text-right text-red-600' }>{formatted}</div>
    },
  },
  {
    accessorKey: "AmountEUR",
    enableHiding: false,
    size: 70,
    header: ({ column }) => {
      return (
        <div className="text-right">
            <Button variant="ghost"
              className="p-0 h-4 text-xs"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              <CaretSortIcon className="mr-2 h-4 w-4" />
              <span className="uppercase font-bold">Amount (€)</span>
            </Button>
        </div>
      )},
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("AmountEUR"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className={ amount > 0 ? 'text-right text-lime-500' : 'text-right text-red-600' }>{formatted}</div>
    },
  },
  {
    accessorKey: "Comment",
    header: ({ column }) => {
      return (
        <span className="uppercase font-bold ">Comment</span>
      )},
    cell: ({ row }) => (
        <DataTableComment txId={row.getValue("id")} txComment={row.getValue("Comment")} />
    ),
  },
  {
    accessorKey: "Categories",
    header: ({ column }) => {
      return (
        <span className="uppercase font-bold">Categories</span>
      )},
    cell: ({ row }) => (
        <DataTableCategory txId={row.getValue("id")} txCategories={row.getValue("Categories")} />
    ),
    filterFn: (row, columnId, filterValue: string[]) => {
        const rowCategories: string[] = row.getValue(columnId);
        // Check if any of the row's categories are in the selected filter values
        return filterValue.some(filterVal => rowCategories.includes(filterVal));
    },
  },
]
