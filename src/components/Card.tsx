import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "./Board";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
};

export default function Card({ task, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    borderRadius: 12,
    padding: 12,
    background: isDragging ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.10)",
    cursor: "grab",
    userSelect: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 600 }}>{task.title}</div>

        <button
          onClick={() => onDelete(task.id)}
          title="Delete"
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            background: "transparent",
            color: "rgba(255,255,255,0.85)",
            borderRadius: 10,
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}