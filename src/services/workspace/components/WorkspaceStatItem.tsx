import type { LucideIcon } from "lucide-react";
import { Progress } from "@/shared/ui/shadcn/progress";

interface IProps {
   icon: LucideIcon;
   progressValue: number;
   label: string;
}

export const WorkspaceStatItem = ({
   icon: Icon,
   progressValue,
   label,
}: IProps) => {
   return (
      <div className="p-5 border rounded-lg max-xl:col-span-full">
         <div className="flex items-center gap-3 mb-5">
            <Icon />
            <div className="text-xl max-xl:text-lg">{label}</div>
         </div>
         <Progress value={progressValue} />
      </div>
   );
};
