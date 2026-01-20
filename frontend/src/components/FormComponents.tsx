import type { ReactNode } from "react";
import { Link } from "react-router-dom";

// Auth Card Container
interface AuthCardProps {
	title: string;
	children: ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-cyan-200 flex items-center justify-center p-4">
			<div className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 max-w-md w-full">
				<h1 className="text-2xl font-bold text-cyan-900 mb-6">{title}</h1>
				{children}
			</div>
		</div>
	);
}

// Auth Input Field (with state management)
interface AuthInputProps {
	id: string;
	label: string;
	type?: "text" | "email" | "password";
	value: string;
	onChange: (value: string) => void;
	required?: boolean;
	placeholder?: string;
}

export function AuthInput({
	id,
	label,
	type = "text",
	value,
	onChange,
	required = false,
	placeholder,
}: AuthInputProps) {
	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-cyan-900 mb-1">
				{label}
			</label>
			<input
				id={id}
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				required={required}
				placeholder={placeholder}
				className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 text-cyan-900 placeholder-cyan-400"
			/>
		</div>
	);
}

// Error Message
interface ErrorMessageProps {
	message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
	if (!message) return null;
	return (
		<div className="bg-red-100/60 backdrop-blur-sm text-red-700 p-3 rounded-xl mb-4 text-sm border border-red-200">
			{message}
		</div>
	);
}

// Google Sign In Button
interface GoogleButtonProps {
	onClick: () => void;
}

export function GoogleButton({ onClick }: GoogleButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full bg-white/60 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/70 transition-all duration-300 font-medium flex items-center justify-center gap-3 mb-4"
		>
			<svg className="w-5 h-5" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="currentColor"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="currentColor"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				/>
				<path
					fill="currentColor"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
			Continue with Google
		</button>
	);
}

// Divider
interface DividerProps {
	text: string;
}

export function Divider({ text }: DividerProps) {
	return (
		<div className="relative mb-4">
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t border-cyan-200" />
			</div>
			<div className="relative flex justify-center text-sm">
				<span className="px-2 bg-white/40 text-cyan-800">{text}</span>
			</div>
		</div>
	);
}

// Submit Button
interface SubmitButtonProps {
	loading?: boolean;
	children: ReactNode;
	onClick?: () => void;
}

export function SubmitButton({ loading = false, children, onClick }: SubmitButtonProps) {
	return (
		<button
			type={onClick ? "button" : "submit"}
			disabled={loading}
			onClick={onClick}
			className="w-full bg-white/50 backdrop-blur-sm text-cyan-900 py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 disabled:bg-white/20 disabled:cursor-not-allowed transition-all duration-300 font-medium"
		>
			{children}
		</button>
	);
}

// Auth Footer Link
interface AuthFooterProps {
	text: string;
	linkText: string;
	linkTo: string;
}

export function AuthFooter({ text, linkText, linkTo }: AuthFooterProps) {
	return (
		<p className="mt-4 text-center text-sm text-cyan-800">
			{text}{" "}
			<Link to={linkTo} className="text-cyan-900 font-medium hover:underline">
				{linkText}
			</Link>
		</p>
	);
}

// Link Button (styled link as button)
interface LinkButtonProps {
	to: string;
	children: ReactNode;
	variant?: "primary" | "secondary" | "text";
}

export function LinkButton({ to, children, variant = "primary" }: LinkButtonProps) {
	const buttonClass =
		variant === "text"
			? "w-full text-cyan-800 text-sm hover:underline text-center block"
			: variant === "primary"
			? "block w-full bg-white/50 backdrop-blur-sm text-cyan-900 text-center py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/60 transition-all duration-300 font-medium"
			: "block w-full bg-white/40 backdrop-blur-sm text-cyan-900 text-center py-3 px-4 rounded-xl border border-cyan-200 hover:bg-white/50 transition-all duration-300 font-medium";

	return (
		<Link to={to} className={buttonClass}>
			{children}
		</Link>
	);
}

// Status Icon
interface StatusIconProps {
	type: "loading" | "success" | "error" | "info";
}

export function StatusIcon({ type }: StatusIconProps) {
	const configs = {
		loading: {
			bg: "bg-cyan-100/60",
			color: "text-cyan-600",
			icon: (
				<svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
			),
		},
		success: {
			bg: "bg-green-100/60",
			color: "text-green-600",
			icon: (
				<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
				</svg>
			),
		},
		error: {
			bg: "bg-red-100/60",
			color: "text-red-600",
			icon: (
				<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			),
		},
		info: {
			bg: "bg-cyan-100/60",
			color: "text-cyan-600",
			icon: (
				<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			),
		},
	};

	const config = configs[type];

	return (
		<div className={`inline-flex items-center justify-center w-16 h-16 ${config.bg} rounded-full mb-4`}>
			<div className={config.color}>{config.icon}</div>
		</div>
	);
}

