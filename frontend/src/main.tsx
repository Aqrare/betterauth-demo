import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import CheckEmail from "./pages/CheckEmail";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/check-email" element={<CheckEmail />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
