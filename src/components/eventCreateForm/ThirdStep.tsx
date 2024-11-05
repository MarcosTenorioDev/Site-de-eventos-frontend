import ageRatingIcon from "@/assets/icons/ageRatingIcon.svg";
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
								src="data:image/jpeg;base64,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"
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
