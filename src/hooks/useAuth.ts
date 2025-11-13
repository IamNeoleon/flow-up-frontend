import { useEffect, useState, useCallback } from "react"

export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true) // добавляем загрузку

	const checkToken = useCallback(() => {
		const token = localStorage.getItem("accessToken")
		if (!token) {
			setIsAuthenticated(false)
			setIsLoading(false)
		} else {
			setIsAuthenticated(true)
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		checkToken()
	}, [])

	return { isAuthenticated, isLoading }
}
