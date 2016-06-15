import firebase, {db, sanitiseKey} from '../instance/firebase';

import logger from '../util/logger';

const formulasRef = db.ref('/chemical/formula');
const formulasBackupRef = db.ref('/chemical/formula-backup');
const vitaminsRef = db.ref('/chemical/vitamin');

const worker = async function() {

  // db.ref('/chemical/element1').remove();
  // db.ref('/chemical/formula').remove();
  // vitaminsRef.remove();

  // formulasRef.once('value').then((snapshot) => {
  //   return logger.log(snapshot.val());
  // });

  // formulasRef.child('c18976').once('value').then((snapshot) => {
  //   return logger.log(snapshot.val());
  // });

  // formulasRef.orderByChild('formula').equalTo('3ClH.Sb').once('value').then((snapshot) => {
  //   return logger.log(snapshot.val());
  // });

  // formulasRef.once('value', (snapshot) => {
  //   formulasBackupRef.set(snapshot.val())
  //   .then(async function(snapshot) {
  //     return logger.info(`New data saved for formulas successfully.`);
  //   })
  //   .catch(async function(error) {
  //     return logger.error(error);
  //   });
  // });

  // formulasRef.orderByChild('formula').equalTo('C20H30O').once('value').then((snapshot) => {
  //   return logger.info(snapshot.val());
  // });

  // formulasRef.orderByChild('InChI').equalTo('InChI=1S/C40H56/c1-31(19-13-21-33(3)25-27-37-35(5)23-15-29-39(37,7)8)17-11-12-18-32(2)20-14-22-34(4)26-28-38-36(6)24-16-30-40(38,9)10/h11-14,17-22,25-28H,15-16,23-24,29-30H2,1-10H3/b12-11+,19-13+,20-14+,27-25+,28-26+,31-17+,32-18+,33-21+,34-22+').once('value').then((snapshot) => {
  //   return logger.info(snapshot.val());
  // });

  vitaminsRef.orderByChild('class').equalTo('B3').once('value').then((snapshot) => {
    return logger.info(snapshot.val());
  });

};

export {worker};

export default worker;
