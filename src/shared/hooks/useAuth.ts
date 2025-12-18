import { useGetMeQuery } from "@/api/endpoints/authApi"
import { useAppDispatch } from "@/hooks/redux"
import { setUser } from "@/store/slices/userSlice"
import { useEffect, useState } from "react"

export const useAuth = () => {
	const dispatch = useAppDispatch()
	const token = localStorage.getItem("accessToken")
	const { data: user, isError, isLoading } = useGetMeQuery(undefined, { skip: !token })
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

	useEffect(() => {
		if (!token) {
			setIsAuthenticated(false)
			return
		}

		if (isError) {
			setIsAuthenticated(false)
			return
		}

		if (user) {
			setIsAuthenticated(true)
			dispatch(setUser(user))
		}
	}, [user, isError, token, dispatch])

	return { isAuthenticated, isLoading }
}
