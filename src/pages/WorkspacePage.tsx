import { type FC } from 'react';
import { useParams } from 'react-router';
import { WorkspaceBlock } from '@/widgets/WorkspaceBlock';

export const WorkspacePage: FC = () => {
	const { id } = useParams()
	if (!id) {
		return (
			<div>Не найден воркспейс с таким id</div>
		)
	}

	return (
		<>
			<WorkspaceBlock id={id} />
		</>
	);
};