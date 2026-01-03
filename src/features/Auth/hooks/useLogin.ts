import { setTokenToLs } from "@/shared/lib/localStorage"
import { useLoginMutation } from "@/api/endpoints/authApi"
import type { ILoginBody } from "../types"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuth } from "@/shared/hooks/useAuth"

export const useLogin = () => {
	const [login, { isLoading, isError }] = useLoginMutation()
	const { setIsAuthenticated } = useAuth()
	const navigate = useNavigate()

	const handleLogin = async (formData: ILoginBody) => {
		try {
			const res = await login(formData).unwrap()
			setTokenToLs(res.accessToken)
			setIsAuthenticated(true)
			navigate('/')
			toast.success('Вы вошли в систему')
		} catch {
			toast.error('Неверный email или пароль')
		}
	}

	return { handleLogin, isLoading, isError }
}