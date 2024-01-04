 "use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { updateDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { firestore , storage } from "@/firebase/config";
import { MdAddAPhoto } from "react-icons/md";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
 import {updateProfile} from "@firebase/auth";

const ProfilePage = () => {
    const { user } = useAuth();
    const [description, setDescription] = useState("");

    const userDocRef = user ? doc(firestore, "users", user.uid) : null;

    const fetchUserDescription = async () => {
        if (userDocRef) {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setDescription(userDoc.data().description || "");
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

    const [isUploadMenuOpen, setUploadMenuOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        try {
            if (user && userDocRef && selectedFile) {
                // Upload file to Firebase Storage
                const storageRef = ref(storage, `profilePictures/${user.uid}/${selectedFile.name}`);
                await uploadBytes(storageRef, selectedFile);

                // Get download URL
                const downloadURL = await getDownloadURL(storageRef);

                // Update user's photoURL with the new uploaded image URL
                await updateProfile(user, { photoURL: downloadURL });

                // Update the user document in Firestore (optional)
                await updateDoc(userDocRef, { photoURL: downloadURL });

                // Log success message
                console.log("Profile picture updated:", downloadURL);

                window.location.reload();
            }
        } catch (error) {
            // @ts-ignore
            console.error("Error uploading profile picture:", error.message);
        }
    };

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
                                className="w-28 h-28 rounded-full mb-4 cursor-pointer"
                            />
                        )}
                    </div>
                    <div className="text-center font-extrabold text-3xl m-5 ">
                        Hey there, {user.displayName}!
                    </div>
                    {isUploadMenuOpen && (
                        <div className="bg-background w-100 p-4 rounded-md mt-4 mb-2">
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
                            className="w-full h-40 p-2 mb-4 bg-background text-white rounded-md"
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
