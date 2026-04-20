import React from 'react'
import { CommentGet } from '../../Models/Comment'

type Props = {
    comment:CommentGet;
}

const StockCommentListItem = (props: Props) => {
  return (
    <div className='border-gray-200 rounded-md p-10 my-3 max-w-lg'>
        <p>{props.comment.title}</p>
        <p>{props.comment.content}</p>
        <p>{props.comment.createdBy}</p>
        <p>{props.comment.createdOn.toString()}</p>
    </div>
  )
}

export default StockCommentListItem