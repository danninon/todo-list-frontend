import { TodoItem } from "../interfaces/TodoItem";
import { formatDate } from "../utils/dateUtils";

function TodoList({
                      todos,
                      handleDelete,
                  }: {
    todos: TodoItem[];
    handleDelete: (id: string) => void;
}) {
    return (
        <div className="todo__container">
            {todos.map((item) => (
                <div className="todo__item" key={item.id}>
                    <p>{item.text}</p>
                    <small className="todo__time">
                        Added on: {item.timeStamp ? formatDate(item.timeStamp) : "Unknown"}
                    </small>
                    <small className="todo__user_id">
                        User Id: {item.userId ? item.userId : "Unknown"}
                    </small>
                    <button
                        className="deleteBtn"
                        onClick={() => handleDelete(item.id)}
                    >
                        DELETE
                    </button>
                </div>
            ))}
        </div>
    );
}

export default TodoList;
