import { addNews, deleteNews, updateNews } from "@/repositories/news/news_repository";
import { useMutation } from "@tanstack/react-query";

export const useCreateNewsMutation = () =>
    useMutation({
        mutationFn: addNews
    })

export const useDeleteNewsMutation = () =>
    useMutation({
        mutationFn: deleteNews,
    });

export const useStateNewsMutation = () =>
    useMutation({
        mutationFn: updateNews
    });