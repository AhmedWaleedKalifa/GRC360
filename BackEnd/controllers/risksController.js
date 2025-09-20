const db = require("../db/queries/risks");
const { BadRequestError, NotFoundError } = require("../errors/errors");

async function createRisk(req, res, next) {
  try {
    const { title, description, category, type, status, severity, impact, likelihood, owner, last_reviewed, due_date, notes } = req.body;

    if (!title) {
      throw new BadRequestError("Title is required");
    }

    const newRisk = await db.addRisk({
      title,
      description,
      category,
      type,
      status,
      severity,
      impact,
      likelihood,
      owner,
      last_reviewed,
      due_date,
      notes,
    });

    res.status(201).json(newRisk);
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

    res.status(200).json(risks);
  } catch (err) {
    next(err);
  }
}

async function getRiskById(req, res, next) {
  try {
    const { id } = req.params;
    const risk = await db.getRiskById(parseInt(id));

    if (!risk) {
      throw new NotFoundError("Risk not found");
    }

    res.status(200).json(risk);
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

    res.status(200).json(risks);
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

    const updatedRisk = await db.updateRisk(parseInt(id), fields);

    if (!updatedRisk) {
      throw new NotFoundError("Risk not found");
    }

    res.status(200).json(updatedRisk);
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

    res.status(200).json({ message: "Risk deleted successfully", risk: deletedRisk });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRisk,
  getRisks,
  getRiskById,
  getRisksByOwner,
  updateRisk,
  deleteRisk,
};