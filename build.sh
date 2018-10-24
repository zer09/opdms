#!/bin/sh

# ionic cordova build browser --verbose && cp -r www/* ../opdms-server/public/
# ionic cordova build browser --verbose
ionic build --prod --verbose && rm -rf ../opdms-server/public/* && cp -r www/* ../opdms-server/public/
