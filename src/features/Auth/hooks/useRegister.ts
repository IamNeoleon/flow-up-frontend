import { toast } from "sonner"
import { useRegisterMutation } from "@/api/endpoints/authApi"
import type { IRegisterBody } from "../types"
import { getErrorMessage } from "@/shared/lib/utils/utils"

export const useRegister = () => {
	const [register, { isLoading, isError, error, isSuccess }] = useRegisterMutation()
	const err = getErrorMessage(error)

	const handleRegister = async (formData: IRegisterBody) => {
		try {
			await register(formData).unwrap()
			toast.success('Успешная регистрация')
		} catch (err: any) {
			const message = err?.data?.message || err?.message || "Произошла ошибка при регистрации"
			toast.error(message)
		}
	}

	return { handleRegister, isLoading, isError, err, isSuccess }
}