export function filterDataForm(data: any, valuesToExclude?: any[]) {
	for (let key in data) {
		if (
			data[key] === null ||
			data[key] === "" ||
			data[key] === undefined ||
			(valuesToExclude && valuesToExclude.includes(key))
		) {
			delete data[key];
		}
	}
	return data;
}

export function formatDate(dataISO: string) {
	const data = new Date(dataISO);

	const dia = data.getDate();
	const mes = data.toLocaleString("default", { month: "long" });
	const ano = data.getFullYear();

	return `${dia} de ${mes} de ${ano}`;
}

export const formatCep = (cep: string| undefined) => {
	if (!cep) return "";

	const regexCEP = /^(\d{2})(\d{3})(\d{3})$/;
	const match = cep.match(regexCEP);

	if (match) {
		return `${match[1]}.${match[2]}-${match[3]}`;
	}
	return cep;
};
