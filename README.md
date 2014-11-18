# Arnie Node.js

Simple node.js application used to interface with a vending machine. This code uses the Upstate Networks PC2MDB to treat MDB (the vending machine protocol) as a regular serial stream. The vending machine used is a BevMax4.

Based on Anthony Stellato's CPP code, https://github.com/astellato/ofxVending/blob/master/ofxVending.cpp

## Team
* Chris Heinen (cheinen@arn.com)
* Alicia Foor (afoor@arn.com)

## Requirements
* Node.js
* ChromeKiosk
* NPM

## Reference Manuals

* [BevMax4 Manual](https://www.azdes.gov/InternetFiles/RSAVendingManuals/pdf/bevmax_4_5800_operators_manual.pdf)
* [PC2MDB Manual](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0CCQQFjAB&url=http%3A%2F%2Fwww.upstatenetworks.com%2FPC2MDB%25202.06.pdf&ei=zntiVMTzBtWOsQTiwIH4BQ&usg=AFQjCNFRTs-Xoj7P9dX0MdlXGnSIFLRoOg&sig2=p43bksXuZwguvxwFtkdTkQ&bvm=bv.79189006,d.cWc)
* [MDB 3.0 Manual](http://www.vending.org/technical/MDB_3.0.pdf)

## Node server on startup.

com.user.loginscript.plist is a launch agent that tells OSX to run startup.sh. A copy of this plist goes in /Users/venderson/Library/LaunchAgents

**To add this plist as a launch agent, open terminal and run**

`launchctl load /Users/venderson/Library/LaunchAgents/com.user.loginscript.plist`

Now, when OSX starts, this script will run startup.sh which will run arnieserver.js as a node server. The log for the node server will be nodelog.txt.


### Chrome full screen at startup.


index.html is set as the home page in Chrome. Whenever Chrome starts, this page will be displayed.

To get Chrome to start up in full screen mode, run "ChromeKiosk". ChromeKiosk has been added to the launch items in *System Preferences -> Users & Groups -> Login Items*. This will make it start at login.

## Restarting the node server
1. Open the terminal running node
2. Enter *ctrl-c* to stop the node server
3. Type `node server` and hit enter.

## Notes
* The most common issue that prevents a vending session from happening is that the reader becomes `READER DISABLED`. As of now, the only fix is to restart the node server, hard restart the vending machine and then refresh the page to setup/reset.
* The vending machine keeps track of stock only after a user selects an empty slot and the VMC returns `13 03`. Future sessions will remember the empty slot and silently prevent it from being selected again. 