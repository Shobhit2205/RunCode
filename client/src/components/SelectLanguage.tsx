import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCodeContext } from "@/context/CodeContext";
import { useSocket } from "@/context/SocketContext";
import ACTIONS, { languageDetails } from "@/lib/Action";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function SelectLanguage() {
  const { language, setLanguage } = useCodeContext();
  const { socket } = useSocket();
  const { roomId } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);

  const handleChange = (value: string) => {
    setSelectedLanguage(value);
    setIsDialogOpen(true);
  };

  const handleLanguageChange = () => {
    setLanguage(selectedLanguage);
    socket?.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: selectedLanguage,
    });
    setIsDialogOpen(false);
  };

  useEffect(() => {
    socket?.on(ACTIONS.LANGUAGE_CHANGE, ({language}) => {
      // console.log('lang: ', language);
      setLanguage(language);
    });

    return () => {
      socket?.off(ACTIONS.LANGUAGE_CHANGE);
    }
  }, [language, setLanguage, socket])


  return (
    <>
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={language} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {Object.keys(languageDetails).map((key) => (
              <SelectItem key={key} value={key}>
                {(languageDetails[key as keyof typeof languageDetails]).name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to change language?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Changing the language will reset your current code, as well as the code for all users in the room. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLanguageChange}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
