import { FormEvent } from "react";
import { TodoItem } from "../../interfaces/TodoItem.ts";
import './TodoForm.css';

function TodoForm({
                      todoInput,
                      setTodoInput,
                      handleAddTodo,
                  }: {
    todoInput: string;
    setTodoInput: (value: string) => void;
    handleAddTodo: (newTodo: TodoItem) => void;
}) {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTodo: TodoItem = {
            id: `${Date.now()}`,
            text: todoInput,
            timeStamp: new Date().toISOString(),
            userId: "local-user",
        };
        handleAddTodo(newTodo);
        setTodoInput("");
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                className="todo-form__input"
                required
            />
            <button className="todo-form__button">ADD TODO</button>
        </form>
    );
}

export default TodoForm;
