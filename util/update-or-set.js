import logger from '../util/logger';

const update = async function(ref, key, data) {

  try {

    await ref.update(data)
    .then(async function(snapshot) {
      logger.info(`Data updated for "${key}" successfully.`);
    })
    .catch(async function(error) {
      return logger.error(error);
    });

  }
  catch (error) {
    return logger.error(error);
  }

};

const save = async function(ref, key, data) {

  try {

    await ref.set(data)
    .then(async function(snapshot) {
      logger.info(`New data saved for "${key}" successfully.`);
    })
    .catch(async function(error) {
      return logger.error(error);
    });

  }
  catch (error) {
    return logger.error(error);
  }

};

const updateOrSet = async function(ref, key, data) {

  try {

    await ref.child(key).once('value')
    .then(async function(snapshot) {

      if (snapshot.exists()) {
        logger.info(`Existing data for "${key}" found.`);
        await update(snapshot.ref, snapshot.key, data);
      } else {
        logger.info(`No existing data for "${key}" found.`);
        await save(snapshot.ref, snapshot.key, data);
      }

    })
    .catch(async function(error) {
      return logger.error(error);
    });

  }
  catch (error) {
    return logger.error(error);
  }

};

export {updateOrSet};

export default updateOrSet;
