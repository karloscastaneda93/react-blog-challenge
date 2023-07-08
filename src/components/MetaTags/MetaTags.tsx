import React from "react";
import { Helmet } from "react-helmet-async";

import { META_DETAILS } from "../../constants";

interface MetaTagsProps {
	title?: string;
	description?: string;
	url?: string;
	imageUrl?: string;
	siteName?: string; // Optional site name
	locale?: string; // Optional locale, defaults to "en_US"
	type?: string; // Optional type, defaults to "website"
}

const MetaTags: React.FC<MetaTagsProps> = ({
	title = META_DETAILS.defaultTitle,
	description = META_DETAILS.defaultDescription,
	url = META_DETAILS.defaultUrl,
	imageUrl = META_DETAILS.defaultImageUrl,
	siteName = META_DETAILS.defaultTitle,
	locale = "en_US",
	type = "website",
}) => {
	return (
		<Helmet prioritizeSeoTags>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:url" content={url} />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:type" content={type} />
			<meta property="og:locale" content={locale} />
			<meta property="og:site_name" content={siteName} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={imageUrl} />
		</Helmet>
	);
};

export default MetaTags;
