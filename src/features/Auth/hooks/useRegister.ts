import { toast } from "sonner"
import { useRegisterMutation } from "@/api/endpoints/authApi"
import type { IRegisterBody } from "../types"

export const useRegister = () => {
	const [register, { isLoading, isError }] = useRegisterMutation()

	const handleRegister = async (formData: IRegisterBody) => {
		try {
			await register(formData).unwrap()
			toast.success('Вы успешно зарегистрировались')
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

			toast.error(message)
		}
	}

	return { handleRegister, isLoading, isError }
}