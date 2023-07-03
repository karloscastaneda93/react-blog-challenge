import React from "react";
import { render, act } from "@testing-library/react";
import Header from "../../../components/Header";

// Mock the useInView hook from react-intersection-observer
jest.mock("react-intersection-observer", () => ({
	useInView: () => [null, true], // Returning true for "in view" state
}));

describe("Header", () => {
	it("renders without crashing", () => {
		const setInView = jest.fn();

		act(() => {
			render(<Header setInView={setInView} />);
		});

		expect(setInView).toHaveBeenCalledWith(true);
	});

	it("renders the author name with correct href", () => {
		const setInView = jest.fn();
		const { getByText } = render(<Header setInView={setInView} />);

		const authorLink = getByText("Carlos Castañeda");
		expect(authorLink).toBeInTheDocument();
		expect(authorLink.getAttribute("href")).toBe("https://ccastaneda.dev");
	});
});
