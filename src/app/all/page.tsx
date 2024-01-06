"use client"
import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '@/firebase/config'; // Import firestore from your firebase module

const QuizPage: React.FC = () => {
    const [quizzes, setQuizzes] = useState<{ id: string; quizName: string; userName: string; questionsCount: number }[]>([]);

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

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Quizzes</h1>
            {!quizzes.length ? <p>No quizzes available.</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-background hover:border hover:bg-accent ease-linear duration-150 cursor-pointer p-4 shadow-md rounded-md">
                            <h2 className="text-lg font-semibold">{quiz.quizName}</h2>
                            <p className="text-gray-600 mb-2">Creator: {quiz.userName}</p>
                            <p className="text-gray-600">Questions Count: {quiz.questionsCount}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizPage;
