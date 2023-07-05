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
import userEvent from "@testing-library/user-event";

jest.useFakeTimers();

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
		name: "Comment 1",
		body: "Comment 1 body",
		user: {
			id: 1,
			username: "pepo",
		},
	},
	{
		id: 2,
		postId: 1,
		name: "Comment 2",
		body: "Comment 2 body",
		user: {
			id: 1,
			username: "pepo",
		},
	},
];

const comments: CommentListTypes = {
	comments: commentsArray,
	total: 1,
	skip: 0,
	limit: 0,
};

const COMMENT_STATUS_MESSAGE_DELAY = 1500;

describe("PostDetailPage", () => {
	const mockOnAdd = jest.fn();
	const exampleComment = "Example comment text.";

	beforeEach(() => {
		// Clear all instances and calls to constructor and all methods:
		(useParams as jest.Mock).mockClear();
		(usePostDetail as jest.Mock).mockClear();
		(usePagination as jest.Mock).mockClear();
		(useMutation as jest.Mock).mockClear();
		(useCommentsByPostId as jest.Mock).mockClear();

		(useParams as jest.Mock).mockReturnValue({ id: postId });
		(usePagination as jest.Mock).mockResolvedValue([1, 1, "..."]);
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
			id: 3,
			postId: 1,
			name: "Comment 3",
			email: "test3@gmail.com",
			body: "Comment 3 body",
		});

		(useMutation as jest.Mock).mockReturnValue({
			mutate: jest.fn(),
			add: jest.fn(),
		});
	});

	it("renders post detail", async () => {
        act(() => {
			render(<MockPostDetailPage />);
		});
		expect(await screen.findByText(postDetail.title)).toBeInTheDocument();
		expect(screen.getByText(postDetail.body)).toBeInTheDocument();
	});

	it("renders comments", async () => {
        act(() => {
			render(<MockPostDetailPage />);
		});

		for (let comment of comments.comments) {
			expect(await screen.findByText(comment.body)).toBeInTheDocument();
		}
	});

	it("should close the modal after adding a comment", () => {
		act(() => {
			render(<MockPostDetailPage />);
		});

		fireEvent.click(screen.getByText("Add New"));

		const textarea = screen.getByPlaceholderText("e.g. Hello world");
		userEvent.type(textarea, exampleComment);

		fireEvent.click(screen.getByText("Submit"));

		expect(screen.queryByText("Add a new comment")).not.toBeInTheDocument();
        screen.debug();
	});

	// 	const textarea = screen.getByPlaceholderText("e.g. Hello world");
	// 	userEvent.type(textarea, exampleComment);

	// 	fireEvent.click(screen.getByText("Submit"));

	// 	// Wait for the status message to appear
	// 	await waitFor(() =>
	// 		expect(
	// 			screen.getByText("Comment added successfully!"),
	// 		).toBeInTheDocument(),
	// 	);

	// 	// Fast forward the timer by the delay time
	// 	jest.advanceTimersByTime(COMMENT_STATUS_MESSAGE_DELAY);

	// 	// Expect the status message to have been removed
	// 	expect(
	// 		screen.queryByText("Comment added successfully!"),
	// 	).not.toBeInTheDocument();

	// 	// Try to add an empty comment and check for error message
	// 	fireEvent.click(screen.getByText("Add New"));
	// 	fireEvent.click(screen.getByText("Submit"));

	// 	await waitFor(() =>
	// 		expect(
	// 			screen.getByText("Comment cannot be empty"),
	// 		).toBeInTheDocument(),
	// 	);

	// 	jest.advanceTimersByTime(COMMENT_STATUS_MESSAGE_DELAY);

	// 	expect(
	// 		screen.queryByText("Comment cannot be empty"),
	// 	).not.toBeInTheDocument();
	// });
});
