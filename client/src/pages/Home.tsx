import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useSocket } from "@/context/SocketContext";

export default function Home() {
    const {toast} = useToast();
    const navigate = useNavigate();
    const {socket} = useSocket();
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    
    function createRoom(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
    }

    const handleJoinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
        if(username == "") {
            toast({
              title: "Please Enter Name"
            })
            return;
        }
        if(roomId == ""){
          toast({
            title: "Please Enter the room id",
            description: "If no invitation create new room",
            variant: 'destructive'
          })
          return;
        }
        // if(!socket){
        //   const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        //     forceNew: true,
        //     reconnectionAttempts: Infinity,
        //     timeout: 1000,
        //     reconnection: true,
        //     transports: ['websocket']
        //   });
        //   console.log(newSocket);
        //   setSocket(newSocket)
        // }
        // console.log(socket);
        navigate(`/editor/${roomId}`, {state: username});
    };

    useEffect(() => {
      socket?.disconnect();
    }, []);
    
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="absolute w-full top-0">
      <Navbar/>
      </div>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Collabrate to code</CardTitle>
          <CardDescription>Collaborate in real time for code</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your Name" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="roomId">Room Id</Label>
                <Input id="roomId" placeholder="Enter Invitation Room Id" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleJoinRoom}>Join</Button>
          <p className="text-sm">
            If you don't have invite then create{" "}
            <a
              href=""
              className="font-bold text-red-600 underline"
              onClick={(e) => createRoom(e)}
            >
              new room
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
