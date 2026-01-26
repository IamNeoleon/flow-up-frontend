import { selectUser } from "@/store/slices/userSlice";
import { useAppSelector } from "../hooks/redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar"
import { getUserInitials } from "../utils/get-user-initials";
import { useTranslation } from "react-i18next";

interface IUserInfoProps {
   userId: string,
   role: string
   username: string,
   userAvatar: string
}

export const UserInfo = ({ userId, role, username, userAvatar }: IUserInfoProps) => {
   const currentUser = useAppSelector(selectUser)

   const { t } = useTranslation()

   return (
      <>
         <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
               <AvatarImage src={userAvatar ?? ''} />
               <AvatarFallback>{getUserInitials(username)}</AvatarFallback>
            </Avatar>
            <div>
               <div className="font-medium flex items-center gap-1">
                  <span>{username}</span>
                  <span>{currentUser?.id === userId && `(${t('common.you')})`}</span>
               </div>
               <div className="italic text-sm">{t(`workspaceRole.${role.toLowerCase()}`)}</div>
            </div>
         </div>
      </>
   );
};
