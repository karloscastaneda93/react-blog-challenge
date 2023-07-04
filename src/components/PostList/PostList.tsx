import React, { useState, useCallback, useMemo } from "react";
import { Post } from "../../types";
import PostItem from "../PostItem/PostItem";

const PostList: React.FC<{ posts: Post[] }> = ({ posts }) => {
	const [selectedTag, setSelectedTag] = useState("");

	const handleTagClick = useCallback((tag: string) => {
		setSelectedTag(tag);
	}, []);

	const filteredPosts = useMemo(() => {
		return selectedTag
			? posts.filter((post) => post.tags.includes(selectedTag))
			: posts;
	}, [selectedTag, posts]);

	return (
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
	);
};

export default PostList;
