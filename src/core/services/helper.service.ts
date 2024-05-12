export function filterDataForm(data: any, valuesToExclude?: any[]) {
  for (let key in data) {
    if (data[key] === null || data[key] === "" || (valuesToExclude && valuesToExclude.includes(key))) {
      delete data[key];
    }
  }
  return data;
}
