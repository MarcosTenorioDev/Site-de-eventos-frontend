import { NavItem } from "@/types/navbarTypes";
import { HomeIcon } from "lucide-react";

export const NavItems: NavItem[] = [
    {
      title: "Meus eventos",
      icon: HomeIcon,
      href: "/managment",
      color: "text-primary",
    },  
];

/*   {
      title: "eventos",
      icon: HomeIcon,
      href: "/managment/events",
      color: "text-orange-500",
      isChidren: true,
      children: [
        {
          title: "eventos-01",
          icon: HomeIcon,
          color: "text-red-500",
          href: "/",
        },
        {
          title: "Example-02",
          icon: HomeIcon,
          color: "text-red-500",
          href: "/",
        },
        {
          title: "eventos-03",
          icon: HomeIcon,
          color: "text-red-500",
          href: "/",
        },
      ],
    }, */