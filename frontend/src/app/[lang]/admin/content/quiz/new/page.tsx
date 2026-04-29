'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HelpCircle, Plus, Trash, ArrowLeft, Save } from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function NewQuizPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('module_id');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    { text: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = text;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = oIndex;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('Please enter a quiz title');

    setIsSubmitting(true);
    try {
      // 1. Create Quiz asset
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          time_limit: Number(timeLimit),
          questions
        })
      });

      if (!res.ok) throw new Error('Failed to create quiz');
      const quiz = await res.json();

      // 2. If module_id provided, associate with course module
      if (moduleId) {
        const linkRes = await fetch(`/api/modules/${moduleId}/contents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'quiz',
            reference_id: quiz.id,
            title: quiz.title
          })
        });
        if (!linkRes.ok) throw new Error('Failed to link quiz to module');
      }

      alert('Quiz created and linked successfully!');
      router.back();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur border border-slate-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-violet-600/20 text-violet-400 rounded-xl">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
                <p className="text-slate-400 mt-1">Design an interactive assessment for your students.</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-violet-600/25 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save & Publish'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="e.g. Intro to Genetics Quiz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Time Limit (mins)</label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                  min={1}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors h-28"
                placeholder="Provide instructions or overview for candidates..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 text-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl transition"
              >
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative group">
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-6 right-6 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Question {qIndex + 1}</label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="Type the question..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() => setCorrectAnswer(qIndex, oIndex)}
                          className="w-4 h-4 text-violet-600 focus:ring-violet-500 bg-slate-800 border-slate-700"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          className={`w-full bg-slate-800/30 border rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors ${
                            q.correctAnswer === oIndex 
                              ? 'border-violet-500 text-white' 
                              : 'border-slate-700 text-slate-300 focus:border-slate-500'
                          }`}
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
