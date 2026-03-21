import { COMMENT_DATA } from "@/constants/constants";
import { getCommentBlog, getCommentsUser } from "@/repositories/comment/comment_repository";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useGetCommentUserIdQueries = (userId: string) => {
    return useQueries({
        queries: [
            {
                queryKey: [COMMENT_DATA],
                queryFn: () => getCommentsUser(userId).then((response) => response.data),
                staleTime: 20000,
            },
        ],
    });
};

export const useGetCommentBlogQueries = (id: string) => {
    return useQuery({
        queryKey: [COMMENT_DATA, id],
        queryFn: () => getCommentBlog(id).then((response) => response.data),
        enabled: !!id,
        staleTime: 20000,
    });
};