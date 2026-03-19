import { BLOG_DATA, BLOG_DATA_ID, DASHBOARD_DATA } from "@/constants/constants";
import { getBlogs, getBlogsId, getDashboard, getOwnBlogs } from "@/repositories/blog/blog_repository";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useGetBlogQueries = () => {
    return useQueries({
        queries: [
            {
                queryKey: [BLOG_DATA],
                queryFn: () => getBlogs().then((response) => response.data),
                staleTime: 20000,
            },
        ],
    });
};

export const useGetBlogIdQueries = (id: string) => {
    return useQuery({
        queryKey: [BLOG_DATA_ID, id],
        queryFn: () => getBlogsId(id).then((response) => response.data),
        enabled: !!id,
    });
};

export const useGetDashboardQueries = () => {
    return useQueries({
        queries: [
            {
                queryKey: [DASHBOARD_DATA],
                queryFn: () => getDashboard().then((response) => response.data),
                staleTime: 20000,
            },
        ],
    });
};

export const useGetOwnBlogQueries = (id: string) => {
    return useQuery({
        queryKey: [BLOG_DATA, id],
        queryFn: () => getOwnBlogs(id).then((response) => response.data),
        enabled: !!id,
        staleTime: 20000,
    });
};