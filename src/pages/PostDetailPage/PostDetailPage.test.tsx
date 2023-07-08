import React from "react";
import { useMutation } from "react-query";
import {
	render,
	fireEvent,
	screen,
	waitFor,
	act,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { useParams } from "react-router-dom";
import PostDetailPage from "./PostDetailPage";
import { useCommentsByPostId, addComment } from "../../services/api";
import { usePostDetail } from "../../hooks/usePostDetail";
import { usePagination } from "../../hooks/usePagination";
import { CommentListTypes } from "../../types";
import { META_DETAILS } from "../../constants";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useParams: jest.fn(),
	useNavigate: () => jest.fn(),
}));

jest.mock("../../services/api", () => ({
	useCommentsByPostId: jest.fn(),
	addComment: jest.fn(),
}));

jest.mock("../../hooks/usePostDetail", () => ({
	usePostDetail: jest.fn(),
}));

jest.mock("../../hooks/usePagination", () => ({
	usePagination: jest.fn(),
}));

jest.mock("react-query", () => ({
	...jest.requireActual("react-query"),
	useMutation: jest.fn(),
}));

jest.mock("react-helmet-async", () => ({
	Helmet: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="mock-helmet">{children}</div>
	),
}));

// Initialize queryClient
const queryClient = new QueryClient();
const postId = "1";

const MockPostDetailPage = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[`/post/${postId}`]}>
				<Routes>
					<Route path="/post/:id" element={<PostDetailPage />} />
				</Routes>
			</MemoryRouter>
		</QueryClientProvider>
	);
};
const postDetail = {
	id: 1,
	title: "Post 1",
	body: "Post 1 body",
	tags: ["love", "english"],
	reactions: 6,
	userId: 3,
};

const commentsArray = [
	{
		id: 1,
		postId: 1,
		body: "Comment 1 body",
		user: {
			id: 1,
			username: "pepo",
		},
	},
	{
		id: 2,
		postId: 1,
		body: "Comment 2 body",
		user: {
			id: 1,
			username: "pepo",
		},
	},
];
const extraComments = [
	{
		id: 3,
		postId: 1,
		body: "Comment 3 body",
		user: {
			id: 1,
			username: "pep",
		},
	},
	{
		id: 4,
		postId: 1,
		body: "Comment 4 body",
		user: {
			id: 1,
			username: "carl",
		},
	},
];

const comments: CommentListTypes = {
	comments: commentsArray,
	total: 1,
	skip: 0,
	limit: 0,
};

const exampleComment = "Example comment text.";

