import { type FC } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardTitle, } from "@/shared/ui/shadcn/card"

interface IBoardCardProps {
	id: string,
	title: string,
	image?: string
}

export const BoardCard: FC<IBoardCardProps> = ({ title, image }) => {
	return (
		<>
			<Card className='min-w-[250px] p-0 hover:-translate-y-1 transition-transform shadow-md'>
				<CardContent className='px-0 py-0'>
					{
						image ? (
							<div>
								<img className='block max-w-full rounded-t-lg aspect-250/175 object-cover' src={image} alt="" />
							</div>
						) : (
							<div className="aspect-250/175 rounded-lg bg-muted flex items-center justify-center">
								<LayoutGrid className="size-10 text-muted-foreground" />
							</div>
						)
					}
					<div className='p-3'>
						<CardTitle className='text-lg capitalize text-ellipsis overflow-hidden'>{title}</CardTitle>
						<div className='text-sm text-muted-foreground mt-1'>Обновлен 2 дня назад</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};