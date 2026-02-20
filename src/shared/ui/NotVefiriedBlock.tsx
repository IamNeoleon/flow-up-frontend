import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { MailWarning, X } from "lucide-react";

export const NotVerifiedBlock = () => {
   const { t } = useTranslation()

   const [visible, setVisible] = useState(true);

   if (!visible) return null;

   return (
      <div className="
            fixed top-1 left-1/2 -translate-x-1/2 right-0 z-1000 
             flex items-center justify-between gap-3 
            bg-amber-500 px-4 py-2.5 text-white shadow-md
            rounded-sm 
         "
      >
         <div className="flex items-center gap-2 text-sm font-medium">
            <MailWarning size={22} />
            <div>
               <p>{t('auth.notVerifiedTitle')}</p>
               <Link to='auth/confirm-email' className="underline underline-offset-4 hover:text-white/80">{t('auth.notVerifiedFollow')}</Link>
            </div>
         </div>
         <button
            onClick={() => setVisible(false)}
            className="rounded p-0.5 hover:bg-amber-600 transition-colors"
         >
            <X size={22} />
         </button>
      </div>
   );
};