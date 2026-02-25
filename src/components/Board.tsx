import { useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import Column from "./Column";

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

export default function Board() {
  const [columns, setColumns] = useLocalStorage<ColumnsType>("kanban.columns.v1", initialData);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const columnOrder = useMemo<ColumnId[]>(() => ["todo", "doing", "done"], []);

  function addTask() {
    const title = newTaskTitle.trim();
    if (!title) return;

    const task: Task = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      title,
    };

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

  function findColumnByTaskId(taskId: string): ColumnId | null {
    for (const col of columnOrder) {
      if (columns[col].some((t) => t.id === taskId)) return col;
    }
    return null;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = findColumnByTaskId(activeId);
    if (!sourceCol) return;

    // Визначаємо ціль:
    // - якщо кинули на колонку, беремо columnId з data
    // - якщо кинули на картку, шукаємо колонку по id картки
    const overData = over.data.current as unknown as
      | { type?: string; columnId?: string }
      | undefined;

    const targetCol =
      overData?.type === "column"
        ? (overData.columnId as ColumnId)
        : (findColumnByTaskId(overId) as ColumnId | null);

    if (!targetCol) return;
    if (sourceCol === targetCol) return;

    const movedTask = columns[sourceCol].find((t) => t.id === activeId);
    if (!movedTask) return;

    setColumns((prev) => ({
      ...prev,
      [sourceCol]: prev[sourceCol].filter((t) => t.id !== activeId),
      [targetCol]: [...prev[targetCol], movedTask],
    }));
  }

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 48, margin: "0 0 24px 0" }}>Дошка Канбан</h1>

      {/* Add task */}
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="Нове завдання..."
          style={{
            flex: 1,
            maxWidth: 420,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            outline: "none",
          }}
        />

        <button
          onClick={addTask}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Додати
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 18 }}>
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