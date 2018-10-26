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
 * Gets the details of a given user through the Slack Web API
 *
 * @param {String} accessToken - authorization token
 * @param {String} userId - the id of the user to retrieve info from
 * @param {function} callback - function(err, user)
 * @returns {Object} user - user information
 */
function usersInfo (accessToken, userId, callback) {
  request({
    url: "https://slack.com/api/users.info",
    method: "POST",
    form: {
      token: accessToken,
      user: userId
    },
    json: true
  }, (err, response, body) => {
    if (err) {
      return callback(err);
    } else if (body && body.ok) {
      return callback(null, body.user);
    } else if (body && !body.ok) {
      return callback(body.error);
    }
    return callback("unknown response");
  });
}

/**
 * Main function
 * @param {*} args - the arguments
 * @returns {null} Nothing
 */
function main (args) {
  console.log("Processing new bot command from Slack", args);

  // Avoid calls from unknown
  if (args.token !== args.slackVerificationToken) {
    return {
      statusCode: 401
    };
  }

  // Connect to the Cloudant database
  const cloudant = require("cloudant")({url: args.cloudantUrl});
  const botsDb = cloudant.use(args.cloudantDb);

  // The command to process
  const command = {
    team_id: args.team_id,
    user_id: args.user_id,
    /*
     * The response url could be used to send the response later as part of another
     * action in the case we need to do more processing before being able to reply.
     */
    response_url: args.response_url,
    text: args.text,
    command: args.command
  };

// Create your getWeather API call here


  return new Promise(((resolve, reject) => {
    async.waterfall(
      [
      // Find the token for this bot
        function (callback) {
          console.log("Looking up bot info for team", command.team_id);
          botsDb.view("bots", "by_team_id", {
            keys: [command.team_id],
            limit: 1,
            include_docs: true
          }, (err, body) => {
            if (err) {
              return callback(err);
            } else if (body.rows && body.rows.length > 0) {
              return callback(null, body.rows[0].doc.registration);
            }
            return callback(err);
          });
        },

        // Grab info about the user
        function (registration, callback) {
          console.log("Looking up user info for user", command.user_id);
          usersInfo(registration.bot.bot_access_token, command.user_id, (err, user) => callback(err, registration, user));
        },

        // Reply to the message (handle the command and reply to the user with the weather information)

      ],

      (err, response) => {
        if (err) {
          console.log("Error", err);
          reject({
            body: err
          });
        } else {
          resolve({
            body: response
          });
        }
      }
    );
  }));
}
