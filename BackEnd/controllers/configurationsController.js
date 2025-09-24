const db = require("../db/queries/configurations");
const { BadRequestError, NotFoundError } = require("../errors/errors");
const { logAction } = require("./auditHelper");

async function createConfiguration(req, res, next) {
  try {
    const { key, value, description } = req.body;
    const user_id = req.user?.user_id;

    if (!key || !value) {
      throw new BadRequestError("Key and value are required");
    }

    const newConfiguration = await db.addConfiguration({key,value,description,});

    // Log the action
    await logAction(user_id, "CREATE", "configuration", newConfiguration.config_id, {
      key,
      value
    });

    res.status(201).json(newConfiguration);
  } catch (err) {
    if (err.code === "23505") {
      return next(new ConflictError("Configuration key already exists"));
    }
    next(err);
  }
}

async function updateConfiguration(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;
    const user_id = req.user?.user_id;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const oldConfiguration = await db.getConfigurationById(parseInt(id));
    const updatedConfiguration = await db.updateConfiguration(parseInt(id), fields);

    if (!updatedConfiguration) {
      throw new NotFoundError("Configuration not found");
    }

    // Log the action
    await logAction(user_id, "UPDATE", "configuration", parseInt(id), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedConfiguration);
  } catch (err) {
    next(err);
  }
}

async function deleteConfiguration(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user?.user_id;

    const deletedConfiguration = await db.removeConfiguration(parseInt(id));

    if (!deletedConfiguration) {
      throw new NotFoundError("Configuration not found");
    }

    // Log the action
    await logAction(user_id, "DELETE", "configuration", parseInt(id), {
      key: deletedConfiguration.key
    });

    res.status(200).json({ message: "Configuration deleted successfully", configuration: deletedConfiguration });
  } catch (err) {
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
async function searchConfigurations(req, res, next) {
  try {
    const { q } = req.query;

    if (!q) {
      throw new BadRequestError("Search query is required");
    }

    const searchQuery = `%${q}%`; // pattern match
    const configurations = await db.query(
      `SELECT * FROM configurations 
       WHERE key ILIKE $1 OR value ILIKE $1 OR description ILIKE $1`,
      [searchQuery]
    );

    if (configurations.rows.length === 0) {
      return res.status(404).json({ message: "No configurations found matching your search" });
    }

    res.status(200).json(configurations.rows);
  } catch (err) {
    console.error("Error in searchConfigurations:", err);
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
  searchConfigurations
};