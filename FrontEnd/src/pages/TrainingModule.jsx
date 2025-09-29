// pages/TrainingModule.jsx
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

// Quiz Timer Component
const QuizTimer = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, isPaused, timeRemaining, onTimeUp]);

  useEffect(() => {
    if (isActive) {
      setTimeRemaining(timeLimit);
      setIsPaused(false);
    }
  }, [isActive, timeLimit]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((timeLimit - timeRemaining) / timeLimit) * 100;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage <= 20) return 'text-red-600';
    if (percentage <= 40) return 'text-orange-500';
    if (percentage <= 60) return 'text-yellow-500';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-orange-400';
    if (percentage >= 40) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon 
          icon={faClock} 
          className={`text-2xl ${getTimeColor()}`} 
        />
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTimeColor()} font-mono`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Time Remaining
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex-1">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0:00</span>
          <span>{formatTime(timeLimit)}</span>
        </div>
      </div>

      {/* Pause/Resume Button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        disabled={!isActive || timeRemaining === 0}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FontAwesomeIcon icon={isPaused ? faPlayCircle : faPause} />
        <span>{isPaused ? 'Resume' : 'Pause'}</span>
      </button>

      {/* Time Warning */}
      {timeRemaining <= 60 && timeRemaining > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span className="font-semibold">Hurry! {timeRemaining}s left</span>
        </div>
      )}
    </div>
  );
};

const TrainingModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  
  const module = trainingModules[id];
  const currentStepData = module?.steps[currentStep];

  // Quiz time limits in seconds
  const QUIZ_TIME_LIMITS = {
    1: 900,  // 15 minutes for Phishing
    2: 720,  // 12 minutes for Password Security
    3: 900,  // 15 minutes for Data Protection
    4: 600,  // 10 minutes for Ransomware
    5: 900   // 15 minutes for Remote Work
  };

  useEffect(() => {
    if (!module) {
      navigate('/app/awareness');
    }
  }, [module, navigate]);

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
    if (currentStepData.type !== 'quiz') return 0;
    
    let correct = 0;
    currentStepData.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
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

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const handleNextStep = () => {
    if (currentStepData.type === 'video' && !videoWatched && !videoError) {
      alert('Please watch the video before proceeding to the quiz.');
      return;
    }

    if (currentStepData.type === 'quiz' && !quizCompleted) {
      alert('Please complete the quiz before proceeding.');
      return;
    }

    if (currentStepData.type === 'quiz') {
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
      updateModuleProgress();
    }
  };

  const updateModuleProgress = () => {
    const progress = JSON.parse(localStorage.getItem('trainingProgress') || '{}');
    progress[module.id] = {
      completed: true,
      score: score,
      completedAt: new Date().toISOString(),
      moduleTitle: module.title,
      category: module.category
    };
    localStorage.setItem('trainingProgress', JSON.stringify(progress));
    
    window.dispatchEvent(new Event('trainingProgressUpdated'));
  };

  const renderStepContent = () => {
    if (!currentStepData) return null;

    switch (currentStepData.type) {
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
                    src={module.videoUrl}
                    title={currentStepData.title}
                    className="w-full h-64 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleVideoWatched}
                    onError={handleVideoError}
                  ></iframe>
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
            {/* Timer Section - Prominently Displayed */}
            {quizStarted && !quizCompleted && (
              <div className="mb-6">
                <QuizTimer 
                  timeLimit={QUIZ_TIME_LIMITS[module.id]}
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

            {timeUp && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center text-red-700 dark:text-red-300">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  <span className="font-semibold">Time's up! Your quiz has been automatically submitted.</span>
                </div>
              </div>
            )}

            {/* Quiz Progress */}
            {!showResults && (
              <div className="mb-6">
                <Progress 
                  title="Quiz Progress" 
                  footer="questions completed" 
                  num={Object.keys(userAnswers).length}
                  all={currentStepData.questions.length}
                />
              </div>
            )}

            {/* Results Section */}
            {showResults && (
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    score >= 90 ? 'text-green-600' : 
                    score >= 70 ? 'text-blue-600' : 'text-orange-500'
                  }`}>
                    {score}%
                  </div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    {score >= 90 ? 'Excellent! 🎉' : 
                     score >= 70 ? 'Great Job! 👍' : 'Good Effort! 💪'}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <strong>Questions:</strong> {currentStepData.questions.length}
                    </div>
                    <div>
                      <strong>Correct:</strong> {Math.round((score / 100) * currentStepData.questions.length)}/{currentStepData.questions.length}
                    </div>
                  </div>
                  {score < 70 && (
                    <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                      <p className="text-orange-700 dark:text-orange-300 text-sm">
                        You need at least 70% to pass. Please review the material and try again.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Questions Section */}
            {!showResults && (
              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {currentStepData.questions.map((question, index) => (
                  <div key={question.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {index + 1}. {question.question}
                    </h4>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                            userAnswers[question.id] === optionIndex
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          } ${quizCompleted ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={optionIndex}
                            checked={userAnswers[question.id] === optionIndex}
                            onChange={() => handleAnswerSelect(question.id, optionIndex)}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                            disabled={quizCompleted}
                          />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quiz Review - Show correct answers after completion */}
            {showResults && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Quiz Review
                </h4>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {currentStepData.questions.map((question, index) => {
                    const userAnswer = userAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div key={question.id} className={`p-4 border rounded-lg ${
                        isCorrect 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                            {index + 1}. {question.question}
                          </h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isCorrect 
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            let bgColor = 'bg-white dark:bg-gray-800';
                            let borderColor = 'border-gray-300 dark:border-gray-600';
                            let textColor = 'text-gray-700 dark:text-gray-300';
                            
                            if (optionIndex === question.correctAnswer) {
                              bgColor = 'bg-green-100 dark:bg-green-900/30';
                              borderColor = 'border-green-300 dark:border-green-700';
                              textColor = 'text-green-800 dark:text-green-200';
                            } else if (optionIndex === userAnswer && !isCorrect) {
                              bgColor = 'bg-red-100 dark:bg-red-900/30';
                              borderColor = 'border-red-300 dark:border-red-700';
                              textColor = 'text-red-800 dark:text-red-200';
                            }
                            
                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 border rounded-lg ${bgColor} ${borderColor} ${textColor}`}
                              >
                                <div className="flex items-center">
                                  {optionIndex === question.correctAnswer && (
                                    <FontAwesomeIcon 
                                      icon={faCheckCircle} 
                                      className="text-green-500 mr-2" 
                                    />
                                  )}
                                  {optionIndex === userAnswer && !isCorrect && optionIndex !== question.correctAnswer && (
                                    <FontAwesomeIcon 
                                      icon={faExclamationTriangle} 
                                      className="text-red-500 mr-2" 
                                    />
                                  )}
                                  <span>{option}</span>
                                  {optionIndex === question.correctAnswer && (
                                    <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400">
                                      Correct Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {!showResults ? (
                  <>
                    <div className="font-semibold">
                      {allQuestionsAnswered ? 'All questions answered' : `${currentStepData.questions.length - Object.keys(userAnswers).length} questions remaining`}
                    </div>
                    <div>Minimum passing score: 70%</div>
                  </>
                ) : (
                  <div className={`font-semibold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {score >= 70 ? 'Quiz Passed! 🎉' : 'Quiz Failed - Please try again'}
                  </div>
                )}
              </div>
              
              {showResults ? (
                <button
                  onClick={handleNextStep}
                  disabled={score < 70}
                  className="button buttonStyle disabled:opacity-50 disabled:cursor-not-allowed px-6"
                >
                  {score >= 70 ? 'Continue' : 'Retry Quiz'}
                </button>
              ) : (
                <button
                  onClick={handleFinishQuiz}
                  disabled={!allQuestionsAnswered}
                  className="button buttonStyle disabled:opacity-50 disabled:cursor-not-allowed px-6"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!module) {
    return (
      <div className="container flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Training Module Not Found
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

  if (moduleCompleted) {
    return (
      <div className="container flex items-center justify-center min-h-96">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md w-full">
          <FontAwesomeIcon 
            icon={faCheckCircle} 
            className="text-6xl text-green-500 mb-4" 
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You've successfully completed <strong>{module.title}</strong>
          </p>
          <div className={`text-3xl font-bold mb-2 ${score >= 90 ? 'text-green-600' : score >= 70 ? 'text-blue-600' : 'text-orange-600'}`}>
            Final Score: {score}%
          </div>
          <div className="mb-6">
            {score >= 90 && <span className="text-green-500 font-semibold">Excellent work! 🎉</span>}
            {score >= 70 && score < 90 && <span className="text-blue-500 font-semibold">Great job! 👍</span>}
            {score < 70 && <span className="text-orange-500 font-semibold">Good effort! Keep learning 💪</span>}
          </div>
          <button 
            onClick={() => navigate('/app/awareness')}
            className="button buttonStyle w-full mb-3"
          >
            Back to Awareness Dashboard
          </button>
          <button 
            onClick={() => {
              setCurrentStep(0);
              setModuleCompleted(false);
              setUserAnswers({});
              setScore(0);
              setVideoWatched(false);
              setVideoError(false);
              setQuizStarted(false);
              setQuizCompleted(false);
              setShowResults(false);
              setTimeUp(false);
            }}
            className="button bg-gray-500 text-white w-full hover:bg-gray-600"
          >
            Retake Module
          </button>
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

// Training modules data with REAL video URLs
const trainingModules = {
  1: {
    id: 1,
    title: "Phishing Awareness",
    videoUrl: "https://www.youtube.com/embed/Y7ix6RITXM0",
    duration: "25 min",
    category: "Security",
    steps: [
      {
        type: "video",
        title: "Understanding Phishing Attacks",
        content: "Learn how to identify and protect yourself from phishing emails, texts, and calls that try to steal your personal information.",
        duration: "5:30"
      },
      {
        type: "quiz",
        title: "Phishing Knowledge Test",
        questions: [
          {
            id: 1,
            question: "What is a phishing email?",
            options: [
              "A legitimate email from your bank",
              "A malicious attempt to steal sensitive information",
              "A promotional newsletter"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "How can you verify a suspicious sender?",
            options: [
              "Click the links to check the website",
              "Contact the organization directly using official channels",
              "Reply to the email asking for verification"
            ],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "Should you click links in emails from unknown senders?",
            options: ["Yes, if they look interesting", "No, never click unknown links", "Only if the email seems urgent"],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "What is spear-phishing?",
            options: [
              "Random spam sent to millions of people",
              "Targeted phishing attack aimed at specific individuals",
              "A type of fishing sport"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "How should you report phishing attempts?",
            options: [
              "Ignore and delete them",
              "Forward to your IT security team and then delete",
              "Keep them for reference"
            ],
            correctAnswer: 1
          },
          {
            id: 6,
            question: "Which of these is a red flag in phishing emails?",
            options: [
              "Professional company logo",
              "Urgent action required with threats",
              "Clear contact information"
            ],
            correctAnswer: 1
          },
          {
            id: 7,
            question: "Is it safe to open attachments from unknown emails?",
            options: ["Yes, if they're PDF files", "No, never open unexpected attachments", "Only if your antivirus is updated"],
            correctAnswer: 1
          },
          {
            id: 8,
            question: "What should you do if you accidentally clicked a phishing link?",
            options: [
              "Nothing, it's probably fine",
              "Immediately disconnect from internet and report it",
              "Change your password later when convenient"
            ],
            correctAnswer: 1
          },
          {
            id: 9,
            question: "What makes an email look suspicious?",
            options: [
              "Perfect grammar and spelling",
              "Generic greetings like 'Dear Customer'",
              "Official-looking email signatures"
            ],
            correctAnswer: 1
          },
          {
            id: 10,
            question: "How often should you receive phishing awareness training?",
            options: [
              "Once when you start the job",
              "Regularly throughout the year",
              "Only after a security incident"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  2: {
    id: 2,
    title: "Password Security",
    videoUrl: "https://www.youtube.com/embed/eMOe-PLBy1k",
    duration: "7 min",
    category: "Security",
    steps: [
      {
        type: "video",
        title: "Creating Strong Passwords",
        content: "Learn the principles of creating strong, memorable passwords and why password security is crucial for protecting your accounts.",
        duration: "6:15"
      },
      {
        type: "quiz",
        title: "Password Security Quiz",
        questions: [
          {
            id: 1,
            question: "What makes a password strong?",
            options: [
              "Using common words and dates",
              "Length, complexity, and uniqueness",
              "Writing it down somewhere safe"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Should you reuse passwords across different accounts?",
            options: ["Yes, it's easier to remember", "No, never reuse passwords", "Only for unimportant accounts"],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "What is multi-factor authentication?",
            options: [
              "Using multiple passwords",
              "Two or more verification methods to prove your identity",
              "Having backup email addresses"
            ],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "How often should you change important passwords?",
            options: [
              "Every week",
              "Every 3-6 months or when compromised",
              "Never change them"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "What is a password manager?",
            options: [
              "A notebook where you write passwords",
              "Software that securely stores and generates passwords",
              "A friend who remembers your passwords"
            ],
            correctAnswer: 1
          },
          {
            id: 6,
            question: "Are passphrases more secure than complex passwords?",
            options: [
              "No, complex passwords are always better",
              "Yes, they're longer and easier to remember",
              "They are equally secure"
            ],
            correctAnswer: 1
          },
          {
            id: 7,
            question: "Should you share passwords with IT support?",
            options: [
              "Yes, always when they ask",
              "No, they should use temporary access methods",
              "Only with senior IT staff"
            ],
            correctAnswer: 1
          },
          {
            id: 8,
            question: "What indicates your password might be compromised?",
            options: [
              "You can't remember it",
              "Unusual account activity or security alerts",
              "The password is too old"
            ],
            correctAnswer: 1
          },
          {
            id: 9,
            question: "Which of these is a weak password?",
            options: [
              "Blue42Sky!Running@",
              "password123",
              "Winter*Snowflake^99"
            ],
            correctAnswer: 1
          },
          {
            id: 10,
            question: "Why is two-factor authentication important?",
            options: [
              "It makes logging in faster",
              "It adds an extra layer of security",
              "It's required by all websites"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  3: {
    id: 3,
    title: "Data Protection",
    videoUrl: "https://www.youtube.com/embed/acijNEErf-c",
    duration: "6 min",
    category: "Compliance",
    steps: [
      {
        type: "video",
        title: "Data Classification and Handling",
        content: "Understand how to properly classify, handle, and protect sensitive data according to company policies and regulations.",
        duration: "7:45"
      },
      {
        type: "quiz",
        title: "Data Protection Quiz",
        questions: [
          {
            id: 1,
            question: "What is considered sensitive data?",
            options: [
              "Public company announcements",
              "Personal information that could cause harm if exposed",
              "General work instructions"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "How should confidential files be stored?",
            options: [
              "On your desktop for easy access",
              "In encrypted, access-controlled locations",
              "In personal cloud storage"
            ],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "Can you email customer data to external personal accounts?",
            options: ["Yes, if it's urgent", "No, never", "Only with manager approval"],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "What is data classification?",
            options: [
              "Deleting old files",
              "Categorizing data based on sensitivity and importance",
              "Organizing files by date"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "Why encrypt sensitive data?",
            options: [
              "To make files smaller",
              "To protect against unauthorized access",
              "It's required for all files"
            ],
            correctAnswer: 1
          },
          {
            id: 6,
            question: "How should you handle customer information?",
            options: [
              "Share only when requested",
              "Follow company data protection policies strictly",
              "Use it for personal reference"
            ],
            correctAnswer: 1
          },
          {
            id: 7,
            question: "What is a data retention policy?",
            options: [
              "How to backup data",
              "Rules for how long different data types should be kept",
              "Methods for data encryption"
            ],
            correctAnswer: 1
          },
          {
            id: 8,
            question: "Who should access classified company data?",
            options: [
              "Anyone in the company",
              "Only authorized personnel with a need-to-know",
              "All department members"
            ],
            correctAnswer: 1
          },
          {
            id: 9,
            question: "What does GDPR protect?",
            options: [
              "Company trade secrets",
              "Personal data and privacy of EU citizens",
              "Financial transaction records"
            ],
            correctAnswer: 1
          },
          {
            id: 10,
            question: "What should you do if you accidentally share sensitive data?",
            options: [
              "Try to delete it quietly",
              "Immediately report to your supervisor and IT security",
              "Nothing, if no one notices"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  4: {
    id: 4,
    title: "Ransomware Defense",
    videoUrl: "https://www.youtube.com/embed/e1j3XKwR4Uw",
    duration: "10 min",
    category: "Security",
    steps: [
      {
        type: "video",
        title: "Understanding Ransomware Threats",
        content: "Learn how ransomware works, how to prevent infections, and what to do if your system is compromised.",
        duration: "4:20"
      },
      {
        type: "quiz",
        title: "Ransomware Protection Quiz",
        questions: [
          {
            id: 1,
            question: "What is ransomware?",
            options: [
              "A type of computer virus that displays ads",
              "Malicious software that encrypts files and demands payment",
              "Software that slows down your computer"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "How does ransomware typically spread?",
            options: [
              "Through computer overheating",
              "Via malicious email attachments and infected websites",
              "By using old software"
            ],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "Should you pay the ransom if infected?",
            options: [
              "Yes, to get your files back quickly",
              "No, never pay - contact IT security immediately",
              "Only if the amount is small"
            ],
            correctAnswer: 1
          },
          {
            id: 4,
            question: "What is the primary impact of ransomware?",
            options: [
              "Faster computer performance",
              "Loss of access to files and systems",
              "Improved security awareness"
            ],
            correctAnswer: 1
          },
          {
            id: 5,
            question: "How can you protect against ransomware?",
            options: [
              "Regular backups and security updates",
              "Using simple passwords",
              "Opening all email attachments"
            ],
            correctAnswer: 0
          },
          {
            id: 6,
            question: "Can phishing emails lead to ransomware?",
            options: ["Yes, frequently", "No, they're different threats", "Only in rare cases"],
            correctAnswer: 0
          },
          {
            id: 7,
            question: "What should antivirus software do?",
            options: [
              "Only remove old files",
              "Detect and prevent malware infections",
              "Make internet faster"
            ],
            correctAnswer: 1
          },
          {
            id: 8,
            question: "How should you update software safely?",
            options: [
              "Use automatic updates from official sources",
              "Download from any website offering updates",
              "Never update to avoid problems"
            ],
            correctAnswer: 0
          },
          {
            id: 9,
            question: "What is safe browsing behavior?",
            options: [
              "Clicking on pop-up ads",
              "Avoiding suspicious websites and downloads",
              "Using the same password everywhere"
            ],
            correctAnswer: 1
          },
          {
            id: 10,
            question: "What's the first step if you suspect ransomware?",
            options: [
              "Continue working normally",
              "Disconnect from network and report immediately",
              "Restart the computer repeatedly"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  5: {
    id: 5,
    title: "Remote Work Security",
    videoUrl: "https://www.youtube.com/embed/rNtMMhemHRk",
    duration: "6 min",
    category: "Operations",
    steps: [
      {
        type: "video",
        title: "Secure Remote Work Practices",
        content: "Essential security practices for working remotely, including secure connections, device protection, and data handling.",
        duration: "8:30"
      },
      {
        type: "quiz",
        title: "Remote Work Security Quiz",
        questions: [
          {
            id: 1,
            question: "What are secure Wi-Fi practices for remote work?",
            options: [
              "Use public Wi-Fi without protection",
              "Use VPN and secure, encrypted networks",
              "Share Wi-Fi passwords with neighbors"
            ],
            correctAnswer: 1
          },
          {
            id: 2,
            question: "Should work devices be shared with family members?",
            options: ["Yes, for convenience", "No, never share work devices", "Only for quick tasks"],
            correctAnswer: 1
          },
          {
            id: 3,
            question: "How to secure video conferences?",
            options: [
              "Use passwords and waiting rooms",
              "Post meeting links publicly",
              "Record all meetings automatically"
            ],
            correctAnswer: 0
          },
          {
            id: 4,
            question: "What is a VPN and why is it important?",
            options: [
              "Virtual Private Network that encrypts internet traffic",
              "A type of computer virus",
              "Video recording software"
            ],
            correctAnswer: 0
          },
          {
            id: 5,
            question: "How should sensitive information be handled remotely?",
            options: [
              "Follow the same security policies as in office",
              "Be more relaxed about security at home",
              "Print documents for easier access"
            ],
            correctAnswer: 0
          },
          {
            id: 6,
            question: "Is it safe to print confidential documents at home?",
            options: [
              "Yes, home printers are always secure",
              "No, unless absolutely necessary and properly secured",
              "Always safe if no one else is home"
            ],
            correctAnswer: 1
          },
          {
            id: 7,
            question: "How to recognize phishing attempts while remote working?",
            options: [
              "Ignore all emails",
              "Same methods as in office: check sender, links, content",
              "Assume all remote communications are safe"
            ],
            correctAnswer: 1
          },
          {
            id: 8,
            question: "What is endpoint protection?",
            options: [
              "Security software for individual devices",
              "Network firewall only",
              "Password management"
            ],
            correctAnswer: 0
          },
          {
            id: 9,
            question: "Why lock your device when stepping away?",
            options: [
              "To save battery life",
              "Prevent unauthorized physical access",
              "It makes the computer run faster"
            ],
            correctAnswer: 1
          },
          {
            id: 10,
            question: "How to report security incidents when working remotely?",
            options: [
              "Wait until you're back in the office",
              "Use secure channels to report immediately",
              "Handle it yourself to avoid bothering IT"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  }
};

export default TrainingModule;