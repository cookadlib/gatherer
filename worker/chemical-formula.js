import _ from 'lodash';
import async from 'async';
import chemicalFormula from 'chemical-formula';
import errors from 'request-promise/errors';
import requestPromise from 'request-promise';

import firebase, {db, sanitiseKey} from '../instance/firebase';

import logger from '../util/logger';
import updateOrSet from '../util/update-or-set';

const vitamins = {
  'InChI=1S/C20H30O/c1-16(8-6-9-17(2)13-15-21)11-12-19-18(3)10-7-14-20(19,4)5/h6,8-9,11-13,21H,7,10,14-15H2,1-5H3': 'A',
  'InChI=1S/C20H28O/c1-16(8-6-9-17(2)13-15-21)11-12-19-18(3)10-7-14-20(19,4)5/h6,8-9,11-13,15H,7,10,14H2,1-5H3': 'A',
  'InChI=1S/C40H56/c1-31(19-13-21-33(3)25-27-37-35(5)23-15-29-39(37,7)8)17-11-12-18-32(2)20-14-22-34(4)26-28-38-36(6)24-16-30-40(38,9)10/h11-14,17-22,25-28H,15-16,23-24,29-30H2,1-10H3/b12-11+,19-13+,20-14+,27-25+,28-26+,31-17+,32-18+,33-21+,34-22+': 'A',
  'InChI=1S/C40H56/c1-31(19-13-21-33(3)25-27-37-35(5)23-15-29-39(37,7)8)17-11-12-18-32(2)20-14-22-34(4)26-28-38-36(6)24-16-30-40(38,9)10/h11-14,17-23,25-28,37H,15-16,24,29-30H2,1-10H3/b12-11+,19-13+,20-14+,27-25+,28-26+,31-17+,32-18+,33-21+,34-22+/t37-/m0/s1': 'A',
  'InChI=1S/C40H56O/c1-30(18-13-20-32(3)23-25-37-34(5)22-15-27-39(37,7)8)16-11-12-17-31(2)19-14-21-33(4)24-26-38-35(6)28-36(41)29-40(38,9)10/h11-14,16-21,23-26,36,41H,15,22,27-29H2,1-10H3/b12-11+,18-13+,19-14+,25-23+,26-24+,30-16+,31-17+,32-20+,33-21+/t36-/m1/s1': 'A',
  'InChI=1S/C40H56/c1-32(2)18-13-21-35(5)24-15-26-36(6)25-14-22-33(3)19-11-12-20-34(4)23-16-27-37(7)29-30-39-38(8)28-17-31-40(39,9)10/h11-12,14-16,18-20,22-27,29-30H,13,17,21,28,31H2,1-10H3/b12-11+,22-14+,23-16+,26-15+,30-29+,33-19+,34-20+,35-24+,36-25+,37-27+': 'A',
  'InChI=1S/C12H17N4OS.ClH/c1-8-11(3-4-17)18-7-16(8)6-10-5-14-9(2)15-12(10)13;/h5,7,17H,3-4,6H2,1-2H3,(H2,13,14,15);1H/q+1;/p-1': 'B1',
  'InChI=1S/C17H20N4O6/c1-7-3-9-10(4-8(7)2)21(5-11(23)14(25)12(24)6-22)15-13(18-9)16(26)20-17(27)19-15/h3-4,11-12,14,22-25H,5-6H2,1-2H3,(H,20,26,27)/t11-,12+,14-/m0/s1': 'B2',
  'InChI=1S/C6H5NO2/c8-6(9)5-2-1-3-7-4-5/h1-4H,(H,8,9)': 'B3',
  'InChI=1S/C6H6N2O/c7-6(9)5-2-1-3-8-4-5/h1-4H,(H2,7,9)': 'B3',
  'InChI=1S/C9H17NO5/c1-9(2,5-11)7(14)8(15)10-4-3-6(12)13/h7,11,14H,3-5H2,1-2H3,(H,10,15)(H,12,13)': 'B5',
  'InChI=1S/C9H17NO5/c1-9(2,5-11)7(14)8(15)10-4-3-6(12)13/h7,11,14H,3-5H2,1-2H3,(H,10,15)(H,12,13)/t7-/m0/s1': 'B5',
  'InChI=1S/C9H17NO5/c1-9(2,5-11)7(14)8(15)10-4-3-6(12)13/h7,11,14H,3-5H2,1-2H3,(H,10,15)(H,12,13)/t7-/m1/s1': 'B5',
  'InChI=1S/C8H11NO3/c1-5-8(12)7(4-11)6(3-10)2-9-5/h2,10-12H,3-4H2,1H3': 'B6',
  'InChI=1S/C8H12N2O2/c1-5-8(12)7(2-9)6(4-11)3-10-5/h3,11-12H,2,4,9H2,1H3': 'B6',
  'InChI=1S/C8H9NO3/c1-5-8(12)7(4-11)6(3-10)2-9-5/h2,4,10,12H,3H2,1H3': 'B6',
  'InChI=1S/C10H16N2O3S/c13-8(14)4-2-1-3-7-9-6(5-16-7)11-10(15)12-9/h6-7,9H,1-5H2,(H,13,14)(H2,11,12,15)/t6-,7-,9-/m0/s1': 'B7',
  'InChI=1S/C19H19N7O6/c20-19-25-15-14(17(30)26-19)23-11(8-22-15)7-21-10-3-1-9(2-4-10)16(29)24-12(18(31)32)5-6-13(27)28/h1-4,8,12,21H,5-7H2,(H,24,29)(H,27,28)(H,31,32)(H3,20,22,25,26,30)/t12-/m0/s1': 'B9',
  'InChI=1S/C20H23N7O7/c21-20-25-16-15(18(32)26-20)27(9-28)12(8-23-16)7-22-11-3-1-10(2-4-11)17(31)24-13(19(33)34)5-6-14(29)30/h1-4,9,12-13,22H,5-8H2,(H,24,31)(H,29,30)(H,33,34)(H4,21,23,25,26,32)/t12?,13-/m0/s1': 'B9',
  'InChI=1S/C62H90N13O14P.CN.Co/c1-29-20-39-40(21-30(29)2)75(28-70-39)57-52(84)53(41(27-76)87-57)89-90(85,86)88-31(3)26-69-49(83)18-19-59(8)37(22-46(66)80)56-62(11)61(10,25-48(68)82)36(14-17-45(65)79)51(74-62)33(5)55-60(9,24-47(67)81)34(12-15-43(63)77)38(71-55)23-42-58(6,7)35(13-16-44(64)78)50(72-42)32(4)54(59)73-56;1-2;/h20-21,23,28,31,34-37,41,52-53,56-57,76,84H,12-19,22,24-27H2,1-11H3,(H15,63,64,65,66,67,68,69,71,72,73,74,77,78,79,80,81,82,83,85,86);;/q;-1;+3/p-2/t31-,34-,35-,36-,37+,41-,52-,53-,56-,57+,59-,60+,61+,62+;;/m1../s1': 'B12',
  'InChI=1S/C62H90N13O14P.Co.H2O/c1-29-20-39-40(21-30(29)2)75(28-70-39)57-52(84)53(41(27-76)87-57)89-90(85,86)88-31(3)26-69-49(83)18-19-59(8)37(22-46(66)80)56-62(11)61(10,25-48(68)82)36(14-17-45(65)79)51(74-62)33(5)55-60(9,24-47(67)81)34(12-15-43(63)77)38(71-55)23-42-58(6,7)35(13-16-44(64)78)50(72-42)32(4)54(59)73-56;;/h20-21,23,28,31,34-37,41,52-53,56-57,76,84H,12-19,22,24-27H2,1-11H3,(H15,63,64,65,66,67,68,69,71,72,73,74,77,78,79,80,81,82,83,85,86);;1H2/q;+2;/p-2/t31-,34+,35+,36+,37-,41+,52+,53+,56?,57-,59+,60-,61-,62-;;/m0../s1': 'B12',
  'InChI=1S/C62H90N13O14P.CH3.Co/c1-29-20-39-40(21-30(29)2)75(28-70-39)57-52(84)53(41(27-76)87-57)89-90(85,86)88-31(3)26-69-49(83)18-19-59(8)37(22-46(66)80)56-62(11)61(10,25-48(68)82)36(14-17-45(65)79)51(74-62)33(5)55-60(9,24-47(67)81)34(12-15-43(63)77)38(71-55)23-42-58(6,7)35(13-16-44(64)78)50(72-42)32(4)54(59)73-56;;/h20-21,23,28,31,34-37,41,52-53,56-57,76,84H,12-19,22,24-27H2,1-11H3,(H15,63,64,65,66,67,68,69,71,72,73,74,77,78,79,80,81,82,83,85,86);1H3;/q;-1;+3/p-2': 'B12',
  'InChI=1S/C6H8O6/c7-1-2(8)5-3(9)4(10)6(11)12-5/h2,5,7-8,10-11H,1H2/t2-,5+/m0/s1': 'C',
  'InChI=1S/C27H44O/c1-19(2)8-6-9-21(4)25-15-16-26-22(10-7-17-27(25,26)5)12-13-23-18-24(28)14-11-20(23)3/h12-13,19,21,24-26,28H,3,6-11,14-18H2,1-2,4-5H3/b22-12+,23-13-/t21-,24+,25-,26+,27-/m1/s1': 'D',
  'InChI=1S/C28H44O/c1-19(2)20(3)9-10-22(5)26-15-16-27-23(8-7-17-28(26,27)6)12-13-24-18-25(29)14-11-21(24)4/h9-10,12-13,19-20,22,25-27,29H,4,7-8,11,14-18H2,1-3,5-6H3/b10-9+,23-12+,24-13-/t20-,22+,25-,26+,27-,28+/m0/s1': 'D',
  'InChI=1S/C29H50O2/c1-20(2)12-9-13-21(3)14-10-15-22(4)16-11-18-29(8)19-17-26-25(7)27(30)23(5)24(6)28(26)31-29/h20-22,30H,9-19H2,1-8H3/t21-,22-,29-/m1/s1': 'E',
  'InChI=1S/C28H48O2/c1-20(2)11-8-12-21(3)13-9-14-22(4)15-10-17-28(7)18-16-25-24(6)26(29)19-23(5)27(25)30-28/h19-22,29H,8-18H2,1-7H3': 'E',
  'InChI=1S/C28H48O2/c1-20(2)11-8-12-21(3)13-9-14-22(4)15-10-17-28(7)18-16-25-19-26(29)23(5)24(6)27(25)30-28/h19-22,29H,8-18H2,1-7H3/t21-,22-,28-/m1/s1': 'E',
  'InChI=1S/C27H46O2/c1-20(2)10-7-11-21(3)12-8-13-22(4)14-9-16-27(6)17-15-24-19-25(28)18-23(5)26(24)29-27/h18-22,28H,7-17H2,1-6H3/t21-,22-,27-/m1/s1': 'E',
  'InChI=1S/C29H44O2/c1-20(2)12-9-13-21(3)14-10-15-22(4)16-11-18-29(8)19-17-26-25(7)27(30)23(5)24(6)28(26)31-29/h12,14,16,30H,9-11,13,15,17-19H2,1-8H3/b21-14+,22-16+/t29-/m1/s1': 'E',
  'InChI=1S/C28H42O2/c1-20(2)11-8-12-21(3)13-9-14-22(4)15-10-17-28(7)18-16-25-24(6)26(29)19-23(5)27(25)30-28/h11,13,15,19,29H,8-10,12,14,16-18H2,1-7H3/b21-13+,22-15+/t28-/m1/s1': 'E',
  'InChI=1S/C28H42O2/c1-20(2)11-8-12-21(3)13-9-14-22(4)15-10-17-28(7)18-16-25-19-26(29)23(5)24(6)27(25)30-28/h11,13,15,19,29H,8-10,12,14,16-18H2,1-7H3/b21-13+,22-15+/t28-/m1/s1': 'E',
  'InChI=1S/C27H40O2/c1-20(2)10-7-11-21(3)12-8-13-22(4)14-9-16-27(6)17-15-24-19-25(28)18-23(5)26(24)29-27/h10,12,14,18-19,28H,7-9,11,13,15-17H2,1-6H3/b21-12+,22-14+/t27-/m1/s1': 'E',
  'InChI=1S/C31H46O2/c1-22(2)12-9-13-23(3)14-10-15-24(4)16-11-17-25(5)20-21-27-26(6)30(32)28-18-7-8-19-29(28)31(27)33/h7-8,18-20,22-24H,9-17,21H2,1-6H3': 'K',
  'InChI=1S/C31H46O2/c1-22(2)12-9-13-23(3)14-10-15-24(4)16-11-17-25(5)20-21-27-26(6)30(32)28-18-7-8-19-29(28)31(27)33/h7-8,18-20,22-24H,9-17,21H2,1-6H3/b25-20+/t23-,24-/m1/s1': 'K',
  'InChI=1S/C31H46O2/c1-22(2)12-9-13-23(3)14-10-15-24(4)16-11-17-25(5)20-21-27-26(6)30(32)28-18-7-8-19-29(28)31(27)33/h7-8,18-20,22-24H,9-17,21H2,1-6H3/b25-20+': 'K',
  'InChI=1S/C16H16O2/c1-10(2)8-9-12-11(3)15(17)13-6-4-5-7-14(13)16(12)18/h4-8H,9H2,1-3H3': 'K',
  'InChI=1S/C21H24O2/c1-14(2)8-7-9-15(3)12-13-17-16(4)20(22)18-10-5-6-11-19(18)21(17)23/h5-6,8,10-12H,7,9,13H2,1-4H3/b15-12+': 'K',
  'InChI=1S/C11H8O2/c1-7-6-10(12)8-4-2-3-5-9(8)11(7)13/h2-6H,1H3': 'K',
  'InChI=1S/C31H40O2/c1-22(2)12-9-13-23(3)14-10-15-24(4)16-11-17-25(5)20-21-27-26(6)30(32)28-18-7-8-19-29(28)31(27)33/h7-8,12,14,16,18-20H,9-11,13,15,17,21H2,1-6H3/b23-14+,24-16+,25-20+': 'K',
  'InChI=1S/C41H56O2/c1-30(2)16-11-17-31(3)18-12-19-32(4)20-13-21-33(5)22-14-23-34(6)24-15-25-35(7)28-29-37-36(8)40(42)38-26-9-10-27-39(38)41(37)43/h9-10,16,18,20,22,24,26-28H,11-15,17,19,21,23,25,29H2,1-8H3/b31-18+,32-20+,33-22+,34-24+,35-28+': 'K',
  'InChI=1S/C46H64O2/c1-34(2)18-12-19-35(3)20-13-21-36(4)22-14-23-37(5)24-15-25-38(6)26-16-27-39(7)28-17-29-40(8)32-33-42-41(9)45(47)43-30-10-11-31-44(43)46(42)48/h10-11,18,20,22,24,26,28,30-32H,12-17,19,21,23,25,27,29,33H2,1-9H3/b35-20+,36-22+,37-24+,38-26+,39-28+,40-32+': 'K',
  'InChI=1S/C51H72O2/c1-38(2)20-13-21-39(3)22-14-23-40(4)24-15-25-41(5)26-16-27-42(6)28-17-29-43(7)30-18-31-44(8)32-19-33-45(9)36-37-47-46(10)50(52)48-34-11-12-35-49(48)51(47)53/h11-12,20,22,24,26,28,30,32,34-36H,13-19,21,23,25,27,29,31,33,37H2,1-10H3/b39-22+,40-24+,41-26+,42-28+,43-30+,44-32+,45-36+': 'K'
};

