import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import ScrollToTop from "./components/ScrollTop";

import "./Layout.css";

const Layout: React.FC = () => {
	const [inView, setInView] = useState(true);
	return (
		<>
			<Header setInView={setInView} />
			<main className="main">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/:page" element={<HomePage />} />
					<Route path="/post/:id" element={<PostDetailPage />} />
				</Routes>
			</main>
			<ScrollToTop inView={inView} />
		</>
	);
};

export default Layout;
