const express = require('express');
const njs = require('@nut-tree/nut-js');
const exp = express();

const port = 3000;
const useNJS = true;
const screenX = 1366;
const screenY = 768;

var clientX, clientY;
var lastPoint = new njs.Point(0,0);

var serverIP;

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
            serverIP = net.address;
        }
    }
}


exp.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname});
  }
)

exp.listen(port, () => {
    console.log(`Now listening at ${serverIP}:${port}`);    
  }
);

exp.use('/send/:x/:y',(req, res, next) => {
    res.send(req.params.x + ' ' + req.params.y);
    let coords = project(parseInt(req.params.x), parseInt(req.params.y), parseInt(clientX), parseInt(clientY), screenX, screenY);
    
    next();
  }
)

exp.use('/dimensions/:w/:h',(req, res, next) => {
  res.send(req.params.w + ' ' + req.params.h);
  console.log(req.params.w + ' ' + req.params.h);
  clientX = req.params.w;
  clientY = req.params.h;
  next();
  }
)

exp.use('/click',(req, res, next) => {
  res.send(req.params.w + ' ' + req.params.h);
  njs.mouse.click(njs.Button.LEFT);
  next();
  }
)

function project(x, y, clientW, clientH, serverW, serverH)
{
  var projectedX, projectedY;
  projectedX = (x/clientW) * serverW;
  projectedY = (y/clientH) * serverH;

  if(useNJS){
    lastPoint = new njs.Point(projectedX, projectedY);

    njs.mouse.setPosition(lastPoint);
  }

  return { projectedX, projectedY };
}

