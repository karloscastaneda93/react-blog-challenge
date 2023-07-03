import React from "react";
import { render, screen } from "@testing-library/react";
import Title from "../../../components/Title";

describe("Title", () => {
	it("renders the title text", () => {
		render(<Title />);
		const titleElement = screen.getByText(/A blog site/i);
		expect(titleElement).toBeInTheDocument();
	});
});
