# Fremote 📺
Open-source Node.js CLI application used to convert instances of Safari and Chrome into wireless remote controls for a host device. This application was created so that I can control my 32" monitor from my bed (about 6ft away), like a TV.

## Composition 🔎
The application is comprised of two key components: index.html and index.js. 
Index.html is a barebones HTML5 document with a circle that follows the cursor/touch location (for IOS) that is hosted on a server created by Index.js. It includes scripts that send XTTP requests to the server, containing client cursor/touch x,y and click events.
Index.js uses the Node.js Express library to manage /get and /use requests. XTTPS is interpretted through Express /use and is parsed to the Nut.js automation library.

Nut.js is used to move the cursor on the server machine to match the client cursor. As well as clicking and scrolling.

When Index.js receives an endpoint it doesn't recognise, the endpoint is typed as a string on the server device.

The application is primarily a teaching-tool, and should be appreciated as such. It is inefficient, but serves as an intuitive example of WEB3 protocols.

## Installation 📁
There are two recommended methods of installation:
* Cloning this repository.
* Downloading the [.exe file](https://www.dropbox.com/scl/fo/dagkablwswvxfxw7idubl/h?rlkey=bmi7f7ysllwfjvw2y5te8cvx9&dl=0).

### Installation via cloning
To clone this repository from GitHub CLI, enter the following commands into your terminal:
```
gh repo clone JustKindaDoIt/Fremote
npm install
node index.js
```
For convenience, the codebase can then be build as an .exe file with [Nexe](https://github.com/nexe/nexe) via:
`npm run build`

### Installation via download
To install the program via download simply go to this [Dropbox](https://www.dropbox.com/scl/fo/dagkablwswvxfxw7idubl/h?rlkey=bmi7f7ysllwfjvw2y5te8cvx9&dl=0) folder and download the .exe file. This method of installation is currently **windows only**.