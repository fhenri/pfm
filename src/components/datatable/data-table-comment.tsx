"use client"

import { useState, useEffect } from "react";
import { useFormStatus, useFormState } from 'react-dom'
import { setFormComment } from "@/actions/datatable-action";
import { Input } from "@/components/ui/input"

const DataTableComment = ({ txId, txComment }:
   {txId: string, txComment: string}) => {

    const [state, formCommentAction] = useFormState(setFormComment, null)
    const [comment, setComment] = useState(() => txComment ? txComment : '' );

    useEffect(() => {
      setComment(() => txComment ? txComment : '');
    }, [txComment]);

    const commentKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Tab") {
            let formData = new FormData();
            formData.append('id', txId);
            formData.append('comment', (event.target as HTMLInputElement).value);
            formCommentAction(formData);
        }
    }

    return (
        <form action={formCommentAction} id="comment">
          <input type="hidden" name="id" value={txId} />
          <input type="text" name="comment" value={comment}
                className="w-full h-5 px-1 rounded-none border border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onKeyDown={commentKeyDown}
                onChange={e => setComment(e.target.value)} />
        </form>
    )
}

export default DataTableComment;