# Lab 03 - Option 2 - Watson Assistant

## Objective

Enhance the IBM function to call the Watson Assistant API to have a conversation in Slack.

## Architecture

The following shows the architecture at the end of this Lab.

![](../xdocs/Architecture-Lab01-Step04.png)

Note: Diagrams are created using https://www.draw.io/

## Steps

1. cd to the _solution_ directory

1. Copy the `template.parameters.json` found in the root directory to the _solution_ directory. For example
   ```
   cp ../template.parameters.json parameters.json
   ```
1. Ensure the following settings are still correctly set (you will have to copy these settings from your previous lab).

```javascript
"cloudantUrl": "YOUR_CLOUDANT_URL",
"cloudantDb": "registrations",
"slackClientId": "YOUR_SLACK_CLIENT_ID",
"slackClientSecret": "YOUR_SLACK_CLIENT_SECRET",
"slackVerificationToken": "YOUR_SLACK_VERIFICATION_TOKEN"
```

1. But leave the following section of the `parameters.json` as found to have the connection to the Watson Assistant parameters

   ```javascript
   "CONVERSATION_PASSWORD": "UgJVgytgCZlP",
   "CONVERSATION_USERNAME": "e4fee5c9-adf3-4388-a006-d96271930a95",
   "WORKSPACE_ID": "c7b1d638-721b-42a8-a509-6c779e9f68f4",
   "CONVERSATION_URL": "https://gateway.watsonplatform.net/assistant/api",
   "WATSON_COVERSATION_VERSION": "2018-02-16"
   ```

   - **This is a preconfigured Watson Assistant instance that you will connect to and use. This instance will likely be unavailable at later dates. See the instructions on importing a configuration to set up your own instance.**

1. Add the following Watson Assistant funtion to the end of slackapp-event.js

   ```javascript
   const watsonAssistant = (args, message, context, callback) => {
     console.log("start calling watson assistant for " + message);
     var watsonAssistantVersion =
       args.WATSON_COVERSATION_VERSION || "2018-02-16";
     var watson_url = `
      ${args.CONVERSATION_URL}/v1/workspaces/${
       args.WORKSPACE_ID
     }/message?version=${watsonAssistantVersion}`;

     let body;
     if (context) {
       body = JSON.stringify({
         input: {
           text: message
         },
         context,
         alternate_intents: true
       });
     } else {
       body = JSON.stringify({
         input: {
           text: message
         },
         alternate_intents: true
       });
     }
     request(
       {
         method: "POST",
         uri: watson_url,
         headers: {
           Authorization:
             "Basic " +
             new Buffer(
               args.CONVERSATION_USERNAME + ":" + args.CONVERSATION_PASSWORD
             ).toString("base64"),
           "Content-Type": "application/json"
         },
         body
       },
       (error, response, body) => {
         if (error) {
           callback("Unable to connect to Watson Assistant" + error);
           console.log("get error response, error:" + error);
         } else {
           var jsonBody = JSON.parse(body);
           callback(undefined, jsonBody);
         }
       }
     );
   };
   ```

1. Add the Watson Assistant funtion when process the slack message. At line 313 look for postMessage call, use the following code to replace it.

   ```javascript
   watsonAssistant(
     args,
     event.event.text,
     watson_conversion_context,
     (errorMessage, results) => {
       if (errorMessage) {
         console.log(errorMessage);
         callback(errorMessage);
       } else {
         watson_conversion_context = results.context;
         console.log("get results from watson assistant," + results);
         postMessage(
           registration.bot.bot_access_token,
           event.event.channel,
           `Hey ${user.real_name}, ` + results.output.text,
           (err, result) => {
             callback(err);
           }
         );
       }
     }
   );
   ```

1. Deploy the update, for Linux or Mac user, you may need to add the execute permission first

   ```shell
   chmod +x deploy.sh
   ```

1. Uninstall with ./deploy.sh --uninstall (required because we need to re-create the package with the additional parameters.json file)
1. Install with ./deploy.sh --install

1. Go to the channel and type a message and get it replied back out to you:

   Try the following messages:

   ```
     "hi",
     "please turn on music"
     "Jazz"
     "Light on please"
     "find a restaurant for me"
     "Tacos"
     "nearest"
     "tomorrow"
     "7pm"
     "Turn off the light"
     "Music off"
   ```

   ![](../xdocs/slack_watson.jpg)

# Creating the Watson Assistant

We use a predefined Watson Assistant workspace for this workshop, so you do not need to handle the following steps, but it will be needed if you take use of your own Watson Assistant workspace.

1. Log in to IBM Cloud from a browser

1. Find Watson Assistant Service from the catalog and create a free version service.

1. Open the Watson Assistant Service and click on Launch Tool button.

1. After the tool is launched, go the the Workspace tab and click on the import icon as shown below.

   ![](../xdocs/watsonAssistantWorspace.jpg)

1. Browse to the file `solution/car_demo_watsonAssistant_wp.json` and import it.

1. You will have the same Car_Demo workspace imported.

1. Update your `parameters.json` with your own Watson Assistant credentials and workspace id.

## Next Step

You are now ready to continue with one of the following:

- <a href='../lab02-handlingacommand/README.md'>Lab 02 - Handling a Command</a>
- <a href='../lab03-option01-savetocloudant/README.md'>Lab 03 - Option 01 - Save to Cloudant</a>
