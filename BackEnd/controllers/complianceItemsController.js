const db = require("../db/queries/complianceItems");
const { BadRequestError, NotFoundError, ConflictError } = require("../errors/errors");

// Frameworks
async function createFramework(req, res, next) {
  try {
    const { framework_id, framework_name, description } = req.body;

    if (!framework_id || !framework_name) {
      throw new BadRequestError("Framework ID and name are required");
    }

    const existing = await db.getFrameworkById(framework_id);
    if (existing) {
      throw new ConflictError("Framework ID already exists");
    }

    const newFramework = await db.addFramework({
      framework_id,
      framework_name,
      description,
    });

    res.status(201).json(newFramework);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Framework ID already exists (DB check)"));
    }
    next(err);
  }
}

async function getFrameworks(req, res, next) {
  try {
    const frameworks = await db.getAllFrameworks();

    if (!frameworks || frameworks.length === 0) {
      return res.status(404).json({ message: "No frameworks found" });
    }

    res.status(200).json(frameworks);
  } catch (err) {
    next(err);
  }
}

async function getFrameworkById(req, res, next) {
  try {
    const { id } = req.params;
    const framework = await db.getFrameworkById(id);

    if (!framework) {
      throw new NotFoundError("Framework not found");
    }

    res.status(200).json(framework);
  } catch (err) {
    next(err);
  }
}

async function updateFramework(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedFramework = await db.updateFramework(id, fields);

    if (!updatedFramework) {
      throw new NotFoundError("Framework not found");
    }

    res.status(200).json(updatedFramework);
  } catch (err) {
    next(err);
  }
}

async function deleteFramework(req, res, next) {
  try {
    const { id } = req.params;
    const deletedFramework = await db.removeFramework(id);

    if (!deletedFramework) {
      throw new NotFoundError("Framework not found");
    }

    res.status(200).json({ message: "Framework deleted successfully", framework: deletedFramework });
  } catch (err) {
    next(err);
  }
}

// Requirements
async function createRequirement(req, res, next) {
  try {
    const { requirement_id, framework_id, requirement_name, reference } = req.body;

    if (!requirement_id || !framework_id || !requirement_name) {
      throw new BadRequestError("Requirement ID, framework ID, and name are required");
    }

    const existing = await db.getRequirementById(requirement_id);
    if (existing) {
      throw new ConflictError("Requirement ID already exists");
    }

    const newRequirement = await db.addRequirement({
      requirement_id,
      framework_id,
      requirement_name,
      reference,
    });

    res.status(201).json(newRequirement);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Requirement ID already exists (DB check)"));
    }
    next(err);
  }
}

async function getRequirementsByFramework(req, res, next) {
  try {
    const { frameworkId } = req.params;
    const requirements = await db.getRequirementsByFramework(frameworkId);

    if (!requirements || requirements.length === 0) {
      return res.status(404).json({ message: "No requirements found for this framework" });
    }

    res.status(200).json(requirements);
  } catch (err) {
    next(err);
  }
}

async function getRequirementById(req, res, next) {
  try {
    const { id } = req.params;
    const requirement = await db.getRequirementById(id);

    if (!requirement) {
      throw new NotFoundError("Requirement not found");
    }

    res.status(200).json(requirement);
  } catch (err) {
    next(err);
  }
}

async function updateRequirement(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedRequirement = await db.updateRequirement(id, fields);

    if (!updatedRequirement) {
      throw new NotFoundError("Requirement not found");
    }

    res.status(200).json(updatedRequirement);
  } catch (err) {
    next(err);
  }
}

async function deleteRequirement(req, res, next) {
  try {
    const { id } = req.params;
    const deletedRequirement = await db.removeRequirement(id);

    if (!deletedRequirement) {
      throw new NotFoundError("Requirement not found");
    }

    res.status(200).json({ message: "Requirement deleted successfully", requirement: deletedRequirement });
  } catch (err) {
    next(err);
  }
}

// Controls
async function createControl(req, res, next) {
  try {
    const { control_id, requirement_id, control_name, status, owner, last_reviewed, reference, notes, description, attachment } = req.body;

    if (!control_id || !requirement_id || !control_name) {
      throw new BadRequestError("Control ID, requirement ID, and name are required");
    }

    const existing = await db.getControlById(control_id);
    if (existing) {
      throw new ConflictError("Control ID already exists");
    }

    const newControl = await db.addControl({
      control_id,
      requirement_id,
      control_name,
      status,
      owner,
      last_reviewed,
      reference,
      notes,
      description,
      attachment,
    });

    res.status(201).json(newControl);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Control ID already exists (DB check)"));
    }
    next(err);
  }
}

async function getControlsByRequirement(req, res, next) {
  try {
    const { requirementId } = req.params;
    const controls = await db.getControlsByRequirement(requirementId);

    if (!controls || controls.length === 0) {
      return res.status(404).json({ message: "No controls found for this requirement" });
    }

    res.status(200).json(controls);
  } catch (err) {
    next(err);
  }
}

async function getControlsByOwner(req, res, next) {
  try {
    const { ownerId } = req.params;
    const controls = await db.getControlsByOwner(parseInt(ownerId));

    if (!controls || controls.length === 0) {
      return res.status(404).json({ message: "No controls found for this owner" });
    }

    res.status(200).json(controls);
  } catch (err) {
    next(err);
  }
}

async function getControlById(req, res, next) {
  try {
    const { id } = req.params;
    const control = await db.getControlById(id);

    if (!control) {
      throw new NotFoundError("Control not found");
    }

    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
}

async function updateControl(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedControl = await db.updateControl(id, fields);

    if (!updatedControl) {
      throw new NotFoundError("Control not found");
    }

    res.status(200).json(updatedControl);
  } catch (err) {
    next(err);
  }
}

async function deleteControl(req, res, next) {
  try {
    const { id } = req.params;
    const deletedControl = await db.removeControl(id);

    if (!deletedControl) {
      throw new NotFoundError("Control not found");
    }

    res.status(200).json({ message: "Control deleted successfully", control: deletedControl });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // Frameworks
  createFramework,
  getFrameworks,
  getFrameworkById,
  updateFramework,
  deleteFramework,
  
  // Requirements
  createRequirement,
  getRequirementsByFramework,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
  
  // Controls
  createControl,
  getControlsByRequirement,
  getControlsByOwner,
  getControlById,
  updateControl,
  deleteControl,
};