const formulasRef = db.ref('/chemical/formula');
const vitaminsRef = db.ref('/chemical/vitamin');

const getFormulaDetails = async function(formula) {

  try {

    const options = {
      headers: {
        'User-Agent': 'request'
      },
      json: true,
      method: 'POST',
      postData: {
        mimeType: 'application/x-www-form-urlencoded',
        params: [
          {
            name: 'inchi',
            value: formula.InChI
          }
        ]
      },
      simple: false,
      url: 'http://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/property/MolecularFormula/JSON'
    };

    await requestPromise(options)
    .then(async function(body) {
      const pubchem = body;

      let chemicalFormulaInstance;

      if (formula.formula) {
        formula.equilibrator = {
          formula: formula.formula
        };

        delete formula.formula;
      }

      if (pubchem && pubchem.PropertyTable && pubchem.PropertyTable.Properties) {
        formula.CID = pubchem.PropertyTable.Properties.CID;
        formula.MolecularFormula = pubchem.PropertyTable.Properties.MolecularFormula;
      }

      if (formula.MolecularFormula) {

        try {
          chemicalFormulaInstance = chemicalFormula(formula.MolecularFormula);
        }
        catch (exception) {
          return logger.error(exception.message);
        }
        finally {
          if (chemicalFormulaInstance) {
            formula.elements = chemicalFormulaInstance;
          }
        }

      }

    })
    .catch(errors.StatusCodeError, (reason) => {
      // The server responded with a status codes other than 2xx.
      // Check reason.statusCode
      return logger.error(reason.statusCode);
    })
    .catch(errors.RequestError, (reason) => {
      // The request failed due to technical reasons.
      // reason.cause is the Error object Request would pass into a callback.
      return logger.error(reason.cause);
    })
    .catch((error) => {
      return logger.error(error);
    });

    return await formula;

  }
  catch (error) {
    return logger.error(error);
  }

};

