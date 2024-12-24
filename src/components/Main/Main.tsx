import { useState, useEffect } from "react";
import Nav from "../Nav/Nav.tsx";
import StatusIndicator from "../StatusIndicator/StatusIndicator.tsx";
import TodoForm from "../TodoForm/TodoForm.tsx";
import TodoList from "../TodoList/TodoList.tsx";
import { useOnlineStatus } from "../../hooks/useOnlineStatus.ts";
import { useSocket } from "../../hooks/useSocket.ts";
import { isTokenExpired } from "../../utils/tokenUtils.ts";
import { Builder } from "xml2js";
import { TodoItem } from "../../interfaces/TodoItem.ts";
import './Main.css';

function Main({ token }: { token: string }) {
    const [todoInput, setTodoInput] = useState("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [localTodos, setLocalTodos] = useState<TodoItem[]>([]);
    const [localDeletions, setLocalDeletions] = useState<TodoItem[]>([]);
    const [isServerConnected, setIsServerConnected] = useState(false);
    const isOffline = useOnlineStatus();
    const socket = useSocket(
        token,
        setTodoList,
        setIsServerConnected,
        isOffline
    );

    const handleAddTodo = (newTodo: TodoItem) => {
        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
        }

        const builder = new Builder();
        const xmlPayload = builder.buildObject({
            todo: { text: newTodo.text, timestamp: newTodo.timeStamp },
        });

        if (!socket || isOffline || !isServerConnected) {
            setLocalTodos((prev) => [...prev, newTodo]);
            setTodoList((prev) => [...prev, newTodo]);
            alert("Added to local todos. Will sync when online.");
            return;
        }

        socket.emit("addTodo", xmlPayload, (response: { error?: string }) => {
            if (response?.error) {
                setLocalTodos((prev) => [...prev, newTodo]);
                alert(`Failed to add todo: ${response.error}`);
            }
        });
    };

    const handleDelete = (todoId: string) => {
        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
        }

        const builder = new Builder();
        const xmlPayload = builder.buildObject({
            todo: { id: todoId },
        });

        if (!socket || isOffline || !isServerConnected) {
            const todoToDelete = [...todoList, ...localTodos].find((todo) => todo.id === todoId);
            if (todoToDelete) {
                setLocalDeletions((prev) => [...prev, todoToDelete]);
                setTodoList((prev) => prev.filter((todo) => todo.id !== todoId));
                setLocalTodos((prev) => prev.filter((todo) => todo.id !== todoId));
            }
            alert("Marked for deletion locally. Will sync when online.");
            return;
        }

        socket.emit("deleteTodo", xmlPayload, (response: { error?: string }) => {
            if (response?.error) {
                alert(`Failed to delete todo: ${response.error}`);
            }
        });
    };


    useEffect(() => {

        if (!isOffline && isServerConnected && socket) {
            const builder = new Builder();


            localTodos.forEach((todo) => {
                const xmlPayload = builder.buildObject({
                    todo: { text: todo.text, timestamp: todo.timeStamp },
                });

                socket.emit("addTodo", xmlPayload, (response: { error?: string }) => {
                    if (response?.error) {
                        console.error(`Failed to sync todo: ${response.error}`);
                    } else {
                        console.log(`Todo synced successfully: ${todo.id}`);
                    }
                });
            });


            localDeletions.forEach((todo) => {
                const xmlPayload = builder.buildObject({
                    todo: { id: todo.id },
                });

                socket.emit("deleteTodo", xmlPayload, (response: { error?: string }) => {
                    if (response?.error) {
                        console.error(`Failed to sync delete: ${response.error}`);
                    } else {
                        console.log(`Todo deleted successfully: ${todo.id}`);
                    }
                });
            });

            if(localTodos.length){
                setLocalTodos([]);
            }
            if (localDeletions.length){
                setLocalDeletions([]);
            }

        }
    }, [isOffline, isServerConnected, localTodos, localDeletions, socket]);

    return (
        <div className="main">
            <Nav />
            <StatusIndicator
                isOffline={isOffline || !isServerConnected}
            />
            <TodoForm
                todoInput={todoInput}
                setTodoInput={setTodoInput}
                handleAddTodo={handleAddTodo}
            />
            <TodoList
                todos={todoList}
                handleDelete={handleDelete}
            />
        </div>
    );
}

export default Main;
