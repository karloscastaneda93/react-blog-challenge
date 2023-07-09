const fs = require("fs");
const fetch = require("node-fetch");
const slugify = require("slugify");
const API_BASE_URL = "https://dummyjson.com";
const SITE_URL = "https://react-blog-challenge-e859f.web.app";

// Fetch your data
fetch(`${API_BASE_URL}/posts?limit=150`)
	.then((response) => response.json())
	.then(({ posts }) => {
		// Generate a URL for each post
		const urls = posts.map((post) => ({
			url: `${SITE_URL}/post/${slugify(
				post.title,
				{
					lower: true,
					strict: true,
				},
			)}/${post.id}`,
			title: post.title,
			tags: post.tags,
			datePublished: new Date().toISOString()
		}));

		// Create the sitemap
		const sitemap = `<?xml version="1.0" encoding="utf-8"?>
			<urlset xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				<url>
					<loc>${SITE_URL}/</loc>
					<priority>1.0</priority>
				</url>
				${urls
					.map(
						({ url, title, tags, datePublished }) => `
				<url>
					<loc>${url}</loc>
					<news:news>
						<news:publication>
						<news:name>A Blog site</news:name>
						<news:language>en</news:language>
						</news:publication>
						<news:publication_date>${datePublished}</news:publication_date>
						<news:title>${title}</news:title>
						<news:keywords>${tags ? tags.join(", ") : ""}</news:keywords>
					</news:news>
					<priority>0.9</priority>
				</url>
				`,
					)
					.join("")}
			</urlset>
		`;

		// Write the sitemap to a file
		fs.writeFileSync("build/static/sitemap.xml", sitemap);
	}).
	catch((err) => {
		console.log(err);
	});
