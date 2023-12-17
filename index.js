//import color from 'picocolors';
//import * as p from '@clack/prompts';
//import { setTimeout } from 'node:timers/promises';

const color = require('picocolors');
const p = require('@clack/prompts');
const timers = require('node:timers/promises')

const express = require('express');
const njs = require('@nut-tree/nut-js');
const exp = express();

var port;
const useNJS = true;
var screenX, screenY;

var clientX, clientY;
var lastPoint = new njs.Point(0,0);

var serverIP;

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

njs.screen.width().then(function(result) {
  screenX = result * 1.1;
});

njs.screen.height().then(function(result) {
  screenY = result * 1.1;
});

function runApp(){
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
    }
  );

  exp.use('/send/:x/:y',(req, res, next) => {
      res.send(req.params.x + ' ' + req.params.y);
      let coords = project(parseInt(req.params.x), parseInt(req.params.y), parseInt(clientX), parseInt(clientY), screenX, screenY);
      //next();
    }
  )

  exp.use('/dimensions/:w/:h',(req, res, next) => {
    res.send(req.params.w + ' ' + req.params.h);
    clientX = req.params.w;
    clientY = req.params.h;
    //next();
    }
  )

  exp.use('/click',(req, res, next) => {
    res.send(req.params.w + ' ' + req.params.h);
    njs.mouse.click(njs.Button.LEFT);
    //next();
    }
  )

  exp.use('/:v',(req, res, next) => {
    res.sendFile('index.html', {root: __dirname});

    njs.mouse.click(njs.Button.LEFT);

    if(req.params.v == 'd'){
      njs.keyboard.pressKey(njs.Key.Backspace);
      njs.keyboard.releaseKey(njs.Key.Backspace);
      return;
    }

    if(req.params.v == '-'){
      njs.keyboard.pressKey(njs.Key.PageDown);
      njs.keyboard.releaseKey(njs.Key.PageDown);
      return;
    }

    if(req.params.v == '+' || req.params.v == 'n'){
      njs.keyboard.pressKey(njs.Key.PageUp);
      njs.keyboard.releaseKey(njs.Key.PageUp);
      return;
    }

    njs.keyboard.type(req.params.v);
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
}

async function main() {
	console.clear();

	await timers.setTimeout(1000);

	p.intro(`${color.bgRed(color.black(' Mote '))}`);

	const project = await p.group(
		{
			wprompt: () =>
				p.text({
          message: 'Enter the width of your target display',
					placeholder: Math.round(screenX).toString(),
          defaultValue: Math.round(screenX).toString(),
					validate: (value) => {
            if (Number.isInteger(value)) return 'Please enter an integer value.';
					},
				}),
        hprompt: () =>
				p.text({
          message: 'Enter the height of your target display',
					placeholder: Math.round(screenY).toString(),
          defaultValue: Math.round(screenY).toString(),
					validate: (value) => {
            if (Number.isInteger(value)) return 'Please enter an integer value.';
					},
				}),
			port: () =>
				p.text({
					message: 'Enter a port between 3000 and 8000',
          placeholder: '3000',
          defaultValue: 3000,
					validate: (value) => {
						if (Number.isInteger(value)) return 'Please enter a valid port between 3000 and 8000.';
						if (value && (value < 3000 || value > 8000)) return 'Please enter a port between 3000 and 8000';
					},
				}),
      }

    );

    port = project.port;
    screenX = project.wprompt * 1.1;
    screenY = project.hprompt * 1.1;

	if (project.install) {
		const s = p.spinner();
		s.start('Installing via pnpm');
		await timers.setTimeout(2500);
		s.stop('Installed via pnpm');
	}

	let nextSteps = `Dimensions: ${color.green(Math.round(screenX) + 'x' + Math.round(screenY))}         \nPort: ${color.green(project.port)}`;

	p.note(nextSteps, 'Overview');

  runApp();

	p.outro(`Now listening at ${serverIP}:${port}`);
}

main().catch(console.error);
