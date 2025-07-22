import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4 font-sans">
			<div className="text-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 sm:p-10 rounded-3xl shadow-2xl border border-white border-opacity-20 max-w-2xl w-full">
				<h1 className="text-4xl sm:text-6xl font-extrabold mb-4 sm:mb-6 animate-fade-in-down text-gray-900 leading-tight">Welcome to Our App!</h1>
				<p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed animate-fade-in-up text-gray-800">
					Your journey begins here. Explore the features, connect with others, and make the most of your experience.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
					<a
						href="/auth/login"
						className="inline-block w-full sm:w-auto bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 animate-bounce-in"
					>
						Login
					</a>
					<a
						href="/auth/signup"
						className="inline-block w-full sm:w-auto bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg border border-white hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 animate-bounce-in delay-100"
					>
						Sign Up
					</a>
					<a
						href="/profile"
						className="inline-block w-full sm:w-auto bg-green-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 animate-bounce-in delay-200"
					>
						Profile
					</a>
				</div>
			</div>
		</div>
	);
}
