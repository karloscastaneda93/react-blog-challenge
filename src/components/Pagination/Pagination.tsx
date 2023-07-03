import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <nav
            className="pagination is-centered is-relative mt-5"
            role="navigation"
            aria-label="pagination"
        >
            <button
                className={`pagination-previous ${ isFirstPage ? "" : "is-clickable"}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={isFirstPage}
            >
                Previous
            </button>
            <button
                className={`pagination-next ${ isLastPage ? "" : "is-clickable"}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={isLastPage}
            >
                Next
            </button>
            <ul className="pagination-list">
                {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                ).map((page) => (
                    <li key={page}>
                        <button
                            className={`pagination-link is-clickable${
                                currentPage === page ? ' is-current' : ''
                            }`}
                            aria-label={`Goto page ${page}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
