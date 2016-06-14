import _ from 'lodash';
import async from 'async';
import chemicalFormula from 'chemical-formula';
import errors from 'request-promise/errors';
import requestPromise from 'request-promise';

import firebase, {db, sanitiseKey} from '../instance/firebase';

import logger from '../util/logger';
import updateOrSet from '../util/update-or-set';

const vitamins = ['A', 'B1', 'B2', 'B3', 'B5', 'B6', 'B7', 'B9', 'B12', 'C', 'D', 'E', 'K'];

const formulasRef = db.ref('/chemical/formula');
const vitaminsRef = db.ref('/chemical/vitamin');

const getFormulaDetails = async function(formula) {

  try {

    const options = {
      headers: {
        'User-Agent': 'request'
      },
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
      url: 'http://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/property/MolecularFormula/JSON',
      json: true
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

  }
  catch (error) {
    return logger.error(error);
  }

};

const getFormulaSynonyms = async function(formula) {

  try {

    const options = {
      headers: {
        'User-Agent': 'request'
      },
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
      url: 'http://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/synonyms/JSON',
      json: true
    };

    await requestPromise(options)
    .then(async function(body) {
      const pubchem = body.InformationList.Information[0];

      if (pubchem && pubchem.Synonym) {

        formula.synonym = pubchem.Synonym;

        for (let vitamin of vitamins) {
logger.log('vitamin', vitamin);

          let vitaminPosition = pubchem.Synonym.indexOf(`vitamin ${vitamin}`);
logger.log('found', vitamin);
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
logger.log('vitaminData', vitaminData);
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
    await getFormulaSynonyms(formula);
    await updateOrSet(formulasRef, key, formula);

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
      url: 'http://equilibrator2.milolab.webfactional.com/media/downloads/kegg_compounds.json.gz', // see http://equilibrator.weizmann.ac.il/download
      json: true
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
