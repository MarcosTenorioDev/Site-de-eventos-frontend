import { Card, CardContent } from "@/components/ui/card";
import {
  CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import banner1 from "@/assets/mockImages/banner1.jpeg";
import banner2 from "@/assets/mockImages/banner2.jpg";
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [imagesBanner, setImagesBanner] = useState<string[]>([]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
    setImagesBanner([banner1, banner2, banner1, banner2]);
    setCount(imagesBanner.length);
  }, [api]);

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <Carousel
        setApi={setApi}
        className="w-full sm:w-10/12 md:w-8/12 lg:w-7/12 max-w-[1200px]"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent>
          {imagesBanner.map((image, index) => {
            return (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-0">
                    <img
                      src={image}
                      alt="imagem do banner"
                      className="object-cover w-full h-full rounded-xl"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground flex items-center justify-center">
        <div className="flex gap-[4px]">
          {Array.from({ length: count }).map((_, index) => {
            return (
              <div key={index}
                className={`w-2 h-2 rounded-full ${
                  index + 1 === current ? "bg-black" : "bg-gray-300"
                }`}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
