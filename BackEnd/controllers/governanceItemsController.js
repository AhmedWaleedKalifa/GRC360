const db = require("../db/queries/governanceItems");
const { BadRequestError, NotFoundError } = require("../errors/errors");

const { logAction } = require("./auditHelper");

async function createGovernanceItem(req, res, next) {
  try {
    const { governance_name, type, owner, status, effective_date, expiry_date, next_review, last_reviewed, approval_status, approver, latest_change_summary, attachment } = req.body;
    const user_id = req.user?.user_id;

    if (!governance_name || !type) {
      throw new BadRequestError("Governance name and type are required");
    }

    const newGovernanceItem = await db.addGovernanceItem({governance_name,type,owner,status,effective_date,expiry_date,next_review,last_reviewed,approval_status,approver,latest_change_summary,attachment,});

    // Log the action
    await logAction(user_id, "CREATE", "governance_item", newGovernanceItem.governance_id, {
      governance_name,
      type,
      status
    });

    res.status(201).json(newGovernanceItem);
  } catch (err) {
    next(err);
  }
}

async function updateGovernanceItem(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;
    const user_id = req.user?.user_id;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const oldGovernanceItem = await db.getGovernanceItemById(parseInt(id));
    const updatedGovernanceItem = await db.updateGovernanceItem(parseInt(id), fields);

    if (!updatedGovernanceItem) {
      throw new NotFoundError("Governance item not found");
    }

    // Log the action
    await logAction(user_id, "UPDATE", "governance_item", parseInt(id), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedGovernanceItem);
  } catch (err) {
    next(err);
  }
}

async function deleteGovernanceItem(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user?.user_id;

    const deletedGovernanceItem = await db.removeGovernanceItem(parseInt(id));

    if (!deletedGovernanceItem) {
      throw new NotFoundError("Governance item not found");
    }

    // Log the action
    await logAction(user_id, "DELETE", "governance_item", parseInt(id), {
      governance_name: deletedGovernanceItem.governance_name
    });

    res.status(200).json({ message: "Governance item deleted successfully", governanceItem: deletedGovernanceItem });
  } catch (err) {
    next(err);
  }
}

async function getGovernanceItems(req, res, next) {
  try {
    const governanceItems = await db.getAllGovernanceItems();

    if (!governanceItems || governanceItems.length === 0) {
      return res.status(404).json({ message: "No governance items found" });
    }

    res.status(200).json(governanceItems);
  } catch (err) {
    next(err);
  }
}

async function getGovernanceItemById(req, res, next) {
  try {
    const { id } = req.params;
    const governanceItem = await db.getGovernanceItemById(parseInt(id));

    if (!governanceItem) {
      throw new NotFoundError("Governance item not found");
    }

    res.status(200).json(governanceItem);
  } catch (err) {
    next(err);
  }
}

async function getGovernanceItemsByOwner(req, res, next) {
  try {
    const { ownerId } = req.params;
    const governanceItems = await db.getGovernanceItemsByOwner(parseInt(ownerId));

    if (!governanceItems || governanceItems.length === 0) {
      return res.status(404).json({ message: "No governance items found for this owner" });
    }

    res.status(200).json(governanceItems);
  } catch (err) {
    next(err);
  }
}




async function getRisksForGovernanceItem(req, res, next) {
  try {
    const { id } = req.params;
    const risks = await db.getRisksForGovernanceItem(parseInt(id));

    res.status(200).json(risks);
  } catch (err) {
    next(err);
  }
}

async function getFrameworksForGovernanceItem(req, res, next) {
  try {
    const { id } = req.params;
    const frameworks = await db.getFrameworksForGovernanceItem(parseInt(id));

    res.status(200).json(frameworks);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createGovernanceItem,
  getGovernanceItems,
  getGovernanceItemById,
  getGovernanceItemsByOwner,
  updateGovernanceItem,
  deleteGovernanceItem,
  getRisksForGovernanceItem,
  getFrameworksForGovernanceItem,
};