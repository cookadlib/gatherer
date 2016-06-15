import logger from '../util/logger';

const update = async function(ref, data, key) {

  try {

    await ref.update(data)
    .then(async function(snapshot) {
      console.log('snapshot.val()', snapshot.val());
      logger.info(`Data updated for "${snapshot.key()}" successfully`);
    })
    .catch(async function(error) {
      return logger.error(error);
    });

  }
  catch (error) {
    return logger.error(error);
  }

};

const save = async function(ref, data, key) {

  try {

    await ref.set(data)
    .then(async function(snapshot) {
      logger.info(`New data saved for "${snapshot.key()}" successfully`);
    })
    .catch(async function(error) {
      return logger.error(error);
    });

  }
  catch (error) {
    return logger.error(error);
  }

};

const updateOrSet = async function(ref, data, key) {

  try {

    if (key) {

      await ref.child(key).once('value')
      .then(async function(snapshot) {

        if (snapshot.exists()) {
          // logger.info(`Existing data for "${key}" found`);
          await update(snapshot.ref, data, snapshot.key);
        } else {
          // logger.info(`No existing data for "${key}" found`);
          await save(snapshot.ref, data, snapshot.key);
        }

      })
      .catch(async function(error) {
        return logger.error(error);
      });

    } else {
      // logger.info(`No key defined`);
      await save(ref, data);
    }

  }
  catch (error) {
    return logger.error(error);
  }

};

export {updateOrSet};

export default updateOrSet;
