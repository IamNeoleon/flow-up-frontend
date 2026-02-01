import { useLoginMutation } from "@/services/auth/api/authApi"
import type { ILoginBody } from "../types"
import { toast } from "sonner"
import { useLocation, useNavigate } from "react-router"
import { useAppDispatch } from "@/shared/hooks/redux"
import { setToken } from "@/store/slices/authSlice"
import i18n from "i18next"

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
			toast.success(i18n.t("auth.loginSuccess"))
		} catch {
			toast.error(i18n.t("auth.loginError"))
		}
	}

	return { handleLogin, isLoading, isError }
}
