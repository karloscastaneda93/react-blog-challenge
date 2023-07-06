import React from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "react-query";

import Layout from "./Layout";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<HelmetProvider>
				<BrowserRouter>
					<Layout />
				</BrowserRouter>
			</HelmetProvider>
		</QueryClientProvider>
	);
}

export default App;
