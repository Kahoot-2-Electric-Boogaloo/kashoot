"use client"
import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '@/firebase/config';

const QuizPage: React.FC = () => {
    const [quizzes, setQuizzes] = useState<{ id: string; quizName: string; userName: string; questionsCount: number }[]>([]);
    const [copiedQuizId, setCopiedQuizId] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const quizCollectionRef = collection(firestore, 'quizzes');
                const querySnapshot = await getDocs(quizCollectionRef);

                const quizData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    quizName: doc.data().quizName,
                    userName: doc.data().userName,
                    questionsCount: doc.data().questions ? doc.data().questions.length : 0,
                }));

                setQuizzes(quizData);
            } catch (error) {
                // @ts-ignore
                console.error('Error fetching quizzes:', error.message);
            }
        };

        fetchQuizzes();
    }, []);

    const handleCopyQuizId = (quizId: string) => {
        navigator.clipboard.writeText(quizId);
        setCopiedQuizId(quizId);

        // Clear the message after a few seconds (e.g., 3 seconds)
        setTimeout(() => {
            setCopiedQuizId(null);
        }, 1000);
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Quizzes</h1>
            {!quizzes.length ? <p>No quizzes available.</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-background text-accent hover:text-white hover:bg-accent ease-linear duration-150 cursor-pointer p-4 shadow-md rounded-md relative"
                            onClick={() => handleCopyQuizId(quiz.id)}
                        >
                            <h1 className="text-2xl font-semibold mb-2">{quiz.quizName}</h1>
                            <p className="mb-2">Creator: {quiz.userName}</p>
                            <p className="mb-2">Questions Count: {quiz.questionsCount}</p>
                            <p className="">Game Pin: {quiz.id}</p>

                            {copiedQuizId === quiz.id && (
                                <div className="ease-linear font-bold rounded-md text-2xl flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 bg-green-500 text-white opacity-80 p-2">
                                    Quiz ID Copied!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizPage;
