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
const _ = require("lodash");

 /** 
  * Posts a message to a channel with Slack Web API
  */
// *** INSERT YOUR CODE HERE ***

/**
 * @param {Object} args - The arguments
 * @returns {null} Nothing
 */
function main (args) {
  // Avoid calls from unknown
  if (args.token !== args.slackVerificationToken) {
    return {
      statusCode: 401
    };
  }

   /*
   * Handle the registration of the Event Subscription callback
   * Slack will send us an initial POST
   * https://api.slack.com/events/url_verification
   */
  if (args.__ow_method === "post" &&
    args.type === "url_verification" &&
    args.token === args.slackVerificationToken &&
    args.challenge) {
    console.log("URL verification from Slack");
    return {
      headers: {
        "Content-Type": "application/json"
      },
      body: Buffer.from(JSON.stringify({
        challenge: args.challenge
      })).toString("base64")
    };
  }
  // Identify if there are message subtypes to ignore See https://api.slack.com/events/message for details
  // *** INSERT YOUR CODE HERE ***

  // Connect to the Cloudant database
  const cloudant = require("cloudant")({url: args.cloudantUrl});
  const botsDb = cloudant.use(args.cloudantDb);

  // Get the event to process
  const event = {
    team_id: args.team_id,
    event: args.event
  };

  return new Promise(((resolve, reject) => {
    async.waterfall(
      [
      // Find the token for this bot
        function (callback) {
          console.log("Looking up bot info for team", event.team_id);
          botsDb.view("bots", "by_team_id", {
            keys: [event.team_id],
            limit: 1,
            include_docs: true
          }, (err, body) => {
            if (err) {
              return callback(err);
            } else if (body.rows && body.rows.length > 0) {
              console.log("Bots: ", body.rows);
              return callback(null, body.rows[0].doc.registration);
            }
            return callback(err);
          });
        }

        // Reply to the message
        // *** INSERT YOUR CODE HERE ***

      ],

      (err, response) => {
        if (err) {
          console.log("Error", err);
          reject({
            body: err
          });
        } else {
          console.log("Response", response);
          resolve({
            body: response
          });
        }
      }
    );
  }));
}
