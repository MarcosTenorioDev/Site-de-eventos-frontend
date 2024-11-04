import placeholder from "@/assets/images/home/placeholderEventCard.png";
import { IAddress } from "@/core/interfaces/Address";
import { IPurchaseOrder } from "@/core/interfaces/PurchaseOrder";
import { formatDate } from "@/core/services/helper.service";
import { Card, CardContent, CardFooter } from "../ui/card";
import PurchaseOrderDialogButton from "./PurchaseOrderDialogButton";

const PurchaseOrderCards = (props: {
	id: string;
	img: string;
	address: IAddress;
	startDate: string;
	title: string;
	status: string;
	purchaseOrder: IPurchaseOrder;
}) => {
	const { img, address, startDate, title, purchaseOrder, status } = props;
	return (
		<>
			<Card className="aspect-video w-80 drop-shadow-md">
				<CardContent className="p-0 h-full overflow-hidden">
					<div className="w-full h-full rounded-t-lg overflow-hidden relative">
						<img
							src={img ? img : placeholder}
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
						{address.street}, {address.city} Nº {address.number}
					</p>

					<PurchaseOrderDialogButton
						address={address}
						img={img}
						purchaseOrder={purchaseOrder}
						startDate={startDate}
						status={status}
						title={title}
						key={purchaseOrder.id}
					/>
				</CardFooter>
			</Card>
		</>
	);
};

export default PurchaseOrderCards;
