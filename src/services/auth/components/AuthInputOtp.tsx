import { Field } from "@/shared/ui/shadcn/field"
import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/shared/ui/shadcn/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"

interface IProps {
   setValue: (v: string) => void
}

export const AuthInputOtp = ({ setValue }: IProps) => {
   return (
      <>
         <Field className="w-fit mx-auto">
            <InputOTP
               maxLength={6}
               pattern={REGEXP_ONLY_DIGITS}
               onComplete={(value) => setValue(value)}
            >
               <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
               </InputOTPGroup>
            </InputOTP>
         </Field>
      </>
   );
};
