"use client"

import { useContext, useState } from "react";
import { useFormStatus, useFormState } from 'react-dom'
import { setFormCategory } from "@/actions/dtAction";
import { CategoryContext } from './transaction-table-client';

const DataTableCategory = ({ txId, txCategories }:
    {txId: string, txCategories: string[]}) => {

    const { categoryList, setCategoryList } = useContext(CategoryContext);
    const [state, formCategoryAction] = useFormState(setFormCategory, { message: "" })


    const updateCategory = (target: HTMLInputElement, newCategory: string) => {
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
        const newCategory = event.target.value.trim();
        updateCategory(event.target, newCategory);
    }

    const categoryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab" || event.key === "Enter") {
            const newCategory = (event.target as HTMLInputElement).value.trim();
            updateCategory(event.target as HTMLInputElement, newCategory);
        }
    }

    const removeCategory = (event: React.MouseEvent<HTMLSpanElement>) => {
        let formData = new FormData();
        formData.append('id', txId);
        formData.append('action', 'splice');
        formData.append('category', (event.target as HTMLInputElement).outerText);
        formCategoryAction(formData);
    }

    return (
        <form action={formCategoryAction} id="category">
            <input type="hidden" name="id" value={txId} />
            <input type="text" name="txNewCategory" id="txNewCategory" list="categories"
                    className="mb-2 w-full h-5 px-1 rounded-none border border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onBlur={categoryFocusOut}
                    onKeyDown={categoryKeyDown}/>
            <div>
                {txCategories.map(category => (
                    <span key={category} id={category} className="tx-category mx-1"
                          onClick={removeCategory}>
                        {category}
                    </span>
                ))}
            </div>
        </form>
    )
}

export default DataTableCategory;