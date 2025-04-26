// resources/js/Layouts/GuestLayout.jsx
import React from 'react';
import '../../styles/auth.css'; // Import auth.css

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="auth-container w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
