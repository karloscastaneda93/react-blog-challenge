const puppeteer = require("puppeteer");
const { expect } = require("chai");

const pageLink = "https://react-blog-challenge-e859f--pr1-develop-mpbvwktp.web.app/";

describe("Home Page", function () {
	let browser;
	let page;

	before(async function () {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		// Navigate to the home page
		await page.goto(pageLink);
	});

	after(async function () {
		await browser.close();
	});

	it("should have the correct page title", async function () {
		expect(await page.title()).to.eql("A Blog Site - Carlos Castaneda");
	});

	it("should display a search bar", async () => {
		// Check if the search bar is rendered
		const searchBar = await page.$(".search-input");
		expect(searchBar).to.exist;
	});

	it("should display postsItems grid", async () => {
		await page.waitForSelector(".columns.is-multiline");
		// Check if the posts grid is rendered
		const postsGrid = await page.$(".columns.is-multiline");
		expect(postsGrid).to.exist;
	});

	it("should navigate to the post detail page when clicking on a post", async function () {
		await page.evaluate(() => {
			debugger;
		});
		const firstPost = await page.$(".columns.is-multiline .card .button");
		await firstPost.click();
		const postTitle = await page.$eval(
			"h1.post-title",
			(element) => element.textContent,
		);
		expect(postTitle).to.not.be.empty
	});
});
