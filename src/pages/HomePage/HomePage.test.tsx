import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePage from "./HomePage";
import { usePosts } from "../../services/api";
import { PostListTypes } from "../../types";

jest.mock("../../services/api");

jest.mock("react-helmet-async", () => ({
	Helmet: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="mock-helmet">{children}</div>
	),
}));

// Initialize queryClient
const queryClient = new QueryClient();

const MockHomePage = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<HomePage />
			</Router>
		</QueryClientProvider>
	);
};

const posts: PostListTypes = {
	posts: [
		{
			id: 1,
			title: "my mocked post",
			body: "my mocked post is nice",
			tags: ["love", "english"],
			reactions: 6,
			userId: 3,
		},
	],
	total: 1,
	skip: 0,
	limit: 0,
};

const extraPosts = Array.from({ length: 20 }, (_, index) => ({
	id: index + 1,
	title: `Post ${index + 1}`,
	body: `Post Body ${index + 1}`,
	tags: ["love", "english"],
	reactions: 6,
	userId: 3,
}));

describe("HomePage", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods:
		(usePosts as jest.Mock).mockClear();
	});

	it("should render loading skeleton", () => {
		// Mock the API call to return loading state
		(usePosts as jest.Mock).mockReturnValue({
			data: posts,
			isLoading: true,
			error: null,
		});

		render(<MockHomePage />);

		expect(
			screen.getByTestId("react-loading-skeleton"),
		).toBeInTheDocument();
	});

	it("should render home page with and pagination", async () => {
		(usePosts as jest.Mock).mockReturnValue({
			data: {
				...posts,
				posts: [...posts.posts, ...extraPosts],
			},
			isLoading: false,
			error: null,
		});
		render(<MockHomePage />);

		// expect(screen.getByText("my mocked post")).toBeInTheDocument();
		// expect(screen.getByText("Post body 1")).toBeInTheDocument();
		const post1 = await waitFor(() => screen.getByText("my mocked post"));
		expect(post1).toBeInTheDocument();
		// expect(screen.getByText("1")).toBeInTheDocument();
		// expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("renders home page with posts grid", async () => {
		(usePosts as jest.Mock).mockReturnValue({
			data: posts,
			isLoading: false,
			error: null,
		});

		render(<MockHomePage />);
		// Ensure the posts are displayed
		for (let post of posts.posts) {
			await waitFor(() => screen.getByText(post.title));
			expect(screen.getByText(post.title)).toBeInTheDocument();
		}
	});

	it("should render no results found message", () => {
		// Mock the API call to return no posts data
		(usePosts as jest.Mock).mockReturnValue({
			data: { posts: [], total: 0, skip: 0, limit: 0 },
			isLoading: false,
			error: null,
		});

		render(<MockHomePage />);

		expect(screen.getByText("no results found for:")).toBeInTheDocument();
	});

	it("search for a post using searchbar", async () => {
		(usePosts as jest.Mock).mockReturnValue({
			data: {
				posts: [
					{
						id: 1,
						title: "my searching post",
						body: "my searching post is nice",
						tags: ["love", "english"],
						reactions: 6,
						userId: 3,
					},
				],
				total: 0,
				skip: 0,
				limit: 0,
			},
			isLoading: false,
			error: null,
		});

		render(<MockHomePage />);

		// Type into the search bar
		fireEvent.change(screen.getByPlaceholderText("Search posts..."), {
			target: { value: "searching" },
		});

		// Make sure only the relevant post is displayed
		await waitFor(() => screen.getByText("my searching post"));
	});
});
