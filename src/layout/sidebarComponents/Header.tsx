import managment from "@/assets/icons/management.svg";
import { SearchEventModal } from "@/components/SearchEventModal/SearchEventModal";
import CustomClerkUserButton from "@/components/customClerkUserButton";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "@/layout/sidebarComponents/Mobile-sidebar";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
	const navigate = useNavigate();
	return (
		<div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
			<nav className="flex h-16 items-center justify-between px-10">
				<Link
					to={"/managment"}
					className="hidden items-center justify-between gap-2 md:flex"
				>
					<img
						src={managment}
						alt="icone de organizadores de eventos"
						className="w-7"
					/>
					<span className="text-lg font-semibold text-nowrap">
						Área do organizador
					</span>
				</Link>
				<div className={cn("md:!hidden w-full flex")}>
					<MobileSidebar />
				</div>
				<div className="flex items-center justify-end gap-10 flex-grow">
					<div className="hidden md:flex w-full max-w-[700px] ml-[50px]">
						<SearchEventModal />
					</div>
					<Button
						variant={"link"}
						className="hidden items-center justify-between gap-2 md:flex text-primary"
						onClick={() => navigate("/")}
					>
						<h1 className="text-md font-semibold">Área do Participante</h1>
					</Button>
					<div className="hidden md:block">
						<CustomClerkUserButton />
					</div>
				</div>
			</nav>
		</div>
	);
}
