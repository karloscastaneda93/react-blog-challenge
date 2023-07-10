import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

const MockModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
	isOpen,
	onClose,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div>Modal Content</div>
		</Modal>
	);
};

describe("Modal", () => {
	it("should render the modal when isOpen is true", () => {
		const { container } = render(
			<MockModal isOpen={true} onClose={() => {}} />,
		);
		const modalElement = container.querySelector(".modal");
		expect(modalElement).toBeInTheDocument();
	});

	it("should not render the modal when isOpen is false", () => {
		const { container } = render(
			<MockModal isOpen={false} onClose={() => {}} />,
		);
		const modalElement = container.querySelector(".modal");
		expect(modalElement).not.toBeInTheDocument();
	});

	it("should call the onClose callback when the modal background is clicked", () => {
		const mockOnClose = jest.fn();
		const { container } = render(
			<MockModal isOpen={true} onClose={mockOnClose} />,
		);
		const modalOverlay = container.querySelector(".modal-background");
		if (modalOverlay) fireEvent.click(modalOverlay);
		expect(mockOnClose).toHaveBeenCalled();
	});
});
