import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { CgProfile } from "react-icons/cg";
import { IoExitOutline } from "react-icons/io5";
import { MdAddToPhotos } from "react-icons/md";
import { GoInfo } from "react-icons/go";
import { FaListAlt } from "react-icons/fa";

const Navbar: React.FC = () => {
    const { user, googleSignIn, logOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLLIElement | null>(null);

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

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-background h-20 w-full border-b-2 flex items-center justify-between p-2">
            <ul className="flex items-center justify-center">
                <li className="p-2 cursor-pointer">
                    <Link href="/">
                        <h1 className="font-extrabold text-white text-4xl ease-linear duration-150 hover:border cursor-pointer flex items-center hover:bg-secondary rounded-md p-2">Kashoot</h1>
                    </Link>
                </li>
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
                    Sign in with Google
                </button>
            ) : (
                <div>
                    <ul className="flex items-center justify-center">
                        <Link className="p-2 ease-linear duration-150 hover:border flex items-center hover:bg-secondary rounded-md  cursor-pointer text-2xl" href="/all" title="View all your quizes">
                            <FaListAlt />
                        </Link>
                        <Link className="p-2 cursor-pointer ease-linear duration-150 hover:border flex items-center hover:bg-secondary rounded-md  text-2xl" href="/create" title="Create a new quiz">
                            <MdAddToPhotos />
                        </Link>
                        <li className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center p-2 ease-linear duration-150 hover:border cursor-pointer flex items-center hover:bg-secondary rounded-md text-4xl" title = "Menu"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={`${user.displayName}'s profile`}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <CgProfile />
                                )}
                            </button>

                            {isDropdownOpen && (
                                <ul className="absolute top-full right-0 mt-2 bg-background-alt border rounded shadow-md p-4 w-40">
                                    <li className="ease-linear duration-150 hover:border cursor-pointer flex items-center hover:bg-secondary rounded-md mb-2" onClick={handleSignOut}>
                                        <IoExitOutline className="mr-2" /> Sign out
                                    </li>
                                    <Link className="ease-linear duration-150 hover:border cursor-pointer flex items-center hover:bg-secondary rounded-md mb-2" href="/profile">
                                        <CgProfile className="mr-2" /> Profile
                                    </Link>
                                    <Link className="ease-linear duration-150 hover:border cursor-pointer flex items-center hover:bg-secondary rounded-md " href="/about">
                                        <GoInfo className="mr-2 font-extrabold" /> About us
                                    </Link>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;
