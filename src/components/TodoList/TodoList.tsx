import './TodoList.css';
import TodoItem from '../TodoItem/TodoItem';
import { TodoItem as TodoItemType } from '../../interfaces/TodoItem';

interface TodoListProps {
    todos: TodoItemType[];
    handleDelete: (id: string) => void;
}

const TodoList = ({ todos, handleDelete }: TodoListProps) => {
    return (
        <div className="todo-list">
            {todos.map((item) => (
                <TodoItem
                    key={item.id}
                    todo={item}
                    handleDelete={handleDelete}
                />
            ))}
        </div>
    );
};

export default TodoList;
