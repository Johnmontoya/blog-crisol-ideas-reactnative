import { deleteUserId, forgotPassword, postLogin, registerUser, resetPassword, userState, verifyuser } from "@/repositories/auth/auth_repository";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () =>
    useMutation({
        mutationFn: postLogin
    })

export const useRegisterUserMutation = () =>
    useMutation({
        mutationFn: registerUser
    })

export const useForgotMutation = () =>
    useMutation({
        mutationFn: forgotPassword
    })

export const useResetMutation = () =>
    useMutation({
        mutationFn: resetPassword
    })

export const useVerifiedMutation = () =>
    useMutation({
        mutationFn: userState
    })

export const useDeleteMutation = () =>
    useMutation({
        mutationFn: deleteUserId
    })

export const useVerifyMutation = () =>
    useMutation({
        mutationFn: verifyuser
    })