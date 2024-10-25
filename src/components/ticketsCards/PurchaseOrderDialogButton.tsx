import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import Tickets from "./Tickets";
import { Badge } from "../ui/badge";
import { IAddress } from "@/core/interfaces/Address";
import { IPurchaseOrder } from "@/core/interfaces/PurchaseOrder";

interface dialogProps {
	img: string;
	title: string;
	address: IAddress;
	status: string;
	purchaseOrder: IPurchaseOrder;
	startDate: string;
}

const PurchaseOrderDialogButton = (props: dialogProps) => {
	const { img, title, address, status, purchaseOrder, startDate } = props;
	const formatedStartDate = new Date(startDate);
	const purchasedDate = new Date(purchaseOrder.createdAt);

	return (
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
			<DialogContent className="max-w-[750px] max-h-screen sm:max-h-[90%] bg-[#e2e8f0] border-[#e2e8f0] overflow-y-scroll custom-scroll">
				<DialogHeader className="w-full flex ">
					<DialogTitle className="mx-auto text-3xl flex items-center gap-4 mb-4">
						Detalhes da compra
					</DialogTitle>
					<div className="flex flex-col sm:flex-row items-center justify-between sm:border-y py-3 border-dashed border-black">
						<div className="flex flex-col sm:flex-row items-center h-full">
							<img
								src={img}
								alt="imagem do evento"
								className="rounded-lg aspect-square w-24 h-24 mx-auto object-cover"
							/>
							<div className="text-center sm:text-start font-primary text-sm sm:ml-4 mt-2 sm:mt-0">
								<h3 className="mb-1 text-start text-primary-dark font-semibold text-2xl">
									{title}
								</h3>
								<h4 className="mb-[6px] text-center sm:text-start text-primary-dark font-semibold">
									{address.street}, {address.city} Nº {address.number}
								</h4>
								<Badge className="bg-green-500 hover:bg-green-300 rounded-full">
									{status}
								</Badge>
							</div>
						</div>
						<div className=" h-full sm:ml-9 w-full mt-3 py-3 sm:mt-0 sm:py-0 sm:w-auto border-y sm:border-y-0 border-black border-dashed">
							<div className="flex items-center justify-center sm:justify-start gap-2">
								<p className="text-primary-dark font-medium text-lg">Status:</p>
								<Badge>{purchaseOrder.status}</Badge>
							</div>
							<div className="flex items-center justify-center sm:justify-start gap-2">
								<p className="text-primary-dark font-medium text-lg">
									Valor total:{" "}
								</p>
								<Badge
									className={`${
										purchaseOrder.totalPrice === 0
											? "bg-muted-foreground hover:bg-gray-600"
											: "bg-green-500 hover:bg-green-300"
									} text-nowrap`}
								>
									{purchaseOrder.totalPrice === 0
										? "Gratuito"
										: `R$ ${purchaseOrder.totalPrice.toFixed(2)}`}{" "}
								</Badge>
							</div>
							<p className="text-primary-dark font-medium text-lg">
								Tickets comprados: {purchaseOrder.quantityTickets}
							</p>
							<p className="text-primary-dark font-medium text-lg">
								comprado em:{" "}
								{purchasedDate.toLocaleString("pt-BR", {
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
								})}
							</p>
						</div>
					</div>
				</DialogHeader>

				{purchaseOrder.tickets.map((ticket) => (
					<Tickets
						key={ticket.id}
						address={address}
						formatedStartDate={formatedStartDate}
						img={img}
						ticket={ticket}
					/>
				))}
			</DialogContent>
		</Dialog>
	);
};

export default PurchaseOrderDialogButton;
