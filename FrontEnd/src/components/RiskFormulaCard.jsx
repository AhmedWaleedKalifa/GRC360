import React, { useState } from 'react';
import { faCalculator, faInfoCircle, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RiskFormulaCard = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // If card is not visible, show only the toggle button
    if (!isVisible) {
        return (
            <div className="flex justify-center mb-6">
                <button 
                    onClick={() => setIsVisible(true)}
                    className="button buttonStyle flex items-center"
                >
                    <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
                    Show Risk Calculation Formula
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-300 dark:border-gray-600 shadow-lg">
            {/* Header with toggle buttons */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalculator} className="h1Icon mr-3 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Risk Calculation Formula</h3>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="button buttonStyle text-sm"
                    >
                        <FontAwesomeIcon icon={showDetails ? faInfoCircle : faInfoCircle} className="mr-1" />
                        {showDetails ? 'Less' : 'More'} Info
                    </button>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="button buttonStyle text-sm"
                    >
                        <FontAwesomeIcon icon={faChevronUp} className="mr-1" />
                        Hide
                    </button>
                </div>
            </div>
            
            {/* Always visible basic formula */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Formula Section */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">Risk Score Formula</h4>
                    <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            Risk Score = Likelihood × Impact
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Scale: 1-5 for both factors → Score range: 1-25
                        </div>
                    </div>
                </div>

                {/* Risk Matrix Section */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">Risk Matrix (5×5)</h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium">
                        <div className="bg-green-500 text-white p-2 rounded">1-5<br/>Low</div>
                        <div className="bg-yellow-500 text-white p-2 rounded">6-10<br/>Medium</div>
                        <div className="bg-orange-500 text-white p-2 rounded">11-15<br/>High</div>
                        <div className="bg-red-500 text-white p-2 rounded">16-25<br/>Critical</div>
                    </div>
                </div>
            </div>

            {/* Expandable detailed information */}
            {showDetails && (
                <>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Detailed Formula Explanation */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                            <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">Detailed Explanation</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Likelihood Scale:</span>
                                    <span>1=Very Low, 2=Low, 3=Medium, 4=High, 5=Very High</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Impact Scale:</span>
                                    <span>1=Negligible, 2=Minor, 3=Moderate, 4=Major, 5=Severe</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Calculation:</span>
                                    <span>Multiply likelihood by impact</span>
                                </div>
                            </div>
                        </div>

                        {/* Scoring Examples */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800">
                            <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">Scoring Examples</h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    <span>Likelihood 2 × Impact 3 =</span>
                                    <span className="font-bold text-yellow-600 dark:text-yellow-400">6 (Medium)</span>
                                </div>
                                <div className="flex justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    <span>Likelihood 4 × Impact 4 =</span>
                                    <span className="font-bold text-red-600 dark:text-red-400">16 (Critical)</span>
                                </div>
                                <div className="flex justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    <span>Likelihood 1 × Impact 2 =</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">2 (Low)</span>
                                </div>
                                <div className="flex justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    <span>Likelihood 3 × Impact 5 =</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400">15 (High)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pro Tip Section */}
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-start">
                            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-1 mr-2" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Pro Tip:</strong> Regularly review and update likelihood and impact scores as conditions change. 
                                Consider additional factors like velocity and vulnerability for mature risk management.
                                Use this formula consistently across all risks for accurate comparisons and prioritization.
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RiskFormulaCard;