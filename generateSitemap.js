const fs = require("fs");
const fetch = require("node-fetch");
const slugify = require("slugify");
const API_BASE_URL = "https://dummyjson.com";

// Fetch your data
fetch(`${API_BASE_URL}/posts?limit=150`)
	.then((response) => response.json())
	.then(({ posts }) => {
		// Generate a URL for each post
		const urls = posts.map(
			(post) =>
				`https://react-blog-challenge-e859f.web.app/post/${slugify(
					post.title,
					{
						lower: true,
						strict: true,
					},
				)}/${post.id}`,
		);

		// Create the sitemap
		const sitemap = `
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls
			.map(
				(url) => `
          <url>
            <loc>${url}</loc>
          </url>
        `,
			)
			.join("")}
      </urlset>
    `;

		// Write the sitemap to a file
		fs.writeFileSync("sitemap/sitemap.xml", sitemap);
	});
