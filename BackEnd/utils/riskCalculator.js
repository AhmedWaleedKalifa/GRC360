// utils/riskCalculator.js

class RiskCalculator {
  static calculateRiskScore(impact, likelihood) {
    // Validate inputs
    if (impact === undefined || likelihood === undefined) {
      throw new Error('Impact and likelihood are required');
    }
    
    // Convert to numbers if they are strings
    const numImpact = Number(impact);
    const numLikelihood = Number(likelihood);
    
    if (isNaN(numImpact) || isNaN(numLikelihood)) {
      throw new Error('Impact and likelihood must be valid numbers');
    }
    
    if (numImpact < 1 || numImpact > 5 || numLikelihood < 1 || numLikelihood > 5) {
      // Instead of throwing error, clamp values to valid range
      const clampedImpact = Math.max(1, Math.min(5, numImpact));
      const clampedLikelihood = Math.max(1, Math.min(5, numLikelihood));
      return clampedImpact * clampedLikelihood;
    }
    
    return numImpact * numLikelihood;
  }
  
  static getSeverityLevel(riskScore) {
    const score = Number(riskScore);
    
    if (isNaN(score)) {
      return 'low'; // Default to lowercase
    }
    
    // Clamp the score to valid range and determine severity
    const clampedScore = Math.max(1, Math.min(25, score));
    
    if (clampedScore >= 16 && clampedScore <= 25) return 'critical'; // lowercase
    if (clampedScore >= 11 && clampedScore <= 15) return 'high'; // lowercase
    if (clampedScore >= 6 && clampedScore <= 10) return 'medium'; // lowercase
    if (clampedScore >= 1 && clampedScore <= 5) return 'low'; // lowercase
    
    return 'low'; // Default to lowercase
  }
  
  static calculateRisk(impact, likelihood) {
    try {
      const riskScore = this.calculateRiskScore(impact, likelihood);
      const severity = this.getSeverityLevel(riskScore);
      
      return {
        riskScore,
        severity,
        isValid: (impact >= 1 && impact <= 5 && likelihood >= 1 && likelihood <= 5)
      };
    } catch (error) {
      // Return default values if calculation fails
      return {
        riskScore: 1,
        severity: 'low',
        isValid: false,
        error: error.message
      };
    }
  }
  
  // Helper method to validate risk values
  static validateRiskValues(impact, likelihood) {
    const numImpact = Number(impact);
    const numLikelihood = Number(likelihood);
    
    if (isNaN(numImpact) || isNaN(numLikelihood)) {
      return { isValid: false, error: 'Impact and likelihood must be numbers' };
    }
    
    if (numImpact < 1 || numImpact > 5 || numLikelihood < 1 || numLikelihood > 5) {
      return { 
        isValid: false, 
        error: 'Impact and likelihood must be between 1 and 5',
        suggestedImpact: Math.max(1, Math.min(5, numImpact)),
        suggestedLikelihood: Math.max(1, Math.min(5, numLikelihood))
      };
    }
    
    return { isValid: true };
  }
}

module.exports = RiskCalculator;