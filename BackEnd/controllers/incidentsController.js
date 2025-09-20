const db = require("../db/queries/incidents");
const { BadRequestError, NotFoundError } = require("../errors/errors");

async function createIncident(req, res, next) {
  try {
    const { title, category, status, severity, priority, reported_at, detected_at, owner, description } = req.body;

    if (!title || !category || !severity) {
      throw new BadRequestError("Title, category, and severity are required");
    }

    const newIncident = await db.addIncident({
      title,
      category,
      status,
      severity,
      priority,
      reported_at,
      detected_at,
      owner,
      description,
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

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedIncident = await db.updateIncident(parseInt(id), fields);

    if (!updatedIncident) {
      throw new NotFoundError("Incident not found");
    }

    res.status(200).json(updatedIncident);
  } catch (err) {
    next(err);
  }
}

async function deleteIncident(req, res, next) {
  try {
    const { id } = req.params;
    const deletedIncident = await db.removeIncident(parseInt(id));

    if (!deletedIncident) {
      throw new NotFoundError("Incident not found");
    }

    res.status(200).json({ message: "Incident deleted successfully", incident: deletedIncident });
  } catch (err) {
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
};