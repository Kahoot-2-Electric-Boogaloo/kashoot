// Navbar.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, googleSignIn, logOut } = useAuth();
    const [loading, setLoading] = useState(true);

    const handleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };
        checkAuthentication();
    }, [user]);

    return (
        <div className="bg-background h-20 w-full border-b-2 flex items-center justify-between p-2">
            <ul className="flex">
                <li className="p-2 cursor-pointer">
                    <Link href="/"> <h1 className='font-extrabold'>
                        Kashoot
                    </h1></Link>
                </li>
                {!user ? null : (
                    <li className="p-2 cursor-pointer">
                        <Link href="/ShooterPorfile">Profile</Link>
                    </li>
                )}
            </ul>

            {loading ? null : !user ? (
                <ul className="flex">
                    <li onClick={handleSignIn} className="p-2 cursor-pointer">
                        Sign in with google
                    </li>
                </ul>
            ) : (
                <div>
                    <p>Welcome, {user.displayName}</p>
                    <p className="cursor-pointer" onClick={handleSignOut}>
                        Sign out
                    </p>
                </div>
            )}
        </div>
    );
};

export default Navbar;
