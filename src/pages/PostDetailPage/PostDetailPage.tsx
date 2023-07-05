import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Skeleton from "react-loading-skeleton";

import { Comment as CommentType } from "../../types/Comment";
import { addComment, useCommentsByPostId } from "../../services/api";
import { storeInLocalStorage, getFromLocalStorage } from "../../utils";
import Error from "../../components/Error";
import AddComment from "../../components/AddComment";
import Comment from "../../components/Comment";
import Pagination from "../../components/Pagination";

// import { usePostDetail } from "../../hooks/usePostDetail"
import { usePostDetail } from "../../hooks/usePostDetail";
// import { useComments } from "../../hooks/useComments";
// import { useAddComment } from "../../hooks/useAddComment";

import "./PostDetailPage.css";
import { Link } from "react-router-dom";

const PAGE_SIZE = 3;
const COMMENT_STATUS_MESSAGE_DELAY = 1500;

const PostDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const {
		postData,
		postLoading,
		postError,
		userData,
		userLoading,
		userError,
	} = usePostDetail(id || "");

	// Add a state to handle current comment page
	const [currentCommentsPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [displayedComments, setDisplayedComments] = useState<CommentType[]>(
		[],
	);

	const { data: commentsData, isLoading: commentsLoading } =
		useCommentsByPostId(id || "", currentCommentsPage, PAGE_SIZE);

	// // New state for comments
	const [, setComments] = useState<CommentType[]>([]);

	// Initialize comments
	useEffect(() => {
		if (commentsData && commentsData.comments) {
			let storedComments = getFromLocalStorage(`comments-${id}`);
			if (storedComments) {
				storedComments = storedComments.filter(
					(comment: { id: number }) =>
						!commentsData.comments.find((c) => c.id === comment.id),
				);
			}
			const allComments = storedComments
				? [...storedComments, ...commentsData.comments]
				: [...commentsData.comments];

			const startIdx = (currentCommentsPage - 1) * PAGE_SIZE;
			const endIdx = startIdx + PAGE_SIZE;

			setComments(allComments);
			setDisplayedComments(allComments.slice(startIdx, endIdx));
			setTotalPages(Math.ceil(allComments.length / PAGE_SIZE));
		}
	}, [commentsData, id, currentCommentsPage, PAGE_SIZE]);

	const [commentStatusMessage, setCommentStatusMessage] = useState<{
		message: string;
		isError: boolean;
	}>({ message: "", isError: false });

	// handle adding a comment
	const handleAddComment = useCallback(
		async (comment: string) => {
			let messageStatus = {
				message: "Comment added successfully!",
				isError: false,
			};
			if (!comment.trim()) {
				messageStatus = {
					message: "Comment cannot be empty",
					isError: true,
				};
			} else {
				try {
					// Generate a random userId between 1 and 50
					const userId = Math.floor(Math.random() * 50) + 1;
					if (id) {
						const postId = parseInt(id);
						const newAddedComment = await addComment(
							comment,
							postId,
							userId,
						);

						setComments((prevComments) => {
							const updatedComments = [
								newAddedComment,
								...prevComments,
							];
							storeInLocalStorage(
								`comments-${postId}`,
								updatedComments,
							);
							// Calculate the new total pages
							const newTotalPages = Math.ceil(
								updatedComments.length / PAGE_SIZE,
							);
							setTotalPages(newTotalPages);
							return updatedComments;
						});
						setDisplayedComments((prevDisplayedComments) => {
							const updatedDisplayedComments = [
								newAddedComment,
								...prevDisplayedComments,
							];
							return updatedDisplayedComments.slice(0, PAGE_SIZE);
						});
					}
				} catch (error) {
					console.error("Error while adding comment", error);
					messageStatus = {
						message:
							"Something went wrong while adding your comment. Please try again.",
						isError: true,
					};
				}
			}
			setCommentStatusMessage(messageStatus);

			//  hide the message after 1.5s
			setTimeout(() => {
				setCommentStatusMessage({ message: "", isError: false });
			}, COMMENT_STATUS_MESSAGE_DELAY);
		},
		[id],
	);

	const renderComments = (comments: CommentType[]) =>
		comments.map((comment: CommentType, index: number) => (
			<Comment key={index} comment={comment} />
		));

	const schema = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: postData?.title,
		author: {
			"@type": "Person",
			name: userData?.firstName,
		},
		publisher: {
			"@type": "Organization",
			name: "A blog site.",
			logo: {
				"@type": "ImageObject",
				url: "https://www.example.com/path-to-your-logo.jpg",
			},
		},
		description: postData?.body,
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			<Helmet>
				<script type="application/ld+json">
					{JSON.stringify(schema)}
				</script>
			</Helmet>
			<section className="section">
				{commentStatusMessage.message.length > 0 && (
					<div
						className={`success-message notification is-${
							commentStatusMessage.isError ? "danger" : "success"
						}`}
					>
						{commentStatusMessage.message}
					</div>
				)}
				<div className="btn container is-flex is-justify-content-end is-align-items-center is-align-content-center mb-3">
					<button
						className="button mr-2"
						title="Go to previous page"
						onClick={() => navigate(-1)}
					>
						<span className="icon">
							<i className="fas fa-arrow-left"></i>
						</span>
					</button>
					<Link
						className="button"
						to={"/"}
						title="Go to back Home Page"
					>
						<span className="icon">
							<i className="fas fa-home"></i>
						</span>
					</Link>
				</div>
				<div className="container">
					{userError || postError ? (
						<>
							{userError && <Error error={userError} />}
							{postError && <Error error={postError} />}
						</>
					) : (
						<>
							<h1 className="title">
								{!postLoading ? (
									postData?.title
								) : (
									<Skeleton width={540} />
								)}
							</h1>
							<div className="mb-3">
								{!userLoading && userData ? (
									`Author: ${userData.firstName} ${userData.lastName}`
								) : (
									<Skeleton width={120} />
								)}
							</div>
							<p className="content">
								{!postLoading ? (
									postData?.body
								) : (
									<Skeleton count={3} />
								)}
							</p>
							<div className="is-flex is-justify-content-space-between is-align-items-center is-align-content-center mb-5">
								<p>Comments:</p>
								<AddComment onAdd={handleAddComment} />
							</div>
							{!commentsLoading ? (
								displayedComments.length > 0 ? (
									<>
										{renderComments(displayedComments)}
										<Pagination
											currentPage={currentCommentsPage}
											totalPages={totalPages}
											pageSize={PAGE_SIZE}
											isHomePage={false}
											onPageChange={handlePageChange}
										/>
									</>
								) : (
									<div className="notification has-text-centered">
										There are no comments on this post.
									</div>
								)
							) : (
								<Skeleton height={120} count={3} />
							)}
						</>
					)}
				</div>
			</section>
		</>
	);
};

export default PostDetailPage;
