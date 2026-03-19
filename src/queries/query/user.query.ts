import { USER_DATA, USERS_DATA } from "@/constants/constants";
import { getUserId, getUsers } from "@/repositories/auth/auth_repository";
import { useQueries } from "@tanstack/react-query";

export const useGetUserIdQueries = (userId: string) => {
    return useQueries({
        queries: [
            {
                queryKey: [USER_DATA],
                queryFn: () => getUserId(userId).then((response) => response.data),
                staleTime: 20000,
            },
        ],
    });
};

export const useGetUsersQueries = () => {
    return useQueries({
        queries: [
            {
                queryKey: [USERS_DATA],
                queryFn: () => getUsers().then((response) => response.data),
                staleTime: 20000,
            }
        ]
    })
}