import banner1 from "@/assets/mockImages/banner1.jpeg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Attraction from "@/components/attractions/attraction";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

const Event = () => {
  const jsonExample = {
    id: "9490d8db-0808-4c51-bcc4-5cb6c4f076fe",
    title: "Primeiro evento",
    description: "Esse é meu primeiro evento",
    location: "Recife",
    capacity: 1000,
    categoryId: "0c1855a2-4cb4-4a0c-b8d5-2ad4b695c234",
    status: null,
    startDate: "2024-01-01T00:00:00.000Z",
    endDate: "2024-01-01T00:00:00.000Z",
    salesStartDate: null,
    showStartDate: null,
    format: "presencial",
    producer: "PI4 producer",
    ageRating: 12,
    price: null,
    additionalDetails: "Essa é a informação adicional do meu primeiro evento",
    creatorId: "3b4305ef-2385-44c2-87ae-fa89c6ccb300",
  };
  console.log(jsonExample)
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [attractions, setAttractions] = useState<string[]>([]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
    setAttractions([banner1, banner1, banner1, banner1]);
    setCount(attractions.length);
  }, [api]);
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4 sm:mt-8 w-full my-56">
        <div className="flex flex-col justify-start items-center w-full">
          <img
            src={banner1}
            alt="imagem do banner"
            className="object-cover w-full h-full rounded-xl max-w-[1140px] max-h-[500px] aspect-video"
          />
          <div className="flex w-full max-w-[1140px] justify-start  mt-5">
            <Card className="p-5 rounded-3xl shadow-md shadow-gray-500 hover:shadow-lg hover:shadow-gray-500 w-min text-center font-primary">
              <p className="text-3xl text-primary font-semibold">20</p>
              <p className="text-3xl text-primary font-semibold opacity-50">
                abr
              </p>
              <p className="text-xl text-primary font-semibold opacity-50">
                sex
              </p>
              <p className="text-3xl text-primary font-semibold opacity-50">
                21h
              </p>
            </Card>
            <div className="flex justify-center items-start flex-col px-8 font-primary text-xl">
              <p className="mb-1">Rua da batalha, 85, Jordão Alto - Recife</p>
              <p>Presencial</p>
            </div>
          </div>
          <div className="flex w-full max-w-[1140px] justify-start  mt-8 font-primary">
            <Card className="w-6/12">
              <CardHeader>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                delectus sed odit officia eum reprehenderit ut, dolores autem
                tenetur in, dolore cum a! Aut, provident consectetur? Natus,
                beatae? Minus, eaque?
              </CardHeader>
              <CardContent className="">
                <h3 className="mb-6 text-xl">Atrações</h3>
                <Carousel setApi={setApi} className="w-10/12 mx-auto">
                  <CarouselContent>
                    {attractions.map((attraction) => {
                      return (
                        <CarouselItem className="flex items-center justify-center">
                          <Attraction
                            img={attraction}
                            title="Kenzy"
                            description="The React Framework created and maintained by @vercel."
                          />
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
                <div className="py-2 text-center text-sm text-muted-foreground flex items-center justify-center">
                  <div className="flex gap-[4px]">
                    {Array.from({ length: count }).map((_, index) => {
                      console.log(current, index+1)
                      return (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index + 1 === current ? "bg-black" : "bg-gray-300"
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;
