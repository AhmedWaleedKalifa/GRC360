const db = require("../db/queries/threats");
const { BadRequestError, NotFoundError } = require("../errors/errors");
const { logAction } = require("./auditHelper");

async function createThreat(req, res, next) {
  try {
    const { name, message, description, category, severity, detected_at } = req.body;
    const user_id = req.user?.user_id;

    if (!name || !category || !severity) {
      throw new BadRequestError("Name, category, and severity are required");
    }

    const threatData = {name,message,description,category,severity};
    
    if (detected_at) {
      threatData.detected_at = detected_at;
    }

    const newThreat = await db.addThreat(threatData);

    // Log the action
    await logAction(user_id, "CREATE", "threat", newThreat.threat_id, {
      name,
      category,
      severity
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
    const user_id = req.user?.user_id;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const oldThreat = await db.getThreatById(parseInt(id));
    const updatedThreat = await db.updateThreat(parseInt(id), fields);

    if (!updatedThreat) {
      throw new NotFoundError("Threat not found");
    }

    // Log the action
    await logAction(user_id, "UPDATE", "threat", parseInt(id), {
      changed_fields: Object.keys(fields),
      old_severity: oldThreat.severity,
      new_severity: updatedThreat.severity
    });

    res.status(200).json(updatedThreat);
  } catch (err) {
    next(err);
  }
}

async function deleteThreat(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user?.user_id;

    const deletedThreat = await db.removeThreat(parseInt(id));

    if (!deletedThreat) {
      throw new NotFoundError("Threat not found");
    }

    // Log the action
    await logAction(user_id, "DELETE", "threat", parseInt(id), {
      name: deletedThreat.name,
      category: deletedThreat.category
    });

    res.status(200).json({ message: "Threat deleted successfully", threat: deletedThreat });
  } catch (err) {
    next(err);
  }
}
async function searchThreats(req, res, next) {
  try {
    const { q } = req.query;

    if (!q) {
      throw new BadRequestError("Search query is required");
    }
    
    const searchQuery = q.trim();
    if (searchQuery.length === 0) {
      throw new BadRequestError("Search query cannot be empty");
    }

    console.log('Search query:', searchQuery);
    const threats = await db.searchThreatsByName(searchQuery);

    if (!threats || threats.length === 0) {
      return res.status(404).json({ message: "No threats found matching your search" });
    }

    res.status(200).json(threats);
  } catch (err) {
    console.error('Error in searchThreats:', err);
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
  searchThreats, // Add this
};