import React, { ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="modal is-active">
			<div className="modal-background" onClick={onClose} />
			{children}
		</div>
	);
};

export default Modal;
