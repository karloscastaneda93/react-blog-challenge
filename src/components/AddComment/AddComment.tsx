import React, { useState } from "react";
import Modal from "../Modal";

import { sanitizeInput } from "../../utils";

interface AddCommentButtonProps {
	onAdd: (comment: string) => void;
}

const AddComment: React.FC<AddCommentButtonProps> = ({ onAdd }) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [comment, setComment] = useState("");

	const openModal = () => {
		setModalIsOpen(true);
	};

	const closeModal = () => {
		setModalIsOpen(false);
		setComment("");
	};

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
			<Modal isOpen={modalIsOpen} onClose={closeModal}>
				<div className="modal is-active">
					<div className="modal-background" onClick={closeModal} />
					<div className="modal-card">
						<header className="modal-card-head">
							<p className="modal-card-title">
								Add a new comment
							</p>
							<button
								className="delete"
								aria-label="close"
								onClick={closeModal}
							/>
						</header>
						<section className="modal-card-body">
							<div className="field">
								<div className="control">
									<textarea
										className="textarea mb-3"
										aria-describedby="Input for adding a comment"
										placeholder="e.g. Hello world"
										value={comment}
										onChange={(e) =>
											setComment(e.target.value)
										}
									/>
								</div>
							</div>
						</section>
						<footer className="modal-card-foot">
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
						</footer>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default AddComment;
