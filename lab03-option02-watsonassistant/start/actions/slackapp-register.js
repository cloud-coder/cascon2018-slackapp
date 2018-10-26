/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const async = require("async");
const request = require("request");

/**
 * Main function
 * @param {*} args - the arguments
 * @returns {null} Nothing
 */
function main (args) {
  console.log("Registering new bot from Slack");
  console.log(args);
  console.log("-----------------------------");

  // Connect to the Cloudant database
  const cloudant = require("cloudant")({url: args.cloudantUrl});
  const botsDb = cloudant.use(args.cloudantDb);

  return new Promise(((resolve, reject) => {
    async.waterfall([
      // Complete the OAuth flow with Slack
      (callback) => {
        request({
          url: `https://slack.com/api/oauth.access?client_id=${args.slackClientId}&client_secret=${args.slackClientSecret}&code=${args.code}&state=${args.state}`,
          json: true
        }, (err, response, registration) => {
          if (err) {
            console.log("Registration Error", err);
            return callback(err);
          } else if (registration && registration.ok) {
            console.log("Result from Slack", registration);
            return callback(null, registration);
          }
          console.log(registration);
          return callback("Registration failed");
        });
      },
      // Find previous registrations for this team
      function (registration, callback) {
        console.log("Looking for previous registrations for the team", registration.team_id);
        botsDb.view("bots", "by_team_id", {
          keys: [registration.team_id],
          include_docs: true
        }, (err, body) => {
          if (err) {
            return callback(err);
          }
          return callback(null, registration, body.rows);
        });
      },
      // Delete them all
      function (registration, rows, callback) {
        console.log("Removing previous registrations for the team", registration.team_id, rows);
        const toBeDeleted = {
          docs: rows.map((row) => ({
            _id: row.doc._id,
            _rev: row.doc._rev,
            _deleted: true
          }))
        };
        if (rows.length > 0) {
          botsDb.bulk(toBeDeleted, (err, result) => {
            callback(err);
          });
          return true;
        }
        return callback(null, registration);
      },
      // Register the bot
      function (registration, callback) {
        console.log("Registering the bot for the team", registration.team_id);
        botsDb.insert({
          _id: registration.team_id,
          type: "bot-registration",
          registration
        }, (err, bot) => {
          console.log("Registered bot", bot);
          callback(err, registration);
        });
      }
    ], (err, result) => {
      if (err) {
        reject({
          body: err
        });
      } else {
        resolve({
          body: "Registration was successful. You can try the command in Slack or send a direct message to the bot."
        });
      }
    });
  }));
}
