export function filterDataForm(data: any, valuesToExclude?: any[]) {
	for (let key in data) {
		if (
			data[key] === null ||
			data[key] === "" ||
			(valuesToExclude && valuesToExclude.includes(key))
		) {
			delete data[key];
		}
	}
	return data;
}

export function formatDate(dataISO:string) {
	const data = new Date(dataISO);


	const dia = data.getDate();
	const mes = data.toLocaleString("default", { month: "long" })
	const ano = data.getFullYear();

	return `${dia} de ${mes} de ${ano}`;
}
