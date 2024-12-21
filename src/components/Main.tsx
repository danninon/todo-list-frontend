import { FormEvent, useEffect, useState } from "react";
import Nav from "./Nav";
import { TodoItem } from "../interfaces/TodoItem";
import { Builder, parseStringPromise } from "xml2js";
import { io, Socket } from "socket.io-client";

function Main({ token }: { token: string }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [todoInput, setTodoInput] = useState("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]);
    const emptyTodosList = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +'<todos/>';

    const handleDelete = (todoId: string) => {
        if (!socket) return;
        console.log(`Todo item with id ${todoId} will be deleted.`);


        const builder = new Builder();
        const xmlPayload = builder.buildObject({
            todo: { id: todoId },
        });
        console.log("xmlPayload:", xmlPayload);
        socket.emit("deleteTodo", xmlPayload);
    };

    const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!socket) return;

        const builder = new Builder();
        const todoPayload = {
            todo: {
                text: todoInput,
                timestamp: new Date().toISOString(),
            },
        };
        const xmlPayload: string = builder.buildObject(todoPayload);
        socket.emit("addTodo", xmlPayload);

        setTodoInput(""); // Reset the input field
    };

    useEffect(() => {
        const newSocket = io("http://localhost:4000", {
            auth: { token },
        });
        setSocket(newSocket); // Set the socket instance

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });

        return () => {
            newSocket.disconnect(); // Ensure socket is disconnected on component unmount
        };
    }, [token]);

    useEffect(() => {
        if (socket) {
            socket.on("todos", async (xmlData: string) => {
                try {
                    console.log("Received XML data:", xmlData);

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
                    }
                } catch (error) {
                    console.error("Error parsing XML from WebSocket:", error);
                }
            });

            socket.emit("getTodos");

            return () => {
                socket.off("todos"); // Cleanup event listener
            };
        }
    }, [socket]);

    return (
        <div>
            <Nav />
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
