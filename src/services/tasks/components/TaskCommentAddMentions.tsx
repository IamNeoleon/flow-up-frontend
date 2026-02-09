import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/shadcn/avatar";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetWorkspaceMembersQuery } from "@/services/workspace/api/workspaceApi";
import { getUserInitials } from "@/shared/utils/get-user-initials";

interface Props {
   mentionQuery: string | null;
   onPick: (username: string) => void;

   selectedIndex: number;
   setSelectedIndex: (i: number) => void;

   onListChange: (usernames: string[]) => void;
}

export const TaskCommentAddMentions = ({
   mentionQuery,
   onPick,
   selectedIndex,
   setSelectedIndex,
   onListChange,
}: Props) => {
   const { workspaceId } = useParams();
   const { data: members = [], isLoading } = useGetWorkspaceMembersQuery(workspaceId ?? skipToken);

   useEffect(() => {
      if (mentionQuery === null || isLoading || members.length === 0) {
         onListChange([]);
         return;
      }

      const q = mentionQuery.toLowerCase();
      const list = members
         .filter((m) => m.user.username.toLowerCase().startsWith(q))
         .slice(0, 8)
         .map((m) => m.user.username);

      onListChange(list);

      if (selectedIndex > list.length - 1) setSelectedIndex(0);
   }, [mentionQuery, isLoading, members, onListChange, selectedIndex, setSelectedIndex]);

   if (mentionQuery === null || isLoading || members.length === 0) return null;

   const q = mentionQuery.toLowerCase();
   const filtered = members
      .filter((m) => m.user.username.toLowerCase().startsWith(q))
      .slice(0, 8);

   if (filtered.length === 0) return null;

   return (
      <div className="absolute left-0 top-full z-50 bg-muted border rounded shadow w-full max-h-48 overflow-y-auto">
         {filtered.map((member, idx) => (
            <div
               key={member.id}
               onMouseDown={(e) => e.preventDefault()}
               onMouseEnter={() => setSelectedIndex(idx)}
               onClick={() => onPick(member.user.username)}
               className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm ${idx === selectedIndex ? "bg-accent" : "hover:bg-accent"
                  }`}
            >
               <Avatar className="w-7 h-7">
                  <AvatarImage src={member.user.avatar} />
                  <AvatarFallback>{getUserInitials(member.user.username)}</AvatarFallback>
               </Avatar>
               <div>
                  <div className="font-medium leading-4">{member.user.fullName}</div>
                  <div className="text-xs text-muted-foreground font-medium">@{member.user.username}</div>
               </div>
            </div>
         ))}
      </div>
   );
};
