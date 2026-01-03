import { type FC } from 'react';
import {
	Card,
	CardContent,
	CardTitle,
} from "@/shared/ui/shadcn/card"
import img from '@/assets/img/1.jpg'

interface IBoardCardProps {
	id: string,
	title: string,
}

export const BoardCard: FC<IBoardCardProps> = ({ id, title }) => {
	return (
		<>
			<Card className='max-w-[250px] p-0 hover:-translate-y-1 transition-transform shadow-md'>
				<CardContent className='px-0 py-0'>
					<div>
						<img className='block max-w-full rounded-t-xl aspect-250/175 object-cover' src={img} alt="" />
					</div>
					<div className='p-3'>
						<CardTitle className='text-lg capitalize text-ellipsis overflow-hidden'>{title}</CardTitle>
						<div className='text-sm text-muted-foreground mt-1'>Обновлен 2 дня назад</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};