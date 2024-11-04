import { useT } from "@/assets/i18n";
import banner from "@/assets/images/home/Banner.png";
import DefaultCard from "@/components/eventCards/DefaultCard";
import { DateRangePicker, Select } from "@/components/formInputs/Inputs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IrecentEvents } from "@/core/interfaces/Event.interface";
import CategoriesService from "@/core/services/categories.service";
import EventsService from "@/core/services/event.service";
import { formatDate } from "@/core/services/helper.service";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Autoplay from "embla-carousel-autoplay";
import { Field, Form, Formik } from "formik";
import { FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import * as Yup from "yup";

const Loading = () => {
	return (
		<div className="flex flex-col items-center justify-center mt-4 sm:mt-8">
			<Skeleton className="w-full sm:w-11/12 md:w-10/12 lg:w-7/12 max-w-[1200px] bg-slate-400 aspect-video" />
			<Skeleton className="w-full sm:w-11/12 md:w-10/12 lg:w-7/12 max-w-[1200px] bg-slate-400 h-10 mt-10" />
			<Skeleton className="hidden md:flex w-full bg-slate-400 h-44 mt-10" />
			<div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-[1200px]">
				<Skeleton className="bg-slate-400 h-56" />
				<Skeleton className="bg-slate-400 h-56" />
				<Skeleton className="bg-slate-400 h-56" />
			</div>
			<Skeleton className="hidden md:flex w-full bg-slate-400 h-44 mt-10" />
			<div className="grid grid-cols-3 gap-4 mt-10 w-full max-w-[1200px]">
				<Skeleton className="bg-slate-400 h-56" />
				<Skeleton className="bg-slate-400 h-56" />
				<Skeleton className="bg-slate-400 h-56" />
			</div>
		</div>
	);
};

const Home = () => {
	const t = useT();
	const eventService = new EventsService();
	const categoriesService = new CategoriesService();
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [imagesBanner, setImagesBanner] = useState<(string | undefined)[]>([]);
	const [dateRangeValue, setDateRangeValue] = useState<DateRange | undefined>(
		undefined
	);
	const [recentEvents, setRecentEvents] = useState<IrecentEvents[]>();
	const [festivalEvents, setFestivalEvents] = useState<any>();
	const [theaterEvents, setTheaterEvents] = useState<any>();
	const [sportsEvents, setSportsEvents] = useState<any>();
	const [categories, setCategories] = useState<
		{ value: string; label: string }[]
	>([{ value: "", label: "Selecione uma opção" }]);
	const initialValues = {
		city: "",
		category: "",
		date: undefined,
	};
	const [isLoadingComponent, setIsLoadingComponent] = useState<boolean>(true);

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
	}, [api]);

	useEffect(() => {
		categoriesService.getCategories().then((results) => {
			if (results) {
				const categoriesResult = results.map((categorie) => {
					return {
						value: categorie.id,
						label: categorie.name,
					};
				});
				setCategories([
					{ value: "", label: "Selecione uma opção" },
					...categoriesResult,
				]);
				const fetchCategoryEvents = async () => {
					for (const category of categoriesResult) {
						const categoryLabel = category.label.toLowerCase();
						if (categoryLabel.includes("festas e shows")) {
							const events = await eventService.getEventByCategory(
								category.value
							);
							setFestivalEvents(events);
						} else if (categoryLabel.includes("stand up comedy")) {
							const events = await eventService.getEventByCategory(
								category.value
							);
							setTheaterEvents(events);
						} else if (categoryLabel.includes("esportes")) {
							const events = await eventService.getEventByCategory(
								category.value
							);
							setSportsEvents(events);
						}
					}
				};

				fetchCategoryEvents();
			}
		});
		eventService
			.getRecentEvents()
			.then((events) => {
				setRecentEvents(events);
				setIsLoadingComponent(false);
				const images = events.map((event) => {
					const mainAssets = event.assets?.find(
						(asset) => asset.type === "image"
					);
					return mainAssets?.url;
				});
				const validImages = images.filter((url: any) => {
					return typeof url === "string";
				});
				setImagesBanner(validImages);
				setCount(validImages.length);
			})
			.catch((err) => {
				console.error(err);
				setIsLoadingComponent(false);
			});
	}, []);

	return (
		<>
			{isLoadingComponent ? (
				Loading()
			) : (
				<>
					<div className="flex flex-col items-center justify-center mt-4 sm:mt-8">
						<Carousel
							setApi={setApi}
							className="w-full sm:w-11/12 md:w-10/12 lg:w-7/12 max-w-[1200px]"
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
							<CarouselPrevious className="hidden md:flex" />
							<CarouselNext className="hidden md:flex" />
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
						<div className="w-full bg-primary-dark h-12 text-white font-light font-primary text-center flex items-center justify-center overflow-hidden relative text-nowrap">
							<div className="animate-marquee">
								<span>Transforme seus sonhos em realidade</span>
								<span className="ml-8">
									Transforme seus sonhos em realidade
								</span>
								<span className="ml-8">
									Transforme seus sonhos em realidade
								</span>
								<span className="ml-8">
									Transforme seus sonhos em realidade
								</span>
								<span className="ml-8">
									Transforme seus sonhos em realidade
								</span>
								<span className="ml-8">
									Transforme seus sonhos em realidade
								</span>
							</div>
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
										options={categories}
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
						{recentEvents?.length ? (
							<>
								<h3 className="text-xl mx-auto w-11/12 xl:11/12 sm:w-10/12 2xl:w-full max-w-7xl mb-3 text-primary-dark font-primary font-normal">
									Mais recentes
								</h3>
								<Carousel
									setApi={setApi}
									className="mx-auto w-11/12 sm:w-10/12 xl:11/12 2xl:w-full max-w-7xl"
									opts={{
										loop: false,
									}}
								>
									<CarouselContent className="p-4">
										{recentEvents.map((card) => {
											return (
												<CarouselItem className="basis-auto" key={card.id}>
													<DefaultCard
														id={card.id}
														address={card.Address}
														img={card.assets[0]?.url}
														startDate={formatDate(card.startDate)}
														title={card.title}
													/>
												</CarouselItem>
											);
										})}
									</CarouselContent>
									<CarouselNext className="hidden sm:flex" />
									<CarouselPrevious className="hidden sm:flex" />
								</Carousel>
							</>
						) : (
							<></>
						)}
					</div>

					<div className="max-w-7xl mx-auto mb-20 mt-10">
						{festivalEvents?.length ? (
							<>
								<h3 className="text-xl mx-auto w-11/12 xl:11/12 sm:w-10/12 2xl:w-full max-w-7xl mb-3 text-primary-dark font-primary font-normal">
									Festival
								</h3>
								<Carousel
									setApi={setApi}
									className="mx-auto w-11/12 xl:11/12 sm:w-10/12 2xl:w-full max-w-7xl"
									opts={{
										loop: false,
									}}
								>
									<CarouselContent className="p-4">
										{festivalEvents.map((card: any) => {
											return (
												<CarouselItem className="basis-auto" key={card.id}>
													<DefaultCard
														id={card.id}
														address={card.location}
														img={card.assets[0]?.url}
														startDate={formatDate(card.startDate)}
														title={card.title}
													/>
												</CarouselItem>
											);
										})}
									</CarouselContent>
									<CarouselNext className="hidden sm:flex" />
									<CarouselPrevious className="hidden sm:flex" />
								</Carousel>
							</>
						) : (
							<></>
						)}
					</div>

					<div className=" w-11/12 xl:w-full sm:w-10/12 max-w-7xl mx-auto bg-primary-light h-52 md:h-60 py-10 relative overflow-hidden flex items-center justify-end pr-4 md:pr-8 2xl:pr-14">
						<img
							src={banner}
							alt="Imagem de duas pessoas curtindo um evento"
							className=" absolute -top-50% -left-40 sm:-left-16 w-80 md:w-96 transition-transform duration-300 transform-gpu hover:scale-105 h-64 md:h-80"
						/>
						<div className="text-right lg:text-left w-[50%]">
							<h3 className="text-lg md:text-3xl lg:text-4xl xl:text-5xl font-semibold italic">
								ENCONTRE OS EVENTOS <br /> QUE PROMETEM <br /> MARCAR SUA
								AGENDA!
							</h3>
						</div>
					</div>

					<div className="max-w-7xl mx-auto mb-20 mt-10">
						{theaterEvents?.length ? (
							<>
								<h3 className="text-xl mx-auto w-11/12 xl:11/12 sm:w-10/12 2xl:w-full max-w-7xl mb-3 text-primary-dark font-primary font-normal">
									Teatros e espetáculos
								</h3>
								<Carousel
									setApi={setApi}
									className="mx-auto w-11/12 xl:11/12 sm:w-10/12 2xl:w-full max-w-7xl"
									opts={{
										loop: false,
									}}
								>
									<CarouselContent className="p-4">
										{theaterEvents.map((card: any) => {
											return (
												<CarouselItem className="basis-auto" key={card.id}>
													<DefaultCard
														id={card.id}
														address={card.location}
														img={card.assets[0]?.url}
														startDate={formatDate(card.startDate)}
														title={card.title}
													/>
												</CarouselItem>
											);
										})}
									</CarouselContent>
									<CarouselNext className="hidden sm:flex" />
									<CarouselPrevious className="hidden sm:flex" />
								</Carousel>
							</>
						) : (
							<></>
						)}
					</div>

					<div className="max-w-7xl mx-auto mb-20 mt-10">
						{sportsEvents?.length ? (
							<>
								<h3 className="text-xl mx-auto w-11/12 xl:11/12 sm:w-10/12 2xl:w-full max-w-7xl mb-3 text-primary-dark font-primary font-normal">
									Esportes
								</h3>
								<Carousel
									setApi={setApi}
									className="mx-auto w-11/12 xl:11/12 sm:w-10/12 2xl:w-full max-w-7xl"
									opts={{
										loop: false,
									}}
								>
									<CarouselContent className="p-4">
										{sportsEvents.map((card: any) => {
											return (
												<CarouselItem className="basis-auto" key={card.id}>
													<DefaultCard
														id={card.id}
														address={card.location}
														img={card.assets[0]?.url}
														startDate={formatDate(card.startDate)}
														title={card.title}
													/>
												</CarouselItem>
											);
										})}
									</CarouselContent>
									<CarouselNext className="hidden sm:flex" />
									<CarouselPrevious className="hidden sm:flex" />
								</Carousel>
							</>
						) : (
							<></>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default Home;
