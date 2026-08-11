import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import { Label } from '@/shared/ui/shadcn/label';
import { Badge } from '@/shared/ui/shadcn/badge';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/shadcn/select';

import { cn } from '@/shared/utils/cn';
import { useCreateTaskMutation } from '../api/hooks';
import { createTaskSchema } from '../schemas/create-task.schema';

import type { CreateTaskFormValues } from '../schemas/create-task.schema';
import { useGetFilteredColumns } from '@/widgets/task-table/hooks/use-get-filtered-columns';

interface IProps {
    close: () => void;
    boardId: string;
    colId?: string;
    withColumnChoice: boolean;
}

export const CreateTask = ({
    close,
    boardId,
    colId,
    withColumnChoice = false,
}: IProps) => {
    const { t } = useTranslation();
    const [create] = useCreateTaskMutation();

    const { columns, todoCols, inProgressCols, doneCols } =
        useGetFilteredColumns(boardId);

    const [selectedColId, setSelectedColId] = useState<string | undefined>(
        colId,
    );

    useEffect(() => {
        if (!selectedColId && columns?.length) {
            setSelectedColId(columns[0].id);
        }
    }, [columns, selectedColId]);

    const selectedColumn = columns?.find(
        (column) => column.id === selectedColId,
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(createTaskSchema),
        mode: 'onChange',
    });

    const handleCreateTask = async (data: CreateTaskFormValues) => {
        if (!selectedColId) {
            toast.error(t('task.columnRequired'));
            return;
        }

        const toastId = toast.loading(t('task.createLoading'));

        close();

        try {
            await create({
                boardId,
                colId: selectedColId,
                body: data,
            }).unwrap();

            toast.success(t('task.createSuccess'), {
                id: toastId,
            });
        } catch {
            toast.error(t('task.createError'), {
                id: toastId,
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleCreateTask)}
            className="flex flex-col gap-2"
        >
            <div>
                <Label className="mb-1.5">{t('task.taskName')}</Label>

                <Input
                    {...register('name')}
                    placeholder={t('task.createPlaceholder')}
                    className={cn(errors.name?.message && 'border-destructive')}
                />

                {errors.name && (
                    <p className="text-destructive mt-1 text-sm">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {withColumnChoice && (
                <div>
                    <Label className="mb-1.5">
                        {t('taskList.selectColumn')}
                    </Label>

                    <Select
                        value={selectedColId}
                        onValueChange={setSelectedColId}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue>
                                {selectedColumn && (
                                    <Badge
                                        style={{
                                            backgroundColor:
                                                selectedColumn.color,
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <span className="text-white">
                                            {selectedColumn.name}
                                        </span>
                                    </Badge>
                                )}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            {todoCols.length > 0 && (
                                <SelectGroup>
                                    <SelectLabel>
                                        {t('column.todo')}
                                    </SelectLabel>

                                    {todoCols.map((col) => (
                                        <SelectItem key={col.id} value={col.id}>
                                            <Badge
                                                style={{
                                                    backgroundColor: col.color,
                                                }}
                                                className="flex items-center gap-1"
                                            >
                                                <span className="text-white">
                                                    {col.name}
                                                </span>
                                            </Badge>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            )}

                            {inProgressCols.length > 0 && (
                                <SelectGroup>
                                    <SelectLabel>
                                        {t('column.inProgress')}
                                    </SelectLabel>

                                    {inProgressCols.map((col) => (
                                        <SelectItem key={col.id} value={col.id}>
                                            <Badge
                                                style={{
                                                    backgroundColor: col.color,
                                                }}
                                                className="flex items-center gap-1"
                                            >
                                                <span className="text-white">
                                                    {col.name}
                                                </span>
                                            </Badge>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            )}

                            {doneCols.length > 0 && (
                                <SelectGroup>
                                    <SelectLabel>
                                        {t('column.done')}
                                    </SelectLabel>

                                    {doneCols.map((col) => (
                                        <SelectItem key={col.id} value={col.id}>
                                            <Badge
                                                style={{
                                                    backgroundColor: col.color,
                                                }}
                                                className="flex items-center gap-1"
                                            >
                                                <span className="text-white">
                                                    {col.name}
                                                </span>
                                            </Badge>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <Button
                className="mt-4 w-full"
                type="submit"
                disabled={isSubmitting || !selectedColId}
            >
                {t('task.create')}
            </Button>
        </form>
    );
};
