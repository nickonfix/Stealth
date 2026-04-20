import React from 'react'
import { CommentGet } from '../../Models/Comment';
import StockCommentListItem from '../StockCommentListItem/StockCommentListItem';

type Props = {
    comments: CommentGet[];   
}

const StockCommentList = (props: Props) => {
  return (
    <>
        {props.comments.length > 0 ? props.comments.map((comment)=>{
            return(
                <StockCommentListItem comment={comment}/>
            )
        }):<p>No comments</p>}
    </>
  )
}

export default StockCommentList