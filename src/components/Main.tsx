import { FormEvent, useEffect, useState } from "react";
import Nav from "./Nav";
import { TodoItem } from "../interfaces/TodoItem";
import { Builder, parseStringPromise } from "xml2js";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import config from "../config/default";

function Main({ token }: { token: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [todoInput, setTodoInput] = useState("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const [localTodos, setLocalTodos] = useState<TodoItem[]>([]); // Local todos for offline mode
    const [isOffline, setIsOffline] = useState(!navigator.onLine); // Track online/offline status
    const emptyTodosList =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + "<todos/>";

    // Check if token is expired
    const isTokenExpired = (token: string): boolean => {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    };

    const handleDelete = (todoId: string) => {
        if (!socket) return;

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

        try {
            socket.emit("deleteTodo", xmlPayload, (response: { error?: string }) => {
                if (response?.error) {
                    alert(`Failed to delete todo: ${response.error}`);
                }
            });
        } catch (err) {
            console.error("Error sending deleteTodo request:", err);
            alert("An unexpected error occurred while deleting the todo. Please try again.");
        }
    };

    const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newTodo: TodoItem = {
            id: `${Date.now()}`, // Temporary unique ID
            text: todoInput,
            timeStamp: new Date().toISOString(),
            userId: "local-user", // Replace with actual user ID
        };

        if (!socket || isOffline) {
            // Offline mode or server is unreachable
            setLocalTodos((prev) => [...prev, newTodo]); // Add to offline list
            alert("Added to local todos. Will sync when online.");
        } else {
            // Online: Send directly to the server
            const builder = new Builder();
            const xmlPayload = builder.buildObject({
                todo: { text: newTodo.text, timestamp: newTodo.timeStamp },
            });

            try {
                socket.emit("addTodo", xmlPayload, (response: { error?: string }) => {
                    if (response?.error) {
                        // Add back to local todos if server fails
                        setLocalTodos((prev) => [...prev, newTodo]);
                        alert(`Failed to add todo: ${response.error}`);
                    }
                });
            } catch (err) {
                console.error("Error sending addTodo request:", err);
                // Add back to local todos if the emit fails
                setLocalTodos((prev) => [...prev, newTodo]);
                alert("Failed to connect to the server. Added to local todos.");
            }
        }

        setTodoInput(""); // Reset input field
    };


    // Initialize online/offline listeners
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Initialize socket connection
    useEffect(() => {
        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
        }

        const newSocket = io(config.socketBaseUrl, {
            auth: { token },
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to the server");
            setIsOffline(false); // Mark as online when connected
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from the server");
            setIsOffline(true); // Mark as offline when disconnected
        });

        newSocket.on("error", (errorResponse: string) => {
            console.error("Error received from server:", errorResponse);
            alert(`Server error: ${errorResponse}`);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);

            // Switch to offline mode on connection error
            // if (!isOffline) {
            //     setIsOffline(true);
            //     alert("Server connection lost. Switching to offline mode.");
            // }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    // Sync local todos when online
    useEffect(() => {
        if (!isOffline && localTodos.length > 0) {
            localTodos.forEach((todo) => {
                const builder = new Builder();
                const xmlPayload = builder.buildObject({
                    todo: { text: todo.text, timestamp: todo.timeStamp },
                });

                socket?.emit("addTodo", xmlPayload, (response: { error?: string }) => {
                    if (response?.error) {
                        console.error(`Failed to sync todo: ${response.error}`);
                    } else {
                        console.log(`Todo synced successfully: ${todo.id}`);
                    }
                });
            });

            setLocalTodos([]); // Clear local todos after syncing
        }
    }, [isOffline, localTodos, socket]);

    // Fetch todos from server
    useEffect(() => {
        if (socket) {
            socket.on("todos", async (xmlData: string) => {
                try {
                    if (xmlData === emptyTodosList) {
                        setTodoList([]);
                        return;
                    }

                    const parsedData = await parseStringPromise(xmlData, {
                        explicitArray: false,
                    });

                    if (parsedData.todos && parsedData.todos.todo) {
                        const todos = Array.isArray(parsedData.todos.todo)
                            ? parsedData.todos.todo
                            : [parsedData.todos.todo];
                        setTodoList(todos);
                    } else {
                        alert("Failed to load todos: Invalid response from server.");
                    }
                } catch (error) {
                    alert("Failed to load todos: Could not parse the server response.");
                }
            });

            socket.emit("getTodos");

            return () => {
                socket.off("todos");
            };
        }
    }, [socket]);

    return (
        <div>
            <Nav/>
            <div className="status-indicator">
                <button className={`status-button ${isOffline ? "offline" : "online"}`}>
                    {isOffline ? "Offline" : "Online"}
                </button>
            </div>
            <form className="form" onSubmit={handleAddTodo}>
                <input
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    className="input"
                    required
                />
                <button className="form__cta">ADD TODO</button>
            </form>
            <div className="todo__container">
                {[...todoList, ...localTodos].map((item) => (
                    <div className="todo__item" key={item.id}>
                        <p>{item.text}</p>
                        <small className="todo__time">
                            Added on: {item.timeStamp ? formatDate(item.timeStamp) : "Unknown"}
                        </small>
                        <small className="todo__user_id">
                            User Id: {item.userId ? item.userId : "Unknown"}
                        </small>
                        <div>
                            <button
                                className="deleteBtn"
                                onClick={() => handleDelete(item.id)}
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}

const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
};

export default Main;
