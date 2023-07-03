import React, { FC, useEffect } from "react";
import Title from "../Title";
import { useInView } from "react-intersection-observer";
import "./Header.css";

const Header: FC<{ setInView: (inView: boolean) => void }> = ({
	setInView,
}) => {
	const [ref, inView] = useInView();

	useEffect(() => {
		setInView(inView);
	}, [inView, setInView]);

	return (
		<header ref={ref} className="header">
			<div className="header-details has-text-centered mt-5">
				<Title />
				<h2 className="author">
					by
					<a
						target="_blank"
						rel="noreferrer"
						className="is-size-4"
						href="https://ccastaneda.dev"
					>
						Carlos Castañeda
					</a>
				</h2>
			</div>
		</header>
	);
};

export default Header;
