import placeholder from "@/assets/images/home/placeholderEventCard.png";
import { IAddress } from "@/core/interfaces/Address";
import { TicketCard } from "@/core/interfaces/Ticket.interface";
import { MapPinIcon } from "lucide-react";
import QRCode from "qrcode.react";
import { Badge } from "../ui/badge";
interface ticketProps {
	img: string;
	formatedStartDate: Date;
	address: IAddress;
	ticket: TicketCard;
}
const Tickets = (props: ticketProps) => {
	const { img, formatedStartDate, address, ticket } = props;
	return (
		<div className="w-full flex flex-col sm:flex-row justify-between min-h-56 bg-white rounded-lg overflow-hidden drop-shadow-sm transform transition border-0">
			<div className="hidden sm:flex">
				<img
					src={img ? img : placeholder}
					alt="imagem do evento"
					className="aspect-square h-56 object-cover"
				/>
			</div>
			<div className="px-8 w-full flex flex-col justify-start mt-4 sm:max-w-[390px]">
				<div className="border-y py-2 sm:px-2 flex items-center justify-between gap-5">
					<p className="text-xl text-primary-dark font-semibold">
						{formatedStartDate?.toLocaleString("default", {
							weekday: "short",
						})}{" "}
					</p>
					<p className="text-xl text-primary-dark font-semibold text-nowrap">
						{formatedStartDate?.toLocaleString("default", {
							day: "2-digit",
						})}
						-
						{formatedStartDate?.toLocaleString("default", {
							month: "short",
						})}
					</p>
					<p className="text-xl text-primary-dark font-semibold">
						{formatedStartDate?.toLocaleString("default", {
							year: "numeric",
						})}
					</p>
				</div>
				<div className="flex flex-col mt-2 justify-start h-full">
					<div className="flex items-center justify-between gap-2">
						<h3 className=" text-primary-dark font-bold text-lg gap-3 items-center line-clamp-2 text-ellipsis justify-center">
							{ticket.ticketType?.description}
						</h3>
						<Badge
							className={`${
								ticket.price === 0
									? "bg-muted-foreground hover:bg-gray-600"
									: "bg-green-500 hover:bg-green-300"
							} rounded-full text-nowrap`}
						>
							{ticket.price === 0
								? "Gratuito"
								: `R$ ${ticket.price.toFixed(2)}`}{" "}
						</Badge>
					</div>
					<p className="text-muted-foreground flex items-center gap-1 mt-2">
						<MapPinIcon className="w-4 h-4 min-w-4 min-h-4" />
						{address.street}, {address.city} Nº {address.number}
					</p>
					<div className="mt-2">
						<p className="text-muted-foreground flex">
							Name: {ticket.participantName}
						</p>
						<p className="text-muted-foreground flex">
							Email: {ticket.participantEmail}
						</p>
					</div>
				</div>
			</div>
			<div className="relative flex flex-col justify-center h-[98%] items-center px-4 text-center border-t sm:border-0 py-5 mt-5 sm:mt-0 sm:border-l border-black border-dashed">
				<QRCode value="teste" size={80} />
				<p className="text-muted-foreground font-bold">#000000</p>

				<div className="absolute -left-[14px] -top-3 w-7 h-7 bg-[#e2e8f0] rounded-full shadow-inner shadow-black/40"></div>
				<div className="absolute sm:-left-[14px] -top-3 sm:top-auto -right-[14px] sm:-bottom-[18px] w-7 h-7 bg-[#e2e8f0] rounded-full shadow-inner shadow-black/40"></div>
			</div>
		</div>
	);
};

export default Tickets;
