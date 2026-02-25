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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "card cardDrag" : "card"}
    >
      <div className="cardRow">
        {/* Drag handle */}
        <div className="handle" {...listeners} {...attributes} title="Drag">
          {task.title}
        </div>

        {/* Delete */}
        <button
          type="button"
          className="iconBtn"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}