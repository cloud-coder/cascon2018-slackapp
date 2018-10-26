#!/bin/bash
#
# Copyright 2016 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#  https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# load configuration variables
PACKAGE_NAME=slackapp

function usage() {
  echo "Usage: $0 [--install,--uninstall,--update]"
}



function install() {
  echo "Creating $PACKAGE_NAME package"
  ibmcloud wsk package create $PACKAGE_NAME --param-file parameters.json

#  echo "Adding app registration command"
  ibmcloud wsk action create $PACKAGE_NAME/slackapp-register actions/slackapp-register.js\
    --web true --annotation final true --kind nodejs:8

  echo "Adding app event processing"
  ibmcloud wsk action create $PACKAGE_NAME/slackapp-event actions/slackapp-event.js\
    --web true --annotation final true --kind nodejs:8

#  echo "Adding app command processing"
#  ibmcloud wsk action create $PACKAGE_NAME/slackapp-command actions/slackapp-command.js\
#    --web true --annotation final true --kind nodejs:8

  showurls
}

function uninstall() {
  echo "Removing actions..."
  ibmcloud wsk action delete $PACKAGE_NAME/slackapp-register
#  ibmcloud wsk action delete $PACKAGE_NAME/slackapp-command
  ibmcloud wsk action delete $PACKAGE_NAME/slackapp-event
  ibmcloud wsk package delete $PACKAGE_NAME

  echo "Done"
  ibmcloud wsk list
}

function showurls() {
  OPENWHISK_API_HOST=$(ibmcloud wsk property get --apihost | awk '{print $4}')
  echo OAuth URL:
  echo https://$OPENWHISK_API_HOST/api/v1/web$(ibmcloud wsk list | grep 'slackapp/slackapp-register' | awk '{print $1}')
#  echo Command URL:
#  echo https://$OPENWHISK_API_HOST/api/v1/web$(ibmcloud wsk list | grep 'slackapp/slackapp-command' | awk '{print $1}')
  echo Event Subscription Request URL:
  echo https://$OPENWHISK_API_HOST/api/v1/web$(ibmcloud wsk list | grep 'slackapp/slackapp-event' | awk '{print $1}')
}

function update() {
  ibmcloud wsk action update $PACKAGE_NAME/slackapp-register actions/slackapp-register.js --kind nodejs:8
  ibmcloud wsk action update $PACKAGE_NAME/slackapp-event    actions/slackapp-event.js --kind nodejs:8
#  ibmcloud wsk action update $PACKAGE_NAME/slackapp-command  actions/slackapp-command.js --kind nodejs:8
}

case "$1" in
"--install" )
install
;;
"--uninstall" )
uninstall
;;
"--update" )
update
;;
"--urls" )
showurls
;;
* )
usage
;;
esac
