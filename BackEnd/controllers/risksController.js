const db = require("../db/queries/risks");
const RiskCalculator = require("../utils/riskCalculator");
const { BadRequestError, NotFoundError } = require("../errors/errors");
const { logAction, logSystemAction } = require("./auditHelper");

async function createRisk(req, res, next) {
  try {
    const {
      title,
      description,
      category,
      type,
      status,
      impact,
      likelihood,
      owner,
      last_reviewed,
      due_date,
      notes,
    } = req.body;

    if (!title) {
      throw new BadRequestError("Title is required");
    }

    // Validate impact and likelihood
    if (impact === undefined || likelihood === undefined) {
      throw new BadRequestError("Impact and likelihood are required");
    }

    const validation = RiskCalculator.validateRiskValues(impact, likelihood);
    if (!validation.isValid) {
      throw new BadRequestError(validation.error);
    }

    // Calculate severity automatically (now returns lowercase)
    const riskCalculation = RiskCalculator.calculateRisk(impact, likelihood);

    const newRisk = await db.addRisk({
      title,
      description,
      category,
      type,
      status,
      severity: riskCalculation.severity,
      impact,
      likelihood,
      owner,
      last_reviewed,
      due_date,
      notes,
    });

    // Log the action with calculated values
    await logAction(req, "CREATE", "risk", newRisk.risk_id, {
      title,
      category: category || "Other",
      impact,
      likelihood,
      calculated_severity: riskCalculation.severity,
      risk_score: riskCalculation.riskScore,
    });

    res.status(201).json({
      ...newRisk,
      risk_score: riskCalculation.riskScore,
      calculated_severity: riskCalculation.severity,
    });
  } catch (err) {
    next(err);
  }
}

async function updateRisk(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    // If impact or likelihood is being updated, recalculate severity
    if (fields.impact !== undefined || fields.likelihood !== undefined) {
      // Get current values to calculate new severity
      const currentRisk = await db.getRiskById(parseInt(id));
      if (!currentRisk) {
        throw new NotFoundError("Risk not found");
      }

      const newImpact =
        fields.impact !== undefined ? fields.impact : currentRisk.impact;
      const newLikelihood =
        fields.likelihood !== undefined
          ? fields.likelihood
          : currentRisk.likelihood;

      // Validate new values
      const validation = RiskCalculator.validateRiskValues(
        newImpact,
        newLikelihood
      );
      if (!validation.isValid) {
        throw new BadRequestError(validation.error);
      }

      // Calculate new severity (now returns lowercase)
      const riskCalculation = RiskCalculator.calculateRisk(
        newImpact,
        newLikelihood
      );
      fields.severity = riskCalculation.severity;
    }

    const oldRisk = await db.getRiskById(parseInt(id));
    const updatedRisk = await db.updateRisk(parseInt(id), fields);

    if (!updatedRisk) {
      throw new NotFoundError("Risk not found");
    }

    // Calculate current risk score for response
    const currentCalculation = RiskCalculator.calculateRisk(
      updatedRisk.impact,
      updatedRisk.likelihood
    );

    // Log the action
    const logData = {
      changed_fields: Object.keys(fields),
    };

    if (fields.impact !== undefined || fields.likelihood !== undefined) {
      logData.old_severity = oldRisk.severity;
      logData.new_severity = updatedRisk.severity;
      logData.old_impact = oldRisk.impact;
      logData.new_impact = updatedRisk.impact;
      logData.old_likelihood = oldRisk.likelihood;
      logData.new_likelihood = updatedRisk.likelihood;
    }

    await logAction(req, "UPDATE", "risk", parseInt(id), logData);

    res.status(200).json({
      ...updatedRisk,
      risk_score: currentCalculation.riskScore,
      calculated_severity: currentCalculation.severity,
    });
  } catch (err) {
    next(err);
  }
}

async function getRisks(req, res, next) {
  try {
    const risks = await db.getAllRisks();

    if (!risks || risks.length === 0) {
      return res.status(404).json({ message: "No risks found" });
    }

    // Add calculated risk score to each risk for frontend display
    const risksWithCalculation = risks.map((risk) => {
      try {
        const riskCalculation = RiskCalculator.calculateRisk(
          risk.impact,
          risk.likelihood
        );
        return {
          ...risk,
          risk_score: riskCalculation.riskScore,
          calculated_severity: riskCalculation.severity,
          calculation_valid: riskCalculation.isValid,
        };
      } catch (error) {
        // Handle individual risk calculation errors gracefully
        console.warn(
          `Error calculating risk for risk_id ${risk.risk_id}:`,
          error.message
        );
        return {
          ...risk,
          risk_score: 1,
          calculated_severity: "low",
          calculation_valid: false,
          calculation_error: error.message,
        };
      }
    });

    res.status(200).json(risksWithCalculation);
  } catch (err) {
    next(err);
  }
}

