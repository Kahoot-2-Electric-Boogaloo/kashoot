"use client"
import React, { useState } from "react";

const AboutPage: React.FC = () => {
    const [rickrollVisible, setRickrollVisible] = useState(false);

    const handleLearnMoreClick = () => {
        setRickrollVisible(true);
    };

    return (
        <div className="bg-background-alt min-h-screen flex flex-col items-center justify-start">
            <div className="text-center w-80 m-auto">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="text-lg text-white mb-6">
                    Welcome to our Kahoot Clone, a project created by Marc-Andrei Furtos and Tudor Cosmin Mihart as a project for SSD.
                </p>
                <p className="text-lg text-white mb-6">
                    Our goal with this project was to recreate the fun and interactive learning environment that Kahoot provides,
                    allowing users to create and participate in quizzes on various topics, Our tech stack was comprised of Firebase, Next.js and a lot of memes.
                </p>
                <p className="text-lg text-white">
                    We hope you enjoy using our application as much as we enjoyed building it!
                </p>
                {rickrollVisible && (
                    <div className="mt-4 flex justify-center items-center">
                        <iframe
                            title="Rickroll"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
                {!rickrollVisible && (
                    <button
                        onClick={handleLearnMoreClick}
                        className='bg-primary
                        mt-3
                        p-3
                        rounded-md
                        outline-none
                        shadow-[0_3px_0px_0px_rgba(255,255,255)]
                        font-bold
                        hover:bg-accent
                        hover:shadow-[0_2px_0px_0px_rgba(255,255,255)]
                        hover:translate-y-[2px]
                        active:shadow-none
                        active:translate-y-[4px]
                        transition duration-[100] ease-in-out
                        '
                    >
                        Learn More
                    </button>
                )}
            </div>
        </div>
    );
};

export default AboutPage;
