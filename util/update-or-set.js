const update = async function(ref, key, data) {
  try {
    await ref.update(data)
    .then(async function(snapshot) {
      console.info(`Data updated for "${key}" successfully.`);
    })
    .catch(async function(error) {
      console.error(error);
    });
  }
  catch (error) {
    console.error(error);
  }
};

const save = async function(ref, key, data) {
  try {
    await ref.push().set(data)
    .then(async function(snapshot) {
      console.info(`New data saved for "${key}" successfully.`);
    })
    .catch(async function(error) {
      console.error(error);
    });
  }
  catch (error) {
    console.error(error);
  }
};

const updateOrSet = async function(ref, key, data) {
  try {
    await ref.child(key).once('value')
    .then(async function(snapshot) {
      console.info(`Existing data for "${key}" found.`);

      await update(snapshot.ref, snapshot.key, data);

      // do .length count on snapshot instead?
    })
    .catch(async function(error) {
      console.error(error);

      await save(snapshot.ref, snapshot.key, data);
    });
  }
  catch (error) {
    console.error(error);
  }

  /////

  // ref.child(key).once('value', (snapshot) => {
  //
  //   ref.child(key).update(data, (error) => {
  //
  //     if (error) {
  //       console.error(`Data for "${key}" could not be saved.`, error);
  //     } else {
  //       console.info(`Data for "${key}" saved successfully.`);
  //     }
  //
  //   });
  //
  // }, (error) => {
  //   ref.child(key).push().set(data, (error) => {
  //
  //     if (error) {
  //       console.error(`Data for "${key}" could not be saved.`, error);
  //     } else {
  //       console.info(`Data for "${key}" saved successfully.`);
  //     }
  //
  //   });
  //
  // });

};

export {updateOrSet};

export default updateOrSet;
