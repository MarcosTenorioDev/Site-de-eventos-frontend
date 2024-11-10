import ageRatingIcon from "@/assets/icons/ageRatingIcon.svg";
import placeholder from "@/assets/images/home/placeholderEventCard.png";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { ToastType, useToastContext } from "@/core/contexts/toasts.context";
import { IAddress } from "@/core/interfaces/Address";
import { IEventPayload } from "@/core/interfaces/Event.interface";
import { TicketTypePayload } from "@/core/interfaces/TicketType";
import AddressService from "@/core/services/address.service";
import AssetsService from "@/core/services/assets.service";
import EventsService from "@/core/services/event.service";
import {
	DownloadIcon,
	MapPinIcon,
	MinusIcon,
	PlusIcon,
	XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import EditorView from "../MarkdownEditor/EditorView";
import { useStepper } from "../stepper/use-stepper";

interface IThirdStepProps {
	tickets: TicketTypePayload[];
	event: IEventPayload;
}

const ThirdStep = (props: IThirdStepProps) => {
	const { event, tickets } = props;
	const [imageBanner, setImageBanner] = useState<File>();
	const eventService = new EventsService();
	const assetsService = new AssetsService();
	const [address, setAddress] = useState<IAddress>();
	const addressService = new AddressService();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { prevStep, nextStep } = useStepper();

	const toast = useToastContext();
	const handleImageUpload = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			setImageBanner(file);
		}
	};

	const onSubmit = () => {
		try {
			setIsLoading(true);
			const payload = { ...event, ticketTypes: tickets };
			eventService
				.postEvent(payload)
				.then((event) => {
					if (imageBanner) {
						const payload = new FormData();

						payload.append("image", imageBanner);
						payload.append("eventId", event.id);
						payload.append("type", "image");
						payload.append("description", "main");

						assetsService
							.postAssets(payload)
							.then((asset) => {
								console.log(asset);
								toast.showToast(
									"Parabéns! O seu evento está pronto!🎉",
									ToastType.Success
								);
								nextStep();
								return;
							})
							.catch(() => {
								toast.showToast(
									"Parabéns! O seu evento está pronto🎉 - Mas houve um problema ao adicionar a imagem de banner, por favor, verificar!",
									ToastType.Warning
								);
								nextStep();
							});
						return;
					}

					toast.showToast(
						"Parabéns! O seu evento está pronto!🎉",
						ToastType.Success
					);
					nextStep();
				})
				.catch(() => {
					toast.showToast(
						"Houve um erro ao criar o seu evento, por favor, tente novamente ou contate o suporte técnico!",
						ToastType.Error
					);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} catch (err) {}
	};

	useEffect(() => {
		addressService
			.getAddressById(event.addressId)
			.then((address) => {
				setAddress(address);
			})
			.catch((err) => {
				console.error("Houve um erro ao buscar endereço do evento", err);
			});
	}, []);

	return (
		<div className="flex flex-col w-full px-5 sm:px-10 max-w-7xl my-10">
			{event ? (
				<>
					<h1 className="text-3xl font-semibold mb-10">
						Já estamos no final, revise a sua tela de evento antes de
						prosseguir.
					</h1>
					{imageBanner ? (
						<>
							<div
								className="w-full h-full max-w-[1140px] max-h-[500px] aspect-video relative rounded-xl overflow-hidden"
								style={{
									backgroundImage: `url(${URL.createObjectURL(imageBanner)})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							>
								{/* Imagem com sobreposição */}
								<img
									src={URL.createObjectURL(imageBanner)}
									alt="banner do evento"
									className="opacity-0 w-full h-full object-cover rounded-xl"
								/>

								<Button
									className="absolute top-0 right-0 text-white w-max h-max hover:bg-slate-300 hover:bg-opacity-15 hover:text-white z-10"
									variant={"ghost"}
									onClick={() => setImageBanner(undefined)}
								>
									<XCircleIcon className="w-10 h-10" />
								</Button>
							</div>
						</>
					) : (
						<>
							<div className="flex items-center justify-center w-full h-full max-w-[1140px] max-h-[500px] hover:bg-muted aspect-video border-2 border-dashed border-gray-500 rounded-xl hover:border-gray-900 transition-colors duration-300 p-10">
								<label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
									<span className="text-gray-500 flex flex-col items-center">
										Parece que você ainda não tem uma imagem para o seu evento,
										por favor selecione uma imagem.
										<DownloadIcon className="w-12 h-12 mt-6" />
									</span>
									<input
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handleImageUpload}
									/>
								</label>
							</div>
						</>
					)}

					<div className="flex flex-col sm:flex-row sm:justify-start text-center sm:text-start px-0 w-full max-w-[1140px] justify-center items-center mt-5 rounded-lg shadow-sm shadow-gray-400 bg-white sm:px-10 py-5">
						<div className="flex justify-start items-center gap-3 sm:flex-col sm:gap-0 sm:items-center sm:justify-start">
							<p className="text-3xl text-primary font-semibold">
								{event.startDate?.getDate()}
							</p>
							<p className="text-3xl text-primary font-semibold opacity-50">
								{event.startDate?.toLocaleString("default", { month: "short" })}
							</p>
							<p className="text-xl text-primary font-semibold opacity-50">
								{event.startDate?.toLocaleString("default", {
									weekday: "short",
								})}
							</p>
							<p className="text-3xl text-primary font-semibold opacity-50">
								{event.startDate?.getHours()}h
							</p>
						</div>

						<div className="flex justify-center items-start flex-col px-8 font-primary text-xl text-center sm:text-start">
							<div>
								<p className="mb-1 w-full text-3xl font-semibold text-gray-600">
									{event.title} - {event.format}
								</p>
								<p className="flex sm:gap-2 items-start text-primary-dark">
									<MapPinIcon className="h-8 w-8 min-h-6 min-w-6" />{" "}
									{address?.street} {address?.number} - {address?.neighborhood}{" "}
									- {address?.city}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col lg:flex-row gap-10 mt-14">
						<Card className="w-full h-min">
							<div className="p-4 ">
								<EditorView content={event.description} />
							</div>
							<CardContent>
								{/* {attractions.length ? (
									<>
										<h3 className="mb-6 text-xl">Atrações</h3>

										<Carousel
											className="w-10/12 mx-auto"
											plugins={[
												Autoplay({
													delay: 3000,
												}),
											]}
										>
											<CarouselContent>
												{attractions.map((attraction, index) => (
													<CarouselItem
														key={index}
														className="flex items-center justify-center"
													>
														<Attraction
															img={attraction.imageUrl}
															title={attraction.name}
															description={attraction.description}
														/>
													</CarouselItem>
												))}
											</CarouselContent>
											<CarouselPrevious className="hidden md:flex" />
											<CarouselNext className="hidden md:flex" />
										</Carousel>
									</>
								) : (
									""
								)} */}
								<div>
									<h3 className="font-bold text-xl text-start">
										Classificação etária
									</h3>
									<p className="flex items-center gap-3 font-semibold text-lg mt-2">
										<i>
											<img src={ageRatingIcon} alt="" className="w-7" />
										</i>
										{event.ageRating} Anos
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="min-w-[280px] md:min-w-[330px] h-fit">
							<CardHeader className="bg-primary-dark text-white font-primary rounded-t-sm p-3">
								Ingressos
							</CardHeader>
							{tickets.length ? (
								<>
									<div className="flex flex-col justify-between">
										<CardContent className="p-4 min-w-64 text-start">
											{tickets.map((ticket, index) => (
												<div key={index} className="flex items-center">
													<div className="w-full">
														<p className="font-semibold text-lg">
															{ticket.description}
														</p>
														<p className="mb-2 text-sm text-primary">
															R$ {ticket.price}
														</p>
													</div>
													<div>
														<div className="flex">
															<Button
																disabled={true}
																variant={"ghost"}
																className="p-0"
																type="button"
																onClick={() => {}}
															>
																<MinusIcon />
															</Button>
															<input
																disabled={true}
																type="number"
																name={`tickets[${index}].quantity`}
																className="max-w-8 text-center"
															/>
															<Button
																disabled={true}
																variant={"ghost"}
																className="p-0"
																type="button"
															>
																<PlusIcon />
															</Button>
														</div>
													</div>
												</div>
											))}
										</CardContent>
										<CardFooter className="flex flex-col text-start relative border-t">
											<div className="w-full">
												<h3 className="text-md mt-4">Total</h3>
												<h3 className="text-lg text-primary">R$ 0.00</h3>
											</div>

											<Button
												type="button"
												className="absolute -bottom-5 mx-auto text-lg"
												disabled={true}
											>
												Selecione um ingresso
												<PlusIcon className="ml-2" />
											</Button>
										</CardFooter>
									</div>
								</>
							) : (
								<CardContent className="p-4 w-64 mx-auto text-center">
									<h3 className="w-full font-bold text-muted-foreground text-xl">
										{" "}
										Oops... Parece que ainda não há ingressos disponíveis para
										venda
									</h3>
								</CardContent>
							)}
						</Card>
					</div>
					<div className="flex flex-col text-primary-dark sm:flex-row justify-center items-center w-full max-w-[1140px] sm:justify-start text-center mt-12 sm:mt-8 font-primary gap-8">
						<div>
							<h2 className="text-4xl font-semibold mb-5">Produtor</h2>
							<img
								src={placeholder}
								alt=""
								className="w-full aspect-video sm:w-48"
							/>
						</div>
						<div className=" flex flex-col justify-end gap-5">
							<h3 className="text-3xl font-semibold">Produtor exemplo</h3>
							<Button className="py-7">Entre em contato</Button>
						</div>
					</div>
				</>
			) : (
				<>
					<div className="w-full bg-red-100 text-red-700 px-4 py-3 rounded-md text-center">
						<p>
							Não foi possível recuperar os dados do evento. Por favor, tente
							novamente mais tarde.
						</p>
					</div>
				</>
			)}
			<div className="flex self-end gap-6 mt-10">
				<Button
					onClick={prevStep}
					size="lg"
					variant="secondary"
					className="text-xl"
				>
					Voltar
				</Button>
				<Button
					size="lg"
					className="bg-green-500 hover:bg-green-300 text-xl"
					type="submit"
					onClick={onSubmit}
					disabled={isLoading}
				>
					{isLoading ? "Carregando..." : "Criar evento"}
				</Button>
			</div>
		</div>
	);
};

export default ThirdStep;
