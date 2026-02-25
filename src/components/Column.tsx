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
    <div ref={setNodeRef} className={`col ${id} ${isOver ? "colOver" : ""}`}>
      <div className="colHead">
        <div className="colTitle">{title}</div>
        <div className="badge">{tasks.length}</div>
      </div>

      <div className="colBody">
        {tasks.length === 0 ? (
          <div className="empty">Drop a task here</div>
        ) : (
          tasks.map((task) => <Card key={task.id} task={task} onDelete={onDelete} />)
        )}
      </div>
    </div>
  );
}