import React, { useEffect, useState, useCallback } from 'react'
import StockCommentForm from './StockCommentForm';
import { commentGetAPI, commentPostAPI } from '../../Services/CommentService';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';
import { CommentGet } from '../../Models/Comment';
import StockCommentList from '../StockCommentList/StockCommentList';
import Spinner from '../Spinner/Spinner';

type Props = {
    stockSymbol:string;
}
type CommentFormInputs  ={
    title : string;
    content: string;

}
const StockComment = ({stockSymbol}: Props) => {
    const [comments, setComments] = useState<CommentGet[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { token } = useAuth();

const getComments = useCallback(async () => {
    setLoading(true);
    try {
        const res = await commentGetAPI(stockSymbol, token ?? undefined);
        setComments(res?.data ?? []);
    } catch {
        setComments([]);
    } finally {
        setLoading(false);
    }
}, [stockSymbol, token]);

useEffect(() => {
    getComments();
}, [getComments]);

const handleComment = (e: CommentFormInputs) => {
    if (!token) {
        toast.warning("Please log in to add comments.");
        return;
    }

    commentPostAPI(e.title, e.content, stockSymbol, token!)
    .then((res)=>{
        if(res){
            toast.success("Comment created sucessfully!")
            getComments();
        }   
    }).catch((e) => {
        toast.warning(e);
    })
}
  return (
    <div className="flex flex-col">
    {loading ? <Spinner /> : <StockCommentList comments={comments!}/>}
    <StockCommentForm symbol={stockSymbol} handleComment={handleComment}/></div>
  )
}

export default StockComment