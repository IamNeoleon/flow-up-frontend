import { setTokenToLs } from "@/utils/localStorageUtils"
import { useLoginMutation } from "../api/authApi"
import type { ILoginBody } from "../types"
import { useToast } from "@/app/providers/ToastProvider"
import { useNavigate } from "react-router"

export const useLogin = () => {
	const [login, { isLoading, isError }] = useLoginMutation()
	const toast = useToast()
	const navigate = useNavigate()

	const handleLogin = async (formData: ILoginBody) => {
		try {
			const res = await login(formData).unwrap()
			setTokenToLs(res.accessToken)
			toast({ title: "Успешно!", description: "Вы вошли в систему", type: "success" })
			navigate('/')
		} catch {
			toast({ title: "Ошибка", description: "Неверный email или пароль", type: "error" })
		}
	}

	return { handleLogin, isLoading, isError }
}