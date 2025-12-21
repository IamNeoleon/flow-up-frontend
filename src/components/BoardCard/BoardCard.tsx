import { type FC } from 'react';
import {
	Card,
	CardContent,
	CardTitle,
} from "@/shared/ui/card"
import { Link } from 'react-router';

interface IBoardCardProps {
	id: string,
	title: string,
}

export const BoardCard: FC<IBoardCardProps> = ({ id, title }) => {
	return (
		<>
			<Card className='max-w-[250px] p-5'>
				<CardContent className='px-0'>
					<div>
						<img className='block max-w-full rounded-xl' src="https://placehold.co/250x200" alt="" />
					</div>
					<CardTitle className='mt-2'>{title}</CardTitle>
				</CardContent>
			</Card>
		</>
	);
};