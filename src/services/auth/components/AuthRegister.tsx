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
import { useRegister } from '../hooks/useRegister';
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

const formSchema = z.object({
	email: z
		.string()
		.trim()
		.pipe(z.email({ message: i18n.t("errors.invalidEmail") })),
	username: z
		.string()
		.min(4, { message: i18n.t("errors.minLength", { count: 4 }) })
		.max(12, { message: i18n.t("errors.maxLength", { count: 12 }) }),
	password: z
		.string()
		.min(6, { message: i18n.t("errors.minLength", { count: 6 }) })
		.max(32, { message: i18n.t("errors.maxLength", { count: 32 }) }),
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	path: ["confirmPassword"],
	message: i18n.t("auth.passwordMismatch"),
})

type FormValues = z.infer<typeof formSchema>

interface IAuthRegisterProps {
	setHaveAccount: () => void
}


export const AuthRegister: FC<IAuthRegisterProps> = ({ setHaveAccount }) => {
	const { t } = useTranslation()
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
		try {
			await handleRegister({
				email: values.email,
				username: values.username,
				password: values.password
			})

			setHaveAccount()
		} catch (err) {
		}
	}

	return (
		<>
			<Card className='w-[350px]'>
				<CardHeader>
					<CardTitle className='text-center text-xl'>{t("auth.register")}</CardTitle>
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
										<FormLabel>{t("auth.email")}</FormLabel>
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
										<FormLabel>{t("auth.username")}</FormLabel>
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
										<FormLabel>{t("auth.password")}</FormLabel>
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
										<FormLabel>{t("auth.confirmPassword")}</FormLabel>
										<FormControl>
											<Input type="password" placeholder="******" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								{t("auth.createAccount")}
							</Button>
							<div className="text-right">
								<span className="mr-2">{t("auth.haveAccount")}</span>
								<button
									type="button"
									onClick={setHaveAccount}
									className="underline"
								>
									{t("auth.login")}
								</button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</>
	);
};
