import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface AddCommentButtonProps {
	onAdd: (comment: string) => void;
}

const AddComment: React.FC<AddCommentButtonProps> = ({ onAdd }) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [comment, setComment] = useState("");

	const openModal = () => setModalIsOpen(true);
	const closeModal = () => setModalIsOpen(false);

	function sanitizeInput(str: string) {
		return str.replace(/<\/?[^>]+(>|$)/g, "");
	}

	const handleAddComment = () => {
		const sanitizedComment = sanitizeInput(comment);
		onAdd(sanitizedComment);
		setComment("");
		closeModal();
	};

	return (
		<>
			<button className="button" onClick={openModal}>
				Add New
			</button>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel="Add Comment Modal"
				className="Modal"
			>
				<p className="title is-3 has-text-centered">
					Add a new comment
				</p>
				<article className="media">
					<div className="media-content is-clipped">
						<div className="field">
							<p className="control">
								<textarea
									className="textarea mb-3"
									placeholder="e.g. Hello world"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
							</p>
						</div>
						<div className="field buttons">
							<p className="control">
								<button
									className="button is-danger"
									onClick={closeModal}
								>
									Cancel
								</button>
								<button
									className="button"
									onClick={handleAddComment}
								>
									Submit
								</button>
							</p>
						</div>
					</div>
				</article>
			</Modal>
		</>
	);
};

export default AddComment;
