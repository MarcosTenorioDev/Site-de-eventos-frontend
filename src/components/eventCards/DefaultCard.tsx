import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Calendar } from "lucide-react";
import { IAddress } from "@/core/interfaces/Address";
import placeholder from "@/assets/images/home/placeholderEventCard.png";

const DefaultCard = (props: {
	id: string;
	img: string;
	address: IAddress;
	startDate: string;
	title: string;
}) => {
	const { img, address, startDate, title, id } = props;
	const navigate = useNavigate();
	return (
		<>
			<Card
				className="aspect-[16/8] w-72 border-0 drop-shadow-none shadow-none hover:shadow-md rounded-md hover:cursor-pointer"
				onClick={() => navigate(`/event/${id}`)}
			>
				<CardContent className="p-0 h-full overflow-hidden cursor-pointer">
					<div className="w-full h-full bg-no-repeat bg-cover bg-center rounded-t-lg overflow-hidden relative">
						<img
							src={img ? img : placeholder}
							alt="Imagem"
							className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 transform-gpu hover:scale-110"
						/>
					</div>
				</CardContent>
				<CardFooter className="p-4 font-primary text-black rounded-lg overflow-hidden rounded-t-none drop-shadow-md flex flex-col">
					<p className="text-md font-medium text-start line-clamp-2 w-full overflow-hidden text-ellipsis text-primary-dark">
						{title}
					</p>
					<p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap flex flex-row mt-1">
						{address?.street}{address?.street ? "," : ""} {address?.city}{" "}
						{address?.number ? "Nº" : ""} {address?.number}
					</p>
					<p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2 mt-2">
						<Calendar className="w-4 h-4" /> {startDate}
					</p>
				</CardFooter>
			</Card>
		</>
	);
};

export default DefaultCard;
