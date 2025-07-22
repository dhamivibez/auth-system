import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { API } from "@/routes/__root";

// Define the route for the forgot password page
export const Route = createFileRoute("/auth/reset-password")({
	component: RouteComponent,
});

function RouteComponent() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	// Function to handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessage(""); // Clear previous messages
		setIsSuccess(false); // Reset success status
		setLoading(true);

		if (!username || !email || !newPassword) {
			// Basic client-side validation
			setMessage("Please fill in all fields.");
			setLoading(false);
			return;
		}

		if (newPassword.length < 6) {
			setMessage("Password should be at least six characters.");
			setLoading(false);
			return;
		}

		// Prepare the payload for the API call
		const payload = {
			username,
			email,
			password: newPassword,
		};

		try {
			// Simulate API call to /auth/forgot-password
			// In a real application, you would replace this with an actual fetch call to your backend
			const response = await fetch(`${API}/auth/forgot-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setMessage("Password reset successfully! You can now log in with your new password.");
				setIsSuccess(true);
				// Clear the form
				setUsername("");
				setEmail("");
				setNewPassword("");
			} else {
				// Handle API errors
				setMessage(data.message || "Failed to reset password. Please try again.");
				setIsSuccess(false);
			}
		} catch (error) {
			console.error("Error during password reset:", error);
			setMessage("An unexpected error occurred. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
			<div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Forgot Password</h2>
				<p className="text-center text-gray-600 mb-6">Enter your username and email to reset your password.</p>
				{message && (
					<div className={`mt-6 p-3 rounded-md text-center ${isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} role="alert">
						{message}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
							Username
						</label>
						<input
							type="text"
							id="username"
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							aria-label="Username"
							disabled={loading}
						/>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							id="email"
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							aria-label="Email"
							disabled={loading}
						/>
					</div>

					<div>
						<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
							New Password
						</label>
						<input
							type="password"
							id="newPassword"
							className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							minLength={6}
							aria-label="New Password"
							disabled={loading}
						/>
					</div>

					<button
						type="submit"
						className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
						disabled={loading}
					>
						{loading ? (
							<span className="flex items-center">
								<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<title>svg</title>
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
							</span>
						) : (
							"Reset Password"
						)}
					</button>
				</form>

				<div className="mt-8 text-center text-sm text-gray-600">
					Remember your password?
					<Link to="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
						Log in here
					</Link>
				</div>
			</div>
		</div>
	);
}

export default RouteComponent;
