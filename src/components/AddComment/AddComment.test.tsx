import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddComment from "./AddComment";

describe("AddComment", () => {
	const mockOnAdd = jest.fn();
	const exampleComment = "Example comment text.";

	beforeEach(() => {
		mockOnAdd.mockClear();
	});

	it("should open and close the modal when the Add New button is clicked", () => {
		render(<AddComment onAdd={mockOnAdd} />);

		fireEvent.click(screen.getByText("Add New"));
		expect(screen.getByText("Add a new comment")).toBeInTheDocument();

		fireEvent.click(screen.getByText("Cancel"));
		expect(screen.queryByText("Add a new comment")).not.toBeInTheDocument();
	});

	it("should call the onAdd function with the comment text when submit is clicked", () => {
		render(<AddComment onAdd={mockOnAdd} />);

		fireEvent.click(screen.getByText("Add New"));

		const textarea = screen.getByPlaceholderText("e.g. Hello world");
		fireEvent.change(textarea, { target: { value: exampleComment } });

		fireEvent.click(screen.getByText("Submit"));

		expect(mockOnAdd).toHaveBeenCalledTimes(1);
		expect(mockOnAdd).toHaveBeenCalledWith(exampleComment);
	});

	it("should close the modal after adding a comment", () => {
		render(<AddComment onAdd={mockOnAdd} />);

		fireEvent.click(screen.getByText("Add New"));

		const textarea = screen.getByPlaceholderText("e.g. Hello world");
		userEvent.type(textarea, exampleComment);

		fireEvent.click(screen.getByText("Submit"));

		expect(screen.queryByText("Add a new comment")).not.toBeInTheDocument();
	});

});
