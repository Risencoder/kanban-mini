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
    id,
    data: { type: "column", columnId: id },
  });

  return (
    <div ref={setNodeRef} className={isOver ? "col colOver" : "col"}>
      <div className="colHead">
        <div className="colTitle">{title}</div>
        <div className="badge">{tasks.length}</div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {tasks.length === 0 ? (
          <div className="empty">Перетягни сюди задачу</div>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} task={task} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}