import { useState } from "react"
import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { Building2, ChevronDown, Plus } from "lucide-react"
import {
	CollapsibleContent,
	CollapsibleTrigger,
	Collapsible,
} from "@/shared/ui/shadcn/collapsible"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from "@/shared/ui/shadcn/sidebar"
import { Spinner } from "@/shared/ui/shadcn/spinner"
import { useSidebar } from "@/shared/ui/shadcn/sidebar"
import { WorkspaceItem } from "./WorkspaceItem"
import type { IWorkspace } from "@/services/workspace/types/workspace"

interface IProps {
	title: string
	items: IWorkspace[] | undefined
	isLoading: boolean
	isError: boolean
	createElement?: {
		createTitle: string
		createAction: () => void
	}
}

export const WorkspaceList = ({ title, items, createElement, isLoading, isError }: IProps) => {
	const { t } = useTranslation()
	const { workspaceId } = useParams()
	const [open, setOpen] = useState(true)

	const { state: openSidebar, setOpen: setOpenSidebar } = useSidebar()

	const content = (() => {
		if (isLoading) {
			return (
				<SidebarMenuSubItem className="flex justify-center py-5">
					<Spinner />
				</SidebarMenuSubItem>
			)
		}

		if (isError) {
			return (
				<SidebarMenuSubItem>
					<div className="px-2 py-1 text-sm text-red-500 text-center">
						{t("workspace.error")}
					</div>
				</SidebarMenuSubItem>
			)
		}

		if (!items?.length) {
			return (
				<SidebarMenuSubItem>
					<div className="px-2 py-1 text-sm opacity-70 text-center">
						{t("workspace.empty")}
					</div>
				</SidebarMenuSubItem>
			)
		}

		return (
			<>
				{items.map((item) => (
					<WorkspaceItem key={item.id} item={item} isActive={item.id === workspaceId} />
				))}
			</>
		)
	})()

	return (
		<SidebarMenu>
			<Collapsible open={open} onOpenChange={setOpen}>
				<SidebarMenuItem>
					<CollapsibleTrigger
						asChild
						className="group"
						onClick={() => {
							if (openSidebar === 'collapsed') {
								setOpenSidebar(true)
							}
						}}
					>
						<SidebarMenuButton asChild>
							<button type="button">
								<Building2 className="size-5 shrink-0" />
								<span className="font-medium">{title}</span>

								<ChevronDown className="ml-auto transition-transform group-data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden" />
							</button>
						</SidebarMenuButton>
					</CollapsibleTrigger>

					<CollapsibleContent>
						<SidebarMenuSub>
							{content}

							{createElement && (
								<SidebarMenuSubItem>
									<SidebarMenuButton asChild>
										<button type="button" onClick={createElement.createAction}>
											<Plus className="size-5 shrink-0" />
											<span className="text-sm font-medium">{createElement.createTitle}</span>
										</button>
									</SidebarMenuButton>
								</SidebarMenuSubItem>
							)}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		</SidebarMenu>
	)
}
