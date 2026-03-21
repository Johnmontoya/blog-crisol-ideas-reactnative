import { addComment, approveComment, deleteComment } from "@/repositories/comment/comment_repository";
import { useMutation } from "@tanstack/react-query";

export const useCreateCommentMutation = () =>
    useMutation({
        mutationFn: addComment
    })

export const useStateCommentMutation = () =>
    useMutation({
        mutationFn: approveComment,
    });

export const useDeleteCommentMutation = () =>
    useMutation({
        mutationFn: deleteComment,
    });