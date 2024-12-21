import { useEffect, useState } from "react";
import Nav from "./Nav";
import {useNavigate} from "react-router-dom";
import {TodoItem} from "../interfaces/TodoItem.ts";
import {TodoItemPayload} from "../interfaces/TodoItemPayload.ts";



function Main({ socket }) {
    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]); // Type `todoList` as an array of `TodoItem`
    const navigate = useNavigate();

    // Generates a random string as the todo ID
    // const generateID = () => Math.random().toString(36).substring(2, 10);

    const handleDelete = (todoId: string) => {
        console.log(`Todo item with id ${todoId} will be deleted.`);
        socket.emit("deleteTodo", { id: todoId }); // Emit the delete event to the backend
    };

    const handleAddTodo = (e) => {
        e.preventDefault();

        const todoPayload: TodoItemPayload = {
            text: todo, // Use the `todo` state as the `text`
            timestamp: new Date().toISOString(), // Use ISO 8601 format for clarity
        };

        socket.emit("addTodo", todoPayload);

        setTodo("");
    };

    // Emit "registerUser" when the component mounts
    useEffect(() => {
        console.log(`socket.id inside Main: ${socket.id}`);
        console.log("first use effect");
        if (!socket) {
            console.error("Socket is not defined.");
            return;
        }

        const token = localStorage.getItem("token");
        // const isValidToken = token? fetch() : false;

        socket.emit("registerUser", token);
        console.log("registerUser emitted with token:", token);



    }, [socket, navigate]);

    // Fetch todos and set up socket listener for "todos" event
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await fetch("http://localhost:4000/api");
                const data: TodoItem[] = await response.json(); // Expect the response to be an array of `TodoItem`
                setTodoList(data);
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };

        fetchTodos();

        if (socket) {
            socket.on("todos", (data: TodoItem[]) => {
                setTodoList(data);
                console.log("Todos received:", data);
            });

            // Cleanup the listener
            return () => {
                socket.off("todos");
            };
        }
    }, [socket]);

    return (
        <div>
            <Nav />
            <form className="form" onSubmit={handleAddTodo}>
                <input
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
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
                            <button className="deleteBtn" onClick={() => handleDelete(item.id)}>DELETE</button>


                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Format time using JavaScript's Date API
const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

export default Main;
