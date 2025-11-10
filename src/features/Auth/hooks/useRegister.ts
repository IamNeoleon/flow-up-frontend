import { useRegisterMutation } from "../api/authApi"
import type { IRegisterBody } from "../types"

export const useRegister = () => {
	const [register, { isLoading, isError }] = useRegisterMutation()

	const handleRegister = async (formData: IRegisterBody) => {
		await register(formData)
	}

	return { handleRegister, isLoading, isError }
}