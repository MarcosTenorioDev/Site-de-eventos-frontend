import { formatDate } from "@/core/services/helper.service";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Address } from "@/core/interfaces/Address";
import { useNavigate } from "react-router-dom";

const MyEventsCards = (props: {
	id: string;
	img: string;
	address: Address;
	startDate: string;
	title: string;
}) => {
	const { img, address, startDate, title, id } = props;
	const navigate = useNavigate()
	return (
		<>
			<Card className="aspect-[9/10] w-48 drop-shadow-md">
				<CardContent className="p-0 h-full overflow-hidden cursor-pointer">
					<div className="w-full h-full rounded-lg overflow-hidden relative" onClick={() => navigate(`/managment/event/${id}`)}>
						<img
							src={img}
							alt="Imagem"
							className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform-gpu hover:scale-110"
						/>
					</div>
				</CardContent>

				<CardFooter className="p-4 font-primary w-48 text-black rounded-lg overflow-hidden rounded-t-none drop-shadow-md flex flex-col">
					<p className="text-md font-medium text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
						{title}
					</p>
					<p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
						{address.street}
					</p>
					<p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
						{formatDate(startDate)}
					</p>
				</CardFooter>
			</Card>
		</>
	);
};

export default MyEventsCards;
