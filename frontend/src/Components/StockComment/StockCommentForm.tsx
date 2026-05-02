import React from 'react'
import * as Yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    symbol: string;
    handleComment: (e: CommentFormInputs) => void;
}

type CommentFormInputs  ={
    title : string;
    content: string;
}

const validation = Yup.object({
  title: Yup.string().required("Title required"),
  content: Yup.string().required("Content required")
})

const StockCommentForm = ({handleComment}: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CommentFormInputs>({
    resolver: yupResolver(validation),
    defaultValues: { title: '', content: '' }
  });
  
  return ( 
    <form className="mt-8 border-t border-white/10 pt-8" onSubmit={handleSubmit(handleComment)}>
      <h4 className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">Terminal / Transmission</h4>
      
      <div className="mb-6">
        <input
          type="text"
          id="title"
          className="w-full bg-white/[0.02] border border-white/10 p-4 font-mono text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-all"
          placeholder="IDENTIFIER / SUBJECT"
          {...register("title")}
        />
        {errors.title?.message && (
          <p className="text-red-500 font-mono text-[10px] mt-2 uppercase">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-6">
        <textarea
          id="comment"
          rows={4}
          className="w-full bg-white/[0.02] border border-white/10 p-4 font-sans text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-all resize-none"
          placeholder="ENTER TRANSMISSION CONTENT..."
          {...register("content")}
        ></textarea>
        {errors.content?.message && (
          <p className="text-red-500 font-mono text-[10px] mt-2 uppercase">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="px-8 py-3 bg-white text-[#1f2228] font-mono text-xs font-medium uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
      >
        Execute Transmission
      </button>
    </form>
  )
}

export default StockCommentForm