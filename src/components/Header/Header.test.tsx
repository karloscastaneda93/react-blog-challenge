import React from "react";
import { render, act } from "@testing-library/react";
import Header from "./Header";
import { HEADER_DETAILS } from "../../constants";

// Mock the useInView hook from react-intersection-observer
jest.mock("react-intersection-observer", () => ({
	useInView: () => [null, true], // Returning true for "in view" state
}));

const mockProps = {
	setInView: jest.fn(),
	title: HEADER_DETAILS.title,
	author: HEADER_DETAILS.author,
	authorUrl: HEADER_DETAILS.authorUrl,
	authorLabel: HEADER_DETAILS.authorLabel,
};

describe("Header", () => {
	it("renders without crashing", () => {
		act(() => {
			render(<Header {...mockProps} />);
		});

		expect(mockProps.setInView).toHaveBeenCalledWith(true);
	});

	it("renders the title and author name with correct href", () => {
		const { getByText } = render(<Header {...mockProps} />);

		const titleElement = getByText(mockProps.title);
		expect(titleElement).toBeInTheDocument();

		const authorLink = getByText(mockProps.author);
		expect(authorLink).toBeInTheDocument();
		expect(authorLink.getAttribute("href")).toBe(mockProps.authorUrl);
	});
});
