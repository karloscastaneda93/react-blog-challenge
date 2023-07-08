import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import GoHomeButton from "../../components/GoHomeButton";
import MetaTags from "../../components/MetaTags/MetaTags";

const NotFound = () => {
	const [countdown, setCountdown] = useState(10);
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown((countdown) => countdown - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (countdown === 0) navigate("/");
	}, [countdown, navigate]);

	return (
		<>
			<MetaTags
				title="404 Not Found - Carlos Castaneda"
				description="The page you're looking for was not found."
				url={window.location.href}
			/>
			<section className="hero is-fullheight section">
				<div className="hero-body container">
					<div className="container has-text-centered">
						<h1 className="title is-1">404</h1>
						<p className="subtitle has-text-grey-lighter">
							Page Not Found!
						</p>
						<div className="is-flex is-flex-direction-column is-justify-content-space-evenly is-align-items-center is-align-content-center mb-5">
							<p className="subtitle is-3">Go back</p>
							<GoHomeButton />
						</div>
						<hr />
						<p className="subtitle is-3">
							Or you will be redirected in {countdown} ...
						</p>
					</div>
				</div>
			</section>
		</>
	);
};

export default NotFound;
