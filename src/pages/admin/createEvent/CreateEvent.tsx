import FirstStep from "@/components/eventCreateForm/FirstStep";
import SecondStep from "@/components/eventCreateForm/SecondStep";
import ThirdStep from "@/components/eventCreateForm/ThirdStep";
import { Step, type StepItem, Stepper } from "@/components/stepper";
import { IEventPayload } from "@/core/interfaces/Event.interface";
import { useState } from "react";

const steps = [
	{ label: "Etapa 1", description: "Informações gerais" },
	{ label: "Etapa 2", description: "Ingressos (opcional)" },
	{ label: "Etapa 3", description: "Layout (opcional)" },
] satisfies StepItem[];

export default function CreateEvent() {
	const [eventPayload, setEventPayload] = useState<IEventPayload>();
	const [ticketTypes, setTicketTypes] = useState<TicketTypeCreate[]>([]);
	return (
		<div className="max-w-[1980px] mx-auto text-center min-h-screen px-2 sm:px-8 md:px-20 py-10 ">
			<Stepper initialStep={0} steps={steps}>
				{steps.map((stepProps, index) => {
					if (index === 0) {
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
					if (index === 1) {
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
					if (index === 2) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md">
									<ThirdStep event={eventPayload!} tickets={ticketTypes} />
								</div>
							</Step>
						);
					} else {
						return (
							<div className="h-[80%] flex items-center justify-center my-2 border text-primary rounded-md py-10">
								<SucessStep />;
							</div>
						);
					}
				})}
			</Stepper>
		</div>
	);
}

const SucessStep = () => {
	return (
		<div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
			<h1 className="text-xl">Parabéns! O seu evento está pronto!🎉</h1>
		</div>
	);
};
