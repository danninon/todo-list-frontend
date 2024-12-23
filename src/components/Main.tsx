import {FormEvent, useEffect, useState} from "react";
import Nav from "./Nav";
import {TodoItem} from "../interfaces/TodoItem";
import {Builder, parseStringPromise} from "xml2js";
import {io, Socket} from "socket.io-client";
import {jwtDecode} from "jwt-decode";
import config from "../config/default";

function Main({token}: { token: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [todoInput, setTodoInput] = useState("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const emptyTodosList = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + '<todos/>';

    const isTokenExpired = (token: string): boolean => {
        const decoded: { exp: number } = jwtDecode(token);
        console.log("decoded: ", decoded);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    };


    const handleDelete = (todoId: string) => {
        if (!socket) return;
        console.log(`Todo item with id ${todoId} will be deleted.`);

        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
        }
        const builder = new Builder();
        const xmlPayload = builder.buildObject({
            todo: {id: todoId},
        });
        console.log("xmlPayload:", xmlPayload);
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
        if (!socket) return;

        if (isTokenExpired(token)) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            window.location.href = "/";
            return;
        }

        const builder = new Builder();
        const todoPayload = {
            todo: {
                text: todoInput,
                timestamp: new Date().toISOString(),
            },
        };
        const xmlPayload: string = builder.buildObject(todoPayload);
        try {
            socket.emit("addTodo", xmlPayload, (response: { error?: string }) => {
                if (response?.error) {
                    alert(`Failed to add todo: ${response.error}`);
                }
            });
            setTodoInput(""); // Reset the input field only if the request is successful
        } catch (err) {
            console.error("Error sending addTodo request:", err);
            alert("An unexpected error occurred while adding the todo. Please try again.");
        }
    };

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
        setSocket(newSocket); // Set the socket instance

        newSocket.on("error", (errorResponse: string) => {
            console.error("Error received from server:", errorResponse);
            alert(`Server error: ${errorResponse}`); // Display the error to the user
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
            alert("Failed to connect to the server. Please check your network or try again later."); // User-friendly feedback
        });

        return () => {
            newSocket.disconnect(); // Ensure socket is disconnected on component unmount
        };
    }, [token]);

    useEffect(() => {
        if (socket) {
            if (isTokenExpired(token)) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                window.location.href = "/";
                return;
            }

            socket.on("todos", async (xmlData: string) => {
                try {
                    console.log("Received XML db:", xmlData);

                    console.log(xmlData);
                    if (xmlData === emptyTodosList) {
                        setTodoList([]); // Set an empty todo list
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
                        console.error("Invalid XML structure");
                        alert("Failed to load todos: Invalid response from server.");
                    }
                } catch (error) {
                    console.error("Error parsing XML from WebSocket:", error);
                    alert("Failed to load todos: Could not parse the server response.");
                }
            });

            socket.emit("getTodos", (response: { error?: string }) => {
                if (response?.error) {
                    console.error("Error fetching todos:", response.error);
                    alert(`Error fetching todos: ${response.error}`);
                }
            });

            return () => {
                socket.off("todos"); // Cleanup event listener
            };
        }
    }, [socket]);

    return (
        <div>
            <Nav/>
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
                {todoList.map((item) => (
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
