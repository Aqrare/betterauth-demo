import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import CheckEmail from "./pages/CheckEmail";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import SetPassword from "./pages/SetPassword";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import TwoFactorVerify from "./pages/TwoFactorVerify";
import VerifyEmail from "./pages/VerifyEmail";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="/set-password" element={<SetPassword />} />
				<Route path="/two-factor-verify" element={<TwoFactorVerify />} />
				<Route path="/check-email" element={<CheckEmail />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
