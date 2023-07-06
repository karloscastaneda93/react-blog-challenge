import React, { useState, useCallback, createContext } from "react";
import { useParams } from "react-router-dom";
import { usePosts } from "../../services/api";
import PostList from "../../components/PostList";
import Pagination from "../../components/Pagination";
import Error from "../../components/Error";
import PostItemSkeleton from "../../components/PostItemSkeleton";
import SearchBar from "../../components/SearchBar/SearchBar";

interface HomeContextType {
	searchValue: string;
	filter: string;
	setFilter: (filter: string) => void;
}

export const HomeContext = createContext<HomeContextType | undefined>(
	undefined,
);
const POSTS_NUMBER = 14;

const HomePage: React.FC = () => {
	const [searchValue, setSearchValue] = useState<string>("");
	const [filter, setFilter] = useState("");

	const { page } = useParams<{ page: string }>();
	const currentPage = page ? parseInt(page) : 1;

	const { data, isLoading, error } = usePosts(currentPage, searchValue);

	const totalPages = data ? Math.ceil(data.total / POSTS_NUMBER) : 0;

	const handleSearch = useCallback((value: string) => {
		setSearchValue(value);
	}, []);

	return (
		<HomeContext.Provider value={{ searchValue, filter, setFilter }}>
			<section className="section">
				<SearchBar onSearch={handleSearch} />
				<div className="container">
					{isLoading ? (
						<PostItemSkeleton cards={POSTS_NUMBER} />
					) : error ? (
						<Error error={error} />
					) : (
						<>
							{data && data.posts.length ? (
								<>
									<PostList posts={data.posts} />
									<Pagination
										currentPage={currentPage}
										totalPages={totalPages}
										pageSize={POSTS_NUMBER}
										isHomePage={true}
									/>
								</>
							) : (
								<div className="notification has-text-centered">
									no results found for: {searchValue}
								</div>
							)}
						</>
					)}
				</div>
			</section>
		</HomeContext.Provider>
	);
};

export default HomePage;
