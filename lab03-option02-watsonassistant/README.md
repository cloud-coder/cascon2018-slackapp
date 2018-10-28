# Lab 03 - Option 2 - Watson Assistant

## Objective

Enhance the IBM function to call the Watson Assistant API to have a conversation in Slack.

## Architecture

The following shows the architecture at the end of this Lab.

![](../xdocs/Architecture-Lab01-Step04.png)

Note: Diagrams are created using https://www.draw.io/

## Steps

1. Copy the **template.parameters.json** file to **solution/parameters.json**
2. cd to the *solution* directory
3. Copy the following parameters settings from lab01-step01-basicevent

   ```javascript
   "cloudantUrl": "YOUR_CLOUDANT_URL",
   "cloudantDb": "registrations",
   "slackClientId": "YOUR_SLACK_CLIENT_ID",
   "slackClientSecret": "YOUR_SLACK_CLIENT_SECRET",
   "slackVerificationToken": "YOUR_SLACK_VERIFICATION_TOKEN"
   ```

4. Deploy the update

   For linux or Mac user, you may need to add the execute permission first

   ```
   chmod +x deploy.sh
   ```

   1. Uninstall with ./deploy.sh --uninstall (required because we need to re-create the package with the additional parameters.json file)
   2. Install with ./deploy.sh --install

5. Go to the channel and type a message and get it replied back out to you:

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
