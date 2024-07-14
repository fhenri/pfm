"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
// npm install jquery datatables.net datatables.net-dt
// npm install datatables.net-buttons datatables.net-buttons-dt --> for the colvis button
// npm install -D @types/jquery @types/datatables.net
import jquery from 'jquery';
//import DataTable from "datatables.net-dt";
import 'datatables.net-responsive'
import  DataTable from 'datatables.net-responsive-dt'
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import ITransaction from '@/types/bTransaction';
import ICategory from '@/types/txCategory';

import DataTableRow from "./DataTableRow";

export const CategoryContext = createContext();

const DataTableClient = (
    { transactions, categories, isAccountSelected }:
    { transactions: ITransaction[], categories: ICategory[], isAccountSelected: boolean }) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [categoryList, setCategoryList] = useState<string[]>(
      categories.map((category) => category.CategoryName)
  );
  const { toast } = useToast()

  useEffect(() => {
    toast({
      //title: state?.error?.name || state?.error?.email ? "Error" : "Success",
      //description: state.message,
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
    });

    const dt:DataTable.Api = new DataTable(tableRef.current!, {
      "responsive": true,
      // Optional: add DataTables configuration options here
      "info": false,          // dont display info
      "lengthChange": false,  // dont allow to change number of items per page
      "pageLength": 12,       // default to 50 items per page
      "paging": true,         // Enable pagination
      "searching": true,      // Enable searching
      "ordering": true,       // Enable column ordering
      "language": {
        "searchPlaceholder": "Search transactions",
        "search": "",
      },
      columnDefs: [
        {
            targets: isAccountSelected ? 0 : 1,
            render: ( data, type, row ) => {
                return data.substring(0, 10).replaceAll("-","/");
            }
        }
      ]
    });
    return () => {
      dt.destroy();
    };
  }, []);

  return (
    <>
    <datalist id="categories">
        {categoryList.map((category) => (
            <option key={category} value={category} />
        ))}
    </datalist>
    <table ref={tableRef} id="transactionTable" className="display nowrap compact table-responsive responsive">
            <thead>
                <tr>
                    {!isAccountSelected && <th>Account</th>}
                    <th className="!text-center">Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th className="dt-type-numeric">Amount (€)</th>
                    <th className="!text-center">Comment</th>
                    <th className="!text-center">Categories</th>
                </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
              <CategoryContext.Provider key={transaction._id} value={{ categoryList, setCategoryList }}>
                <DataTableRow isAccountSelected={isAccountSelected} data={transaction} />
              </CategoryContext.Provider>
              ))}
            </tbody>
    </table>
    </>
  )
}

export default DataTableClient;
