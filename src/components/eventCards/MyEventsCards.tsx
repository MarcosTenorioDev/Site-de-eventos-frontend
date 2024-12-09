import { formatDate } from "@/core/services/helper.service";
import { Card, CardContent, CardFooter } from "../ui/card";
import { IAddress } from "@/core/interfaces/Address";
import { Link, useNavigate } from "react-router-dom";
import placeholder from "@/assets/images/home/placeholderEventCard.png";
import { Button } from "../ui/button";
import { PenBoxIcon } from "lucide-react";

const MyEventsCards = (props: {
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
      <Card className="aspect-video flex-grow drop-shadow-md pb-0">
        <CardContent className="p-0 w-full aspect-video overflow-hidden">
          <div className="w-full aspect-video rounded-lg overflow-hidden relative">
            <img
              src={img ? img : placeholder}
              alt="Imagem"
              className="absolute inset-0 w-full aspect-video rounded-xl object-cover transition-transform duration-300 transform-gpu hover:scale-110"
            />
          </div>
        </CardContent>

        <CardFooter className=" font-primary w-full text-black rounded-lg overflow-hidden rounded-t-none drop-shadow-md flex flex-col pb-2">
          <p className="text-md font-medium text-start flex items-center w-60 h-14 line-clamp-2 self-start">
            <Link to={`/event/${id}`} className="no-underline hover:underline hover:underline-offset-2">
              {title}
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {address.street}, {address.city} Nº {address.number}
          </p>
          <p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {formatDate(startDate)}
          </p>{" "}
          <Button
            variant={"link"}
            onClick={() => navigate(`/managment/event/${id}`)}
            className="text-xs text-primary-dark text-end justify-end w-full whitespace-nowrap gap-2"
          >
            Editar evento <PenBoxIcon className="w-5 h-5 underline" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default MyEventsCards;
