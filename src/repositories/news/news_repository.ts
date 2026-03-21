import type { AxiosResponse } from "axios"
import type { IResponse } from "../../types/blog"
import type { INews, INewsData, INewsResponse } from "../../types/news"
import apiClient from "../apiClient"

export const addNews = async (data: INewsData): Promise<AxiosResponse<IResponse>> => {
    return await apiClient<IResponse>({
        method: 'post',
        url: `/api/v1/news/add`,
        data: data
    })
}

export const getNews = async (): Promise<AxiosResponse<INewsResponse>> => {
    return await apiClient<INewsResponse>({
        method: 'get',
        url: `/api/v1/news/all`
    })
}

export const deleteNews = async ({ id }: INews): Promise<AxiosResponse<string>> => {
    return await apiClient<string>({
        method: "delete",
        url: `/api/v1/news/delete/${id}`
    });
}

export const updateNews = async ({ id }: INews): Promise<AxiosResponse<string>> => {
    return await apiClient<string>({
        method: 'put',
        url: `/api/v1/news/statenews/${id}`
    });
}