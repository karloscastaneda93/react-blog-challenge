import { Post, User } from "../types";

// Utility function to store data in localStorage
export const storeInLocalStorage = <T>(key: string, data: T): void => {
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

export const getPostSchema = (postData: Post, userData: User): object => {
	const schema = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: postData?.title,
		author: {
			"@type": "Person",
			name: `${userData?.firstName} ${userData?.lastName}`,
		},
		publisher: {
			"@type": "Organization",
			name: "A blog site.",
			logo: {
				"@type": "ImageObject",
				url: "https://via.placeholder.com/300",
			},
		},
		description: postData?.body,
		image: "https://via.placeholder.com/800x400",
		datePublished: new Date().toISOString(),
	};

	return schema;
};
