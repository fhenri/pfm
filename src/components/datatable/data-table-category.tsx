"use client"

import { useContext, useState } from "react";
import { useFormStatus, useFormState } from 'react-dom'
import { Badge } from "@/components/ui/badge"
import { setFormCategory } from "@/actions/datatable-action";
import { CategoryContext } from './transaction-table-client';

const DataTableCategory = ({ txId, txCategories }:
    {txId: string, txCategories: string[]}) => {

    const { categoryList, setCategoryList } = useContext(CategoryContext);
    const [state, formCategoryAction] = useFormState(setFormCategory, { message: "" })

    const updateCategory = (target: HTMLInputElement) => {
        const newCategory: string = target.value?.trim();
        if (Boolean(newCategory)) {
            let formData = new FormData();
            formData.append('id', txId);
            formData.append('action', 'push');
            formData.append('category', newCategory);
            formCategoryAction(formData);
            if (!categoryList.includes(newCategory)) {
                setCategoryList([...categoryList, newCategory].sort());
            }
            target.value = '';
        }
    }

    const categoryFocusOut = (event: React.FocusEvent<HTMLInputElement>) => {
        updateCategory(event.target as HTMLInputElement);
    }

    const categoryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab" || event.key === "Enter") {
            updateCategory(event.target as HTMLInputElement);
        }
    }

    const removeCategory = (event: React.MouseEvent<HTMLSpanElement>) => {
        let formData = new FormData();
        formData.append('id', txId);
        formData.append('action', 'splice');
        formData.append('category', (event.target as HTMLInputElement).outerText);
        formCategoryAction(formData);
    }
/*
                    <span key={category} id={category} className="tx-category mx-1"
                          onClick={removeCategory}>
                        {category}
                    </span>
*/
    return (
        <form action={formCategoryAction} id="category">
            <input type="hidden" name="id" value={txId} />
            <input type="text" name="txNewCategory" id="txNewCategory" list="categories"
                    className="mb-2 w-full h-5 px-1 rounded-none border border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onBlur={categoryFocusOut}
                    onKeyDown={categoryKeyDown}/>
            <div>
                {txCategories.map(category => (
                  <Badge
                    id={category}
                    variant="outline"
                    key={category}
                    onClick={removeCategory}
                    className="rounded-sm mx-1 px-1 font-normal cursor-default">
                    {category}
                  </Badge>

                ))}
            </div>
        </form>
    )
}

export default DataTableCategory;