# tplight-web
## a web interface for controlling tplink lightbulbs.

###
Installation and deployment

`npm install` to install.

`sudo node server.js` to deploy a server on localhost with ability to control [tplink-lightbulb](https://github.com/konsumer/tplink-lightbulb)s.

### Issues to resolve

- [x] Pattern choosing
- [ ] concurrency broken as switches don't update across clients
- [ ] cycling off and fade off sometimes don't work
- [ ] color picker disabled - infrastructure exists to change bulb color, but need to adapt
color picking and setting code to interface with server stored patterns.
 