import React from "react";
import { Comment as CommentType } from "../../types/Comment";

interface CommentProps {
	comment: CommentType;
}

const Comment: React.FC<CommentProps> = ({ comment }) => (
	<article key={comment.id} className="message">
		<div className="message-body">
			<div className="is-flex is-align-items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="icon is-medium"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
					/>
				</svg>
				{comment.user.username}
			</div>
			<br />
			{comment.body}
		</div>
	</article>
);

export default Comment;
