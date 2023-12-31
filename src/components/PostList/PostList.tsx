import React, { useState, useCallback, useMemo, useContext } from "react";
import { useSearchParams } from "react-router-dom";

import { Post } from "../../types";
import { HomeContext } from "../../pages/HomePage/HomePage";
import PostItem from "../PostItem/PostItem";

import "./PostList.css";

const PostList: React.FC<{ posts: Post[] }> = ({ posts }) => {
	const homeContext = useContext(HomeContext);
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedTag, setSelectedTag] = useState(
		homeContext?.filter || searchParams.get("filter") || "",
	);

	const handleTagClick = useCallback((tag: string) => {
		const params = new URLSearchParams(searchParams.toString());
		setSelectedTag(tag);
		homeContext?.setFilter(tag);
		if (!params.has("filter")) {
			params.append("filter", tag);
			setSearchParams(params, { replace: true });
		}
	}, []);

	const handleCloseClick = () => {
		const params = new URLSearchParams(searchParams.toString());
		setSelectedTag("");
		homeContext?.setFilter("");
		params.delete("filter");
		setSearchParams(params, { replace: true });
	};

	const filteredPosts = useMemo(() => {
		return selectedTag
			? posts.filter((post) => post.tags.includes(selectedTag))
			: posts;
	}, [selectedTag, posts]);

	return (
		<>
			{selectedTag && (
				<div className="filtering-by is-flex is-justify-content-space-between is-align-items-center is-align-content-center">
					<p className="subtitle m-0">Filtering by: {selectedTag}</p>
					<button
						onClick={handleCloseClick}
						className="delete ml-2"
					/>
				</div>
			)}
			<ul className="columns is-multiline">
				{filteredPosts.map((post) => (
					<PostItem
						key={post.id}
						post={post}
						handleTagClick={handleTagClick}
						selectedTag={selectedTag}
					/>
				))}
			</ul>
		</>
	);
};

export default PostList;
