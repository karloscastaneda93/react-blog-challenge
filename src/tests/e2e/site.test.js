const puppeteer = require("puppeteer");
const { expect } = require("chai");

const pageLink =
	"https://react-blog-challenge-e859f--pr1-develop-mpbvwktp.web.app/";

describe("Home Page", function () {
	let browser;
	let page;

	before(async function () {
		browser = await puppeteer.launch({ headless: true });
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
		await page.waitForSelector(".card-footer a.button");

		await page.waitForSelector("ul.columns.is-multiline");

		// Select the first list item
		const firstListItem = await page.$("ul.columns.is-multiline > li");

		// Get the title from the first list item
		const cardTitle = await firstListItem.$eval(
			"h2.title.is-4",
			(el) => el.innerText,
		);

		// Click the "Read More..." button in the first list item
		await firstListItem.$eval(".card-footer > a.button", (el) =>
			el.click(),
		);

		// Wait for the skeleton loader to disappear
		await page.waitForSelector(".react-loading-skeleton", { hidden: true });

		// Get the title  of the post
		const postTitle = await page.$eval(
			".title.post-title",
			(el) => el.innerHTML,
		);

		expect(postTitle).to.eql(cardTitle);
	});
});
