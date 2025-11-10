import { setTokenToLs } from "@/utils/localStorageUtils"
import { useLoginMutation } from "../api/authApi"
import type { ILoginBody } from "../types"

export const useLogin = () => {
	const [login, { isLoading, isError }] = useLoginMutation()

	const handleLogin = async (formData: ILoginBody) => {
		const response = await login(formData)

		if (response.data) {
			setTokenToLs(response.data.accessToken)
		}
	}

	return { handleLogin, isLoading, isError }
}