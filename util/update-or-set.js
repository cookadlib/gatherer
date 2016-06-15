import logger from '../util/logger';

const updateOrSet = async function(ref, data, key) {

  try {

    if (key) {
      await ref.child(key).set(data)
      .then(async function(snapshot) {
        logger.info(`New data saved for "${key}" successfully`);
      })
      .catch(async function(error) {
        return logger.error(error);
      });

    } else {

      await ref.push().set(data)
      .then(async function(snapshot) {
        logger.info(`New data saved successfully`);
      })
      .catch(async function(error) {
        return logger.error(error);
      });

    }

  }
  catch (error) {
    return logger.error(error);
  }

};

export {updateOrSet};

export default updateOrSet;
