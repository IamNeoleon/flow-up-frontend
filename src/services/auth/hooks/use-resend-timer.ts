import { useEffect, useState } from "react";

export const useResendTimer = (seconds = 60) => {
   const [timeLeft, setTimeLeft] = useState(seconds);

   useEffect(() => {
      if (timeLeft === 0) return;
      const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(id);
   }, [timeLeft]);

   const reset = () => setTimeLeft(seconds);

   return { timeLeft, canResend: timeLeft === 0, reset };
};