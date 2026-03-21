import { IResponse } from "@/types/auth";
import { IBlog, IBlogResponse, Iblogs, IBlogsResponse, IDashboardResponse } from "@/types/blog";
import { AxiosResponse } from "axios";
import apiClient from "../apiClient";

export const getBlogs = async (): Promise<
    AxiosResponse<Iblogs[]>
> => {
    return await apiClient<Iblogs[]>({
        method: "get",
        url: `/api/v1/blog/all`,
    });
};

export const getBlogsId = async (id: string): Promise<AxiosResponse<IBlogResponse>> => {
    return await apiClient<IBlogResponse>({
        method: "get",
        url: `/api/v1/blog/${id}`
    })
}

export const getDashboard = async (): Promise<
    AxiosResponse<IDashboardResponse>
> => {
    return await apiClient<IDashboardResponse>({
        method: "get",
        url: `/api/v1/blog/dashboard`,
    });
};

export const getOwnBlogs = async (id: string): Promise<AxiosResponse<IBlogsResponse>> => {
    return await apiClient<IBlogsResponse>({
        method: "get",
        url: `/api/v1/blog/all-admin/${id}`,
    });
}

export const togglePublish = async ({ id }: IBlog): Promise<AxiosResponse<string>> => {
    return await apiClient<string>({
        method: "put",
        url: `/api/v1/blog/toggle-publish`,
        data: {
            id: id
        }
    });
}

export const deleteBlog = async ({ id }: IBlog): Promise<AxiosResponse<string>> => {
    return await apiClient<string>({
        method: "delete",
        url: `/api/v1/blog/delete/${id}`
    });
}

export const addBlog = async (data: any): Promise<AxiosResponse<IResponse>> => {
    console.log(data);
    return await apiClient<IResponse>({
        method: 'post',
        url: `/api/v1/blog/add`,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: data
    })
}

export const generateAI = async (prompt: string): Promise<AxiosResponse<IResponse>> => {
    return await apiClient<IResponse>({
        method: 'post',
        url: `/api/v1/blog/generate`,
        data: { prompt: prompt }
    })
}