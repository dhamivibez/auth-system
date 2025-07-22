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
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		lastLogin: "", // Holds the last login timestamp
	});
	const [editedUserData, setEditedUserData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		// lastLogin is intentionally not included here as it's not user-editable
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
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
				if (response.ok && data.success) {
					setUserData(data.data);
					setEditedUserData({
						firstName: data.data.firstName,
						lastName: data.data.lastName,
						username: data.data.username,
						email: data.data.email,
					});
				} else if (response.status === 401) {
					setErrorMessage(data.message || "Session Expired");
					navigate({ to: "/auth/login" });
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
	}, [navigate]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditedUserData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSaving(true);
		setErrorMessage("");
		setSuccessMessage("");

		if (!editedUserData.firstName || !editedUserData.username || !editedUserData.email) {
			setErrorMessage("First name, username, and email are required.");
			setIsSaving(false);
			return;
		}

		try {
			const response = await fetch(`${API}/profile`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				// Explicitly send only the editable fields; lastLogin is excluded
				body: JSON.stringify({
					firstName: editedUserData.firstName,
					lastName: editedUserData.lastName,
					username: editedUserData.username,
					email: editedUserData.email,
				}),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				// Update userData with the edited data (and keep existing lastLogin)
				setUserData((prev) => ({ ...prev, ...editedUserData }));
				setSuccessMessage("Profile updated successfully!");
				setIsEditing(false);
			} else {
				setErrorMessage(data.message || "Failed to update profile.");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			setErrorMessage("An error occurred while updating profile. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

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
			setTimeout(() => {
				navigate({ to: "/auth/login" });
			}, 1000);
		}
	};

	// Helper function to format the lastLogin date
	const formatLastLogin = (dateString: string) => {
		if (!dateString) return "N/A";
		try {
			const date = new Date(dateString);
			return date.toLocaleString();
		} catch (error) {
			console.error("Error formatting date:", error);
			return "Invalid Date";
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
				<div className="flex items-center text-gray-700 text-xl">
					<svg className="animate-spin h-6 w-6 text-blue-500 mr-3" viewBox="0 0 24 24" aria-label="Loading profile data">
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

				{isEditing ? (
					<form onSubmit={handleUpdateProfile} className="space-y-6">
						<div>
							<label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
								First Name
							</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								value={editedUserData.firstName}
								onChange={handleChange}
								required
								aria-label="First Name"
								disabled={isSaving}
							/>
						</div>

						<div>
							<label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
								Last Name
							</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								value={editedUserData.lastName || ""}
								onChange={handleChange}
								aria-label="Last Name"
								disabled={isSaving}
							/>
						</div>

						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
								Username
							</label>
							<input
								type="text"
								id="username"
								name="username"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								value={editedUserData.username}
								onChange={handleChange}
								required
								aria-label="Username"
								disabled={isSaving}
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								value={editedUserData.email}
								onChange={handleChange}
								required
								aria-label="Email"
								disabled={isSaving}
							/>
						</div>

						<div className="flex justify-between space-x-4">
							<button
								type="button"
								onClick={() => {
									setIsEditing(false);
									setEditedUserData({
										firstName: userData.firstName,
										lastName: userData.lastName,
										username: userData.username,
										email: userData.email,
									});
									setErrorMessage("");
									setSuccessMessage("");
								}}
								className="w-1/2 flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 ease-in-out transform hover:scale-105"
								disabled={isSaving}
								aria-label="Cancel editing profile"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
								disabled={isSaving}
								aria-label={isSaving ? "Saving profile changes" : "Save Changes"}
							>
								{isSaving ? (
									<span className="flex items-center">
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Saving spinner">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Saving...
									</span>
								) : (
									"Save Changes"
								)}
							</button>
						</div>
					</form>
				) : (
					<>
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
							<div className="flex justify-between items-center py-2 border-b border-gray-200">
								<span className="font-medium">Email:</span>
								<span>{userData.email}</span>
							</div>
							<div className="flex justify-between items-center py-2">
								<span className="font-medium">Last Login:</span>
								<span>{formatLastLogin(userData.lastLogin)}</span>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
							<button
								type="button"
								onClick={() => {
									setIsEditing(true);
									setErrorMessage("");
									setSuccessMessage("");
								}}
								className={`w-full sm:w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105
                  ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
								disabled={isLoading}
								aria-label="Edit profile"
							>
								Edit Profile
							</button>

							<button
								type="button"
								onClick={handleLogout}
								className={`w-full sm:w-1/2 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105
                  ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
								disabled={isLoading}
								aria-label={isLoading ? "Logging out..." : "Logout"}
							>
								{isLoading ? "Logging out..." : "Logout"}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default ProfilePage;
