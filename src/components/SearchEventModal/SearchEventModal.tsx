import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import { IEventSearch } from "@/core/interfaces/Event.interface";
import EventsService from "@/core/services/event.service";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../SearchInput";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/loading-spinner";

export function SearchEventModal({ children }: any) {
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState<boolean>(false);
	const [events, setEvents] = useState<IEventSearch[]>([]);
	const eventService = new EventsService();
	const [open, setOpen] = useState<boolean>(false);
	const navigate = useNavigate();
	useEffect(() => {
		const debounceTimeout = setTimeout(async () => {
			if (searchTerm.trim() !== "") {
				try {
					setLoading(true);
					const result = await eventService.getEventByName(searchTerm);
					setEvents(result);
				} catch (error) {
				} finally {
					setLoading(false);
				}
				return;
			}
			setEvents([]);
		}, 500);

		return () => clearTimeout(debounceTimeout);
	}, [searchTerm]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="w-full">
				{children ?? (
					<SearchInput
						placeholder="Pesquisar meus eventos para gerenciar"
						className="border"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				)}
			</DialogTrigger>
			<DialogContent
				className="p-0 gap-0 h-full w-full max-w-full sm:max-w-[600px] sm:h-[500px] overflow-auto flex flex-col"
				hiddenCloseBtn={true}
			>
				<DialogHeader className="flex flex-row">
					<SearchInput
						placeholder="Pesquisar perfil ou publicação"
						className="border-0 border-b rounded-none shadow-none bg-transparent p-7 pl-12"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{loading && (
						<div className="border-b flex items-center justify-center">
							<Spinner size="small" className=" mr-4 text-muted-foreground" />
						</div>
					)}
					<DialogClose className="sm:hidden border-b pr-6 font-semibold">
						Cancelar
					</DialogClose>
				</DialogHeader>
				<div className="flex flex-col h-[400px]">
					{events.length ? (
						events.map((event) => {
							return (
								<>
									<Button
										variant={"ghost"}
										className="h-24 flex justify-start space-x-4 p-4"
										onClick={() => {
											navigate(`/managment/event/${event.id}`);
											setOpen(false);
											setSearchTerm("");
										}}
									>
										<img
											src={event.assets[0]?.url}
											alt={`${event.title} Profile Image`}
											className="aspect-square rounded-md w-16 min-w-16 h-16"
										/>

										<div className="flex justify-between w-full items-center">
											<div className="flex flex-col items-start">
												<p className="font-bold text-accent-foreground text-md truncate max-w-[280px]">
													{event.title}
												</p>
											</div>
											<Badge
												className={`${
													event.status === "Ativo"
														? "bg-green-500 hover:bg-green-300"
														: "bg-gray-500 hover:bg-gray-300"
												} rounded-full`}
											>
												{event.status}
											</Badge>
										</div>
									</Button>
								</>
							);
						})
					) : (
						<div className="w-full h-full flex flex-col justify-center items-center">
							<MagnifyingGlassIcon className="w-10 h-10 text-muted-foreground" />
							<p className="text-muted-foreground">Busque seus eventos</p>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
