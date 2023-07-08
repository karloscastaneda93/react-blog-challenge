import React from "react";
import { render, screen } from "@testing-library/react";
import Title from "./Title";

describe("Title", () => {
	it("renders the title text", () => {
		render(<Title text="A blog site" />);
		const titleElement = screen.getByText(/A blog site/i);
		expect(titleElement).toBeInTheDocument();
	});
});
