import { Glasses, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"


const UserDropdown = ({clients}: {clients: Array<{socketId: string, username: string}> | undefined}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:ring-0">
        <Avatar className="cursor-pointer">
            <AvatarFallback>
               <Users strokeWidth={2.5} size={20} />
            </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-28 max-w-[162px] w-auto mx-2 my-1">
        <div className="bg-white dark:bg-black z-1 shadow border p-2 rounded-lg flex gap-3 items-center flex-wrap">
            {clients?.map((client, ind) => (
                 <TooltipProvider key={ind}>
                 <Tooltip>
                   <TooltipTrigger asChild>
                   <Avatar className="cursor-pointer">
                        <AvatarFallback>
                        {client?.username ? client.username[0] : <Glasses size={20} />}
                        </AvatarFallback>
                    </Avatar>
                   </TooltipTrigger>
                   <TooltipContent>
                     <p>{client?.username ? client.username : 'Anonymous user'}</p>
                   </TooltipContent>
                 </Tooltip>
               </TooltipProvider>
            )) }
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown


