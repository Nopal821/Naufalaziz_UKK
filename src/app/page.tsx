import React from 'react';
import Link from "next/link";

export default function LandingPage() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
            style={{ backgroundImage: "url('https://wallpapercave.com/uwp/uwp4733095.jpeg')" }}
        >
            <div className="bg-white bg-opacity-55 p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
                <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-bounce">Welcome to Hotel Website</h1>
                <p className="text-lg text-gray-700 mb-8">Make your holiday amzing</p>
                <Link href='/room' className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 transform hover:scale-105">
                    Make a reservation
                </Link>
            </div>
            <div className="mt-8">
                <p className="text-white text-sm">Powered by Next.js © 2024</p>
            </div>
        </div>
    );
}
