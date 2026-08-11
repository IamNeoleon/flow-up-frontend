import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import image from '@/assets/images/auth.png';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent } from '@/shared/ui/shadcn/card';
import { FieldSeparator } from '@/shared/ui/shadcn/field';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/shadcn/form';
import { Input } from '@/shared/ui/shadcn/input';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { cn } from '@/shared/utils/cn';
import { getErrorMessage } from '@/shared/utils/get-error-message';
import { useRegisterMutation } from '../api/hooks';
import { GOOGLE_LOGIN_URL } from '../constants/google-login-url';
import { registerSchema } from '../schemas/register-schema';

import type { TRegisterFormValues } from '../schemas/register-schema';

interface IProps {
    setHaveAccount: () => void;
    className?: string;
}

export const AuthRegister = ({ setHaveAccount, className }: IProps) => {
    const { t } = useTranslation();
    const [register, { error, isLoading }] = useRegisterMutation();

    const form = useForm<TRegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: TRegisterFormValues) => {
        try {
            await register({
                body: {
                    fullName: values.fullName,
                    email: values.email,
                    username: values.username,
                    password: values.password,
                },
            }).unwrap();

            toast.success(t('auth.registerSuccess'));

            setHaveAccount();
        } catch (err) {
            toast.error(
                `${t('auth.registerError')}: ${getErrorMessage(error)}`,
            );
        }

    };

    const loginGoogle = () => {
        window.location.href = GOOGLE_LOGIN_URL;
    };

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <Card className="overflow-hidden p-0 shadow-xl">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 p-6 md:p-8"
                        >
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    {t('auth.register')}
                                </h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    {t('auth.registerDescription', {
                                        defaultValue:
                                            'Enter your details below to create your account',
                                    })}
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t('auth.fullName')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Jonh Doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('auth.email')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john_doe@example.com"
                                                {...field}
                                            />
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
                                        <FormLabel>
                                            {t('auth.username')}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="john_doe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t('auth.password')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
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
                                            <FormLabel>
                                                {t('auth.confirmPassword')}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <p className="text-muted-foreground -mt-2 text-xs">
                                {t('auth.passwordHint', {
                                    defaultValue:
                                        'Must be at least 8 characters long.',
                                })}
                            </p>

                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="w-full"
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    t('auth.createAccount')
                                )}
                            </Button>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                {t('auth.orContinue')}
                            </FieldSeparator>

                            <Button
                                onClick={loginGoogle}
                                variant="outline"
                                type="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                <span className="sr-only">
                                    {t('auth.google')}
                                </span>
                            </Button>
                            <div className="text-center text-sm">
                                <span className="text-muted-foreground mr-1">
                                    {t('auth.haveAccount')}
                                </span>
                                <button
                                    type="button"
                                    onClick={setHaveAccount}
                                    className="underline underline-offset-4"
                                >
                                    {t('auth.signIn')}
                                </button>
                            </div>
                        </form>
                    </Form>

                    <div className="bg-muted relative hidden md:block">
                        <img
                            src={image}
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-90"
                        />
                    </div>
                </CardContent>
            </Card>

            <p className="text-muted-foreground px-6 text-center text-xs">
                {t('auth.termsPrefix', {
                    defaultValue: 'By clicking continue, you agree to our',
                })}{' '}
                <a
                    href="#"
                    className="hover:text-primary underline underline-offset-4"
                >
                    {t('auth.termsOfService', {
                        defaultValue: 'Terms of Service',
                    })}
                </a>{' '}
                {t('auth.and', { defaultValue: 'and' })}{' '}
                <a
                    href="#"
                    className="hover:text-primary underline underline-offset-4"
                >
                    {t('auth.privacyPolicy', {
                        defaultValue: 'Privacy Policy',
                    })}
                </a>
                .
            </p>
        </div>
    );
};
