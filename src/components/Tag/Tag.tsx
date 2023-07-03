import React from "react";

interface TagProps {
	tag: string;
	onClick: (tag: string) => void;
	isSelected: boolean;
}

const Tag: React.FC<TagProps> = ({ tag, onClick, isSelected }) => (
	<span
		className={`tag is-clickable ${
			isSelected ? "" : "has-background-grey-lighter"
		}`}
		onClick={() => onClick(tag)}
	>
		{tag}
	</span>
);

export default Tag;
