import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/shadcn/dialog";
import { createContext, useContext, useState, type ReactNode } from "react";

interface IModalOptions {
	title: string,
	description: string,
	content: ReactNode
}

interface IModalContext {
	open: (modalOptions: IModalOptions) => void
	close: () => void
}

const ModalContext = createContext<IModalContext | null>(null)

export const useModal = () => {
	const ctx = useContext(ModalContext)
	if (!ctx) throw new Error("useModal must be used inside ModalProvider")
	return ctx
}

// Modal provider

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [modalOptions, setModalOptions] = useState<IModalOptions | null>(null)

	const open = (modalOptions: IModalOptions) => {
		setModalOptions({ ...modalOptions })
		setIsOpen(true)
	}

	const close = () => {
		setIsOpen(false)
		setModalOptions(null)
	}

	return (
		<ModalContext.Provider value={{ open, close }}>
			{children}
			<Dialog open={isOpen} onOpenChange={(state) => { if (!state) close() }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{modalOptions?.title}</DialogTitle>
						<DialogDescription>
							{modalOptions?.description}
						</DialogDescription>
					</DialogHeader>
					{modalOptions?.content}
				</DialogContent>
			</Dialog>
		</ModalContext.Provider>
	)
}