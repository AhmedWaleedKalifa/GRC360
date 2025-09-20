const db = require("../db/queries/threats");
const { BadRequestError, NotFoundError } = require("../errors/errors");

async function createThreat(req, res, next) {
  try {
    const { name, message, description, category, severity, detected_at } = req.body;

    if (!name || !category || !severity) {
      throw new BadRequestError("Name, category, and severity are required");
    }

    const newThreat = await db.addThreat({
      name,
      message,
      description,
      category,
      severity,
      detected_at,
    });

    res.status(201).json(newThreat);
  } catch (err) {
    next(err);
  }
}

async function getThreats(req, res, next) {
  try {
    const threats = await db.getAllThreats();

    if (!threats || threats.length === 0) {
      return res.status(404).json({ message: "No threats found" });
    }

    res.status(200).json(threats);
  } catch (err) {
    next(err);
  }
}

async function getThreatById(req, res, next) {
  try {
    const { id } = req.params;
    const threat = await db.getThreatById(parseInt(id));

    if (!threat) {
      throw new NotFoundError("Threat not found");
    }

    res.status(200).json(threat);
  } catch (err) {
    next(err);
  }
}

async function getThreatsByCategory(req, res, next) {
  try {
    const { category } = req.params;
    const threats = await db.getThreatsByCategory(category);

    if (!threats || threats.length === 0) {
      return res.status(404).json({ message: "No threats found in this category" });
    }

    res.status(200).json(threats);
  } catch (err) {
    next(err);
  }
}

async function updateThreat(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedThreat = await db.updateThreat(parseInt(id), fields);

    if (!updatedThreat) {
      throw new NotFoundError("Threat not found");
    }

    res.status(200).json(updatedThreat);
  } catch (err) {
    next(err);
  }
}

async function deleteThreat(req, res, next) {
  try {
    const { id } = req.params;
    const deletedThreat = await db.removeThreat(parseInt(id));

    if (!deletedThreat) {
      throw new NotFoundError("Threat not found");
    }

    res.status(200).json({ message: "Threat deleted successfully", threat: deletedThreat });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createThreat,
  getThreats,
  getThreatById,
  getThreatsByCategory,
  updateThreat,
  deleteThreat,
};