const assignVitamin = async function(formula) {

  let match = vitamins[formula.InChI];

  if (match) {
    formula.vitamin = {};
    formula.vitamin[match] = true;

    let data = {
      name: formula.name,
      class: match,
      InChI: formula.InChI
    };

    await vitaminsRef.orderByChild('InChI').equalTo(formula.InChI).once('value').then(async function(snapshot) {

      if (snapshot.exists()) {

        await vitaminsRef.update(data)
        .then(async function(snapshot) {
          logger.info(`Data updated for "${snapshot.key()}" successfully`);
        })
        .catch(async function(error) {
          return logger.error(error);
        });

      } else {

        await vitaminsRef.push().set(data)
        .then(async function(snapshot) {
          logger.info(`New data saved for "${snapshot.key()}" successfully`);
        })
        .catch(async function(error) {
          return logger.error(error);
        });

      }

    });

  }

  return await formula;

};

const getFormulaSynonyms = async function(formula) {

  try {

    const options = {
      headers: {
        'User-Agent': 'request'
      },
      json: true,
      method: 'POST',
      postData: {
        mimeType: 'application/x-www-form-urlencoded',
        params: [
          {
            name: 'inchi',
            value: formula.InChI
          }
        ]
      },
      simple: false,
      url: 'http://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/synonyms/JSON'
    };

    await requestPromise(options)
    .then(async function(body) {
      const pubchem = body.InformationList.Information[0];

      if (pubchem && pubchem.Synonym) {

        formula.synonym = pubchem.Synonym;

        for (let vitamin of vitamins) {

          let vitaminPosition = pubchem.Synonym.indexOf(`vitamin ${vitamin}`);

          if (vitaminPosition !== -1) {
            element.vitamin = {};
            element.vitamin[vitamin] = true;

            let vitaminData = {
              formula: {
                'InChI': formula.key
              },
              source: [
                {
                  classification: {
                    group: {
                      lichen: true
                    }
                  }
                }
              ]
            };

          }

        }

      }

      // formula.vitamin.d3 = true;
    })
    .catch(errors.StatusCodeError, (reason) => {
      // The server responded with a status codes other than 2xx.
      // Check reason.statusCode
      return logger.error(reason.statusCode);
    })
    .catch(errors.RequestError, (reason) => {
      // The request failed due to technical reasons.
      // reason.cause is the Error object Request would pass into a callback.
      return logger.error(reason.cause);
    })
    .catch((error) => {
      return logger.error(error);
    });

    return await formula;

  }
  catch (error) {
    return logger.error(error);
  }

};

