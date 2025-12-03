import { useEffect, useState, useCallback } from "react"
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	exp: number;
}

const isTokenExpired = (token: string | null) => {
	if (!token) return true;

	try {
		const decoded = jwtDecode<JwtPayload>(token);
		const now = Date.now() / 1000;

		return decoded.exp < now;
	} catch (e) {
		return true;
	}
};


export const useAuth = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	const checkToken = useCallback(() => {
		const token = localStorage.getItem("accessToken")
		if (!token || isTokenExpired(token)) {
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
