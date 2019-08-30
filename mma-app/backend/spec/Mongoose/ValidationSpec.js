const mongoose = require('mongoose');
const FighterModel = require('../../models/fighter.model');
const MatchModel = require('../../models/match.model');

// TODO: Need more validation tests
describe("Validation tests", () => {
    
    it('validates a match', done => {

        const matchObject = {
            eventName: "UFC 242",
            organization: "UFC",
            weightClass: 170,
            matchType: 'Main',
            matchOrder: 1,
            isFiveRounds: true,
            // TODO: Remove this if we use a test database for the tests
            isTestData: true
        };

        let fighterObjs = [];
        let fighterIds = [];

        for (let i = 0; i < 2; i++) {
            fighterObjs.push({
                firstName: "FirstName" + i,
                lastName: "LastName" + i,
                isTestData: true
            });
        }

        const validateMatch = async () => {
            for (fighterObj of fighterObjs) {
                const fighter = new FighterModel(fighterObj);
                const savedFighter = await fighter.save();
                fighterIds.push(savedFighter._id);
            }
            matchObject.fighters = fighterIds;
            // console.info(matchObject.fighters);
            const match = new MatchModel(matchObject);
            match.save().then(savedMatch => {
                done();
                }
            ).catch((err) => {
                fail('should always save');
            });

            matchObject.fighters.push({
                firstName:'ErrorFirstName',
                lastName:"errorLastName",
                isTestData: true
            });

            const errorMatch = new MatchModel(matchObject);
            errorMatch.save().then(() => {
                fail('should always throw an error')
                }
            ).catch((err) => {
                expect(err.ValidationError).not.toBe(null);
                done();
            });

        };

        validateMatch();

    });
});