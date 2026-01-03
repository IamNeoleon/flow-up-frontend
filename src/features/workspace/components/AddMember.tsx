import { useState, type FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui/shadcn/select"
import type { TWorkspaceRole } from '@/shared/types/workspace.types';
import { CopyLinkInput } from '@/shared/ui/CopyLinkInput';
import { Button } from '@/shared/ui/shadcn/button';
import { useAddMemberMutation } from '@/api/endpoints/workspaceApi';
import { Spinner } from '@/shared/ui/shadcn/spinner';

export const AddMember: FC<{ close: () => void, workspaceId: string }> = ({ close, workspaceId }) => {
	const [role, setRole] = useState<TWorkspaceRole>('MEMBER')
	const [addMember, { data, isLoading }] = useAddMemberMutation()

	const handleAddMember = () => {
		addMember({ role, id: workspaceId })
	}

	return (
		<>
			<div className=''>
				<Tabs defaultValue="link" className="">
					<TabsList className='w-full mb-1'>
						<TabsTrigger value="link">Ссылка-приглашение</TabsTrigger>
						{/* <TabsTrigger value="friends">Друзья</TabsTrigger> */}
					</TabsList>
					<TabsContent value="link">
						<Select value={role} onValueChange={(value: TWorkspaceRole) => setRole(value)}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Выберите роль" />
							</SelectTrigger>
							<SelectContent className='text-lg'>
								<SelectItem value="MEMBER">Участник</SelectItem>
								<SelectItem value="EDITOR">Редактор</SelectItem>
							</SelectContent>
						</Select>
						<div className='mt-2'>
							<CopyLinkInput link={data?.inviteUrl ? `${data.inviteUrl}` : 'Ваша ссылка будет здесь'} />
						</div>
						<Button onClick={handleAddMember} className='mt-3 w-full'>
							{
								isLoading ? (
									<Spinner />
								) : (
									<span>Сгенирировать ссылку</span>
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