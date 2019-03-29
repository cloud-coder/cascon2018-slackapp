# Lab 00 - Preparation

## Objective

The objective of this lab is to:
 - Help you get started with creating a Slack App.
 - Provide some information about the structure and content of the files used in this lab.
 - Create the IBM Cloud Cloudant service.
 - Create and configure the environment parameters configuration file.

### Architecture Diagram

The following shows the architecture of the eventual end product for Lab 01.

![](../xdocs/Architecture-Final.png)


## Pre-requisites

**Make sure to review the <a href='../Pre-requisites.md'>Pre-Requistes documented here</a>**

In order to work on the lab we need to make sure that we have all the following information:
- IBM Cloud username and password
- Slack Workspace name, username and password

## References

Slack API: https://api.slack.com/

URL verification: https://api.slack.com/events/url_verification

Draw.io: https://www.draw.io/

## Creating the Slack app

In order to implement some code, we need to create the application on the Slack site.

* Log in to *yourworkspace.slack.com*
* Go to https://api.slack.com 
* Click on the **Your Apps** link at the top right
* Click on the **Create an App** button
* Fill in the form *Create a Slack App* 
    * Give your application a name, for example "Super Service"
    * Select your workspace from the *Development Slack Workspace* dropdown
    * Review and accept the *Terms of Service*
    * Click **Create App**
* On the left, you should be on the *Basic Information* link, Scroll to the **App Credentials** section
* Take note of the *Client ID*, *Client Secret*, *Signing Secret* and *Verification Token*


## Log in to IBM Cloud

### Non-IBMer
Open up a terminal. Type the following to login to IBM Cloud.

```shell
ibmcloud login
ibmcloud target -o <ibm cloud user> -s dev
```
Note: 
 - If you are logging in with a federated IBMid you will be prompted to generate a one-time passcode to login.
 - The Region and End-Point of your organization for your account.

### IBMer
Open up a terminal. Type the following to login to IBM Cloud.

The first command will ask you to open a web page where you will login with IBMId and copy a code back onto the prompt. 
You _may_ be prompted to select from a list of accounts if you have multiple accounts configured. 
```shell
ibmcloud login --sso
```

The second command will interactively log you in to your cloud foundry org and space.
```shell
ibmcloud target --cf
```


## Getting ready for the rest of the lab

The following will walk you through some of the details of the files provided to you.

* Look at the file/folder structure
    * The `actions` directory contains 2 files
        * slackapp-register.js
        * slackapp-event.js
    * The root directory contains: 
        * `deploy.sh` script which will be used for deployments
        * `template.parameters.json` which is a template for the `parameters.json` file we will need to create


* The `slackapp-register.js` file is a cloud function action that contains code required for the registration of the bot
    * Performs the OAUTH authentication for the bot
    * Saves the registration information in the Cloudant `registration` database
        * Looks for existing registration for this bot for the team in question
        * Deletes the existing registration for the team
        * Create a new registration record for the team

* The `slackapp-event.js` is a cloud function action that contains code that will handle the event coming from slack. The starting point code does the following:
    * Handles the URL verification from Slack
    * Sets ups the default `async.waterfal` structure that will be used to handle the event
    * Connects to the `registration` database in Cloudant to get the bot registration information


## Create the IBM Cloud Cloudant service 

1. Open the IBM Cloudant console -> https://console.bluemix.net/catalog/services/cloudant
      - You may need to first select  **Lite (free) plan**

1. Create a Cloudant NoSQL DB service instance named **cloudant-for-slackapp**
      - Select an *Available Authentication Method* from the drop down (eg. *Use both legacy credentials and IAM*) and click **create**

1. On Cloudant service page, click **Launch Cloudant Dashboard** to open the Cloudant service dashboard and create a new database named **registrations**

1. Select the database

1. Create a new document.

1. Replace the default JSON with the content of the file [cloudant-designs.json](cloudant-designs.json)


   ![](../xdocs/cloudant-adddesigndoc.png)

1. Go to **Permissions**, and select **Generate API Key**

   ![](../xdocs/cloudant-generate-api-key.png)

   1. take note of the Key and the Password for use in the parameters.json file

   1. Give permissions to the generated API key: _reader, _writer 

   ![](../xdocs/cloudant-permissions.png)

## Create the parameters.json file

Create a `parameters.json` file from the template provided. This file will contain the information required by the application for
connecting to the Cloudant databases as well as the Slack API connectivity.

### Configuring the parameters.json file <a name="configure_parameters_json_file"></a>

In development a user can use the following way to setup the environment until they start using the Devops delivery toolchain. The parameters.json file is never read by the code. In the deployment scripts, it is passed as a parameter to the package creation which sets up environment variables available to the actions in the functions.

1. Copy the **template.parameters.json** file to **parameters.json**

1. Use the Cloudant API Key / Password for **registrations** to configure the property **cloudantUrl**

    `"cloudantUrl" : "https://key:password@hostname.cloudant.com"`

1. Set the values for **slackClientId**, **slackClientSecret**, **slackVerificationToken** - these are the App Credentials we've seen in the previous steps.

1. The resulting parameters.json file should look something like:

```
{
    "cloudantUrl" : "https://standenswerceizentle:db04a6c10ec89a1ec4bab85bdcb7b86ce1370b2e@13056fe6-e3e5-43f6-9d1e-1e434234b6b5-bluemix.cloudant.com",
    "cloudantDb" : "registrations",
    "slackClientId" : "changeme",
    "slackClientSecret" : "changeme",
    "slackVerificationToken" : "changeme"
}
```

### Note on the use of Windows and local environment files <a name="windows_en_files"></a>

There appears to be an issue with the use of the Windows IBM Cloud and openwhisk tools when using the `-param` parameter for the commands in the CMD file. Although parameters should initially be considered as strings, the `slackClientId` is parsed and converted to a number and then rounded by the tools which means that a value such as `585673529829.387652325025` gets turned into `585673529829.3877` which is obviously an incorrect slackId.

The use of a parameters.json file prevents this issue but obviously may not be a long term solution.

## Next Step

You are now ready to start <a href='../lab01-step01-basicevent/README.md'>Lab 01 - Step 01 - Basic Event</a>
