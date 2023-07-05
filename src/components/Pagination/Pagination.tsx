import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { usePagination, DOTS } from "../../hooks/usePagination";
import { HomeContext } from "../../pages/HomePage/HomePage";

import "./Pagination.css";

interface PaginationProps {
	totalPages: number;
	siblingCount?: number;
	currentPage: number;
	pageSize: number;
	className?: string;
	isHomePage: boolean;
	onPageChange?: (page: number) => void;
}

const getButtonClass = (isDisabled: boolean) =>
	isDisabled ? " is-disabled is-unselectable" : " is-clickable";

const Pagination: React.FC<PaginationProps> = ({
	totalPages,
	siblingCount = 1,
	currentPage,
	pageSize,
	className = "",
	isHomePage,
	onPageChange,
}) => {
	const homeContext = useContext(HomeContext);

	// Early return for edge conditions
	if (currentPage === 0 || totalPages < 2) {
		return null;
	}

	const paginationRange = usePagination({
		currentPage,
		totalPages,
		siblingCount,
		pageSize,
	});

	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	const handlePageChange = (page: number) => {
		onPageChange && onPageChange(page);
	};

	const getPageLink = (pageNumber: number | string) => {
		if (!isHomePage) return "#";

		const url = pageNumber !== 1 ? `/${pageNumber}` : "/";

		const params = new URLSearchParams();

		if (homeContext?.searchValue?.length) {
			params.append("q", homeContext.searchValue);
		}
		if (homeContext?.filter?.length) {
			params.append("filter", homeContext.filter);
		}

		return params.toString() ? `${url}?${params.toString()}` : url;
	};

	return (
		<nav
			className="pagination is-centered is-relative mt-5"
			role="navigation"
			aria-label="pagination"
		>
			<Link
				className={`pagination-link pagination-previous ${getButtonClass(
					isFirstPage,
				)}`}
				to={getPageLink(currentPage - 1)}
				onClick={() => handlePageChange(currentPage - 1)}
				style={{ pointerEvents: isFirstPage ? "none" : "auto" }}
				aria-label="previous page"
				aria-disabled={isFirstPage}
			>
				Previous
			</Link>
			<Link
				className={`pagination-next ${getButtonClass(isLastPage)}`}
				to={getPageLink(currentPage + 1)}
				style={{ pointerEvents: isLastPage ? "none" : "auto" }}
				onClick={() => handlePageChange(currentPage + 1)}
				aria-disabled={isLastPage}
				aria-label="next page"
			>
				Next
			</Link>
			<ol className={`pagination-list is-flex-wrap-nowrap ${className}`}>
				{paginationRange.map((pageNumber, idx) =>
					pageNumber === DOTS || typeof pageNumber === "string" ? (
						<li key={idx}>
							<span className="pagination-ellipsis">
								&hellip;
							</span>
						</li>
					) : (
						<li key={idx}>
							<Link
								className={`pagination-link${
									currentPage === pageNumber
										? " is-current"
										: ""
								}`}
								aria-label={`Page ${pageNumber}`}
								aria-current={
									currentPage === pageNumber
										? "page"
										: undefined
								}
								onClick={() => handlePageChange(pageNumber)}
								to={getPageLink(pageNumber)}
							>
								{pageNumber}
							</Link>
						</li>
					),
				)}
			</ol>
		</nav>
	);
};

export default Pagination;
