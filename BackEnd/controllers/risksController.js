const db = require("../db/queries/risks");
const { BadRequestError, NotFoundError } = require("../errors/errors");
const { logAction } = require("./auditHelper");

async function createRisk(req, res, next) {
  try {
    const { title, description, category, type, status, severity, impact, likelihood, owner, last_reviewed, due_date, notes } = req.body;
    const user_id = req.user?.user_id;

    if (!title) {
      throw new BadRequestError("Title is required");
    }

    const newRisk = await db.addRisk({title,description,category,type,status,severity,impact,likelihood,owner,last_reviewed,due_date,notes});

    // Log the action
    await logAction(user_id, "CREATE", "risk", newRisk.risk_id, {
      title,
      category: category || 'Other',
      severity,
      status: status || 'open'
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
    
    // Validate that id is a number
    const riskId = parseInt(id);
    if (isNaN(riskId)) {
      throw new BadRequestError("Invalid risk ID");
    }

    const risk = await db.getRiskById(riskId);

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
    const user_id = req.user?.user_id;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const oldRisk = await db.getRiskById(parseInt(id));
    const updatedRisk = await db.updateRisk(parseInt(id), fields);

    if (!updatedRisk) {
      throw new NotFoundError("Risk not found");
    }

    // Log the action
    await logAction(user_id, "UPDATE", "risk", parseInt(id), {
      changed_fields: Object.keys(fields),
      old_severity: oldRisk.severity,
      new_severity: updatedRisk.severity,
      old_status: oldRisk.status,
      new_status: updatedRisk.status
    });

    res.status(200).json(updatedRisk);
  } catch (err) {
    next(err);
  }
}

async function deleteRisk(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user?.user_id;

    const deletedRisk = await db.removeRisk(parseInt(id));

    if (!deletedRisk) {
      throw new NotFoundError("Risk not found");
    }

    // Log the action
    await logAction(user_id, "DELETE", "risk", parseInt(id), {
      title: deletedRisk.title,
      severity: deletedRisk.severity
    });

    res.status(200).json({ message: "Risk deleted successfully", risk: deletedRisk });
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
    
    // Trim and validate the search query
    const searchQuery = q.trim();
    if (searchQuery.length === 0) {
      throw new BadRequestError("Search query cannot be empty");
    }

    console.log('Search query:', searchQuery);
    const risks = await db.searchRisksByTitle(searchQuery);

    if (!risks || risks.length === 0) {
      return res.status(404).json({ message: "No risks found matching your search" });
    }

    res.status(200).json(risks);
  } catch (err) {
    console.error('Error in searchRisks:', err);
    next(err);
  }
}
module.exports = {
  createRisk,
  getRisks,
  getRiskById,
  searchRisks, // Add this
  getRisksByOwner,
  updateRisk,
  deleteRisk,
};