import { createContext, useContext, useState, type ReactNode } from 'react'
import { Toast } from '@/components/Toast'

interface ToastData {
	id: string
	title: string
	description?: string
	type: 'success' | 'info' | 'error'
}

interface ToastContextValue {
	toast: (data: Omit<ToastData, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<ToastData[]>([])

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}

	const toast = (data: Omit<ToastData, 'id'>) => {
		const id = crypto.randomUUID()
		setToasts((prev) => [...prev, { ...data, id }])

		setTimeout(() => removeToast(id), 5000)
	}

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div className="fixed bottom-5 right-5 flex flex-col gap-3 z-[9999]">
				{toasts.map((t) => (
					<Toast
						key={t.id}
						title={t.title}
						description={t.description}
						type={t.type}
						onClose={() => removeToast(t.id)}
					/>
				))}
			</div>
		</ToastContext.Provider>
	)
}

export const useToast = () => {
	const context = useContext(ToastContext)
	if (!context) throw new Error('useToast must be used within <ToastProvider>')
	return context.toast
}
