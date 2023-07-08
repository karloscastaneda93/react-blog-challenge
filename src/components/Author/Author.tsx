import React from "react";

interface AuthorProps {
	name: string;
	url: string;
	label: string;
}

const Author: React.FC<AuthorProps> = ({ name, url, label }) => (
	<p className="author">
		by
		<a
			target="_blank"
			rel="noreferrer"
			className="is-size-4"
			href={url}
			aria-label={label}
		>
			{name}
		</a>
	</p>
);

export default Author;
