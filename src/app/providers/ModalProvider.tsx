import {
	createContext,
	useContext,
	useState,
	type ReactNode,
	useCallback,
} from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { type ModalInstance, type ModalOptions } from "@/@types/modal.types"
import { nanoid } from "nanoid"

interface ModalContextType {
	open: (options: Omit<ModalOptions, "id">) => string
	close: (id: string) => void
	closeAll: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [modals, setModals] = useState<ModalInstance[]>([])

	const open = useCallback((options: Omit<ModalOptions, "id">) => {
		const id = nanoid()
		setModals((prev) => [...prev, { ...options, id }])
		return id
	}, [])

	const close = useCallback((id: string) => {
		setModals((prev) => prev.filter((m) => m.id !== id))
	}, [])

	const closeAll = useCallback(() => {
		setModals([])
	}, [])

	return (
		<ModalContext.Provider value={{ open, close, closeAll }}>
			{children}

			{modals.map((modal) => (
				<Dialog
					key={modal.id}
					open={true}
					onOpenChange={(state) => {
						if (!state) close(modal.id)
					}}
				>
					<DialogContent className={sizeToClass(modal.size)}>
						{modal.title && (
							<DialogHeader>
								<DialogTitle>{modal.title}</DialogTitle>
								<DialogDescription>{modal.description}</DialogDescription>
							</DialogHeader>
						)}
						{modal.content}
					</DialogContent>
				</Dialog>
			))}
		</ModalContext.Provider>
	)
}

export const useModal = () => {
	const ctx = useContext(ModalContext)
	if (!ctx) throw new Error("useModal must be used inside ModalProvider")
	return ctx
}

function sizeToClass(size?: ModalOptions["size"]) {
	switch (size) {
		case "sm": return "max-w-sm"
		case "md": return "max-w-md"
		case "lg": return "max-w-lg"
		case "xl": return "max-w-2xl"
		case "full": return "max-w-[90vw]"
		default: return "max-w-md"
	}
}
