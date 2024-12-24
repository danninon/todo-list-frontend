import './TodoItem.css';
import { TodoItem as TodoItemType } from '../../interfaces/TodoItem';

interface TodoItemProps {
    todo: TodoItemType;
    handleDelete: (id: string) => void;
}

const TodoItem = ({ todo, handleDelete }: TodoItemProps) => {
    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="todo-item">
            <p className="todo-item__text">{todo.text}</p>
            <small className="todo-item__time">
                Added on: {todo.timeStamp ? formatDate(todo.timeStamp) : 'Unknown'}
            </small>
            <small className="todo-item__user">
                User Id: {todo.userId || 'Unknown'}
            </small>
            <button
                className="todo-item__delete"
                onClick={() => handleDelete(todo.id)}
            >
                DELETE
            </button>
        </div>
    );
};

export default TodoItem;
