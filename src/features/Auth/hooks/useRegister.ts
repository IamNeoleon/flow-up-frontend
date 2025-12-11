import { toast } from "sonner"
import { useRegisterMutation } from "@/api/endpoints/authApi"
import type { IRegisterBody } from "../types"
import { getErrorMessage } from "@/lib/utils"

export const useRegister = () => {
	const [register, { isLoading, isError, error, isSuccess }] = useRegisterMutation()
	const err = getErrorMessage(error)

	const handleRegister = async (formData: IRegisterBody) => {
		try {

			await register(formData).unwrap() // unwrap выбрасывает ошибку, если запрос неудачный
			toast.success('Успешная регистрация')
			console.log('asdasd')
		} catch (err: any) {
			const message = err?.data?.message || err?.message || "Произошла ошибка при регистрации"
			toast.error(message)
			console.log('asdasd 12e')
		}
	}

	return { handleRegister, isLoading, isError, err, isSuccess }
}