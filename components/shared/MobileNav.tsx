import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator"

import Image from "next/image";
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="">
            <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={24}
                height={24}
            />
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-6 bg-white wrapper md:hidden">
          <SheetTitle className="hidden">Mobile Nav</SheetTitle>
          <Image 
            src="/assets/images/logo.svg"
            width={128}
            height={38}
            alt="logo"
          />
          <Separator />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
