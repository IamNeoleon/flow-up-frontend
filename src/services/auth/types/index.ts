export interface IRegisterBody {
	email: string,
	username: string,
	password: string,
	fullName: string
}

export interface ILoginBody {
	email: string,
	password: string
}