import React, { useState, FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ScrollTop.css";

const ScrollToTop: FC<{ inView: boolean }> = ({ inView }) => {
	const [show, setShow] = useState(false);
	const [isRendered, setIsRendered] = useState(false);

	const { pathname } = useLocation();

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

	useEffect(() => {
		setShow(!inView);
	}, [inView]);

	useEffect(() => {
		scrollToTop();
	}, [pathname]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsRendered(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	if (!show || !isRendered) {
		return null;
	}

	return (
		<div
			className="scroll-top cursor-pointer text-center"
			onClick={scrollToTop}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="icon is-medium"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M4.5 15.75l7.5-7.5 7.5 7.5"
				/>
			</svg>
		</div>
	);
};

export default ScrollToTop;
