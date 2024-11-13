import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/core/services/helper.service";
import PurchaseOrderService from "@/core/services/purchaseOrder.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

interface EventPurchaseOrderTableProps {
	eventId: string;
}

export function EventPurchaseOrderTable(props: EventPurchaseOrderTableProps) {
	const { eventId } = props;
	const purchaseOrderService = new PurchaseOrderService();
	const [currentPage, setCurrentPage] = useState(1);
	const [recordsPerPage, setRecordsPerPage] = useState(5);
	const [totalRecords, setTotalRecords] = useState(0);
	const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const totalPages = Math.ceil(totalRecords / recordsPerPage);

	useEffect(() => {
		setLoading(true);
		purchaseOrderService
			.GetPurchaseOrdersByEventId(eventId, recordsPerPage, currentPage)
			.then((response) => {
				console.log(response);
				setPurchaseOrders(response.purchaseOrders);
				setTotalRecords(response.total);
			})
			.catch(() => {})
			.finally(() => {
				setLoading(false);
			});
	}, [eventId, recordsPerPage, currentPage]);

	return (
		<Accordion type="single" collapsible>
			<AccordionItem value="Event Details">
				<AccordionTrigger className="border border-b-0 rounded-md rounded-b-none px-8 font-bold text-xl text-start">
					Lista de ordens de compras do evento
				</AccordionTrigger>
				<AccordionContent className="p-4 border-x flex flex-wrap justify-center gap-10">
					{loading ? (
						Array.from({ length: recordsPerPage }).map((_, index) => (
							<TableRow key={index} className="w-full px-16">
								<TableCell>
									<Skeleton className="w-10 h-10 bg-gray-200 rounded-full mx-auto"></Skeleton>
								</TableCell>
								<TableCell className="w-3/12">
									<Skeleton className="h-4 bg-gray-200 rounded-md mx-auto"></Skeleton>
								</TableCell>
								<TableCell className="w-3/12">
									<Skeleton className="h-4 bg-gray-200 rounded-md mx-auto"></Skeleton>
								</TableCell>
								<TableCell className="w-3/12">
									<Skeleton className="h-4 bg-gray-200 rounded-md mx-auto"></Skeleton>
								</TableCell>
								<TableCell className="w-3/12">
									<Skeleton className="h-4 bg-gray-200 rounded-md mx-auto"></Skeleton>
								</TableCell>
							</TableRow>
						))
					) : (
						<Table className="mx-auto">
							<TableCaption>
								Lista das compras feitas pelos usuários
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-24 text-center">
										Ordem de compra criada em
									</TableHead>
									<TableHead className="w-24 text-center">Usuário</TableHead>
									<TableHead className="w-24 text-center">
										Tickets comprados
									</TableHead>
									<TableHead className="w-24 text-center">Valor</TableHead>
									<TableHead className="w-24 text-center">
										Status do pedido
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{purchaseOrders.map((purchaseOrders, index) => (
									<TableRow key={index}>
										<TableCell className="w-24">
											{formatDate(purchaseOrders.createdAt)}
										</TableCell>
										<TableCell className="w-24 font-medium">
											{purchaseOrders.user.firstName}{" "}
											{purchaseOrders.user.lastName}
										</TableCell>
										<TableCell className="w-24">
											{purchaseOrders.quantityTickets}
										</TableCell>
										<TableCell className="w-24">
											R${purchaseOrders.totalPrice}
										</TableCell>
										<TableCell className="w-24">
											<Badge
												className={`${
													purchaseOrders.status === "active"
														? "bg-green-500 hover:bg-green-300"
														: "bg-yellow-500 hover:bg-yellow-300"
												} text-white`}
											>
												{purchaseOrders.status.charAt(0).toUpperCase() +
													purchaseOrders.status.slice(1)}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<tfoot>
								<tr>
									<td colSpan={5}>
										<div className="flex justify-between items-center mt-4 border-t pt-8">
											<div className="flex items-center space-x-2">
												<span>Mostrar</span>
												<Select
													value={recordsPerPage.toString()}
													onValueChange={(value) => {
														setRecordsPerPage(Number(value));
														setCurrentPage(1);
													}}
												>
													<SelectTrigger className="w-[70px]">
														<SelectValue placeholder="5" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="5">5</SelectItem>
														<SelectItem value="10">10</SelectItem>
														<SelectItem value="15">15</SelectItem>
														<SelectItem value="20">20</SelectItem>
													</SelectContent>
												</Select>
												<span>Resultados</span>
											</div>
											<div className="flex items-center space-x-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setCurrentPage(currentPage - 1)}
													disabled={currentPage === 1}
												>
													<ChevronLeft className="h-4 w-4" />
												</Button>
												<span>{`Página ${currentPage} de ${totalPages}`}</span>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setCurrentPage(currentPage + 1)}
													disabled={currentPage === totalPages}
												>
													<ChevronRight className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</td>
								</tr>
							</tfoot>
						</Table>
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
