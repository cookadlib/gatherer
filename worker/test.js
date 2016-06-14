import firebase, {db, sanitiseKey} from '../instance/firebase';

import logger from '../util/logger';

const formulasRef = db.ref('/chemical/formula');
const formulasBackupRef = db.ref('/chemical/formula-backup');

const worker = async function() {

  // db.ref('/chemical/element1').remove();
  // db.ref('/chemical/formula').remove();

  // formulasRef.once('value').then((snapshot) => {
  //   logger.log(snapshot.val());
  // });

  // formulasRef.child('c18976').once('value').then((snapshot) => {
  //   logger.log(snapshot.val());
  // });

  // formulasRef.orderByChild('formula').equalTo('3ClH.Sb').once('value').then((snapshot) => {
  //   logger.log(snapshot.val());
  // });

  // formulasRef.once('value', (snapshot) => {
  //   formulasBackupRef.set(snapshot.val())
  //   .then(async function(snapshot) {
  //     logger.info(`New data saved for formulas successfully.`);
  //   })
  //   .catch(async function(error) {
  //     logger.error(error);
  //   });
  // });

  formulasRef.orderByChild('formula').equalTo('C20H30O').once('value').then((snapshot) => {
    logger.info(snapshot.val());
  });

};

export {worker};

export default worker;
