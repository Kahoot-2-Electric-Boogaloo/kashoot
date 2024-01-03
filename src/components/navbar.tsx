// Navbar.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { CgProfile } from "react-icons/cg";

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
            <ul className="flex items-center justify-center">
                <li className="p-2 cursor-pointer">
                    <Link href="/">
                        <h1 className="font-extrabold text-white text-4xl">Kashoot</h1>
                    </Link>
                </li>

                {!user ? null : (
                    <button className='bg-background-alt
                    rounded-md
                    outline-none
                    shadow-[0_3px_0px_0px_rgba(255,255,255)]
                    font-bold
                    hover:bg-secondary
                    hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                    hover:translate-y-[2px]
                    active:shadow-none
                    active:translate-y-[4px]
                    transition duration-[100] ease-in-out
                    p-2
                    '>Welcome, {user.displayName}</button>
                )}
                {!user ? null : (
                    <li className="p-2 cursor-pointer text-4xl">
                        <Link href="/ShooterPorfile">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={`${user.displayName}'s profile`}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <CgProfile />
                            )}
                        </Link>
                    </li>
                )}
            </ul>

            {loading ? null : !user ? (
                <button
                    value={"Enter"}
                    onClick={() => handleSignIn()}
                    className='bg-background-alt
                    rounded-md
                    outline-none
                    shadow-[0_3px_0px_0px_rgba(255,255,255)]
                    font-bold
                    hover:bg-secondary
                    hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                    hover:translate-y-[2px]
                    active:shadow-none
                    active:translate-y-[4px]
                    transition duration-[100] ease-in-out
                    p-2
                    '
                >
                     Sign in with google
                </button>
            ) : (
                <div>
                    <button
                        value={"Enter"}
                        onClick={() => handleSignOut()}
                        className='bg-background-alt
                        rounded-md
                        outline-none
                        shadow-[0_3px_0px_0px_rgba(255,255,255)]
                        font-bold
                        hover:bg-secondary
                        hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                        hover:translate-y-[2px]
                        active:shadow-none
                        active:translate-y-[4px]
                        transition duration-[100] ease-in-out
                        p-2
                        '
                        >
                            Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
