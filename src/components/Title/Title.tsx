import React from "react";

interface TitleProps {
	text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => (
	<h1 className="title is-size-1 has-text-white">{text}</h1>
);

export default Title;
