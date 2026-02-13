import { useAppDispatch } from "./redux";
import { workspaceApi } from "@/services/workspace/api/workspaceApi";

export const useUpdateWorkspaceActivity = (workspaceId: string | undefined) => {
   const dispatch = useAppDispatch();

   const handleUpdateWorkspaceActivity = () => {
      if (!workspaceId) return;

      dispatch(
         workspaceApi.util.invalidateTags([
            { type: "WorkspaceActivity", id: workspaceId },
         ]),
      );
   };

   return {
      handleUpdateWorkspaceActivity,
   };
};
