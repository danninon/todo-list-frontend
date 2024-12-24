import { FormEvent } from "react";
import { TodoItem } from "../interfaces/TodoItem";

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
        <form className="form" onSubmit={handleSubmit}>
            <input
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                className="input"
                required
            />
            <button className="form__cta">ADD TODO</button>
        </form>
    );
}

export default TodoForm;
