"use client"

import { useState } from "react";
import { useFormStatus, useFormState } from 'react-dom'
import { setFormComment } from "@/actions/dtAction";

const initialState = {
  message: "",
};

const DataTableComment = (props) => {

    const {txId, txComment} = props;

    const [state, formCommentAction] = useFormState(setFormComment, initialState)
    const [comment, setComment] = useState(() => txComment ? txComment : '' );

    const commentKeyDown = (event) => {
        if (event.key === "Tab") {
            let formData = new FormData();
            formData.append('id', txId);
            formData.append('comment', event.target.value);
            formCommentAction(formData);
        }
    }

    return (
        <form action={formCommentAction} id="comment">
          <input type="hidden" name="id" value={txId} />
          <input type="text" name="comment" value={comment}
                className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onKeyDown={commentKeyDown}
                onChange={e => setComment(e.target.value)} />
        </form>
    )
}

export default DataTableComment;