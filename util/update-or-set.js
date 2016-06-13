export const updateOrSet = (ref, key, data) => {

  ref.child(key).once('value', (snapshot) => {

    ref.child(key).update(data, (error) => {

      if (error) {
        console.error(`Data for ${key} could not be saved.`, error);
      } else {
        console.info(`Data for ${key} saved successfully.`);
      }

    });

  }, (error) => {
    ref.child(key).push().set(data, (error) => {

      if (error) {
        console.error(`Data for ${key} could not be saved.`, error);
      } else {
        console.info(`Data for ${key} saved successfully.`);
      }

    });

  });

};

export default updateOrSet;
