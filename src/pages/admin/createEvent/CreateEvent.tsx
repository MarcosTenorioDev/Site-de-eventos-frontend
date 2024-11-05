import FirstStep from "@/components/eventCreateForm/FirstStep";
import SecondStep from "@/components/eventCreateForm/SecondStep";
import ThirdStep from "@/components/eventCreateForm/ThirdStep";
import { Step, type StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { IEventPayload } from "@/core/interfaces/Event.interface";
import { Check, TicketIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
	{ label: "Etapa 1", description: "Informações gerais" },
	{ label: "Etapa 2", description: "Ingressos (opcional)" },
	{ label: "Etapa 3", description: "Layout (opcional)" },
] satisfies StepItem[];

export default function CreateEvent() {
	const [eventPayload, setEventPayload] = useState<IEventPayload>();
	const [ticketTypes, setTicketTypes] = useState<TicketTypePayload[]>([]);
	return (
		<div className="max-w-[1980px] mx-auto text-center min-h-screen px-2 sm:px-8 md:px-20 py-10 ">
			<Stepper initialStep={0} steps={steps}>
				{steps.map((stepProps) => {
					if (stepProps.label === "Etapa 1") {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div
									className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md"
									key={stepProps.label}
								>
									<FirstStep
										onSubmitEvent={setEventPayload}
										event={eventPayload}
									/>
								</div>
							</Step>
						);
					}
					if (stepProps.label === "Etapa 2") {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md py-10 px-5">
									<SecondStep
										onChangeTicketTypes={setTicketTypes}
										ticketTypes={ticketTypes}
									/>
								</div>
							</Step>
						);
					}
					if (stepProps.label === "Etapa 3") {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md">
									<ThirdStep event={eventPayload!} tickets={ticketTypes} />
								</div>
							</Step>
						);
					}
				})}
				<SucessStep />
			</Stepper>
		</div>
	);
}

const SucessStep = () => {
	const { hasCompletedAllSteps } = useStepper();

	if (!hasCompletedAllSteps) return;
	return (
		<div className=" p-10 flex flex-col items-center justify-center my-2 border bg-secondary text-primary rounded-md mt-10">
			<div className="text-center mb-8">
				<h1 className="text-md sm:text-3xl font-bold text-green-600 flex items-center justify-center">
					<Check className="mr-2" /> Evento criado com sucesso!
				</h1>
			</div>

			<Card className="mb-12">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
						Parabéns! 🎉
					</CardTitle>
					<CardDescription className="text-md sm:text-xl">
						O seu evento foi criado com sucesso
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center">
					<p className="text-md sm:text-lg mb-2 text-primary-dark font-semibold">
						Obrigado pela confiança. Estamos ansiosos para ver esse evento
						bombar!
					</p>
				</CardContent>
				<CardFooter className="w-full flex justify-center">
					<Link to={`/managment`}>
						<Button size={"lg"} className="mb-2">
							<TicketIcon className="mr-3" />
							Ver meus eventos
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
};
