import { toast } from "sonner"
import { useRegisterMutation } from "@/features/auth/api/authApi"
import type { IRegisterBody } from "../types"
import { getErrorMessage } from "@/shared/utils/get-error-message"
import i18n from "i18next"

export const useRegister = () => {
	const [register, { isLoading, isError, error, isSuccess }] = useRegisterMutation()
	const err = getErrorMessage(error)

	const handleRegister = async (formData: IRegisterBody) => {
		try {
			await register(formData).unwrap()
			toast.success(i18n.t("auth.registerSuccess"))
		} catch (err: any) {
			const message = err?.data?.message || err?.message || i18n.t("auth.registerError")
			toast.error(message)
		}
	}

	return { handleRegister, isLoading, isError, err, isSuccess }
}
