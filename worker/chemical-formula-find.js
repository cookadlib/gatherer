import firebase, {db, sanitiseKey} from '../instance/firebase';

const formulasRef = db.ref('/chemical/formula');

export const worker = () => {

  // formulasRef.once('value').then((snapshot) => {
  //   console.log('here 0');
  //   console.log(snapshot.val());
  // });

  // formulasRef.child('c18976').once('value').then((snapshot) => {
  //   console.log('here 1');
  //   console.log(snapshot.val());
  // });

  formulasRef.orderByChild('formula').equalTo('3ClH.Sb').once('value').then((snapshot) => {
    console.log('here 2');
    console.log(snapshot.val());
  });

};

export default worker;
