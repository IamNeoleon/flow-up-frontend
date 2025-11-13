import { useRegisterMutation } from "../api/authApi"
import type { IRegisterBody } from "../types"
import { useToast } from "@/app/providers/ToastProvider"

export const useRegister = () => {
	const [register, { isLoading, isError }] = useRegisterMutation()
	const toast = useToast()

	const handleRegister = async (formData: IRegisterBody) => {
		try {
			await register(formData).unwrap()
			toast({
				title: "Успешно!",
				description: "Вы успешно зарегистрировались",
				type: "success",
			})
		} catch (error: any) {
			let message = "Произошла ошибка при регистрации"

			if (error?.data) {
				if (typeof error.data === "string") {
					message = error.data
				} else if (error.data.message) {
					message = error.data.message
				} else if (Array.isArray(error.data?.email)) {
					message = error.data.email[0]
				}
			}

			toast({
				title: "Ошибка",
				description: message,
				type: "error",
			})
		}
	}

	return { handleRegister, isLoading, isError }
}