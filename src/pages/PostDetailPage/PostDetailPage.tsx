import React, { Fragment, useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	addComment,
	usePostById,
	useUserById,
	useCommentsByPostId,
} from "../../services/api";
import Error from "../../components/Error";
import AddComment from "../../components/AddComment";
import Comment from "../../components/Comment";
import { Comment as CommentType } from "../../types/Comment";
import Skeleton from "react-loading-skeleton";
import "./PostDetailPage.css";

const PostDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const {
		data: postData,
		isLoading: postLoading,
		error: postError,
	} = usePostById(id || "");

	const userId = useMemo(() => postData?.userId.toString(), [postData]);

	const {
		data: userData,
		isLoading: userLoading,
		error: userError,
	} = useUserById(userId || "");

	const { data: commentsData, isLoading: commentsLoading } =
		useCommentsByPostId(id || "");

	// New state for comments
	const [comments, setComments] = useState<CommentType[]>([]);

	// Initialize comments
	useEffect(() => {
		if (commentsData && commentsData.comments) {
			setComments(commentsData.comments);
		}
	}, [commentsData]);

	const [commentStatusMessage, setCommentStatusMessage] = useState<{
		message: string;
		isError: boolean;
	}>({ message: "", isError: false });

	// handle adding a comment
	const handleAddComment = async (comment: string) => {
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
					setComments((prevComments) => [
						...prevComments,
						newAddedComment,
					]);
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
		}, 1500);
	};

	const renderComments = (comments: CommentType[]) =>
		comments.map((comment: CommentType, index: number) => (
			<Comment key={index} comment={comment} />
		));

	return (
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
			<div className="btn container">
				<button className="button go-back" onClick={() => navigate(-1)}>
					<span className="icon">
						<i className="fas fa-arrow-left"></i>
					</span>
					<span>Go Back</span>
				</button>
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
						<div className="content">
							{!postLoading ? (
								postData?.body
							) : (
								<Skeleton count={3} />
							)}
						</div>
						<div className="is-flex is-justify-content-space-between is-align-items-center is-align-content-center mb-5">
							<p>Comments:</p>
							<AddComment onAdd={handleAddComment} />
						</div>
						{!commentsLoading ? (
							comments.length > 0 ? (
								<Fragment>{renderComments(comments)}</Fragment>
							) : (
								<div className="notification has-text-centered">
									There are no comments on this post.
								</div>
							)
						) : (
							<Skeleton height={120} />
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default PostDetailPage;
