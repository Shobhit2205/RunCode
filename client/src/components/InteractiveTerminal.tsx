import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useSocket } from '@/context/SocketContext';
import { useTheme } from './theme-provider';
import { FitAddon } from 'xterm-addon-fit';
import ACTIONS from '@/lib/Action';

interface InteractiveTerminalProps {
  running: React.MutableRefObject<boolean>,
  setDisableButton: (val: boolean) => void;
}

const InteractiveTerminal = ({ running, setDisableButton  }: InteractiveTerminalProps) => {
  const { socket } = useSocket();
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const inputBuffer = useRef<string>('');
  const {theme} = useTheme();

  useEffect(() => {
    if (terminalRef.current) {
      const fitAddon = new FitAddon();
      term.current = new Terminal({
        fontSize: 14,
        cursorBlink: true,
        theme: {
          background: theme === 'dark' ? '#1e1e1e' : '#FAFAFA',
          foreground: theme === 'dark' ? '#d4d4d4' : '#1e1e1e',
          cursor: theme === 'dark' ? '#d4d4d4' : '#1e1e1e',
          selectionBackground: theme === 'dark' ? '#ebeef4' : '#101010',
          selectionForeground: theme === 'dark' ? '#000' : '#fff' 
        },
        
      });
      term.current.loadAddon(fitAddon);
      term.current.open(terminalRef.current);
      fitAddon.fit();
      term.current.writeln('\x1b[31mTerminal ready. Press "Run" to start.\x1b[0m');


      term.current.onData((input) => {
        if(running.current == false) return;
        if (input === '\r') {
          // Enter
          // console.log('Terminal input: ', inputBuffer.current);
          socket?.emit(ACTIONS.INPUT, { data: inputBuffer.current });
          inputBuffer.current = '';
          term.current?.write('\r\n');
        } else if (input === '\x7f') {
          // Backspace
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.current?.write('\b \b');
        } else if (input === '\u001b[A' || input === '\u001b[B') {
          // Up and down move
          return;
        } else {
          inputBuffer.current += input;
          term.current?.write(input);
        }
      });
    
    }

    return () => {
      if (term.current) {
        term.current.dispose();
      }
      
    };
    
  }, [theme, running, socket]);



  useEffect(() => {
    if (socket) {
      socket.on(ACTIONS.CLEAR_TERMINAL, () => {
        if (term.current) {
          // console.log('clear terminal')
          term.current.clear();  
        }
      });

      socket.on(ACTIONS.OUTPUT, (data) => {
        const output = typeof data === 'string' ? data : data.data?.toString(); 
        // console.log(output);
        if (term.current) {
          term.current.write(output + '\r\n'); 
        }           
      });

      socket?.on(ACTIONS.EXECUTION_COMPLETE, () => {
        term.current?.write('\x1b[32m\r\n\n\n ===== Execution completed =====\r\n\x1b[0m');
        running.current = false;
        setDisableButton(false);
      })

      return () => {
        socket.off(ACTIONS.CLEAR_TERMINAL);
        socket.off(ACTIONS.OUTPUT);
        socket?.off(ACTIONS.EXECUTION_COMPLETE);
      };
    }
  }, [socket]);


  return (
    <div ref={terminalRef} className="h-[calc(100vh-64px)] w-full bg-[#FAFAFA] dark:bg-[#1e1e1e]" />
  );
};

export default InteractiveTerminal;
