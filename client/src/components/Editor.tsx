import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { useCallback, useEffect, useRef } from "react";
import ACTIONS from "@/lib/Action";
import { useCodeContext } from "@/context/CodeContext";
import { useSocket } from "@/context/SocketContext";
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
import { useTheme } from "./theme-provider";



interface EditorProps {
  roomId: string | undefined,
  onCodeChange: (code: string) => void,
}

const Editor = ({ roomId, onCodeChange }: EditorProps) => {
  const { socket } = useSocket();
  const {theme} = useTheme();
  const { code, setCode, language } = useCodeContext();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const getLanguageExtension = () => {
    switch (language) {
      case 'Cpp':
        return [cpp()];
      case 'JavaScript':
        return [javascript()];
      case 'Python':
        return [python()];
      case 'Java':
        return [java()];
      case 'Rust':
        return [rust()];
      case 'PHP':
        return [php()];
      default:
        return [javascript()];
    }
  };


  const onChange = useCallback((val: string) => {
    // console.log(val)
    // setCode(val);
    // socket?.emit(ACTIONS.CODE_CHANGE, { roomId, code: val });  
    // onCodeChange(val);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      // console.log(val);
      setCode(val);
      socket?.emit(ACTIONS.CODE_CHANGE, { roomId, code: val });
      onCodeChange(val);
    }, 200);
  }, [onCodeChange, roomId, setCode, socket]);



  useEffect(() => {

      socket?.on(ACTIONS.CODE_CHANGE, ({ code }: {code: string}) => {
        if (code != null) {
          setCode(code);
        }  
      });

     

    return () => {
      socket?.off(ACTIONS.CODE_CHANGE);
    };
  }, [setCode, socket]);



  return (
    <CodeMirror
      value={code}
      height="100%"
      extensions={getLanguageExtension()}
      onChange={onChange}
      theme={theme == "dark" ? xcodeDark : xcodeLight}
      className="h-[calc(100vh-64px)]"
    />
  );
};

export default Editor;
