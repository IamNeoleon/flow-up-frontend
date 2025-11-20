import { type ReactNode } from "react"

export interface ModalOptions {
	id?: string
	content: ReactNode
	title?: string,
	description?: string
	size?: "sm" | "md" | "lg" | "xl" | "full"
	onClose?: () => void
}

export interface ModalInstance extends ModalOptions {
	id: string
}
