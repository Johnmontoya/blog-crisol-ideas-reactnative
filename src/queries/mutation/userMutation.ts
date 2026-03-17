import { postLogin, registerUser } from "@/repositories/auth/auth_repository";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () =>
    useMutation({
        mutationFn: postLogin
    })

export const useRegisterUserMutation = () =>
    useMutation({
        mutationFn: registerUser
    })