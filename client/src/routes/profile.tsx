/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <'explanation'> */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
	component: ProfilePage,
});

const API = import.meta.env.VITE_API_URL;

function ProfilePage() {
	const navigate = useNavigate();
	const [userData, setUserData] = useState({
		firstName: "John",
		lastName: "Doe",
		username: "johndoe",
		email: "john.doe@example.com",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true);
			setErrorMessage("");
			try {
				const response = await fetch(`${API}/profile`, {
					credentials: "include",
				});
				const data = await response.json();
				if (response.ok) {
					setUserData(data.data);
				} else {
					setErrorMessage(data.message || "Failed to load profile data.");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
				setErrorMessage("Could not load profile. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleLogout = async () => {
		setIsLoading(true);
		setErrorMessage("");
		setSuccessMessage("");

		try {
			const response = await fetch(`${API}/auth/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (response.ok) {
				setSuccessMessage("Logged out successfully!");
			} else {
				const errorData = await response.json();
				setErrorMessage(errorData.message || "Logout failed on server.");
				console.error("Logout error:", errorData);
			}
		} catch (error) {
			setErrorMessage("An error occurred during logout. Please try again.");
			console.error("Logout fetch error:", error);
		} finally {
			setIsLoading(false);

			navigate({ to: "/auth/login" });
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
				<div className="flex items-center text-gray-700 text-xl">
					<svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
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

				{successMessage && (
					<div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
						<strong className="font-bold">Success!</strong>
						<span className="block sm:inline ml-2">{successMessage}</span>
					</div>
				)}

				<div className="space-y-4 text-gray-700">
					<div className="flex justify-between items-center py-2 border-b border-gray-200">
						<span className="font-medium">First Name:</span>
						<span>{userData.firstName}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-200">
						<span className="font-medium">Last Name:</span>
						<span>{userData.lastName || "N/A"}</span>
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

				<div>
					<button
						type="button"
						onClick={handleLogout}
						className={`w-full flex mt-6 justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
						disabled={isLoading}
					>
						{isLoading ? "Logging out..." : "Logout"}
					</button>
				</div>
			</div>
		</div>
	);
}
