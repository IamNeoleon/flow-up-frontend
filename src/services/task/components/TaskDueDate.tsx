import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '@/shared/ui/shadcn/calendar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu';
import { ValuePicker } from '@/shared/ui/ValuePicker';
import { formatDate } from '@/shared/utils/formate-date';

interface IProps {
    dueDate: string | undefined;
    setDueDate: (value: Date | undefined) => void;
    showLabel?: boolean;
}

export const TaskDueDate = ({ dueDate, setDueDate, showLabel }: IProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const endOfDay = (d: Date | undefined) => {
        if (!d) return;

        const x = new Date(d);
        x.setHours(23, 59, 59, 999);
        return x;
    };

    const onSelect = (value: Date | undefined) => {
        setOpen(false);
        setDueDate(endOfDay(value));
    };

    return (
        <div>
            {showLabel && (
                <div className="mb-1 flex items-center gap-1 text-base font-medium text-[#ada9a3]">
                    <CalendarIcon width={18} />
                    <span>{t('task.dueDate')}</span>
                </div>
            )}
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <div>
                        <ValuePicker>
                            {dueDate && (
                                <div className="text-md">
                                    {formatDate(dueDate)}
                                </div>
                            )}
                        </ValuePicker>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <Calendar
                        required={false}
                        mode="single"
                        onSelect={(value) => onSelect(value)}
                        selected={dueDate ? new Date(dueDate) : new Date()}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
