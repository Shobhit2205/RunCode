import { createContext, ReactNode, useContext, useState } from "react";
import { Socket } from "socket.io-client";

interface SocketContextInterface {
    socket: Socket | null;
    setSocket: (socket: Socket | null) => void;
}

const SocketContext = createContext<SocketContextInterface | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if(!context){
        throw new Error('useSocket must be used within the socket provider')
    }
    return context;
}

const SocketProvider = ({children} : {children: ReactNode}) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    return (
        <SocketContext.Provider value={{socket, setSocket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;