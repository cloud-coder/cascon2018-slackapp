# Lab 03 - Option 1 - Saving data to cloudant

## Objective

Enhance the IBM function to save the data to a cloudant database in preparation for further processing.

## Architecture

The following shows the architecture at the end of this Lab.

![](../xdocs/Architecture-Final.png)

Note: Diagrams are created using https://www.draw.io/

## Steps

1.  Create the `channeldata` DB in Cloudant

    1. Open the Cloudant service dashboard and create a new database named **channeldata**

    1. Select the database

    1. Go to **Permissions**, and select **Generate API Key**

    ![](../xdocs/cloudant-generate-api-key.png)

    1. Take note of the Key and the Password for use in the parameters.json file

    1. Give permissions to the generated API key: \_reader, \_writer .

    ![](../xdocs/cloudant-permissions.png)

1.  Update the **parameters.json**

    - May want to copy the **parameters.json** configurations (previously prepared from lab0) to the same directory as your deploy.sh

      ```
      cp ../../lab00-preparation/parameters.json .
      ```

    Update it to add the following lines

    ```json
    "channelDataUrl" : "https://<key>:<password>@<yourdatabase>-bluemix.cloudant.com",
    "channelDataDb" : "channeldata"
    ```

    For example:

    ```json
    "channelDataUrl" : "https://chfulnighttowithcleare:a80c04191e3d749def1e9e10ec1222096b43fdd1@cf5f094e-16ac-4a99-acb8-79cfda652911-bluemix.cloudant.com",
    "channelDataDb" : "channeldata"
    ```

1.  In the `slackapp-event.js` file create the connection to the `channeldata` database

    1.  Create the variables for the connection after line 231

        ```
        const cloudantChannel = require("cloudant")({
          url: args.channelDataUrl});
        const channelData = cloudantChannel.use(args.channelDataDb);
        ```

    1.  Add a function that will insert the data in the channeldata database at the end of async.waterfall list.
        ```javascript
        // Create DB entry
        function (callback) {
        // Console.log("Creating entry in database");
        channelData.insert(event, (err, data) => {
            console.log("Channel Data Insert Error:", err);
            console.log("Channel Data Insert Data:", data);
            callback(err, data);
        });
        }
        ```

1)  Deploy the update

    For linux or Mac user, you may need to add the execute permission first

    ```
    chmod +x deploy.sh
    ```

    1. Uninstall with `./deploy.sh --uninstall` (required because we need to re-create the package with the additional parameters.json file)
    1. Install with `./deploy.sh --install`

1)  Go to the channel and type a message and get it replied back out to you
1)  Open the Cloudant console and check that the Cloudant database has the message information in it
    1. Click on the _Table_ tab and you can view the _datetime_ column to track the date and time of the messages

## Next Step

You are now ready to continue with one of the following:

- <a href='../lab02-handlingacommand/README.md'>Lab 02 - Handling a Command</a>
- <a href='../lab03-option02-watsonassistant/README.md'>Lab 03 - Option 02 - Watson Assistant</a>
