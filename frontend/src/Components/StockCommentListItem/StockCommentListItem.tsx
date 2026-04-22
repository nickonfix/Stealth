import React from 'react'
import { CommentGet } from '../../Models/Comment'

type Props = {
    comment:CommentGet;
}

const StockCommentListItem = (props: Props) => {
  return (
    <div className='bg-white border border-gray-200 rounded-lg p-6 my-4 max-w-2xl shadow-sm dark:bg-[#0f172a] dark:border-gray-800 transition-colors'>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{props.comment.title}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{props.comment.content}</p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
          <span className="font-medium text-gray-700 dark:text-gray-300">@{props.comment.createdBy}</span>
          <span>•</span>
          <span>{new Date(props.comment.createdOn).toLocaleDateString()}</span>
        </div>
    </div>
  )
}

export default StockCommentListItem