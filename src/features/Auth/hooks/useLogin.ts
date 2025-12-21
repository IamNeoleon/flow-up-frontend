import { setTokenToLs } from "@/shared/lib/utils/localStorageUtils"
import { useLoginMutation } from "@/api/endpoints/authApi"
import type { ILoginBody } from "../types"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export const useLogin = () => {
	const [login, { isLoading, isError }] = useLoginMutation()
	const navigate = useNavigate()

	const handleLogin = async (formData: ILoginBody) => {
		try {
			const res = await login(formData).unwrap()
			setTokenToLs(res.accessToken)
			toast.success('Вы вошли в систему')
			navigate('/')
		} catch {
			toast.error('Неверный email или пароль')
		}
	}

	return { handleLogin, isLoading, isError }
}