export function filterDataForm(data: any) {
  for (let key in data) {
    if (data[key] === null || data[key] === "") {
      delete data[key];
    }
  }
  return data;
}
