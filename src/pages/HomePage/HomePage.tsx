import React, { useState, useCallback } from 'react';
import { usePosts } from '../../services/api';
import PostList from '../../components/PostList';
import Pagination from '../../components/Pagination';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar/SearchBar';

const HomePage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchValue, setSearchValue] = useState<string>('');

    const { data, isLoading, error } = usePosts(currentPage, searchValue);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = data ? Math.ceil(data.total / 30) : 0;

    const handleSearch = useCallback((value: string) => {
        setSearchValue(value);
        setCurrentPage(1); // Reset page number after a new search
    }, []);

    return (
        <section className="section">
            <SearchBar onSearch={handleSearch} />
            <div className="container">
                {isLoading ? (
                    <Loading />
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
                                    onPageChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <div>no results found for: {searchValue}</div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default HomePage;
