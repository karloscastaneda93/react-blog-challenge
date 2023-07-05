import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePage from "./HomePage";
import { usePosts } from "../../services/api";
import { PostListTypes } from "../../types";

jest.mock("../../services/api");

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
			title: "Post 1",
			body: "Post 1 body",
			tags: ["love", "english"],
			reactions: 6,
			userId: 3,
		},
	],
	total: 1,
	skip: 0,
	limit: 0,
};

describe("HomePage", () => {
    afterEach(() => {
		jest.resetAllMocks();
	});

	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods:
		(usePosts as jest.Mock).mockClear();
	});

	it("renders posts", async () => {
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

	it("search posts", async () => {
		(usePosts as jest.Mock).mockReturnValue({
			data: posts,
			isLoading: false,
			error: null,
		});

		render(<MockHomePage />);

		// Type into the search bar
		fireEvent.change(screen.getByPlaceholderText("Search posts..."), {
			target: { value: "Post 1" },
		});

		// Make sure only the relevant post is displayed
		await waitFor(() => screen.getByText("Post 1"));
	});
});
