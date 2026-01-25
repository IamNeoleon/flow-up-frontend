export const setTokenToLs = (token: string) => {
	localStorage.setItem('accessToken', token)
}

export const getTokenFromLs = () => {
	return localStorage.getItem('accessToken')
}