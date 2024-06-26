import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../ui/card";

const DefaultCard = (props: {
  id:string;
  img: string;
  address: string;
  startDate: string;
  title: string;
}) => {
  const { img, address, startDate, title, id } = props;
  const navigate = useNavigate()
  return (
    <>
      <Card className="aspect-[9/10] w-48 drop-shadow-md">
        <CardContent className="p-0 h-full overflow-hidden cursor-pointer" onClick={() => navigate(`/event/${id}`)}>
          <div className="w-full h-full bg-no-repeat bg-cover bg-center rounded-lg overflow-hidden relative">
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
            {address}
          </p>
          <p className="text-xs text-muted-foreground text-start w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {startDate}
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default DefaultCard;
