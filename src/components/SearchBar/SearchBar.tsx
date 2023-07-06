import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./SearchBar.css";

interface SearchBarProps {
	onSearch: (searchValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [searchParams] = useSearchParams();
	const targetRef = useRef<HTMLInputElement | null>(null);
	const [searchValue, setSearchValue] = useState<string>(
		searchParams.get("q") || "",
	);
	const [debouncedValue, setDebouncedValue] = useState(searchValue);

	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedValue(searchValue);
		}, 500);

		return () => {
			clearTimeout(timerId);
		};
	}, [searchValue]);

	useEffect(() => {
		onSearch(debouncedValue);
	}, [debouncedValue, onSearch]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	return (
		<div className={"search is-flex is-align-items-center"}>
			<label htmlFor="searchInput" className="visually-hidden">
				Search:
			</label>
			<input
				ref={targetRef}
				id="searchInput"
				value={searchValue}
				onChange={handleChange}
				placeholder="Search posts..."
				className={"search-input show-search-input"}
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="icon is-medium p-1 mr-1"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
				/>
			</svg>
		</div>
	);
};

export default SearchBar;
