import { type FC } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardTitle, } from "@/shared/ui/shadcn/card"
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';
import { formatActivityTime } from '../lib/formate-activity-time';

interface IBoardCardProps {
	id: string,
	title: string,
	image?: string,
	updatedAt: string
}

export const BoardCard: FC<IBoardCardProps> = ({ title, image, updatedAt }) => {
	const { t } = useTranslation()

	return (
		<>
			<Card
				className={cn(
					"min-w-[250px] overflow-hidden p-0",
					"bg-card text-card-foreground border border-border/60",
					"shadow-sm transition-all duration-150 ease-out",
					"hover:-translate-y-1 hover:shadow-md hover:border-primary/20",
					"focus-within:ring-2 focus-within:ring-ring/40 focus-within:ring-offset-2 focus-within:ring-offset-background",
					"dark:shadow-none dark:hover:border-primary/25"
				)}
			>
				<CardContent className="p-0">
					{image ? (
						<div className="aspect-250/175 overflow-hidden">
							<img
								className="h-full w-full object-cover transition-transform duration-200 ease-out hover:scale-[1.03]"
								src={image}
								alt=""
							/>
						</div>
					) : (
						<div className="aspect-250/175 bg-muted/60 flex items-center justify-center">
							<LayoutGrid className="size-10 text-muted-foreground" />
						</div>
					)}

					<div className="p-3">
						<CardTitle className="text-base font-semibold leading-tight truncate">
							{title}
						</CardTitle>

						<div className="mt-1 text-sm text-muted-foreground flex flex-col">
							<span>{t("common.updated")}:</span>
							<span className='italic'>{formatActivityTime(updatedAt)}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</>
	);
};
