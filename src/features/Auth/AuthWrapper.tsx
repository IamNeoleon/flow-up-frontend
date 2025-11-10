import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RegisterBlock } from "./ui/RegisterBlock";
import { LoginBlock } from "./ui/LoginBlock";
import { useLogin } from "./hooks/useLogin";
import { useRegister } from "./hooks/useRegister";
import { Toast } from "@/components/Toast";

export const AuthWrapper = () => {
   const [haveAccount, setHaveAccount] = useState<boolean>(false)

   const { handleLogin, isLoading: isLoadingLogin, isError: isErrorLogin } = useLogin()
   const { handleRegister, isLoading: isLoadingRegister, isError: isErrorRegister } = useRegister()

   return (
      <>
         <AnimatePresence mode="wait" initial={false}>
            {
               haveAccount ? (
                  <motion.div
                     key="login"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.2 }}
                  >
                     <LoginBlock setHaveAccount={() => setHaveAccount(false)} onClick={handleLogin} />
                  </motion.div>
               ) : (
                  <motion.div
                     key="register"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.2 }}
                  >
                     <RegisterBlock setHaveAccount={() => setHaveAccount(true)} onClick={handleRegister} />
                  </motion.div>
               )
            }
         </AnimatePresence>
         <Toast title="Toast 1asdasdasd" type="success" />
      </>
   );
};
