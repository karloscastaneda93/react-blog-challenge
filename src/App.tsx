import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "./Layout";
import { SkeletonTheme } from "react-loading-skeleton";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<SkeletonTheme>
				<BrowserRouter>
					<Layout />
				</BrowserRouter>
			</SkeletonTheme>
		</QueryClientProvider>
	);
}

export default App;
