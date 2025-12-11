import { useState, type FC } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AuthLogin } from "@/features/auth/ui/AuthLogin";
import { AuthRegister } from "@/features/auth/ui/AuthRegister";

export const AuthWrapper: FC = () => {
	const [haveAccount, setHaveAccount] = useState<boolean>(true)

	return (
		<>
			<div className="flex justify-center">
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
								<AuthLogin setHaveAccount={() => setHaveAccount(false)} />
							</motion.div>
						) : (
							<motion.div
								key="register"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.2 }}
							>
								<AuthRegister setHaveAccount={() => setHaveAccount(true)} />
							</motion.div>
						)
					}
				</AnimatePresence>
			</div>
		</>
	);
};
