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
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useT } from "@/assets/i18n";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { DateRangePicker, Select } from "@/components/formInputs/Inputs";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import DefaultCard from "@/components/eventCards/DefaultCard";
const Home = () => {
  const t = useT();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [imagesBanner, setImagesBanner] = useState<string[]>([]);
  const [dateRangeValue, setDateRangeValue] = useState<DateRange | undefined>(
    undefined
  );
  const data = [
    {
      img: banner1,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner2,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner1,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner2,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner1,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner2,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner1,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner2,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner1,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
    {
      img: banner2,
      address: "Rua da batalha, 85, Jordão Alto - Rec",
      date: "20 de abril de 2024",
      title: "Eclese",
    },
  ];

  const initialValues = {
    city: "",
    category: "",
    date: undefined,
  };

  const validationSchema = Yup.object({
    city: Yup.string(),
    category: Yup.string(),
    date: Yup.object().shape({
      from: Yup.date(),
      to: Yup.date(),
    }),
  });

  const onSubmit = async (values: any) => {
    console.log(values);
    console.log(dateRangeValue);
  };

  const handleSelectedDate = (value: DateRange | undefined) => {
    setDateRangeValue(value);
    console.log("Valor selecionado:", value);
  };

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
    <>
      <div className="flex flex-col items-center justify-center mt-4 sm:mt-8">
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
      </div>

      <div className="w-full flex items-center justify-center mt-3 sm:mt-5 md:mt-6 mb-9 md:mb-10">
        <MagnifyingGlassIcon className="w-8 text-primary font-bold h-9 rounded-md border border-primary border-r-0 rounded-r-none px-2" />
        <Input
          placeholder={t("application.pages.home.searchPlaceholder")}
          className="w-10/12 sm:w-9/12 md:w-7/12 lg:w-6/12 max-w-[1100px] border-primary font-bold text-sm placeholder:text-primary text-primary border-l-0 rounded-l-none pl-0 focus-visible:outline-0 focus-visible:ring-0 focus-visible:to-transparent focus:outline-none"
        />
      </div>

      <div className="w-full bg-primary-light py-10">
        <div className="w-full bg-primary-dark h-12 text-white font-bold font-primary text-center flex items-center justify-center">
          Transforme seus sonhos em realidade
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className="flex flex-col md:flex-row  gap-4 lg:gap-5 justify-center items-center mt-7 px-2 sm:px-4 md:px-6 lg:px-7 max-w-7xl mx-auto">
            <div className="flex gap-2 sm:gap-5 justify-center w-full">
              <Select
                control="city"
                options={[
                  { value: "", label: "Selecione uma opção" },
                  {
                    value: "Recife",
                    label: "Recife",
                  },
                ]}
                className="w-full max-w-80"
              >
                Cidade
              </Select>
              <Select
                control="category"
                options={[
                  { value: "", label: "Selecione uma opção" },
                  {
                    value: "Show",
                    label: "Show",
                  },
                  {
                    value: "Empreendedorismo",
                    label: "Empreendedorismo",
                  },
                  {
                    value: "Rave",
                    label: "Rave",
                  },
                ]}
                className="w-full max-w-80"
              >
                Categoria
              </Select>
            </div>

            <Field name="date">
              {({ field, form }: any) => (
                <DateRangePicker
                  {...field}
                  className="lg:max-w-80"
                  onSelect={(value: any) => {
                    form.setFieldValue("date", value);
                    handleSelectedDate(value);
                  }}
                >
                  Data
                </DateRangePicker>
              )}
            </Field>

            <div className="mt-5 w-full md:w-auto flex justify-center">
              <Button type="submit" className="font-semibold">
                Aplicar filtros <FilterIcon />
              </Button>
            </div>
          </Form>
        </Formik>
      </div>

      <div className="max-w-7xl mx-auto mt-20">
        <h3 className="text-xl mx-auto xl:w-full w-10/12 mb-3 text-primary-dark font-primary font-normal">Mais recentes</h3>
        <Carousel
          setApi={setApi}
          className="mx-auto xl:w-full w-10/12 max-w-7xl"
          opts={{
            loop: false,
          }}
        >
          <CarouselContent className="p-4">
            {data.map((card) => {
              return (
                <CarouselItem className="basis-auto">
                  <DefaultCard
                    address={card.address}
                    img={card.img}
                    date={card.date}
                    title={card.title}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>

      <div className="max-w-7xl mx-auto mt-20">
        <h3 className="text-xl mx-auto xl:w-full w-10/12 mb-3 text-primary-dark font-primary font-normal">Festival</h3>
        <Carousel
          setApi={setApi}
          className="mx-auto xl:w-full w-10/12 max-w-7xl"
          opts={{
            loop: false,
          }}
        >
          <CarouselContent className="p-4">
            {data.map((card) => {
              return (
                <CarouselItem className="basis-auto">
                  <DefaultCard
                    address={card.address}
                    img={card.img}
                    date={card.date}
                    title={card.title}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselNext />
          <CarouselPrevious />
        </Carousel>
      </div>
    </>
  );
};

export default Home;
