import { type FC } from 'react';
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/ui/shadcn/form"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/ui/shadcn/card"
import { Input } from "@/shared/ui/shadcn/input"
import { Button } from "@/shared/ui/shadcn/button"
import { useLogin } from '../hooks/useLogin';

const formSchema = z.object({
	email: z.string().trim().email({ message: "Введите корректный email" }),
	password: z.string().min(6, { message: "Пароль должен быть минимум 6 символов" }),
})

type FormValues = z.infer<typeof formSchema>

interface IAuthLoginProps {
	setHaveAccount: () => void
}

export const AuthLogin: FC<IAuthLoginProps> = ({ setHaveAccount }) => {
	const { handleLogin } = useLogin()
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	})

	const onSubmit = (values: FormValues) => {
		handleLogin(values)
	}

	return (
		<Card className='w-[350px]'>
			<CardHeader>
				<CardTitle className='text-center text-xl'>Вход</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="you@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<Input type="password" placeholder="******" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							Войти
						</Button>
						<div className="text-right">
							<span className="mr-2">Нет аккаунта?</span>
							<button
								type="button"
								onClick={setHaveAccount}
								className="underline"
							>
								Регистрация
							</button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
