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
 * Gets the details of a given team through the Slack Web API
 *
 * @param {String} accessToken - authorization token
 * @param {function} callback - function(err, team)
 * @returns {Object} team - team information
 */
/**
* TODO: Insert teamInfo function from Step 2i
*/    
 
 

 /**
 * Gets the details of a given channel through the Slack Web API
 *
 * @param {String} accessToken - authorization token
 * @param {String} channelId - the id of the channel to retrieve info from
 * @param {function} callback - function(err, channel)
 * @returns {Object} channel - channel information
 */
/**
* TODO: Insert channelInfo function from Step 2ii
*/ 


 /**
 * Gets the details of a given user through the Slack Web API
 *
 * @param {String} accessToken - authorization token
 * @param {String} userId - the id of the user to retrieve info from
 * @param {function} callback - function(err, user)
 * @returns {Object} user - user information
 */
/**
* TODO: Insert usersInfo function from Step 2iii
*/


/**
 * Posts a message to a channel with Slack Web API
 *
 * @param {String} accessToken - authorization token
 * @param {String} channel - the channel to post to
 * @param {String} text - the text to post
 * @param {function} callback - function(err, responsebody)
 * @returns {null} Nothing
 */
function postMessage (accessToken, channel, text, callback) {
  request({
    url: "https://slack.com/api/chat.postMessage",
    method: "POST",
    form: {
      token: accessToken,
      channel,
      text
    }
  }, (error, response, body) => callback(error, body));
}

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
  const ignoreEventSubTypes = ["bot_message", "group_join", "channel_join", "group_leave", "channel_leave"];

  if (_.includes(ignoreEventSubTypes, args.event.subtype, 0)) {
    // Console.log("This is message subtype we can ignore: ", args.event.subtype);
    return {
      statusCode: 200
    };
  }
  // Console.log('Processing new bot event from Slack', args);


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
        },

        // Grab info about the team
/**
* TODO: Insert function from Step 3i
*/
        
        // Grab info about the channel
/**
* TODO: Insert function from Step 3ii
*/

        // Grab info about the user
/**
* TODO: Insert function from Step 3iii
*/

        // Reply to the message
        function (registration, team, channel, user, callback) {
          if (event.event.type === "message" && !event.event.bot_id) {
            console.log(`Processing message from ${user.name}: ${event.event.text}`);
            // Add the additional information to the response
            event.team_name = team.name; // The workspace
            event.event.channel_name = channel.name; // The channel name
            event.event.user_name = user.name; // The user name
            event.event.user_real_name = user.real_name; // User real name

            // This repeats the message from the use back to the channel and should likely not be used
            postMessage(
              registration.bot.bot_access_token, event.event.channel,
/**
* TODO: Update "event.event.user" to "user.real_name" from Step 4
*/
              `Hey ${event.event.user}, you said ${event.event.text}`,
              (err, result) => {
                callback(err);
              }
            );
            return true;
          }
          return callback(null);
        }
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
