import type { TWorkspaceIcon } from "@/features/workspace/types/workspace-icon";
import { WORKSPACE_ICON_MAP } from "@/features/workspace/constants/workspace-icon-map";

export const useGetIcon = (icon?: TWorkspaceIcon | null) => {
   return WORKSPACE_ICON_MAP[icon ?? "home"];
};
