import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import type { Task, ColumnId } from "./Board";

type Props = {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
};

export default function Column({ id, title, tasks, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id, // ID колонки
    data: { type: "column", columnId: id },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 320,
        minHeight: 420,
        borderRadius: 14,
        padding: 14,
        background: isOver ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, letterSpacing: 0.5 }}>{title}</div>
        <div style={{ opacity: 0.7 }}>{tasks.length}</div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {tasks.length === 0 ? (
          <div
            style={{
              opacity: 0.55,
              padding: 12,
              borderRadius: 12,
              border: "1px dashed rgba(255,255,255,0.18)",
            }}
          >
            Перетягни сюди задачу
          </div>
        ) : (
          tasks.map((task) => <Card key={task.id} task={task} onDelete={onDelete} />)
        )}
      </div>
    </div>
  );
}