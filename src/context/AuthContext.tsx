import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    User as FirebaseAuthUser,
} from "firebase/auth";
import { auth } from "@/firebase/config";

interface User extends FirebaseAuthUser {
    // Extend the FirebaseAuthUser interface with additional properties if needed
    displayName: string;
    photoURL: string;
}

interface AuthContextType {
    user: User | null;
    googleSignIn: () => void;
    logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        signInWithPopup(auth, provider);
    };

    const handleLogOut = () => {
        signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Cast currentUser to User
            setUser(currentUser as User | null);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, googleSignIn, logOut: handleLogOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return context;
};

export const UserAuth = () => {
    return useContext(AuthContext);
};
