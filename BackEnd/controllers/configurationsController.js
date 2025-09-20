const db = require("../db/queries/configurations");
const { BadRequestError, NotFoundError } = require("../errors/errors");

async function createConfiguration(req, res, next) {
  try {
    const { key, value, description } = req.body;

    if (!key || !value) {
      throw new BadRequestError("Key and value are required");
    }

    const newConfiguration = await db.addConfiguration({
      key,
      value,
      description,
    });

    res.status(201).json(newConfiguration);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Configuration key already exists"));
    }
    next(err);
  }
}

async function getConfigurations(req, res, next) {
  try {
    const configurations = await db.getAllConfigurations();

    if (!configurations || configurations.length === 0) {
      return res.status(404).json({ message: "No configurations found" });
    }

    res.status(200).json(configurations);
  } catch (err) {
    next(err);
  }
}

async function getConfigurationById(req, res, next) {
  try {
    const { id } = req.params;
    const configuration = await db.getConfigurationById(parseInt(id));

    if (!configuration) {
      throw new NotFoundError("Configuration not found");
    }

    res.status(200).json(configuration);
  } catch (err) {
    next(err);
  }
}

async function getConfigurationByKey(req, res, next) {
  try {
    const { key } = req.params;
    const configuration = await db.getConfigurationByKey(key);

    if (!configuration) {
      throw new NotFoundError("Configuration not found");
    }

    res.status(200).json(configuration);
  } catch (err) {
    next(err);
  }
}

async function updateConfiguration(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedConfiguration = await db.updateConfiguration(parseInt(id), fields);

    if (!updatedConfiguration) {
      throw new NotFoundError("Configuration not found");
    }

    res.status(200).json(updatedConfiguration);
  } catch (err) {
    next(err);
  }
}

async function deleteConfiguration(req, res, next) {
  try {
    const { id } = req.params;
    const deletedConfiguration = await db.removeConfiguration(parseInt(id));

    if (!deletedConfiguration) {
      throw new NotFoundError("Configuration not found");
    }

    res.status(200).json({ message: "Configuration deleted successfully", configuration: deletedConfiguration });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createConfiguration,
  getConfigurations,
  getConfigurationById,
  getConfigurationByKey,
  updateConfiguration,
  deleteConfiguration,
};