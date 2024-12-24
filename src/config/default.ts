export default {
    apiBaseUrl: import.meta.env.VITE_APIBASEURL || "http://ec2-54-144-64-88.compute-1.amazonaws.com:4000", // API URL from .env
    socketBaseUrl: import.meta.env.VITE_SOCKETBASEURL || "http://ec2-54-144-64-88.compute-1.amazonaws.com:4000", // WebSocket URL from .env
    port: import.meta.env.VITE_SERVER_PORT || 4000
};






