import { useState, type FC } from 'react';
import { Input } from "@/shared/ui/shadcn/input"
import { Button } from "@/shared/ui/shadcn/button"
import { Copy, Check } from "lucide-react"

export const CopyLinkInput: FC<{ link: string }> = ({ link }) => {
	const [copied, setCopied] = useState(false)

	const copy = async () => {
		await navigator.clipboard.writeText(link)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<>
			<div className="flex gap-2">
				<Input
					value={link}
					readOnly
					tabIndex={-1}
					className="
						text-lg
						select-all
						focus-visible:ring-0
						focus-visible:ring-offset-0
						focus-visible:outline-none
  					"
				/>

				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={copy}
				>
					{copied ? <Check /> : <Copy />}
				</Button>
			</div>
		</>
	);
};