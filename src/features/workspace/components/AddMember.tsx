import { useState, type FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui/shadcn/select"
import type { TWorkspaceRole } from '../types/workspace-role';
import { CopyLinkInput } from '@/shared/ui/CopyLinkInput';
import { Button } from '@/shared/ui/shadcn/button';
import { useAddMemberMutation } from '@/features/workspace/api/workspaceApi';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { useTranslation } from 'react-i18next';

export const AddMember: FC<{ close: () => void, workspaceId: string }> = ({ workspaceId }) => {
	const { t } = useTranslation()
	const [role, setRole] = useState<TWorkspaceRole>('MEMBER')
	const [addMember, { data, isLoading }] = useAddMemberMutation()

	const handleAddMember = () => {
		if (!data) {
			addMember({ role, id: workspaceId })
		}
	}

	return (
		<>
			<div className=''>
				<Tabs defaultValue="link" className="">
					<TabsList className='w-full mb-1'>
						<TabsTrigger value="link">{t("workspace.inviteLinkTab")}</TabsTrigger>
						{/* <TabsTrigger value="friends">Друзья</TabsTrigger> */}
					</TabsList>
					<TabsContent value="link">
						<Select value={role} onValueChange={(value: TWorkspaceRole) => setRole(value)}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder={t("workspace.selectRolePlaceholder")} />
							</SelectTrigger>
							<SelectContent className='text-lg'>
								<SelectItem value="MEMBER">{t("workspaceRole.member")}</SelectItem>
								<SelectItem value="EDITOR">{t("workspaceRole.editor")}</SelectItem>
							</SelectContent>
						</Select>
						<div className='mt-2'>
							<CopyLinkInput link={data?.inviteUrl ? `${data.inviteUrl}` : t("workspace.inviteLinkPlaceholder")} />
						</div>
						<Button disabled={data ? true : false} onClick={handleAddMember} className='mt-3 w-full'>
							{
								isLoading ? (
									<Spinner />
								) : (
									<span>{t("workspace.generateInviteLink")}</span>
								)
							}
						</Button>
					</TabsContent>
					<TabsContent value="friends">Change your password here.</TabsContent>
				</Tabs>
			</div>
		</>
	);
};