const processFormula = async function(formula) {

  try {

    const key = formula.KEGG_ID.toLowerCase(); // see http://www.genome.jp/kegg/
    // const key = formula.InChI;

    formula.timestamp = firebase.database.ServerValue.TIMESTAMP;

    await getFormulaDetails(formula);
    await assignVitamin(formula);
    // await getFormulaSynonyms(formula);
    await updateOrSet(formulasRef, formula, key);

  }
  catch (error) {
    return logger.error(error);
  }

};

const worker = async function() {

  try {

    const options = {
      encoding: null,
      gzip: true,
      headers: {
        'User-Agent': 'request'
      },
      json: true,
      simple: false,
      url: 'http://equilibrator2.milolab.webfactional.com/media/downloads/kegg_compounds.json.gz' // see http://equilibrator.weizmann.ac.il/download
    };

    await requestPromise(options)
    .then(async function(body) {
      const formulas = body;

      for (let formula of formulas) {
        processFormula(formula);
      }
    })
    .catch(errors.StatusCodeError, (reason) => {
      // The server responded with a status codes other than 2xx.
      // Check reason.statusCode
      return logger.error(reason.statusCode);
    })
    .catch(errors.RequestError, (reason) => {
      // The request failed due to technical reasons.
      // reason.cause is the Error object Request would pass into a callback.
      return logger.error(reason.cause);
    })
    .catch((error) => {
      return logger.error(error);
    });

  }
  catch (error) {
    return logger.error(error);
  }

};

export {worker};

export default worker;
