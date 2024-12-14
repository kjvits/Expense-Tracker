import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from "react-dom/client";
import GridBackground from "./components/ui/GridBackground.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<GridBackground>
				<App />
			</GridBackground>
		</BrowserRouter>
	</StrictMode>
);