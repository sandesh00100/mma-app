const Jasmine = require('jasmine');
const jasmine = new Jasmine();

// TODO: find out why this isn't working
// jasmine.loadConfig('spec/support/jasmine.json');
jasmine.loadConfig({
    "spec_dir": "spec",
    "spec_files": [
      "**/*[sS]pec.js"
    ],
    "helpers": [
      "helpers/**/*.js"
    ],
    "stopSpecOnExpectationFailure": false,
    "random": true
  }
  );
  
jasmine.onComplete((passed) =>{
    if(passed) {
        console.log('All specs have passed!');
    }
    else {
        console.log('At least one spec has failed');
    }
});

jasmine.execute();