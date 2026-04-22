import React from 'react'
import { CommentGet } from '../../Models/Comment';
import StockCommentListItem from '../StockCommentListItem/StockCommentListItem';

type Props = {
    comments: CommentGet[];   
}

const StockCommentList = (props: Props) => {
  return (
    <div className="flex flex-col w-full px-4 sm:px-0">
        {props.comments.length > 0 ? props.comments.map((comment)=>{
            return(
                <StockCommentListItem key={comment.id} comment={comment}/>
            )
        }):<p className="text-gray-500 dark:text-zinc-400 mt-4">No comments yet. Be the first to share your thoughts!</p>}
    </div>
  )
}

export default StockCommentList