async function getRiskById(req, res, next) {
  try {
    const { id } = req.params;

    const riskId = parseInt(id);
    if (isNaN(riskId)) {
      throw new BadRequestError("Invalid risk ID");
    }

    const risk = await db.getRiskById(riskId);

    if (!risk) {
      throw new NotFoundError("Risk not found");
    }

    // Add calculated risk score for frontend display
    const riskCalculation = RiskCalculator.calculateRisk(
      risk.impact,
      risk.likelihood
    );
    const riskWithCalculation = {
      ...risk,
      risk_score: riskCalculation.riskScore,
      calculated_severity: riskCalculation.severity,
      calculation_valid: riskCalculation.isValid,
    };

    res.status(200).json(riskWithCalculation);
  } catch (err) {
    next(err);
  }
}

async function getRisksByOwner(req, res, next) {
  try {
    const { ownerId } = req.params;
    const risks = await db.getRisksByOwner(parseInt(ownerId));

    if (!risks || risks.length === 0) {
      return res.status(404).json({ message: "No risks found for this owner" });
    }

    // Add calculated risk score to each risk
    const risksWithCalculation = risks.map((risk) => {
      const riskCalculation = RiskCalculator.calculateRisk(
        risk.impact,
        risk.likelihood
      );
      return {
        ...risk,
        risk_score: riskCalculation.riskScore,
        calculated_severity: riskCalculation.severity,
        calculation_valid: riskCalculation.isValid,
      };
    });

    res.status(200).json(risksWithCalculation);
  } catch (err) {
    next(err);
  }
}

async function searchRisks(req, res, next) {
  try {
    const { q } = req.query;

    if (!q) {
      throw new BadRequestError("Search query is required");
    }

    const searchQuery = q.trim();
    if (searchQuery.length === 0) {
      throw new BadRequestError("Search query cannot be empty");
    }

    const risks = await db.searchRisksByTitle(searchQuery);

    if (!risks || risks.length === 0) {
      return res
        .status(404)
        .json({ message: "No risks found matching your search" });
    }

    // Add calculated risk score to each risk
    const risksWithCalculation = risks.map((risk) => {
      const riskCalculation = RiskCalculator.calculateRisk(
        risk.impact,
        risk.likelihood
      );
      return {
        ...risk,
        risk_score: riskCalculation.riskScore,
        calculated_severity: riskCalculation.severity,
        calculation_valid: riskCalculation.isValid,
      };
    });

    res.status(200).json(risksWithCalculation);
  } catch (err) {
    next(err);
  }
}

async function getRiskMatrix(req, res, next) {
  try {
    const matrix = {
      levels: [
        { score: "16-25", level: "Critical", color: "red" },
        { score: "11-15", level: "High", color: "orange" },
        { score: "6-10", level: "Medium", color: "yellow" },
        { score: "1-5", level: "Low", color: "green" },
      ],
      formula: "Risk Score = Impact × Likelihood",
      impactScale: "1-5 (1=Low, 5=High)",
      likelihoodScale: "1-5 (1=Rare, 5=Almost Certain)",
    };

    res.status(200).json(matrix);
  } catch (err) {
    next(err);
  }
}

async function fixInvalidRisks(req, res, next) {
  try {
    const risks = await db.getAllRisks();

    let fixedCount = 0;
    const fixResults = [];

    for (const risk of risks) {
      const validation = RiskCalculator.validateRiskValues(
        risk.impact,
        risk.likelihood
      );

      if (!validation.isValid) {
        // Fix invalid values
        const fixedImpact = validation.suggestedImpact || risk.impact;
        const fixedLikelihood =
          validation.suggestedLikelihood || risk.likelihood;

        const riskCalculation = RiskCalculator.calculateRisk(
          fixedImpact,
          fixedLikelihood
        );

        // Update the risk in database
        const updatedRisk = await db.updateRisk(risk.risk_id, {
          impact: fixedImpact,
          likelihood: fixedLikelihood,
          severity: riskCalculation.severity,
        });

        fixedCount++;
        fixResults.push({
          risk_id: risk.risk_id,
          title: risk.title,
          old_impact: risk.impact,
          old_likelihood: risk.likelihood,
          new_impact: fixedImpact,
          new_likelihood: fixedLikelihood,
          new_severity: riskCalculation.severity,
        });
      }
    }

    await logSystemAction("SYSTEM", "risk_fix", null, {
      fixed_count: fixedCount,
      total_risks: risks.length,
    });

    res.status(200).json({
      message: `Fixed ${fixedCount} risks with invalid values`,
      total_risks: risks.length,
      fixed_count: fixedCount,
      details: fixResults,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteRisk(req, res, next) {
  try {
    const { id } = req.params;

    const deletedRisk = await db.removeRisk(parseInt(id));

    if (!deletedRisk) {
      throw new NotFoundError("Risk not found");
    }

    await logAction(req, "DELETE", "risk", parseInt(id), {
      title: deletedRisk.title,
      severity: deletedRisk.severity,
    });

    res
      .status(200)
      .json({ message: "Risk deleted successfully", risk: deletedRisk });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRisk,
  getRisks,
  getRiskById,
  searchRisks,
  getRisksByOwner,
  updateRisk,
  deleteRisk,
  getRiskMatrix,
  fixInvalidRisks,
};
