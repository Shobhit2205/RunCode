import ACTIONS from "@/lib/Action";
import Editor from "@/components/Editor"
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import { useCodeContext } from "@/context/CodeContext";
import { useSocket } from "@/context/SocketContext";
import Navbar from "@/components/Navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { io } from "socket.io-client";

interface UserJoinedProps {
  clients: Array<{socketId : string, username: string}>,
  username: string, socketId: string
}

interface UserDisconnectedProps {
  socketId: string,
  username: string
}

const EditorScreen = () => {
  const { socket, setSocket } = useSocket();
  const { code, language } = useCodeContext();
  // const [code, setCode] = useState<string | undefined>('console.log("hello")');
  const codeRef = useRef<string>();
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState<Array<{socketId: string, username: string}>>([]);
  const running = useRef<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);


  useEffect(() => {

    if(!socket){
      const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 1000,
        reconnection: true,
        transports: ['websocket']
      });
      // console.log(newSocket);
      setSocket(newSocket)
    }
    
    function handleErrors(e: Error) {
      console.log('Socket error', e);
      toast({title: "Error in socket connection"});
      navigate('/');
    }

    const init = async () => {
      
      socket?.on('connect_error', (err) => handleErrors(err));
      socket?.on('connect_failed', (err) => handleErrors(err));
      socket?.emit(ACTIONS.JOIN, {roomId, username: location?.state});

      socket?.on(ACTIONS.JOINED, ({clients, username, socketId}: UserJoinedProps) => {
        if(username != location.state){
          toast({
            title: `${username || 'Anonymous user'} has joined`
          })
        }
        setClients(clients);
        
        socket?.emit(ACTIONS.SYNC_CODE, {socketId, code: codeRef.current});
      })

      socket?.on(ACTIONS.DISCONNECTED, ({socketId, username}: UserDisconnectedProps) => {
        toast({
          title: `${username || 'Anonymous user'} left`
        });
        setClients((prev) => {
          return prev.filter(client => client.socketId !== socketId);
        })
      })
    }

    init();

    return () => {
      socket?.off(ACTIONS.JOINED);
      socket?.off(ACTIONS.DISCONNECTED);
      // socket?.disconnect();
    }

  }, [socket])


  // if(!location.state){
  //   return <Navigate to={'/'} />
  // }

  function handleRunCode(){
    running.current = true;
    setDisableButton(true);
    // console.log(running);
    socket?.emit(ACTIONS.CLEAR_TERMINAL, { roomId });
    socket?.emit(ACTIONS.START_EXECUTION, {roomId, language, code: code});
  }


  return (
    <div className="h-full">
      <Navbar isEditorPage={true} handleRunCode={handleRunCode} clients={clients} roomId={roomId} disableButton={disableButton} />
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-64px)]">
        <ResizablePanel minSize={30} defaultSize={50}>
          <Editor roomId={roomId} onCodeChange={(code: string) => {codeRef.current = code}} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={30} defaultSize={50}>
          <InteractiveTerminal running={running} setDisableButton={setDisableButton} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default EditorScreen
