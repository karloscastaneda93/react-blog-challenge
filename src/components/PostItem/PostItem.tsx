import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import Tag from "../Tag";
import Icon from "../Icon";
import { Post } from "../../types";

interface PostItemProps {
	post: Post;
	handleTagClick: (tag: string) => void;
	selectedTag: string;
}

const PostItem: React.FC<PostItemProps> = ({
	post,
	handleTagClick,
	selectedTag,
}) => (
	<li key={post.id} className="column is-half">
		<article className="card">
			<div className="card-content">
				<h2 className="title is-4">{post.title}</h2>
				<div className="tags">
					{post.tags.map((tag: string) => (
						<Tag
							key={tag}
							tag={tag}
							isSelected={selectedTag === tag}
							onClick={handleTagClick}
						/>
					))}
				</div>
				<p className="content is-2">
					{post.body.split(" ").slice(0, 10).join(" ")}...
				</p>
				<div className="is-flex is-align-items-center is-justify-content-space-between">
					<div className="is-flex is-align-items-center">
						<Icon />
						<p className="reactions ml-1">{post.reactions}</p>
					</div>
					<div className="card-footer">
						<Link
							aria-label={`Read More About '${post.title}'`}
							className="button is-outlined is-small is-fullwidth"
							title="Read More About this post"
							to={`/post/${slugify(post.title, {
								lower: true,
								strict: true,
							})}/${post.id}`}
						>
							Read More...
						</Link>
					</div>
				</div>
			</div>
		</article>
	</li>
);

export default PostItem;
