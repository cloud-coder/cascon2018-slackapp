## Requirements <a name="requirements"></a>

The following are required for a successful workshop for the attendee.

* Knowledge of javascript programming

* **IBM Cloud account**. [Sign up](https://console.ng.bluemix.net/) for an IBM Cloud, or use an existing account.
    - Go to https://console.bluemix.net/
    - Click "**Create a free account**"
    - Fill in the form with the required data
    - Accept the **Terms and Conditions**
    - Click "**Create Account**"
    - Complete the registration by checking your email and clicking the **Confirm Account** button
    - On first login review the *account privacy* information and click **Proceed**
    - You should now be looking at your IBM Cloud Dashboard


Creating your own Slack team is recommended if you want to play with the integration without impacting others.

* **Slack account**
    - Go to https://slack.com/
    - Enter your email and click **Get started**
    - Select **Create a new workspace** (We need to be administrator on the workspace)
    - Check your e-mail for the confirmation code and enter it in the slack page
    - Complete the registration (name, password, company name, url) and click **Create Workspace**
    - Review and accept the terms and then click **I Agree**
    - Click **Skip For Now** on the Send Invitations page

## Installation of the environment on Linux (Ubuntu)
In this sample you will need to work with Git and the IBM Cloud command line developer tools. Next you will install these utilities that needed to setup your development environment. The steps for doing so in Linux are below:

```shell
sudo apt-get update
sudo apt-get upgrade
curl -sL https://ibm.biz/idt-installer | bash
sudo apt-get install git
```

See the links below for setting up your environment on a Mac or Windows 10 (PowerShell) machine:
Instructions for IBM Cloud can be found here: https://clis.ng.bluemix.net/

Instructions for Git can be found here: https://gist.github.com/derhuerst/1b15ff4652a867391f03


## Verify your development environment

```
user@linux:~# ibmcloud plugin list
Listing installed plug-ins...

Plugin Name                            Version
cloud-functions/wsk/functions/fn       1.0.23
container-registry                     0.1.339
container-service/kubernetes-service   0.1.593
dev                                    2.1.4
sdk-gen                                0.1.12

user@linux:~# git --version
git version 2.19.0
```

In the instructions above, the important line to confirm is that the plugins contain the following:
```
cloud-functions/wsk/functions/fn       1.0.23
```

If that plugin is not present, please run the following command:

```shell
ibmcloud plugin install cloud-functions
```

## Clone the workshop repository

You can now clone the repository to your local machine

```
git clone https://github.com/cloud-coder/cascon2018-slackapp.git
```
