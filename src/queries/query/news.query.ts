import { NEWS_DATA } from "@/constants/constants";
import { getNews } from "@/repositories/news/news_repository";
import { useQueries } from "@tanstack/react-query";

export const useGetNewsQueries = () => {
    return useQueries({
        queries: [
            {
                queryKey: [NEWS_DATA],
                queryFn: () => getNews().then((response) => response.data),
                staleTime: 20000,
            },
        ],
    });
};