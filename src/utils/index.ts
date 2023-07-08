import { Post, User } from "../types";
import { META_DETAILS, HEADER_DETAILS } from "../constants";

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
			name: HEADER_DETAILS.title,
			logo: {
				"@type": "ImageObject",
				url: META_DETAILS.defaultImageUrl,
			},
		},
		description: postData?.body,
		image: "https://via.placeholder.com/800x400",
		datePublished: new Date().toISOString(),
	};

	return schema;
};

export const getHomeSchema = (): object => {
	const schema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: META_DETAILS.defaultTitle,
		description: META_DETAILS.defaultDescription,
		image: META_DETAILS.defaultImageUrl,
		url: new URL(META_DETAILS.defaultUrl),
		publisher: {
			"@type": "Organization",
			name: HEADER_DETAILS.title,
			logo: {
				"@type": "ImageObject",
				url: META_DETAILS.defaultImageUrl,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": META_DETAILS.defaultUrl,
		},
	};

	return schema;
};
export const getHomeItemsSchema = (posts: Post[]): object => {
	const itemListElements = posts.map((post, index) => {
		return {
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "BlogPosting",
				headline: post.title,
				url: `${META_DETAILS.defaultUrl}/post/${post.id}`,
				image: META_DETAILS.defaultImageUrl,
				datePublished: new Date().toISOString(),
				author: {
					"@type": "Person",
					name: `user ${index + 1}`,
				},
				publisher: {
					"@type": "Organization",
					name: HEADER_DETAILS.title,
					logo: {
						"@type": "ImageObject",
						url: META_DETAILS.defaultImageUrl,
					},
				},
				name: `Post Number: ${index + 1}`,
			},
		};
	});

	const schema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: META_DETAILS.defaultTitle,
		description: "A collection of blog posts",
		url: META_DETAILS.defaultUrl,
		numberOfItems: posts.length,
		itemListElement: itemListElements,
	};

	return schema;
};
