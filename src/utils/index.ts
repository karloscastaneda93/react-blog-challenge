// Utility function to store data in localStorage
export const storeInLocalStorage = (key: string, data: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error(
			`Error storing data with key "${key}" to localStorage`,
			error,
		);
	}
};

// Utility function to retrieve data from localStorage
export const getFromLocalStorage = (key: string) => {
	try {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error(
			`Error getting data with key "${key}" from localStorage`,
			error,
		);
		return null;
	}
};
