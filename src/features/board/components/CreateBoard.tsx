import { useState, type FC, type FormEvent } from 'react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { useCreateBoardMutation } from '@/features/board/api/boardApi';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { toast } from 'sonner';

export const CreateBoard: FC<{ close: () => void, workspaceId: string }> = ({ close, workspaceId }) => {
	const [create, { isLoading }] = useCreateBoardMutation()
	const [boardData, setBoardData] = useState<{ name: string, description: string }>({
		name: '',
		description: '',
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setBoardData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		try {
			await create({ workspaceId, ...boardData }).unwrap()
			toast.success('Успешное создание')
			close()
		} catch {
			toast.error('Ошибка при создании')
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
				<Input name='name' onChange={handleChange} required value={boardData?.name} placeholder='Введите название доски' />
				<Input name='description' onChange={handleChange} required value={boardData?.description} placeholder='Добавьте описание' />
				<Button className='w-full' type='submit'>{isLoading ? <Spinner /> : 'Создать'}</Button>
			</form>
		</>
	);
};