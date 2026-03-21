import { type AxiosResponse } from "axios";
import type { ICommentAdd, ICommentResponse, ICommentState } from "../../types/comment";
import apiClient from "../apiClient";

export const getCommentsUser = async (userId: string): Promise<
    AxiosResponse<ICommentResponse>
> => {
    return await apiClient<ICommentResponse>({
        method: "get",
        url: `/api/v1/comment/comments/all/${userId}`,
    });
};

export const getCommentBlog = async (blogId: string): Promise<AxiosResponse<ICommentResponse>> => {
    return await apiClient<ICommentResponse>({
        method: "get",
        url: `/api/v1/comment/blog?id=${blogId}`
    })
}

export const addComment = async (data: ICommentAdd): Promise<AxiosResponse<ICommentResponse>> => {
    return await apiClient<ICommentResponse>({
        method: 'post',
        url: `/api/v1/comment/add-comment`,
        data: data
    })
}

export const approveComment = async ({ id }: ICommentState): Promise<AxiosResponse<ICommentResponse>> => {
    return await apiClient<ICommentResponse>({
        method: "put",
        url: `/api/v1/comment/approve-comment`,
        data: {
            id: id
        }
    });
}

export const deleteComment = async ({ id }: ICommentState): Promise<AxiosResponse<ICommentResponse>> => {
    return await apiClient<ICommentResponse>({
        method: "delete",
        url: `/api/v1/comment/delete-comment/${id}`
    });
}