import React from 'react'
import { CommentGet } from '../../Models/Comment'

type Props = {
    comment: CommentGet;
}

const StockCommentListItem = (props: Props) => {
  return (
    <div className='bg-white/[0.02] border border-white/10 p-8 my-6 w-full max-w-3xl'>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-2 bg-white" />
          <p className="font-mono text-sm font-light text-white uppercase tracking-tight">{props.comment.title}</p>
        </div>
        
        <p className="font-sans text-sm text-white/60 leading-relaxed mb-8">{props.comment.content}</p>
        
        <div className="flex items-center text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] gap-4 pt-6 border-t border-white/5">
          <span className="text-white/50">ID / {props.comment.createdBy}</span>
          <span className="opacity-50">/</span>
          <span>{new Date(props.comment.createdOn).toLocaleDateString()}</span>
        </div>
    </div>
  )
}

export default StockCommentListItem