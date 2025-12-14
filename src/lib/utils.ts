import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type SerializedError } from "@reduxjs/toolkit";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { type TWorkspaceRole } from '@/shared/types/workspace.types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getErrorMessage = (
	err: FetchBaseQueryError | SerializedError | undefined
) => {
	if (!err) return "Unknown error";

	// RTK Query HTTP error
	if ("status" in err) {
		if (typeof err.data === "string") return err.data;

		if (err.data && typeof err.data === "object" && "message" in err.data) {
			return (err.data as { message?: string }).message || "Unknown error";
		}

		return `Error ${err.status}`;
	}

	// JS / SerializedError
	if ("message" in err && err.message) return err.message;

	return "Unknown error";
};

export const getWorkspaceRole = (role: TWorkspaceRole) => {
	const map: Record<TWorkspaceRole, string> = {
		OWNER: 'Владелец',
		EDITOR: 'Администратор',
		MEMBER: 'Участник',
	}

	return map[role]
}

