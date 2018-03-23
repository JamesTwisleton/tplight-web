const TPLSmartDevice = require('tplink-lightbulb');
var convert = require('color-convert');
const lounge = '192.168.1.6'
const light = new TPLSmartDevice(lounge)

/*Turns lightOn*/
function change_color(color, transition=0) {
    var opt = {}
    var colors = convert.hex.hsl(color)
    opt.hue = colors[0]
    opt.saturation = colors[1]
    opt.brightness = colors[2]
    light.power(true,transition,opt)
    .then(status => {
        console.log(status)
  })
  .catch(err => console.error(err))             
}

function lightOff(bulbIP){

}

change_color('0000FF', 10000)

// // turn first discovered light off
// const scan = lights_module.scan()
//   .on('light', light => {
//     light.power(false)
//       .then(status => {
//         console.log(status)
//         scan.stop()
//       })
//   })

// const scan = lights_module.scan();
// console.log(scan)

// get info about a light
// const light = new TPLSmartDevice('192.168.1.6')
// light.info()
//   .then(info => {
//     console.log(info)
//   })