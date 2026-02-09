import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar"
import { useGetMeQuery } from "../api/userApi";
import { Spinner } from "@/shared/ui/shadcn/spinner";
import { getErrorMessage } from "@/shared/utils/get-error-message";
import { getUserInitials } from "@/shared/utils/get-user-initials";
import { Camera } from "lucide-react";
import { Label } from "@/shared/ui/shadcn/label";
import { Input } from "@/shared/ui/shadcn/input";
import { Button } from "@/shared/ui/shadcn/button";
import {
   useCompleteUploadAvatarMutation,
   usePresignUploadAvatarMutation
} from "@/services/user/api/userApi";
import { useState } from "react";
import { isImage } from "@/shared/utils/is-image";
import { MAX_SIZE_AVATAR } from "@/services/user/constants/max-size-avatar";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface IUserProfileProps {
   close: () => void;
}

export const UserProfile = ({ close }: IUserProfileProps) => {
   const { t } = useTranslation()
   const { data: user, isLoading, isError, error } = useGetMeQuery()
   const [loading, setLoading] = useState(false);

   const [presignAvatar] = usePresignUploadAvatarMutation();
   const [completeAvatar] = useCompleteUploadAvatarMutation();

   const onChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0];

      if (!file) return;

      if (!isImage(file)) {
         toast.error(t("user.avatarNotImage"))

         return
      }

      if (file.size > MAX_SIZE_AVATAR) {
         toast.error(t("user.avatarTooLarge"))

         return
      }

      const mimeType = file.type || "application/octet-stream";

      try {
         setLoading(true);

         const presigned = await presignAvatar({ mimeType }).unwrap();

         const putRes = await fetch(presigned.uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": mimeType },
            body: file,
         });

         if (!putRes.ok) throw new Error(`upload failed: ${putRes.status}`);

         await completeAvatar({
            key: presigned.key
         }).unwrap();

         toast.success(t("user.avatarUpdateSuccess"))
      } catch (err) {
         console.error(err);
         toast.error(t("user.avatarUpdateError"));
      } finally {
         setLoading(false);
         e.currentTarget.value = "";
      }
   }

   if (isLoading) (
      <Spinner />
   )

   if (isError) (
      <div>{getErrorMessage(error)}</div>
   )

   if (!user) return <div>{t("user.notFound")}</div>

   return (
      <>
         <div className="flex justify-center gap-5">
            <div className="relative">
               <Avatar className="block w-20 h-20 relative">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{getUserInitials(user.username)}</AvatarFallback>
               </Avatar>
               <div className="absolute bottom-0 right-0">
                  <label className="flex transition-colors items-center justify-center w-6 h-6 rounded-full bg-blue-700 cursor-pointer hover:bg-blue-800">
                     <Camera size={16} color="#fff" />
                     <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onChangeAvatar}
                     />
                  </label>
               </div>
            </div>
         </div>
         <div className="flex flex-col gap-2">
            <div>
               <Label className="mb-1">{t("auth.username")}</Label>
               <Input value={user.username} disabled={true} />
            </div>
            <div>
               <Label className="mb-1">{t("auth.email")}</Label>
               <Input value={user.email} disabled={true} />
            </div>
         </div>
         <Button onClick={close}>{t("common.save")}</Button>
      </>
   );
};