describe("PostDetailPage", () => {
	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods:
		(useParams as jest.Mock).mockClear();
		(usePostDetail as jest.Mock).mockClear();
		(usePagination as jest.Mock).mockClear();
		(useMutation as jest.Mock).mockClear();
		(useCommentsByPostId as jest.Mock).mockClear();

		(useParams as jest.Mock).mockReturnValue({ id: postId });
		(usePagination as jest.Mock).mockReturnValue([1, 2]);
		(usePostDetail as jest.Mock).mockReturnValue({
			postData: postDetail,
			postLoading: false,
			postError: null,
			userData: {
				id: 3,
				name: "User 3",
				firstName: "John",
				lastName: "Doe",
				email: "user3@gmail.com",
			},
			userLoading: false,
			userError: null,
		});
		(useCommentsByPostId as jest.Mock).mockReturnValue({
			data: comments,
			isLoading: false,
			error: null,
		});
		(addComment as jest.Mock).mockResolvedValue({
			id: 341,
			body: exampleComment,
			postId: 2,
			user: { id: 4, username: "yraigatt3" },
		});

		(useMutation as jest.Mock).mockReturnValue({
			mutate: jest.fn(),
			add: jest.fn(),
		});
	});

	it("renders post page and its details", async () => {
		act(() => {
			render(<MockPostDetailPage />);
		});
		const postTitle = `${META_DETAILS.defaultTitle} - ${postDetail.title}`;
		expect(
			await screen.findByText(postTitle),
		).toBeInTheDocument();
		expect(screen.getByText(postDetail.body)).toBeInTheDocument();
	});

	it("should have appropriate accessibility attributes", async () => {
		render(<MockPostDetailPage />);

		const addCommentButton = screen.getByText("Add New");
		fireEvent.click(addCommentButton);
		const cancelButton = screen.getByText("Cancel");
		const submitButton = screen.getByText("Submit");

		expect(addCommentButton).toHaveAccessibleName("Add New");
		expect(cancelButton).toHaveAccessibleName("Cancel");
		expect(submitButton).toHaveAccessibleName("Submit");
	});

	it("should display an error message when post data fails to load", async () => {
		const errorMessage = "Failed to fetch post data";
		(usePostDetail as jest.Mock).mockReturnValue({
			postData: null,
			postLoading: false,
			postError: errorMessage,
			userData: null,
			userLoading: false,
			userError: null,
		});

		render(<MockPostDetailPage />);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	it("renders post comments", async () => {
		act(() => {
			render(<MockPostDetailPage />);
		});

		for (let comment of comments.comments) {
			expect(await screen.findByText(comment.body)).toBeInTheDocument();
		}
	});

	it("should display a message when there are no comments available", async () => {
		(useCommentsByPostId as jest.Mock).mockReturnValue({
			data: { comments: [], total: 0, skip: 0, limit: 0 },
			isLoading: false,
			error: null,
		});

		render(<MockPostDetailPage />);

		expect(
			screen.getByText("There are no comments on this post."),
		).toBeInTheDocument();
	});

	it("closes the modal when clicking the cancel button", async () => {
		render(<MockPostDetailPage />);

		fireEvent.click(screen.getByText("Add New"));

		const cancelButton = screen.getByText("Cancel");

		fireEvent.click(cancelButton);

		expect(screen.queryByText("Add a new comment")).not.toBeInTheDocument();
	});

	it("should open modal and add a new comment", async () => {
		jest.useFakeTimers();
		render(<MockPostDetailPage />);

		await waitFor(() => screen.getByText("Comments:"));

		act(() => {
			fireEvent.click(screen.getByText("Add New"));
		});

		await waitFor(() => screen.getByText("Add a new comment"));

		const textarea = screen.getByPlaceholderText("e.g. Hello world");

		act(() => {
			fireEvent.change(textarea, {
				target: { value: exampleComment },
			});
			fireEvent.click(screen.getByText("Submit"));
		});

		await waitFor(() => screen.getByText(exampleComment));

		expect(screen.getByText(exampleComment)).toBeInTheDocument();

		// Wait for the status message to appear
		await waitFor(() =>
			expect(
				screen.getByText("Comment added successfully!"),
			).toBeInTheDocument(),
		);

		jest.runAllTimers(); // Run all pending timers

		// Expect the status message to disappear
		await waitFor(() =>
			expect(
				screen.queryByText("Comment added successfully!"),
			).not.toBeInTheDocument(),
		);

		jest.useRealTimers(); // Restore real timers
	});

	it("should display an error message when adding an empty comment", async () => {
		jest.useFakeTimers();
		render(<MockPostDetailPage />);

		await waitFor(() => screen.getByText("Comments:"));

		act(() => {
			fireEvent.click(screen.getByText("Add New"));
		});

		await waitFor(() => screen.getByText("Add a new comment"));

		const textarea = screen.getByPlaceholderText("e.g. Hello world");

		act(() => {
			fireEvent.change(textarea, {
				target: { value: "" },
			});
			fireEvent.click(screen.getByText("Submit"));
		});

		// Wait for the status message to appear
		await waitFor(() =>
			expect(
				screen.getByText("Comment cannot be empty"),
			).toBeInTheDocument(),
		);

		jest.runAllTimers(); // Run all pending timers

		// Expect the status message to disappear
		await waitFor(() =>
			expect(
				screen.queryByText("Comment cannot be empty"),
			).not.toBeInTheDocument(),
		);

		jest.useRealTimers(); // Restore real timers
	});

	it("should display pagination when there are multiple pages of comments", async () => {
		(useCommentsByPostId as jest.Mock).mockReturnValue({
			data: {
				...comments,
				comments: [...comments.comments, ...extraComments],
			},
			isLoading: false,
			error: null,
		});
		render(<MockPostDetailPage />);

		await waitFor(() => screen.getByText("Comments:"));

		expect(screen.getByText("1")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("should enable next page button and disable previous page button initially", async () => {
		(useCommentsByPostId as jest.Mock).mockReturnValue({
			data: {
				...comments,
				comments: [...comments.comments, ...extraComments],
			},
			isLoading: false,
			error: null,
		});
		render(<MockPostDetailPage />);

		await waitFor(() => screen.getByText("Comments:"));

		const prevButton = screen.getByLabelText("previous page");
		const nextButton = screen.getByLabelText("next page");

		expect(prevButton).toHaveClass("is-disabled");
		expect(nextButton).not.toHaveClass("is-disabled");
	});

	it("should disable next page button and enable previous page button after clicking next page", async () => {
		(useCommentsByPostId as jest.Mock).mockReturnValue({
			data: {
				...comments,
				comments: [...comments.comments, ...extraComments],
			},
			isLoading: false,
			error: null,
		});
		render(<MockPostDetailPage />);

		await waitFor(() => screen.getByText("Comments:"));

		const prevButton = screen.getByLabelText("previous page");
		const nextButton = screen.getByLabelText("next page");

		fireEvent.click(nextButton);

		expect(prevButton).not.toHaveClass("is-disabled");
		expect(nextButton).toHaveClass("is-disabled");
	});

	it("should enable next page button and disable previous page button after clicking next page and then previous page", async () => {
		(useCommentsByPostId as jest.Mock).mockReturnValue({
			data: {
				...comments,
				comments: [...comments.comments, ...extraComments],
			},
			isLoading: false,
			error: null,
		});
		render(<MockPostDetailPage />);

		await waitFor(() => screen.getByText("Comments:"));

		const prevButton = screen.getByLabelText("previous page");
		const nextButton = screen.getByLabelText("next page");

		fireEvent.click(nextButton);
		fireEvent.click(prevButton);

		expect(prevButton).toHaveClass("is-disabled");
		expect(nextButton).not.toHaveClass("is-disabled");
	});
});
