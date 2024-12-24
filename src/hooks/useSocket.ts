import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import config from "../config/default";
import { TodoItem } from "../interfaces/TodoItem";
import { parseStringPromise } from "xml2js";

export function useSocket(
    token: string,
    setTodoList: (todos: TodoItem[]) => void,
    setIsServerConnected: (status: boolean) => void,
    isOffline: boolean
): Socket | null {
    const [socket, setSocket] = useState<Socket | null>(null);
    const emptyTodosList =
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<todos/>';

    useEffect(() => {
        if (isOffline || !token) return;

        const newSocket = io(config.socketBaseUrl, { auth: { token } });
        setSocket(newSocket);


        newSocket.on("connect", () => {
            console.log("Connected to server.");
            setIsServerConnected(true);


            newSocket.emit("getTodos");
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected from server.");
            setIsServerConnected(false);
        });

        newSocket.on("connect_error", () => {
            console.error("Connection error.");
            setIsServerConnected(false);
        });


        newSocket.on("todos", async (xmlData: string) => {
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

        return () => {
            newSocket.disconnect();
        };
    }, [token, isOffline, setTodoList, setIsServerConnected]);

    return socket;
}
