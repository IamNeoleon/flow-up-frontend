import { Check, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface IToastProps {
	title: string,
	type: 'success' | 'info' | 'error',
	description?: string,
	timeout?: number
}

export const Toast = ({ title, description, type, timeout }: IToastProps) => {
	let mainColor: string = '';
	let mainIcon: ReactNode;

	switch (type) {
		case 'success':
			mainColor = '#0d7d07'
			mainIcon = <Check width={14} />
			break;
		case "info":
			mainColor = '#2d60e5'
			mainIcon = <div>I</div>
			break;
		case "error":
			mainColor = '#d91414'
			mainIcon = <X width={14} />
			break;
	}

	return (
		<div className="absolute bottom-5 right-5 py-5 px-16 bg-[#e9f5e9] text-black">
			<div className="text-base font-medium ">{title}</div>
			<div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: mainColor }}></div>
			<div className="absolute top-3 left-3 w-5 h-5 rounded-full text-white" style={{ backgroundColor: mainColor }}>
				<div className='flex justify-center -translate-y-0.5'>
					{mainIcon}
				</div>
			</div>
		</div>
	)
}