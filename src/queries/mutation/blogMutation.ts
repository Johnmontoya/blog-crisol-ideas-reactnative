import { addBlog, deleteBlog, generateAI, togglePublish } from "@/repositories/blog/blog_repository";
import { useMutation } from "@tanstack/react-query";

export const useToggleBlogMutation = () =>
    useMutation({
        mutationFn: togglePublish,
    });

export const useDeleteBlogMutation = () =>
    useMutation({
        mutationFn: deleteBlog,
    });

export const useCreateBlogMutation = () =>
    useMutation({
        mutationFn: addBlog,
    });

export const useGenerateAIMutation = () =>
    useMutation({
        mutationFn: generateAI,
    });