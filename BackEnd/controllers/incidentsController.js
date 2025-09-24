const db = require("../db/queries/incidents");
const { BadRequestError, NotFoundError } = require("../errors/errors");
const { logAction } = require("./auditHelper");

async function createIncident(req, res, next) {
  try {
    const { title, category, status, severity, priority, reported_at, detected_at, owner, description } = req.body;
    const user_id = req.user?.user_id;

    if (!title || !category || !severity) {
      throw new BadRequestError("Title, category, and severity are required");
    }

    const newIncident = await db.addIncident({title,category,status,severity,priority,reported_at,detected_at,owner,description,});

    // Log the action
    await logAction(user_id, "CREATE", "incident", newIncident.incident_id, {
      title,
      category,
      severity,
      status: status || 'reported'
    });

    res.status(201).json(newIncident);
  } catch (err) {
    next(err);
  }
}

async function getIncidents(req, res, next) {
  try {
    const incidents = await db.getAllIncidents();

    if (!incidents || incidents.length === 0) {
      return res.status(404).json({ message: "No incidents found" });
    }

    res.status(200).json(incidents);
  } catch (err) {
    next(err);
  }
}

async function getIncidentById(req, res, next) {
  try {
    const { id } = req.params;
    const incident = await db.getIncidentById(parseInt(id));

    if (!incident) {
      throw new NotFoundError("Incident not found");
    }

    res.status(200).json(incident);
  } catch (err) {
    next(err);
  }
}

async function getIncidentsByOwner(req, res, next) {
  try {
    const { ownerId } = req.params;
    const incidents = await db.getIncidentsByOwner(parseInt(ownerId));

    if (!incidents || incidents.length === 0) {
      return res.status(404).json({ message: "No incidents found for this owner" });
    }

    res.status(200).json(incidents);
  } catch (err) {
    next(err);
  }
}

async function updateIncident(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;
    const user_id = req.user?.user_id;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const oldIncident = await db.getIncidentById(parseInt(id));
    const updatedIncident = await db.updateIncident(parseInt(id), fields);

    if (!updatedIncident) {
      throw new NotFoundError("Incident not found");
    }

    // Log the action
    await logAction(user_id, "UPDATE", "incident", parseInt(id), {
      changed_fields: Object.keys(fields),
      old_status: oldIncident.status,
      new_status: updatedIncident.status
    });

    res.status(200).json(updatedIncident);
  } catch (err) {
    next(err);
  }
}

async function deleteIncident(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user?.user_id;

    const deletedIncident = await db.removeIncident(parseInt(id));

    if (!deletedIncident) {
      throw new NotFoundError("Incident not found");
    }

    // Log the action
    await logAction(user_id, "DELETE", "incident", parseInt(id), {
      title: deletedIncident.title,
      category: deletedIncident.category
    });

    res.status(200).json({ message: "Incident deleted successfully", incident: deletedIncident });
  } catch (err) {
    next(err);
  }
}

async function searchIncidents(req, res, next) {
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
    const incidents = await db.searchIncidentsByTitle(searchQuery);

    if (!incidents || incidents.length === 0) {
      return res.status(404).json({ message: "No incidents found matching your search" });
    }

    res.status(200).json(incidents);
  } catch (err) {
    console.error('Error in searchIncidents:', err);
    next(err);
  }
}

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  getIncidentsByOwner,
  updateIncident,
  deleteIncident,
  searchIncidents, // Add this
};