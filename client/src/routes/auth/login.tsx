/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <'explanation'> */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { API } from "@/routes/__root";

// Define the route for the login page
export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [identifier, setIdentifier] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Function to handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // Prevent default form submission behavior
		setErrorMessage(""); // Clear previous error messages
		setSuccessMessage(""); // Clear previous success messages
		setIsLoading(true); // Set loading state to true

		try {
			// Make a POST request to the login API endpoint
			const response = await fetch(`${API}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ identifier, password }),
				credentials: "include",
			});

			const data = await response.json();

			if (data.success) {
				setSuccessMessage("Login successful!");
				navigate({ to: "/profile" });
			} else {
				setErrorMessage(data.message || "Login failed. Please check your credentials.");
			}
		} catch (error) {
			setErrorMessage("An error occurred. Please try again later.");
			console.error("Login error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
			<div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
				<h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Welcome Back!</h2>

				{errorMessage && (
					<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
						<strong className="font-bold">Error!</strong>
						<span className="block sm:inline ml-2">{errorMessage}</span>
					</div>
				)}

				{successMessage && (
					<div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
						<strong className="font-bold">Success!</strong>
						<span className="block sm:inline ml-2">{successMessage}</span>
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
							Username or Email
						</label>
						<input
							type="text"
							id="identifier"
							name="identifier"
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out"
							placeholder="Enter your username or email"
						/>
					</div>

					{/* Password Input */}
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out"
							placeholder="Enter your password"
						/>
					</div>

					<div className="flex items-center justify-end">
						<div className="text-sm">
							<Link to="/auth/reset-password" className="font-medium text-blue-600 hover:text-blue-500 transition duration-200 ease-in-out">
								Forgot your password?
							</Link>
						</div>
					</div>

					{/* Login Button */}
					<div>
						<button
							type="submit"
							disabled={isLoading} // Disable button while loading
							className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
						>
							{isLoading ? (
								<svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							) : (
								"Sign In"
							)}
						</button>
					</div>
				</form>

				<div className="mt-8 text-center text-sm text-gray-600">
					Don't have an account?
					<Link to="/auth/signup" className="font-medium pl-1 text-blue-600 hover:text-blue-500 transition duration-200 ease-in-out">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}
