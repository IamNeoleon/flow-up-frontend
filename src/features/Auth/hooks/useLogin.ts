import { useLoginMutation } from "@/features/auth/api/authApi"
import type { ILoginBody } from "../types"
import { toast } from "sonner"
import { useLocation, useNavigate } from "react-router"
import { useAppDispatch } from "@/shared/hooks/redux"
import { setToken } from "@/store/slices/authSlice"

export const useLogin = () => {
	const [login, { isLoading, isError }] = useLoginMutation()
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const location = useLocation()

	const from = location.state?.from?.pathname || '/'

	const handleLogin = async (formData: ILoginBody) => {
		try {
			const res = await login(formData).unwrap()
			dispatch(setToken(res.accessToken))
			navigate(from, { replace: true })
			toast.success('Вы вошли в систему')
		} catch {
			toast.error('Неверный email или пароль')
		}
	}

	return { handleLogin, isLoading, isError }
}