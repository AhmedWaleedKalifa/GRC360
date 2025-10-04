// pages/TrainingModule.jsx - COMPLETE UPDATED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, 
  faCheckCircle, 
  faArrowLeft, 
  faForward, 
  faVideo, 
  faExclamationTriangle,
  faClock,
  faFlag,
  faHourglassHalf,
  faPause,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import Progress from '../components/Progress';
import { awarenessAPI } from '../services/api';
import { useUser } from '../hooks/useUser';

// Quiz Timer Component
const QuizTimer = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return time - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft, isActive, onTimeUp]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progress = (timeLeft / timeLimit) * 100;
  const isWarning = timeLeft < 60; // Less than 1 minute
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <FontAwesomeIcon 
            icon={isWarning ? faExclamationTriangle : faClock} 
            className={`mr-2 ${isWarning ? 'text-red-500' : 'text-blue-500'}`} 
          />
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Time Remaining: {formatTime(timeLeft)}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {isWarning ? 'Hurry up!' : 'Keep going!'}
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            isWarning ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const TrainingModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const [module, setModule] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentStepData = module?.steps?.[currentStep];

  // Quiz time limits in seconds
  const QUIZ_TIME_LIMITS = {
    1: 900,  // 15 minutes for Phishing
    2: 720,  // 12 minutes for Password Security  
    3: 900,  // 15 minutes for Data Protection
    4: 600,  // 10 minutes for Ransomware
    5: 900   // 15 minutes for Remote Work
  };

  // Load module data from backend
  useEffect(() => {
    loadModuleData();
  }, [id]);

  const loadModuleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const moduleData = await awarenessAPI.getTrainingModuleById(id);
      
      if (!moduleData) {
        throw new Error('Module not found');
      }
      
      setModule(moduleData);
      
      // Update user progress to 'in_progress' if not started
      if (currentUser?.user_id) {
        try {
          const userProgress = await awarenessAPI.getUserProgress(currentUser.user_id);
          const currentModuleProgress = userProgress.find(p => p.module_id === parseInt(id));
          
          if (!currentModuleProgress || currentModuleProgress.status === 'not_started') {
            await awarenessAPI.updateUserProgress(currentUser.user_id, id, {
              status: 'in_progress',
              progress_percentage: 0,
              time_spent: 0
            });
          }
        } catch (progressError) {
          console.error('Failed to update user progress:', progressError);
        }
      }
      
    } catch (err) {
      console.error('Failed to load module:', err);
      setError('Failed to load training module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    setQuizCompleted(true);
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizCompleted(false);
    setShowResults(false);
    setTimeUp(false);
    setUserAnswers({});
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (!quizCompleted) {
      setUserAnswers(prev => ({
        ...prev,
        [questionId]: answerIndex
      }));
    }
  };

  const calculateScore = () => {
    if (currentStepData?.step_type !== 'quiz') return 0;
    
    let correct = 0;
    currentStepData.questions.forEach(question => {
      if (userAnswers[question.question_id] === question.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / currentStepData.questions.length) * 100);
  };

  const handleVideoWatched = () => {
    setVideoWatched(true);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleFinishQuiz = async () => {
    const finalScore = calculateScore();
    setQuizCompleted(true);
    setScore(finalScore);
    setShowResults(true);

    // Save quiz attempt to backend
    if (currentUser?.user_id && module) {
      try {
        const answers = Object.keys(userAnswers).map(questionId => ({
          question_id: parseInt(questionId),
          selected_option: userAnswers[questionId],
          is_correct: userAnswers[questionId] === currentStepData.questions.find(q => q.question_id === parseInt(questionId))?.correct_answer
        }));

        const correctAnswers = answers.filter(a => a.is_correct).length;
        
        await awarenessAPI.createQuizAttempt(currentUser.user_id, module.module_id, {
          score: finalScore,
          time_spent: 0, // You might want to track actual time
          total_questions: currentStepData.questions.length,
          correct_answers: correctAnswers,
          answers: answers
        });

        // Update user progress
        const status = finalScore >= 70 ? 'completed' : 'in_progress';
        await awarenessAPI.updateUserProgress(currentUser.user_id, module.module_id, {
          status: status,
          progress_percentage: 100,
          score: finalScore,
          time_spent: 0 // Update with actual time if tracked
        });

      } catch (err) {
        console.error('Failed to save quiz attempt:', err);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStepData.step_type === 'video' && !videoWatched && !videoError) {
      alert('Please watch the video before proceeding to the quiz.');
      return;
    }

    if (currentStepData.step_type === 'quiz' && !quizCompleted) {
      alert('Please complete the quiz before proceeding.');
      return;
    }

    if (currentStepData.step_type === 'quiz') {
      const finalScore = calculateScore();
      
      if (finalScore < 70) {
        alert(`You need at least 70% to proceed. Your score: ${finalScore}%. Please review the material and try again.`);
        return;
      }
    }

    if (currentStep < module.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setVideoWatched(false);
      setVideoError(false);
      setQuizStarted(false);
      setQuizCompleted(false);
      setShowResults(false);
      setTimeUp(false);
      setUserAnswers({});
    } else {
      setModuleCompleted(true);
    }
  };

  const renderStepContent = () => {
    if (!currentStepData) return null;

    switch (currentStepData.step_type) {
      case 'video':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faVideo} className="text-blue-500 text-xl mr-3" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {currentStepData.title}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              {currentStepData.content}
            </p>
            
            <div className="mb-6">
              {videoError ? (
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    Video unavailable. Please continue to the quiz.
                  </p>
                  <button
                    onClick={() => {
                      setVideoWatched(true);
                      setVideoError(false);
                    }}
                    className="button buttonStyle"
                  >
                    Continue to Quiz
                  </button>
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={module.video_url}
                    title={currentStepData.title}
                    className="w-full h-64 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoWatched}
                    onError={handleVideoError}
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Duration: {currentStepData.duration}</span>
              <div className="flex items-center gap-4">
                {(videoWatched || videoError) && (
                  <span className="text-green-500 flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                    Ready for Quiz
                  </span>
                )}
                <button
                  onClick={() => {
                    startQuiz();
                    handleNextStep();
                  }}
                  className="button buttonStyle flex items-center"
                  disabled={!videoWatched && !videoError}
                >
                  <FontAwesomeIcon icon={faForward} className="mr-2" />
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        const allQuestionsAnswered = Object.keys(userAnswers).length === currentStepData.questions.length;
        
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            {/* Timer Section */}
            {quizStarted && !quizCompleted && (
              <div className="mb-6">
                <QuizTimer 
                  timeLimit={QUIZ_TIME_LIMITS[module.module_id] || 600}
                  onTimeUp={handleTimeUp}
                  isActive={quizStarted && !quizCompleted}
                />
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {quizCompleted ? 'Quiz completed!' : 'Test your knowledge from the video.'}
                </p>
              </div>
              
              {quizStarted && !quizCompleted && (
                <button
                  onClick={handleFinishQuiz}
                  className="button bg-orange-500 text-white hover:bg-orange-600 flex items-center px-6 py-3"
                >
                  <FontAwesomeIcon icon={faFlag} className="mr-2" />
                  Submit Quiz
                </button>
              )}
            </div>

            {/* Quiz Questions */}
            {!showResults && (
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {currentStepData.questions.map((question, index) => (
                  <div key={question.question_id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {index + 1}. {question.question_text}
                    </h4>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={option.option_id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            userAnswers[question.question_id] === optionIndex
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          } ${quizCompleted ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.question_id}`}
                            value={optionIndex}
                            checked={userAnswers[question.question_id] === optionIndex}
                            onChange={() => handleAnswerSelect(question.question_id, optionIndex)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                            disabled={quizCompleted}
                          />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{option.option_text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Section */}
            {showResults && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {score >= 70 ? '🎉 Congratulations!' : '📚 Keep Learning!'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {score >= 70 
                      ? `You passed with a score of ${score}%!` 
                      : `Your score is ${score}%. You need 70% to pass.`}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mb-4">
                    <div 
                      className={`h-4 rounded-full ${
                        score >= 70 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>

                {/* Question Review */}
                <div className="space-y-4">
                  {currentStepData.questions.map((question, index) => {
                    const userAnswer = userAnswers[question.question_id];
                    const isCorrect = userAnswer === question.correct_answer;
                    
                    return (
                      <div key={question.question_id} className={`p-4 border rounded-lg ${
                        isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'
                      }`}>
                        <div className="flex items-start mb-2">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mr-2 ${
                            isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{question.question_text}</span>
                        </div>
                        {!isCorrect && (
                          <div className="ml-8 text-sm text-gray-600 dark:text-gray-400">
                            <p>Correct answer: {question.options[question.correct_answer]?.option_text}</p>
                            {question.explanation && (
                              <p className="mt-1 italic">Explanation: {question.explanation}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setQuizCompleted(false);
                      setUserAnswers({});
                    }}
                    className="button bg-gray-500 text-white hover:bg-gray-600"
                    disabled={score >= 70}
                  >
                    Retry Quiz
                  </button>
                  
                  <button
                    onClick={handleNextStep}
                    className="button buttonStyle"
                    disabled={score < 70}
                  >
                    {currentStep < module.steps.length - 1 ? 'Next Step' : 'Complete Module'}
                  </button>
                </div>
              </div>
            )}

            {/* Start Quiz Button (if not started) */}
            {!quizStarted && !quizCompleted && (
              <div className="text-center py-8">
                <button
                  onClick={startQuiz}
                  className="button buttonStyle text-lg px-8 py-3"
                >
                  <FontAwesomeIcon icon={faPlay} className="mr-2" />
                  Start Quiz
                </button>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  You'll have {Math.floor((QUIZ_TIME_LIMITS[module.module_id] || 600) / 60)} minutes to complete the quiz
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {currentStepData.title}
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              {currentStepData.content && (
                <div 
                  className="text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: currentStepData.content }}
                />
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNextStep}
                className="button buttonStyle"
              >
                {currentStep < module.steps.length - 1 ? 'Next' : 'Complete'}
              </button>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading training module...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="container flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error || 'Training Module Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested training module doesn't exist or has been moved.
          </p>
          <button 
            onClick={() => navigate('/app/awareness')}
            className="button buttonStyle"
          >
            Back to Awareness Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (moduleCompleted) {
    return (
      <div className="container">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Module Completed!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Congratulations on completing "{module.title}"
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 inline-block mb-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              Final Score: {score}%
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/app/awareness')}
              className="button buttonStyle"
            >
              Back to Training Dashboard
            </button>
            <button
              onClick={() => {
                // Option to retake the module
                setCurrentStep(0);
                setModuleCompleted(false);
                setVideoWatched(false);
                setVideoError(false);
                setQuizStarted(false);
                setQuizCompleted(false);
                setShowResults(false);
                setTimeUp(false);
                setUserAnswers({});
              }}
              className="button bg-gray-500 text-white hover:bg-gray-600"
            >
              Review Module Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / (module.steps.length + 1)) * 100;

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/app/awareness')}
          className="button buttonStyle flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Training
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {module.title}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {module.category} • {module.duration}
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Step {currentStep + 1} of {module.steps.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress 
          title={`${module.title} Progress`} 
          footer="completed" 
          num={currentStep + 1}
          all={module.steps.length + 1}
        />
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
};

export default TrainingModule;