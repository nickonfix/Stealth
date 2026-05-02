import React from 'react'
import { CommentGet } from '../../Models/Comment';
import StockCommentListItem from '../StockCommentListItem/StockCommentListItem';

type Props = {
    comments: CommentGet[];   
}

const StockCommentList = (props: Props) => {
  return (
    <div className="flex flex-col w-full">
        {props.comments.length > 0 ? (
          <div className="grid grid-cols-1 gap-1">
             {props.comments.map((comment) => (
                <StockCommentListItem key={comment.id} comment={comment}/>
             ))}
          </div>
        ) : (
          <div className="p-8 border border-white/5 bg-white/[0.01]">
            <p className="font-mono text-[11px] text-white/30 uppercase tracking-[0.2em]">Terminal / Data Empty</p>
            <p className="font-sans text-xs text-white/20 mt-2">No transmissions recorded for this identifier.</p>
          </div>
        )}
    </div>
  )
}

export default StockCommentList