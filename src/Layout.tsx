import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/ScrollTop";
import { HEADER_DETAILS } from "./constants";

import "./Layout.css";

const Layout: React.FC = () => {
	const [inView, setInView] = useState(true);
	return (
		<>
			<Header
				setInView={setInView}
				title={HEADER_DETAILS.title}
				author={HEADER_DETAILS.author}
				authorUrl={HEADER_DETAILS.authorUrl}
				authorLabel={HEADER_DETAILS.authorLabel}
			/>
			<main className="main">
				<Routes>
					<Route path="/post/:id" element={<PostDetailPage />} />
					<Route index element={<HomePage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</main>
			<ScrollToTop inView={inView} />
		</>
	);
};

export default Layout;
