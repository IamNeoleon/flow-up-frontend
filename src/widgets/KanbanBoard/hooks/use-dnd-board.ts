import { useChangeOrderMutation, useGetAllColumnsQuery } from "@/services/column/api/columnApi";
import type { IColumn } from "@/services/column/types/column";
import { useMoveTaskMutation } from "@/services/tasks/api/taskApi";
import type { ITaskPreview } from "@/services/tasks/types/task-preview";
import { PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ITaskPreviewWithColor extends ITaskPreview {
   color: string;
}

export const useDndBoard = (boardId: string | undefined) => {
   const { t } = useTranslation()

   const { data: columns, isLoading, isError, error } = useGetAllColumnsQuery(boardId ?? skipToken);

   const [moveTask] = useMoveTaskMutation();
   const [changeOrderCol] = useChangeOrderMutation();

   const [activeTask, setActiveTask] = useState<ITaskPreviewWithColor | null>(null);
   const [activeColumn, setActiveColumn] = useState<IColumn | null>(null);

   const [tasks, setTasks] = useState<ITaskPreview[]>([]);
   const [localColumns, setLocalColumns] = useState<IColumn[]>([]);

   const taskFromCol = useRef<string | null>(null);
   const taskOrderSnapshot = useRef<ITaskPreview[]>([]);

   const colIds = useMemo(() => localColumns.map((c) => c.id), [localColumns]);

   const tasksByColumn = useMemo(() => {
      const map: Record<string, ITaskPreview[]> = {};
      for (const task of tasks) {
         if (!map[task.colId]) map[task.colId] = [];
         map[task.colId].push(task);
      }
      Object.keys(map).forEach((key) => {
         map[key].sort((a, b) => a.order - b.order);
      });
      return map;
   }, [tasks]);

   const recalculateTaskOrders = useCallback((allTasks: ITaskPreview[], affectedColIds: string[]) => {
      const result = [...allTasks];
      affectedColIds.forEach((colId) => {
         const colTasksWithIndices = result
            .map((task, index) => ({ task, index }))
            .filter(({ task }) => task.colId === colId);
         colTasksWithIndices.forEach(({ index }, position) => {
            result[index] = { ...result[index], order: position + 1 };
         });
      });
      return result;
   }, []);

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
   );

   // Drag Events

   const onDragStart = useCallback((event: DragStartEvent) => {
      const data = event.active.data.current;
      if (!data) return;

      if (data.type === "Task") {
         setActiveTask({
            ...data.task,
            color: data.taskColor
         });
         taskFromCol.current = data.task.colId;
         taskOrderSnapshot.current = [...tasks];
      }

      if (data.type === "Column") {
         setActiveColumn(data.column);
      }
   }, [tasks]);

   const onDragOver = useCallback((event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id === over.id) return;

      const activeData = active.data.current;
      const overData = over.data.current;

      if (activeData?.type === "Task") {
         const isOverTask = overData?.type === "Task";
         const isOverColumn = overData?.type === "Column";
         if (!isOverTask && !isOverColumn) return;

         setTasks((prevTasks) => {
            const activeTask = prevTasks.find((t) => t.id === active.id);
            if (!activeTask) return prevTasks;

            const activeIndex = prevTasks.findIndex((t) => t.id === active.id);

            if (isOverTask) {
               const overTask = prevTasks.find((t) => t.id === over.id);
               if (!overTask) return prevTasks;
               const overIndex = prevTasks.findIndex((t) => t.id === over.id);

               if (activeTask.colId !== overTask.colId) {
                  const tasksWithoutActive = prevTasks.filter((t) => t.id !== active.id);
                  const newOverIndex = tasksWithoutActive.findIndex((t) => t.id === over.id);
                  tasksWithoutActive.splice(newOverIndex, 0, { ...activeTask, colId: overTask.colId });
                  return recalculateTaskOrders(tasksWithoutActive, [activeTask.colId, overTask.colId]);
               }

               if (activeIndex === overIndex) return prevTasks;
               return recalculateTaskOrders(arrayMove(prevTasks, activeIndex, overIndex), [activeTask.colId]);
            }

            if (isOverColumn) {
               const overColId = over.id as string;
               if (activeTask.colId === overColId) return prevTasks;

               const tasksWithoutActive = prevTasks.filter((t) => t.id !== active.id);
               const targetColTasks = tasksWithoutActive.filter((t) => t.colId === overColId);
               const updatedTask = { ...activeTask, colId: overColId };

               if (targetColTasks.length === 0) {
                  tasksWithoutActive.push(updatedTask);
               } else {
                  const lastIndex = tasksWithoutActive.findIndex((t) => t.id === targetColTasks[targetColTasks.length - 1].id);
                  tasksWithoutActive.splice(lastIndex + 1, 0, updatedTask);
               }

               return recalculateTaskOrders(tasksWithoutActive, [activeTask.colId, overColId]);
            }

            return prevTasks;
         });
      }
   }, [recalculateTaskOrders]);

   const onDragEnd = useCallback(async (event: DragEndEvent) => {
      if (!boardId) return

      const { active, over } = event;

      setActiveTask(null);
      setActiveColumn(null);

      if (!over) {
         if (taskOrderSnapshot.current.length > 0) {
            setTasks(taskOrderSnapshot.current);
            taskOrderSnapshot.current = [];
         }
         taskFromCol.current = null;
         return;
      }

      if (active.data.current?.type === "Column" && over.data.current?.type === "Column") {
         const oldIndex = localColumns.findIndex((c) => c.id === active.id);
         const newIndex = localColumns.findIndex((c) => c.id === over.id);
         if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

         setLocalColumns((prev) => {
            const reordered = arrayMove(prev, oldIndex, newIndex).map((c, i) => ({ ...c, order: i + 1 }));

            changeOrderCol({
               boardId,
               colId: active.id as string,
               newOrder: newIndex + 1,
            }).catch(() => toast.error(t("column.moveColumnError")));

            return reordered;
         });

         return;
      }

      if (active.data.current?.type === "Task") {
         const taskId = active.id as string;
         const updatedTask = tasks.find((t) => t.id === taskId);
         const originalColId = taskFromCol.current;

         if (updatedTask && originalColId) {
            try {
               await moveTask({
                  taskId,
                  colId: originalColId,
                  targetColId: updatedTask.colId,
                  boardId,
                  newOrder: updatedTask.order,
               }).unwrap();

               toast.success(t("column.moveTaskSuccess"));
            } catch {
               toast.error(t("column.moveTaskError"));
               setTasks(taskOrderSnapshot.current);
            }
         }

         taskFromCol.current = null;
         taskOrderSnapshot.current = [];
      }
   }, [localColumns, tasks, boardId, changeOrderCol, moveTask]);


   useEffect(() => {
      if (!columns) return;

      setLocalColumns((prev) => {
         if (prev.length === 0) return [...columns].sort((a, b) => a.order - b.order);
         return prev;
      });

      const allTasks: ITaskPreview[] = [];
      columns.forEach((col) => allTasks.push(...col.tasks));
      setTasks(allTasks);
   }, [columns]);

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