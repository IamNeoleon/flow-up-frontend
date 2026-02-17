import { useChangeOrderMutation, useGetAllColumnsQuery } from "@/services/column/api/columnApi";
import type { IColumn } from "@/services/column/types/column";
import { useMoveTaskMutation } from "@/services/tasks/api/taskApi";
import type { ITaskPreview } from "@/services/tasks/types/task-preview";
import { PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import debounce from 'debounce';
import { toast } from "sonner";

interface ITaskPreviewWithColor extends ITaskPreview {
   color: string;
}

type TasksByColumn = Record<string, ITaskPreview[]>;

export const useDndBoard = (boardId: string | undefined) => {
   const { t } = useTranslation()
   const { data: columns, isLoading, isError, error } = useGetAllColumnsQuery(boardId ?? skipToken);

   const [activeTask, setActiveTask] = useState<ITaskPreviewWithColor | null>(null);
   const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);

   const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({});
   const [tasksByColumnSnapshot, setTasksByColumnSnapshot] = useState<TasksByColumn>({})

   const [localColumns, setLocalColumns] = useState<IColumn[]>([]);
   const [localColumnsSnapshot, setLocalColumnsSnapshot] = useState<IColumn[]>([]);

   const colIds = useMemo(() => localColumns.map((c) => c.id), [localColumns]);

   const [moveTask] = useMoveTaskMutation();
   const [changeOrderCol] = useChangeOrderMutation();

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
   );

   const debouncedOnDragOver = useRef(
      debounce((event: DragOverEvent) => {
         console.log('Call')
         const { active, over } = event;
         if (!over) return;

         const activeId = active.id;
         const overId = over.id;

         if (activeId === overId) return;

         const isActiveATask = active.data.current?.type === "Task";
         if (!isActiveATask) return;

         const isOverATask = over.data.current?.type === "Task";
         const isOverAColumn = over.data.current?.type === "Column";

         if (isOverATask) {
            setTasksByColumn(prev => {
               const sourceColId = Object.keys(prev).find(colId =>
                  prev[colId].some(t => t.id === activeId)
               );
               if (!sourceColId) return prev;

               const targetColId = Object.keys(prev).find(colId =>
                  prev[colId].some(t => t.id === overId)
               );
               if (!targetColId) return prev;

               const source = [...prev[sourceColId]];
               const target = sourceColId === targetColId ? source : [...prev[targetColId]];

               const activeIndex = source.findIndex(t => t.id === activeId);
               const overIndex = target.findIndex(t => t.id === overId);

               if (activeIndex === -1 || overIndex === -1) return prev;

               const [moved] = source.splice(activeIndex, 1);

               if (sourceColId === targetColId) {
                  source.splice(overIndex, 0, moved);
                  const normalized = source.map((t, i) => ({ ...t, order: i + 1, }));
                  return { ...prev, [sourceColId]: normalized };
               }

               target.splice(overIndex, 0, moved);

               return {
                  ...prev,
                  [sourceColId]: source.map((t, i) => ({ ...t, order: i + 1 })),
                  [targetColId]: target.map((t, i) => ({ ...t, order: i + 1 })),
               };
            });
         }

         if (isOverAColumn) {
            setTasksByColumn(prev => {
               const sourceColId = Object.keys(prev).find(colId =>
                  prev[colId].some(t => t.id === activeId)
               );
               if (!sourceColId) return prev;

               const targetColId = String(overId);
               if (!prev[targetColId] || sourceColId === targetColId) return prev;

               const source = [...prev[sourceColId]];
               const target = [...prev[targetColId]];

               const activeIndex = source.findIndex(t => t.id === activeId);
               if (activeIndex === -1) return prev;

               const [moved] = source.splice(activeIndex, 1);
               target.push(moved);

               return {
                  ...prev,
                  [sourceColId]: source.map((t, i) => ({ ...t, order: i + 1 })),
                  [targetColId]: target.map((t, i) => ({ ...t, order: i + 1 })),
               };
            });
         }
      }, 250)
   ).current;

   const onDragOver = useCallback((event: DragOverEvent) => {
      debouncedOnDragOver(event);
   }, [debouncedOnDragOver]);

   const onDragStart = (event: DragStartEvent) => {
      const data = event.active.data.current;
      if (!data) return;
      if (data.type === "Task") {
         setActiveTask({ ...data.task, color: data.taskColor })

         setTasksByColumnSnapshot(tasksByColumn)
      }
      if (data.type === "Column") {
         setActiveColumn(data.column);

         setLocalColumnsSnapshot(localColumns)
      }
   };

   const onDragEnd = async (event: DragEndEvent) => {
      if (!boardId) return;

      const { active, over } = event;

      setActiveTask(null);
      setActiveColumn(null);

      if (!over) return;

      if (active.data.current?.type === "Task") {
         const taskId = String(active.id);
         const sourceColId = active.data.current.task.colId;

         const targetColId = Object.keys(tasksByColumn).find(colId =>
            tasksByColumn[colId].some(t => t.id === taskId)
         );
         if (!targetColId) return;

         const columnTasks = tasksByColumn[targetColId];
         const newIndex = columnTasks.findIndex(t => t.id === taskId);
         if (newIndex === -1) return;

         const newOrder = newIndex + 1;

         if (sourceColId === targetColId && newOrder === active.data.current.task.order) {
            return;
         }

         try {
            await moveTask({
               boardId,
               colId: sourceColId,
               targetColId,
               taskId,
               newOrder,
            }).unwrap();
         } catch {
            toast.error(t("task.moveTaskError"));

            setTasksByColumn(tasksByColumnSnapshot)
         }

         return;
      }

      if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
         const oldIndex = localColumns.findIndex(c => c.id === active.id);
         const newIndex = localColumns.findIndex(c => c.id === over.id);

         if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

         setLocalColumns(prev => {
            const reordered = arrayMove(prev, oldIndex, newIndex)
               .map((c, i) => ({ ...c, order: i + 1 }));

            return reordered;
         });

         try {
            await changeOrderCol({
               boardId,
               colId: active.id as string,
               newOrder: newIndex + 1,
            }).unwrap()
         } catch (error) {
            toast.error(t("column.moveColumnError"))

            setLocalColumns(localColumnsSnapshot)
         }
      }
   };

   useEffect(() => {
      if (!columns) return;

      const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
      setLocalColumns(sortedColumns);

      const grouped: TasksByColumn = {};
      sortedColumns.forEach(col => {
         grouped[col.id] = [...col.tasks].sort((a, b) => a.order - b.order);
      });
      setTasksByColumn(grouped);
   }, [columns]);

   useEffect(() => {
      return () => {
         debouncedOnDragOver.clear?.();
      };
   }, [debouncedOnDragOver]);

   return {
      isLoading,
      isError,
      localColumns,
      tasksByColumn,
      error,
      onDragStart,
      onDragOver,
      onDragEnd,
      columns,
      activeTask,
      activeColumn,
      colIds,
      sensors
   }
}