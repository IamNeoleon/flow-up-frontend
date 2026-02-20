import { useTranslation } from "react-i18next";
import { useResendTimer } from "../hooks/use-resend-timer";

interface IProps {
   resetReq: () => void;
}

export const ResendBtn = ({ resetReq }: IProps) => {
   const { t } = useTranslation()

   const { timeLeft, canResend, reset } = useResendTimer(60);

   const handleResend = () => {
      if (!canResend) return;
      reset()
      resetReq();
   };

   return (
      <>
         <button onClick={handleResend} disabled={!canResend}>
            {canResend ? (
               <span className="text-foreground font-medium underline hover:text-foreground/80 transition-colors underline-offset-4">
                  {t('verifyPage.sendNewCode')}
               </span>
            ) : (
               <span className="text-muted-foreground">
                  {t('verifyPage.sendNewCode')} <span className="font-mono tabular-nums text-foreground/60">0:{String(timeLeft).padStart(2, "0")}</span>
               </span>
            )}
         </button>
      </>
   );
};
