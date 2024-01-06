"use client"
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { firestore , storage } from "@/firebase/config";
import { MdAddAPhoto } from "react-icons/md";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "@firebase/auth";

const ProfilePage: React.FC = () => {
    const uploadMenuRef = useRef<HTMLDivElement | null>(null);
    const { user } = useAuth();
    const [description, setDescription] = useState<string>("");

    const userDocRef = user ? doc(firestore, "users", user.uid) : null;

    const fetchUserDescription = async () => {
        if (userDocRef) {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setDescription(userDoc.data()?.description || "");
            }
        }
    };

    const updateUserDescription = async () => {
        try {
            if (userDocRef) {
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    await updateDoc(userDocRef, { description: description });
                    console.log("User description updated:", description);
                } else {
                    await setDoc(userDocRef, { description: description });
                    console.log("User document created with description:", description);
                }
            }
        } catch (error) {
            // @ts-ignore
            console.error("Error updating user description:", error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserDescription();
        }
    }, [user]);

    const [isUploadMenuOpen, setUploadMenuOpen] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        try {
            if (user && userDocRef && selectedFile) {
                const storageRef = ref(storage, `profilePictures/${user.uid}/${selectedFile.name}`);
                await uploadBytes(storageRef, selectedFile);
                const downloadURL = await getDownloadURL(storageRef);
                await updateProfile(user, { photoURL: downloadURL });
                await updateDoc(userDocRef, { photoURL: downloadURL });
                console.log("Profile picture updated:", downloadURL);
                window.location.reload();
            }
        } catch (error) {
            // @ts-ignore
            console.error("Error uploading profile picture:", error.message);
        }
    };

    const handleOutsideClick = (e: MouseEvent) => {
        if (uploadMenuRef.current && !uploadMenuRef.current.contains(e.target as Node)) {
            setUploadMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isUploadMenuOpen) {
            document.addEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isUploadMenuOpen]);

    return (
        <div className="bg-background-alt h-screen flex flex-col items-center justify-center">
            {user && (
                <div className="text-center">
                    <div className="relative w-28 m-auto" onClick={() => setUploadMenuOpen(true)} title="Change your profile picture">
                        <MdAddAPhoto className="absolute right-1 bottom-1 text-3xl cursor-pointer" />
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt={`${user.displayName}'s profile`}
                                className="w-28 h-28 rounded-full mb-4 cursor-pointer ease-linear hover:border"
                            />
                        )}
                    </div>
                    <div className="text-center font-extrabold text-3xl m-5 ">
                        Hey there, {user.displayName}!
                    </div>
                    {isUploadMenuOpen && (
                        <div ref={uploadMenuRef} className="bg-background w-100 p-4 rounded-md mt-4 mb-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mb-2"
                            />
                            <button
                                onClick={handleUpload}
                                className="bg-primary rounded-md outline-none shadow-[0_3px_0px_0px_rgba(255,255,255)] hover:shadow-[0_2px_0px_0px_rgba(255,255,255)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition duration-[100] ease-in-out p-2"
                            >
                                Upload Profile Picture
                            </button>
                        </div>
                    )}
                    <div className="bg-background w-100 p-4 rounded-md">
                        <textarea
                            className="w-full h-40 p-2 mb-4 bg-background-alt text-white rounded-md"
                            placeholder="Write a description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                        <button
                            onClick={updateUserDescription}
                            className="bg-primary rounded-md outline-none shadow-[0_3px_0px_0px_rgba(255,255,255)] hover:shadow-[0_2px_0px_0px_rgba(255,255,255)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition duration-[100] ease-in-out p-2"
                        >
                            Save Description
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
