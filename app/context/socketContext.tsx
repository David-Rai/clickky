"use client";
import { useRef, createContext, useContext, useEffect, ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import { URL } from "../config/url.js";

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const socketRef = useRef<Socket | null>(null);

    if (!socketRef.current) {
        socketRef.current = io(URL);
    }

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        // Example: listen to connection
        socket.on("connected", () => {
            console.log("Connected with id:", socket.id);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current }}>
            {children}
        </SocketContext.Provider>
    );
};
