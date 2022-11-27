async function fetchData() {
	const response = await fetch("assets/db/db.json");
	const data = await response.json();
	return data;
}

export const DATA = await fetchData();
