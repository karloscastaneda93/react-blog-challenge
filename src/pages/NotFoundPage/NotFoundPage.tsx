import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const NotFoundPage = () => {
	const [countdown, setCountdown] = useState(15);
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
		<div className="flex flex-col justify-center items-center min-h-[55vh]">
			<div className="relative w-full flex flex-col justify-center items-center">
				<h1 className="text-9xl font-extrabold text-white tracking-widest">
					404
				</h1>
				<div className="bg-[#636365] px-2 text-sm rounded rotate-12 absolute text-white top-[50%] translate-y-[-15%] font2">
					Page Not Found!
				</div>
				<p className="text-white text-center text-2xl mt-5 font2">
					You will be redirected home in {countdown} seconds...
				</p>
			</div>
			<Link
				to="/"
				className="mt-5 relative inline-block text-sm font-medium text-white group active:text-[#636365] focus:none"
			>
				<span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#636365] group-hover:translate-y-0 group-hover:translate-x-0"></span>

				<span className="relative block px-8 py-3 bg-[#232333] border border-current font2">
					Go Home
				</span>
			</Link>
		</div>
	);
};

export default NotFoundPage;
