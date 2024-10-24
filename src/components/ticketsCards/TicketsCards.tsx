import { formatDate } from "@/core/services/helper.service";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import QRCode from "qrcode.react";
import { TicketCard } from "@/core/interfaces/Ticket";
import { IAddress } from "@/core/interfaces/Address";
import { Button } from "../ui/button";
import { ArrowUpRightIcon } from "lucide-react";

const MyTicketsCards = (props: {
	id: string;
	img: string;
	address: IAddress;
	startDate: string;
	title: string;
	ticket: TicketCard;
}) => {
	const { img, address, startDate, title, ticket } = props;
	const formatedStartDate = new Date(startDate);
	console.log(ticket)
	return (
		<>
			<Card className="aspect-video w-80 drop-shadow-md">
				<CardContent className="p-0 h-full overflow-hidden">
					<div className="w-full h-full rounded-t-lg overflow-hidden relative">
						<img
							src={img}
							alt="Imagem"
							className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform-gpu hover:scale-110"
						/>
					</div>
				</CardContent>

				<CardFooter className="p-4 pb-2 font-primary text-black rounded-lg overflow-hidden rounded-t-none drop-shadow-md flex flex-col">
					<p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap mb-4">
						{formatDate(startDate)}
					</p>
					<p className="text-md font-medium text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
						{title}
					</p>
					<p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
						{address.street}
					</p>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								
								variant={"link"}
								className="text-xs text-primary-dark text-end justify-end w-full whitespace-nowrap"
							>
								Ver detalhes da compra{" "}
								<ArrowUpRightIcon className="w-5 h-5 underline" />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<img
									src={img}
									alt=""
									className="rounded-lg aspect-square w-36 mx-auto object-cover"
								/>
								<DialogTitle className="mx-auto text-xl">{title}</DialogTitle>
								<div>
									<div className="flex w-full max-w-[1140px] justify-start mt-5">
										<Card className="p-5 rounded-3xl shadow-md shadow-gray-500 hover:shadow-lg hover:shadow-gray-500 w-min text-center font-primary">
											<div>
												<p className="text-3xl text-primary font-semibold">
													{formatedStartDate?.getDate()}
												</p>
												<p className="text-3xl text-primary font-semibold opacity-50">
													{formatedStartDate?.toLocaleString("default", {
														month: "short",
													})}
												</p>
												<p className="text-xl text-primary font-semibold opacity-50">
													{formatedStartDate?.toLocaleString("default", {
														weekday: "short",
													})}
												</p>
												<p className="text-3xl text-primary font-semibold opacity-50">
													{formatedStartDate?.getHours()}h
												</p>
											</div>
										</Card>
										<div className="flex flex-col justify-center items-start pl-4 sm:pl-8 font-primary text-sm">
											<h4 className="mb-1 text-start text-black font-semibold">
												{address.street}, {address.city} Nº {address.number}
											</h4>

											<h4 className="mb-1 text-green-500">{"ativo"}</h4>
											<h4 className="mb-1 text-black font-semibold">
												{ticket?.ticketType?.description}
											</h4>
										</div>
									</div>
									<div className="w-full text-center text-black mt-8">
										ingresso por QR Code
									</div>
									<div className="flex justify-center py-4">
										<QRCode value="teste" />
									</div>
								</div>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</CardFooter>
			</Card>
		</>
	);
};

export default MyTicketsCards;
