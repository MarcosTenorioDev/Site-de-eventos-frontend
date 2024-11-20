import { IEventFilter, IrecentEvents } from "@/core/interfaces/Event.interface";
import AddressService from "@/core/services/address.service";
import { formatDate } from "@/core/services/helper.service";
import { Field, Form, Formik } from "formik";
import { Filter, FilterIcon, FilterXIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import * as Yup from "yup";
import DefaultCard from "../eventCards/DefaultCard";
import { DateRangePicker, FormikMultiSelect } from "../formInputs/Inputs";
import { Button, buttonVariants } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ToastService from "@/core/services/toast.service";
import { cn } from "@/lib/utils";
import EventsService from "@/core/services/event.service";
import { Spinner } from "../ui/loading-spinner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FilterEventsProps {
  categories: { value: string; label: string }[];
}

const formatDateToYyyyMmDd = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T03:00:00.000Z`;
};

const FilterEvents = (props: FilterEventsProps) => {
  const [dateRangeValue, setDateRangeValue] = useState<DateRange | undefined>(
    undefined
  );
  const [filteredEvents, setFilteredEvents] = useState<IrecentEvents[]>();
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories] = useState<{ value: string; label: string }[]>(
    props.categories
  );
  const initialValues = {
    city: "",
    category: "",
    date: undefined,
  };
  const eventsService = new EventsService();
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const addressService = new AddressService();
  const validationSchema = Yup.object({
    city: Yup.array().of(Yup.string()),
    category: Yup.string(),
    date: Yup.object().shape({
      from: Yup.date(),
      to: Yup.date(),
    }),
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const onSubmit = async (values: any) => {
    if (
      (!values.city || !values.city.length) &&
      !values.category &&
      !values.date
    ) {
      ToastService.showWarning("É necessário selecionar ao menos um filtro.");
      return;
    }
    const payload: IEventFilter = {
      cities: values.city.length ? values.city.join(",") : "",
      categoryId: values.category ?? "",
      dateRange: {
        from: values.date?.from
          ? formatDateToYyyyMmDd(new Date(values.date.from))
          : "",
        to: values.date?.to
          ? formatDateToYyyyMmDd(new Date(values.date.to))
          : "",
      },
    };

    setIsLoading(true);
    eventsService
      .getFilteredEvents(payload)
      .then((event) => {
        setFilteredEvents(event);
        setIsFiltered(true);
      })
      .catch(() => {
        ToastService.showError(
          "Houve um erro ao filtrar os eventos, por favor, tente novamente"
        );
        setIsFiltered(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSelectedDate = (value: DateRange | undefined) => {
    setDateRangeValue(value);
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const cities = await addressService.getCities();
        const cityOptions = cities.map((city) => ({
          value: city.city,
          label: city.city,
        }));
        setCities(cityOptions);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <>
      <div className="w-full bg-primary-light py-10">
        <div className="w-full bg-primary-dark h-12 text-white font-light font-primary text-center flex items-center justify-center overflow-hidden relative text-nowrap">
          <div className="animate-marquee">
            <span>Transforme seus sonhos em realidade</span>
            <span className="ml-8">Transforme seus sonhos em realidade</span>
            <span className="ml-8">Transforme seus sonhos em realidade</span>
            <span className="ml-8">Transforme seus sonhos em realidade</span>
            <span className="ml-8">Transforme seus sonhos em realidade</span>
            <span className="ml-8">Transforme seus sonhos em realidade</span>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ resetForm }) => (
            <Form className="flex flex-col lg:flex-row  gap-4 lg:gap-5 justify-center items-start mt-7 px-2 sm:px-4 md:px-6 lg:px-7 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 justify-center w-full">
                <Field name="city">
                  {({ field, form }: any) => (
                    <FormikMultiSelect
                      control="city"
                      options={cities.map((city) => ({
                        value: city.value,
                        label: city.label,
                      }))}
                      value={field.value ? field.value : []}
                      maxCount={1}
                      placeholder="Selecione a cidade"
                      variant="inverted"
                      animation={0}
                      onValueChange={(city: { city: string }[]) => {
                        form.setFieldValue(field.name, city);
                      }}
                      isEmptyMessage="Sem resultados."
                      disabled={isFiltered || isLoading}
                    >
                      Cidade
                    </FormikMultiSelect>
                  )}
                </Field>

                <Field name="category">
                  {({ field, form }: any) => (
                    <div className="flex flex-col w-full">
                      <label
                        htmlFor="category"
                        className="font-primary font-medium"
                      >
                        Categoria
                      </label>

                      <Select
                        name="category"
                        value={field.value || ""}
                        onValueChange={(value: string) =>
                          form.setFieldValue(field.name, value)
                        }
                        disabled={isFiltered || isLoading}
                      >
                        <SelectTrigger className="flex h-12 w-full font-primary text-primary-dark font-medium items-center justify-between whitespace-nowrap rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                              className="cursor-pointer"
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </Field>
              </div>

              <div className="w-full flex flex-col lg:max-w-80 ">
                <Field name="date">
                  {({ field, form }: any) => (
                    <DateRangePicker
                      {...field}
                      disabled={isFiltered || isLoading}
                      onSelect={(value: any) => {
                        form.setFieldValue("date", value);
                        handleSelectedDate(value);
                      }}
                      defaultStartDate={{
                        to: "",
                        from: "",
                      }}
                      value={dateRangeValue}
                    >
                      Data
                    </DateRangePicker>
                  )}
                </Field>
              </div>

              <div className="w-full lg:w-auto flex justify-center lg:self-end">
                {isLoading ? (
                  <button
                    type="button"
                    className={cn(buttonVariants())}
                    disabled={true}
                  >
                    Carregando <Spinner className="w-6 h-6 ml-2 text-white" />
                  </button>
                ) : isFiltered ? (
                  <button
                    type="button"
                    className={cn(buttonVariants())}
                    onClick={() => {
                      resetForm();
                      setIsFiltered(false);
                      setDateRangeValue(undefined);
                    }}
                  >
                    Limpar filtros <FilterXIcon />
                  </button>
                ) : (
                  <Button type="submit" className="font-semibold">
                    Aplicar filtros <FilterIcon />
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {filteredEvents?.length && isFiltered ? (
        <>
          <div className="max-w-7xl mx-auto mt-14 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg py-6 lg:p-6">
            <div className="flex items-center mb-6 px-6 lg:px-0">
              <Filter className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-blue-600">
                Eventos filtrados
              </h3>
            </div>
            <Carousel
              className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-6xl"
              opts={{
                loop: false,
              }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex"
              >
                <CarouselContent className="p-4">
                  {filteredEvents.map((card) => (
                    <CarouselItem className="basis-auto" key={card.id}>
                      <motion.div variants={itemVariants}>
                        <DefaultCard
                          id={card.id}
                          address={card.Address}
                          img={card.assets[0]?.url}
                          startDate={formatDate(card.startDate)}
                          title={card.title}
                        />
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </motion.div>
              <CarouselNext className="hidden sm:flex" />
              <CarouselPrevious className="hidden sm:flex" />
            </Carousel>
          </div>
        </>
      ) : !filteredEvents?.length && isFiltered ? (
        <Card className="max-w-7xl mx-auto mt-14 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg py-6 lg:p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center text-blue-600">
              <FilterXIcon className="w-8 h-8 text-blue-600 mr-3" />
              Nenhum evento encontrado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-primary-dark font-semibold mb-6">
              Não encontramos eventos que correspondam aos seus critérios de
              filtragem atuais.
            </p>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </>
  );
};

export default FilterEvents;
