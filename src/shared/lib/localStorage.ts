export const setTokenToLs = (token: string) => {
	localStorage.setItem('accessToken', token)
}

export const getTokenFromLs = () => {
	localStorage.getItem('accessToken')
}