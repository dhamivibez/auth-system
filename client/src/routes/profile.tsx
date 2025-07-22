/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <'explanation'> */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// Define the route for the profile page
export const Route = createFileRoute("/profile")({
	component: ProfilePage,
});

// Mock API URL (replace with your actual API endpoint if needed)
const API = import.meta.env.VITE_API_URL;

function ProfilePage() {
	// State to hold user data
	const [userData, setUserData] = useState({
		firstName: "John",
		lastName: "Doe",
		username: "johndoe",
		email: "john.doe@example.com",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string>("");

	// In a real application, you would fetch user data here
	useEffect(() => {
		// Simulate fetching user data from an API
		const fetchUserData = async () => {
			setIsLoading(true);
			setErrorMessage("");
			try {
				// In a real app, you'd make an authenticated fetch request
				const response = await fetch(`${API}/profile`, {
					credentials: "include",
				});
				const data = await response.json();
				if (response.ok) {
					setUserData(data.user);
				} else {
					setErrorMessage(data.message || "Failed to load profile data.");
				}

				// For now, simulate a delay and set mock data
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setUserData({
					firstName: "Jane",
					lastName: "Smith",
					username: "janesmith",
					email: "jane.smith@example.com",
				});
			} catch (error) {
				console.error("Error fetching user data:", error);
				setErrorMessage("Could not load profile. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleLogout = () => {
		// In a real application, you would clear authentication tokens/session
		// localStorage.removeItem('authToken');
		// Redirect to login page or home page
		alert("Logged out successfully! (In a real app, you'd be redirected)");
		window.location.href = "/auth/login"; // Redirect to login page
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
				<div className="flex items-center text-gray-700 text-xl">
					<svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Loading profile...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
			<div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
				<h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Your Profile</h2>

				{errorMessage && (
					<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
						<strong className="font-bold">Error!</strong>
						<span className="block sm:inline ml-2">{errorMessage}</span>
					</div>
				)}

				<div className="space-y-4 text-gray-700">
					<div className="flex justify-between items-center py-2 border-b border-gray-200">
						<span className="font-medium">First Name:</span>
						<span>{userData.firstName}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-200">
						<span className="font-medium">Last Name:</span>
						<span>{userData.lastName || "N/A"}</span> {/* Display N/A if last name is empty */}
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-200">
						<span className="font-medium">Username:</span>
						<span>{userData.username}</span>
					</div>
					<div className="flex justify-between items-center py-2">
						<span className="font-medium">Email:</span>
						<span>{userData.email}</span>
					</div>
				</div>

				<div className="mt-8">
					{/** biome-ignore lint/a11y/useButtonType: <[explanation]> */}
					<button
						onClick={handleLogout}
						className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:scale-105"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}
