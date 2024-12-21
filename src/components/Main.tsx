import {FormEvent, useEffect, useState} from "react";
import Nav from "./Nav";
import {useNavigate} from "react-router-dom";
import {TodoItem} from "../interfaces/TodoItem.ts";
// import {TodoItemPayload} from "../interfaces/TodoItemPayload.ts";
import {Builder, parseStringPromise} from "xml2js";


function Main({ socket }) {
    const [todoInput, setTodoInput] = useState("");
    const [todoList, setTodoList] = useState<TodoItem[]>([]); // Type `todoList` as an array of `TodoItem`
    const navigate = useNavigate();

    // Generates a random string as the todo ID
    // const generateID = () => Math.random().toString(36).substring(2, 10);

    // const handleDelete = (todoId: string) => {
    //     console.log(`Todo item with id ${todoId} will be deleted.`);
    //     socket.emit("deleteTodo", { id: todoId }); // Emit the delete event to the backend
    // };

    const handleDelete = (todoId: string) => {
        console.log(`Todo item with id ${todoId} will be deleted.`);

        // Construct the XML payload
        const builder = new Builder();
        const xmlPayload = builder.buildObject({
            todo: {
                id: todoId, // Include the ID of the todo to delete
            },
        });
        console.log("xmlPayload: " , xmlPayload);
        // Emit the XML payload to the backend
        socket.emit("deleteTodo", xmlPayload);
    };

    const handleAddTodo = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Create the XML payload
        const builder = new Builder();
        const todoPayload = {
            todo: {
                text: todoInput, // Use the `todo` state as the `text`
                timestamp: new Date().toISOString(), // Use ISO 8601 format for clarity
            },
        };
        const xmlPayload:string = builder.buildObject(todoPayload); // Convert to XML

        // Emit the XML payload over the socket
        socket.emit("addTodo", xmlPayload);

        setTodoInput(""); // Reset the input field
    };
    
    // const handleAddTodo = (e) => {
    //     e.preventDefault();
    //
    //     const todoPayload: TodoItemPayload = {
    //         text: todoInput, // Use the `todo` state as the `text`
    //         timestamp: new Date().toISOString(), // Use ISO 8601 format for clarity
    //     };
    //
    //     socket.emit("addTodo", todoPayload);
    //
    //     setTodoInputInput("");
    // };

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

    useEffect(() => {
        if (socket) {
            // Listen for the `todos` event to handle both initial loading and real-time updates
            socket.on("todos", async (xmlData: string) => {
                try {
                    console.log("Received XML data:", xmlData);

                    // Parse the XML data received via WebSocket
                    const parsedData = await parseStringPromise(xmlData, {
                        explicitArray: false, // Prevent wrapping single items in arrays
                    });

                    console.log("Parsed Data:", parsedData);

                    if (parsedData.todos && parsedData.todos.todo) {
                        // Normalize todos into an array
                        const todos = Array.isArray(parsedData.todos.todo)
                            ? parsedData.todos.todo
                            : [parsedData.todos.todo];
                        setTodoList(todos); // Update the state with the parsed todos
                    } else {
                        console.error("Invalid XML structure");
                    }
                } catch (error) {
                    console.error("Error parsing XML from WebSocket:", error);
                }
            });

            // Request the initial todo list explicitly upon connecting
            socket.emit("getTodos");

            // Cleanup the listener on component unmount or when socket changes
            return () => {
                socket.off("todos");
            };
        }
    }, [socket]);
    // useEffect(() => {
    //     // const fetchTodos = async () => {
    //     //     try {
    //             // const response = await fetch("http://localhost:4000/api", {
    //             //     headers: {
    //             //         Accept: "application/xml", // Request XML from the backend
    //             //     },
    //             // });
    //             // console.log('response', response);
    //             // console.log('response.body', response.body);
    //             //
    //             // const xmlData = await response.text(); // Get the XML as a string
    //             // console.log('xmlData', xmlData);
    //             // const parsedData = await parseStringPromise(xmlData, {
    //             //     explicitArray: false, // Prevent wrapping single items in arrays
    //             // });
    //             // console.log('parsedData', parsedData);
    //
    //         //     if (parsedData.todos && parsedData.todos.todo) {
    //         //         const todos = Array.isArray(parsedData.todos.todo)
    //         //             ? parsedData.todos.todo
    //         //             : [parsedData.todos.todo]; // Normalize to an array
    //         //         setTodoList(todos); // Set the todo list state
    //         //     } else {
    //         //         console.error("Invalid XML structure");
    //         //     }
    //         // } catch (error) {
    //         //     console.error("Error fetching todos:", error);
    //         // }
    //     // };
    //
    //     // fetchTodos();
    //
    //     if (socket) {
    //         socket.on("todos", async (xmlData: string) => {
    //             try {
    //                 console.log('xmlData', xmlData);
    //                 // Parse the XML received via WebSocket
    //                 const parsedData = await parseStringPromise(xmlData, {
    //                     explicitArray: false,
    //                 });
    //                 console.log('parsedData', parsedData);
    //                 if (parsedData.todos && parsedData.todos.todo) {
    //                     const todos = Array.isArray(parsedData.todos.todo)
    //                         ? parsedData.todos.todo
    //                         : [parsedData.todos.todo]; // Normalize to an array
    //                     setTodoList(todos); // Update the state with the parsed todos
    //                 } else {
    //                     console.error("Invalid XML structure");
    //                 }
    //             } catch (error) {
    //                 console.error("Error parsing XML from WebSocket:", error);
    //             }
    //         });
    //
    //         // Cleanup the listener
    //         return () => {
    //             socket.off("todos");
    //         };
    //     }
    // }, [socket]);
    // Fetch todos and set up socket listener for "todos" event
    // useEffect(() => {
    //     const fetchTodos = async () => {
    //         try {
    //             const response = await fetch("http://localhost:4000/api");
    //             const data: TodoItem[] = await response.json(); // Expect the response to be an array of `TodoItem`
    //             setTodoList(data);
    //         } catch (error) {
    //             console.error("Error fetching todos:", error);
    //         }
    //     };
    //
    //     fetchTodos();
    //
    //     if (socket) {
    //         socket.on("todos", (data: TodoItem[]) => {
    //             setTodoList(data);
    //             console.log("Todos received:", data);
    //         });
    //
    //         // Cleanup the listener
    //         return () => {
    //             socket.off("todos");
    //         };
    //     }
    // }, [socket]);

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
