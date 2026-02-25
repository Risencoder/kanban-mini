import { useMemo, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type Task = {
  id: string;
  title: string;
};

export type ColumnId = "todo" | "doing" | "done";
type ColumnsType = Record<ColumnId, Task[]>;

const COLUMN_TITLES: Record<ColumnId, string> = {
  todo: "ЗАВДАННЯ",
  doing: "РОБИТИ",
  done: "ГОТОВО",
};

const initialData: ColumnsType = {
  todo: [
    { id: "1", title: "Вивчіть React" },
    { id: "2", title: "Створіть Канбан" },
  ],
  doing: [{ id: "3", title: "Практикуйте англійську" }],
  done: [{ id: "4", title: "Встановити вузол" }],
};

function uid() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Board() {
  const [columns, setColumns] = useLocalStorage<ColumnsType>("kanban.columns.v1", initialData);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const columnOrder = useMemo<ColumnId[]>(() => ["todo", "doing", "done"], []);

  function addTask() {
    const title = newTaskTitle.trim();
    if (!title) return;

    const task: Task = { id: uid(), title };

    setColumns((prev) => ({
      ...prev,
      todo: [...prev.todo, task],
    }));

    setNewTaskTitle("");
  }

  function deleteTask(id: string) {
    setColumns((prev) => ({
      todo: prev.todo.filter((t) => t.id !== id),
      doing: prev.doing.filter((t) => t.id !== id),
      done: prev.done.filter((t) => t.id !== id),
    }));
  }

  function findColumnByTaskId(taskId: string, state: ColumnsType): ColumnId | null {
    for (const col of columnOrder) {
      if (state[col].some((t) => t.id === taskId)) return col;
    }
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setColumns((prev) => {
      const sourceCol = findColumnByTaskId(activeId, prev);
      if (!sourceCol) return prev;

      // якщо кинули на колонку — беремо columnId з over.data
      const overData = over.data.current as unknown as
        | { type?: string; columnId?: string }
        | undefined;

      const targetCol =
        overData?.type === "column"
          ? (String(overData.columnId) as ColumnId)
          : findColumnByTaskId(overId, prev);

      if (!targetCol) return prev;
      if (sourceCol === targetCol) return prev;

      const movedTask = prev[sourceCol].find((t) => t.id === activeId);
      if (!movedTask) return prev;

      return {
        ...prev,
        [sourceCol]: prev[sourceCol].filter((t) => t.id !== activeId),
        [targetCol]: [...prev[targetCol], movedTask],
      };
    });
  }

  return (
    <div className="app">
      <h1 className="h1">Дошка Канбан</h1>

      <div className="toolbar">
        <input
          className="input"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Нове завдання..."
        />

        <button className="btn" onClick={addTask}>
          Додати
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="board">
          {columnOrder.map((colId) => (
            <Column
              key={colId}
              id={colId}
              title={COLUMN_TITLES[colId]}
              tasks={columns[colId]}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}