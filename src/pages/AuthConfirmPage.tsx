import { useSendCodeMutation, useVerifyCodeMutation } from "@/services/auth/api/authApi";
import { AuthInputOtp } from "@/services/auth/components/AuthInputOtp";
import { ResendBtn } from "@/services/auth/components/ResendBtn";
import { PageControls } from "@/shared/ui/PageControls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const AuthConfirmPage = () => {
   const { t } = useTranslation()

   const [sendCode] = useSendCodeMutation()
   const [verifyCode] = useVerifyCodeMutation()

   const [otpCode, setOtpCode] = useState("");

   const handleSendCode = async () => {
      try {
         await sendCode().unwrap()
      } catch (error) {
         toast.error('Error send code')
      }
   }

   const handleVerifyCode = async (otpCode: string) => {
      try {
         await verifyCode({ code: otpCode }).unwrap()
      } catch (error) {
         toast.error('Error verify code')
      }
   }

   useEffect(() => {
      if (otpCode) {
         handleVerifyCode(otpCode)
      }
   }, [otpCode])

   useEffect(() => {
      handleSendCode()
   }, [])

   return (
      <div className="w-full flex justify-center items-center h-screen ">
         <Card className="w-full max-w-sm md:max-w-3xl shadow-xl gap-2">
            <CardHeader className="text-center">
               <CardTitle className="text-center text-2xl">{t('verifyPage.title')}</CardTitle>
               <CardDescription>
                  <p>{t('verifyPage.description')}</p>
                  <p>{t('verifyPage.enter')}:</p>
               </CardDescription>
            </CardHeader>
            <CardContent>
               <AuthInputOtp setValue={setOtpCode} />
               <div className="text-muted-foreground text-sm text-center pt-1">
                  <p>{t('verifyPage.keepOpen')}</p>
                  <p>{t('verifyPage.empty')}</p>
                  <ResendBtn resetReq={() => console.log('reset')} />
               </div>
            </CardContent>
         </Card>
         <PageControls />
      </div>
   );
};

export default AuthConfirmPage
