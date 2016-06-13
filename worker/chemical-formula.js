import _ from 'lodash';
import async from 'async';
import chemicalFormula from 'chemical-formula';
import request from 'request';

import firebase, {db, sanitiseKey} from '../instance/firebase';

import updateOrSet from '../util/update-or-set';

const formulasRef = db.ref('/chemical/formula');

function processFormula(formula) {
  const key = formula.KEGG_ID.toLowerCase(); // see http://www.genome.jp/kegg/

  // const formulaRef = formulasRef.child(key);

  let chemicalFormulaInstance;

  if (formula.formula) {
    formula.webfactional = {
      formula: formula.formula
    };

    delete formula.formula;
  }

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
    // url: 'http://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/JSON',
    url: 'http://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/property/MolecularFormula/JSON',
    json: true
  };

  request(options, (error, response, body) => {
    if (error) {
      return console.log(error);
    }

    const pubchem = body;

    if (pubchem && pubchem.PropertyTable && pubchem.PropertyTable.Properties) {
      formula.CID = pubchem.PropertyTable.Properties.CID;
      formula.MolecularFormula = pubchem.PropertyTable.Properties.MolecularFormula;
    }

    try {
      chemicalFormulaInstance = chemicalFormula(formula.MolecularFormula);
    }
    catch (exception) {
      console.log(exception.message);
    }
    finally {
      if (chemicalFormulaInstance) {
        formula.elements = chemicalFormulaInstance;
      }
    }

    // formula.vitamin.d3 = true;

    formula.timestamp = firebase.database.ServerValue.TIMESTAMP;

    updateOrSet(formulasRef, key, formula);
  });

}

export const worker = () => {

  const options = {
    encoding: null,
    gzip: true,
    headers: {
      'User-Agent': 'request'
    },
    url: 'http://equilibrator2.milolab.webfactional.com/media/downloads/kegg_compounds.json.gz', // see http://equilibrator.weizmann.ac.il/download
    json: true
  };

  request(options, (error, response, body) => {
    if (error) {
      return console.log(error);
    }

    const formulas = body;

    for (let formula of formulas) {
      processFormula(formula);
    }

  });

};

export default worker;
