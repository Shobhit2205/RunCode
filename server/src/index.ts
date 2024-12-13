import express from "express";
import http from "http"
import { Server as SocketIOServer } from "socket.io";
import dotenv from 'dotenv'
import ACTIONS from "./utils/actions";
import cors from 'cors'; 
import run from "./CodeExecution/ExecutionLogic";

dotenv.config();

const app = express();

const server = http.createServer(app);

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}))

const io = new SocketIOServer(server, {
    cors: {
        origin: '*'
    }
});

const userSocketMap = new Map<string, string>();

function getAllConnectedClients(roomId: string){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap.get(socketId)
        }
    })
}


io.on('connection', (socket) => {
    // console.log(socket.id);

    socket.on(ACTIONS.JOIN, ({roomId, username}) => {
        userSocketMap.set(socket.id, username);
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // console.log(clients);
        clients.forEach(({socketId}) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
        // console.log(code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code});
    });

    socket.on(ACTIONS.LANGUAGE_CHANGE, ({roomId, language}) => {
        // console.log({language});
        socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, {language});
    })

    socket.on(ACTIONS.SYNC_CODE, ({socketId, code}) => {
        // console.log(code);
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
    })

    socket.on(ACTIONS.CLEAR_TERMINAL, ({roomId}) => {
    //   console.log('clear terminal');
      socket.emit('clear-terminal');
    })

    // Exectution code

    socket.on(ACTIONS.START_EXECUTION, async ({ roomId, language, code }) => {
      run(io, socket, language.toLowerCase(), code, roomId);
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap.get(socket.id)
            });
            socket.leave(roomId);
        });
        userSocketMap.delete(socket.id);
        
    });
})


const PORT = process.env.PORT || 8000;
server.listen(8000, () => {
    console.log(`Server is running on Port ${PORT}`);
})