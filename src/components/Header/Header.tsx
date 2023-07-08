import React, { FC, useEffect } from "react";
import Title from "../Title";
import { useInView } from "react-intersection-observer";
import "./Header.css";
import Author from "../Author";

interface HeaderProps {
	setInView: (inView: boolean) => void;
	title: string;
	author: string;
	authorUrl: string;
	authorLabel: string;
}

const Header: FC<HeaderProps> = ({
	setInView,
	title,
	author,
	authorUrl,
	authorLabel,
}) => {
	const [ref, inView] = useInView();

	useEffect(() => {
		setInView(inView);
	}, [inView, setInView]);

	return (
		<header ref={ref} className="header">
			<div className="header-details has-text-centered mt-5">
				<Title text={title} />
				<Author name={author} url={authorUrl} label={authorLabel} />
			</div>
		</header>
	);
};
export default Header;