// Status Message (with icon)
interface StatusMessageProps {
	type: "loading" | "success" | "error" | "info";
	title: string;
	message?: string;
	children?: ReactNode;
}

export function StatusMessage({ type, title, message, children }: StatusMessageProps) {
	return (
		<div className="text-center mb-6">
			<StatusIcon type={type} />
			<h1 className="text-2xl font-bold text-cyan-900 mb-2">{title}</h1>
			{message && <p className="text-cyan-800">{message}</p>}
			{children}
		</div>
	);
}

// Success Message Box
interface SuccessMessageProps {
	children: ReactNode;
}

export function SuccessMessage({ children }: SuccessMessageProps) {
	return (
		<div className="bg-green-100/60 backdrop-blur-sm text-green-700 p-3 rounded-xl text-sm border border-green-200 text-center">
			{children}
		</div>
	);
}

// Info Box
interface InfoBoxProps {
	children: ReactNode;
}

export function InfoBox({ children }: InfoBoxProps) {
	return (
		<div className="bg-white/30 backdrop-blur-sm p-4 rounded-xl border border-cyan-200">
			<div className="text-cyan-900 text-sm leading-relaxed">{children}</div>
		</div>
	);
}

// Section Card Component
interface SectionProps {
	title: string;
	children: ReactNode;
	variant?: "default" | "danger";
}

export function Section({ title, children, variant = "default" }: SectionProps) {
	const bgColor = variant === "danger"
		? "bg-red-50/40 backdrop-blur-lg border-red-200/50"
		: "bg-white/40 backdrop-blur-lg border-white/50";
	const titleColor = variant === "danger" ? "text-red-900" : "text-cyan-900";

	return (
		<div className={`${bgColor} p-6 rounded-2xl shadow-lg border`}>
			<h2 className={`text-xl font-bold ${titleColor} mb-4`}>{title}</h2>
			{children}
		</div>
	);
}

// Input Field Component
interface InputFieldProps {
	label: string;
	type?: "text" | "email" | "password";
	value?: string;
	disabled?: boolean;
	helperText?: string;
	monospace?: boolean;
	onChange?: (value: string) => void;
	placeholder?: string;
	maxLength?: number;
	required?: boolean;
}

export function InputField({
	label,
	type = "text",
	value,
	disabled = false,
	helperText,
	monospace = false,
	onChange,
	placeholder,
	maxLength,
	required,
}: InputFieldProps) {
	const inputClass = disabled
		? "w-full px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl text-cyan-700 cursor-not-allowed"
		: "w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500";

	return (
		<div>
			<label className="block text-sm font-medium text-cyan-800 mb-2">
				{label}
			</label>
			<input
				type={type}
				value={value}
				onChange={onChange ? (e) => onChange(e.target.value) : undefined}
				placeholder={placeholder}
				maxLength={maxLength}
				required={required}
				disabled={disabled}
				className={`${inputClass} ${monospace ? "font-mono text-sm" : ""}`}
			/>
			{helperText && (
				<p className="text-xs text-cyan-600 mt-1">{helperText}</p>
			)}
		</div>
	);
}

// Toggle Switch Component
interface ToggleProps {
	label: string;
	description: string;
	defaultChecked?: boolean;
}

export function Toggle({ label, description, defaultChecked = false }: ToggleProps) {
	return (
		<div className="flex items-center justify-between p-4 bg-white/30 rounded-xl">
			<div>
				<p className="font-medium text-cyan-900">{label}</p>
				<p className="text-sm text-cyan-700">{description}</p>
			</div>
			<label className="relative inline-flex items-center cursor-pointer">
				<input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
				<div className="w-11 h-6 bg-cyan-200/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
			</label>
		</div>
	);
}

// Button Component
interface ButtonProps {
	children: ReactNode;
	variant?: "primary" | "secondary" | "danger";
	onClick?: () => void;
	type?: "button" | "submit";
	disabled?: boolean;
}

export function Button({ children, variant = "primary", onClick, type = "button", disabled = false }: ButtonProps) {
	const buttonClass =
		variant === "danger"
			? "px-6 py-3 bg-red-100/60 backdrop-blur-sm text-red-700 rounded-xl border border-red-200 hover:bg-red-100/80 disabled:bg-red-100/40 disabled:cursor-not-allowed transition-all font-medium"
			: variant === "secondary"
			? "px-6 py-3 bg-white/40 backdrop-blur-sm text-cyan-800 rounded-xl border border-cyan-200/50 hover:bg-white/60 disabled:bg-white/20 disabled:cursor-not-allowed transition-all font-medium"
			: "px-6 py-3 bg-cyan-100/50 backdrop-blur-sm text-cyan-900 rounded-xl border border-cyan-200/50 hover:bg-cyan-100/70 disabled:bg-cyan-100/30 disabled:cursor-not-allowed transition-all font-medium";

	return (
		<button type={type} onClick={onClick} disabled={disabled} className={buttonClass}>
			{children}
		</button>
	);
}
