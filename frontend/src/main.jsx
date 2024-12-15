import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import GridBackground from "./components/ui/GridBackground.jsx";
import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";

const client = new ApolloClient({
	// TODO ==> update the URI production
	uri:import.meta.env.VITE_NODE_ENV === "development"? "http://localhost:4000/graphql": "/graphql", // url for graphql server
	cache: new InMemoryCache(), // Apollo Client uses to cache query results after fetching them
	credentials: "include", // this tells client to send cookies along with every request to the server
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<GridBackground>
				<ApolloProvider client={client}>
					<App />
				</ApolloProvider>
			</GridBackground>
		</BrowserRouter>
	</StrictMode>
);