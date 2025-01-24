// GET EXPRESS MODULE
const express = require('express');
const app = express();
app.use(express.json());
// GET READER MODULE
const reader = require('xlsx');
// GET PATH
const path = require('path');
const publicPath = path.join(__dirname, 'public');
const viewsPath = path.join(__dirname, 'views');

app.set('view engine', 'ejs');

var players = []

//////////////////////////////////////////////////////////////////////////
/// APP //////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

// app.use(express.static(publicPath));
app.use(express.static(path.join(__dirname, './public')))

// HOMEPAGE //////////////////////////////////////////////////////////////
app.get('/', (req, res) => {    
    res.sendFile(publicPath);
});

// SEARCH ////////////////////////////////////////////////////////////////
app.get('/search', (req, res) => {
    res.render(viewsPath + '/search');
});

// PLAYER LIST ///////////////////////////////////////////////////////////
app.get('/players', (req, res) => {
    const playerList = [];
    players.forEach((player) => {
        playerList.push(player);
    });
    const searchTerm = "none";
    const searchType = 0;
    res.render(viewsPath + '/playerList', { playerList, searchTerm, searchType });
});

// PLAYER LIST: SEARCH FOR PLAYERS
app.get('/players/name/:chars', (req, res) => {
    const playerList = [];
    players.forEach((player) => {
        if (req.params.chars.includes(player.givenName) || req.params.chars.includes(player.surname)) {
            playerList.push(player);
        }
    });
    const searchTerm = req.params.chars;
    const searchType = 1;
    res.render(viewsPath + '/playerList', { playerList, searchTerm, searchType });
});

// PLAYER LIST: SEARCH FOR PLAYERS
app.get('/players/team/:chars', (req, res) => {
    const playerList = [];
    players.forEach((player) => {
        if (req.params.chars.includes(player.team)) {
            playerList.push(player);
        }
    });
    const searchTerm = req.params.chars;
    const searchType = 2;
    res.render(viewsPath + '/playerList', { playerList, searchTerm, searchType });
});

// PLAYER PROFILE ////////////////////////////////////////////////////////
app.get('/player/:id', (req, res) => {
    const player = players.find(c => c.id === parseInt(req.params.id));
    if (!player) { return res.status(404).send(`Player Not Found...`); }
    res.render(viewsPath + '/profile', {player} );
});

// REGISTER //////////////////////////////////////////////////////////////
app.get('/register', (req, res) => {
    res.render(viewsPath + '/register', { players });
});

app.post('/register', (req, res) => {
    players.push(req.body);
});

//////////////////////////////////////////////////////////////////////////
/// FUNCTIONS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function readFile() {
    const file = reader.readFile(__dirname + '/player_database.xlsx')
    
    for(let i = 0; i < 1; i++)
    {
        const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        temp.forEach((res) => {
            players.push(res);
        })
    }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

readFile();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});