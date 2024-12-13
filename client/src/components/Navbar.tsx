import { ThemeToggle } from "./ThemeToggle";
import { SelectLanguage } from "./SelectLanguage";
import { Button } from "./ui/button";
import UserDropdown from "./UserDropdown";
import { useToast } from "@/hooks/use-toast";
import Logo from "./Logo";

interface NavbarProps {
  isEditorPage?: boolean;
  handleRunCode?: () => void;
  disableButton?: boolean;
  clients?: Array<{ socketId: string; username: string }>;
  roomId?: string;
}

const Navbar = ({
  isEditorPage,
  handleRunCode,
  disableButton,
  clients,
  roomId,
}: NavbarProps) => {
  const { toast } = useToast();

  const onClick = () => {
    if (handleRunCode) {
      handleRunCode();
    }
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard
        .writeText(roomId)
        .then(() => {
          toast({
            title: "Room Id copied",
            description: "you can share the room id with others",
          });
        })
        .catch((err) => {
          toast({
            title: "Error in Copying room Id",
            variant: "destructive",
          });
          console.log(err);
        });
    }
  };

  return (
    <div className="px-8 h-16 border-b flex w-full sticky top-0 left-0 items-center justify-between bg-white dark:bg-[#1e1e1e] z-50">
      <a
        href="/"
        className="flex items-center gap-2  border-b-2 border-black dark:border-white border-double"
      >
        <Logo className="w-[25px] h-[25px] fill-[#000000] dark:fill-[#FFFFFF]" />
        <div className="font-bold text-lg">RunCode</div>
      </a>
      {isEditorPage && (
        <div className="flex items-center gap-4">
          <SelectLanguage />
          <Button onClick={onClick} disabled={disableButton}>
            Run
          </Button>
        </div>
      )}
      <div className="flex items-center gap-4">
        {isEditorPage && <UserDropdown clients={clients} />}
        {isEditorPage && (
          <Button onClick={handleCopyRoomId}>Copy Room ID</Button>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
