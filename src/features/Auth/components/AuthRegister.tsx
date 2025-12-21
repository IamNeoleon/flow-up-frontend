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
} from "@/shared/ui/form"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { useRegister } from '../hooks/useRegister';

const formSchema = z.object({
	email: z
		.string()
		.trim()
		.pipe(z.email({ message: "Введите корректный email" })),
	username: z
		.string()
		.min(4, { message: "Имя пользователя должно быть минимум 6 символов" })
		.max(12, { message: "Максимальная длина имени пользователя — 32 символа" }),
	password: z
		.string()
		.min(6, { message: "Пароль должен быть минимум 6 символов" })
		.max(32, { message: "Максимальная длина пароля — 32 символа" }),
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	path: ["confirmPassword"],
	message: "Пароли не совпадают",
})

type FormValues = z.infer<typeof formSchema>

interface IAuthRegisterProps {
	setHaveAccount: () => void
}


export const AuthRegister: FC<IAuthRegisterProps> = ({ setHaveAccount }) => {
	const { handleRegister } = useRegister()
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		},
	})

	const onSubmit = async (values: FormValues) => {
		await handleRegister({
			email: values.email,
			username: values.username,
			password: values.password
		})
	}

	return (
		<>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='text-center text-xl'>Register</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col gap-3'
						>
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
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Имя пользователя</FormLabel>
										<FormControl>
											<Input placeholder="alex mason" {...field} />
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
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Подтверждение пароля</FormLabel>
										<FormControl>
											<Input type="password" placeholder="******" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Создать аккаунт
							</Button>
							<div className="text-right">
								<span className="mr-2">Уже есть аккаунт?</span>
								<button
									type="button"
									onClick={setHaveAccount}
									className="underline"
								>
									Вход
								</button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</>
	);
};