const io = require("io");

const BG_COLOUR = "#231f20";
const SNAKE_COLOUR = "#c2c2c2";
const FOOD_COLOUR = "#e66916";
const socket = io("https://evening-hollows-88641.herokuapp.com/");
socket.on("init", handleInit);
socket.on("gameState", handleGamestate);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGameCode);
socket.on("unknownGame", handleUnknownGame);
socket.on("tooManyPlayers", handleTooManyPlayers);
const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");

newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);
function newGame() {
	socket.emit("newGame");
	init();
}
function joinGame() {
	const code = gameCodeInput.value;
	socket.emit("joinGame", code);
	init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

function init() {
	initialScreen.style.display = "none";
	gameScreen.style.display = "block";
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = canvas.height = 600;
	ctx.fillStyle = BG_COLOUR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	document.addEventListener("keydown", keydown);
	gameActive = true;
}

function keydown(e) {
	socket.emit("keydown", e.keyCode);
}

function paintGame(state) {
	ctx.fillStyle = BG_COLOUR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	const food = state.food;
	const gridsize = state.gridsize;
	const size = canvas.width / gridsize;
	ctx.fillStyle = FOOD_COLOUR;
	ctx.fillRect(food.x * size, food.y * size, size, size);
	paintPlayer(state.players[0], size, SNAKE_COLOUR);
	paintPlayer(state.players[1], size, "#FF0000");
}
function paintPlayer(playerState, size, colour) {
	const snake = playerState.snake;
	for (let cell of snake) {
		ctx.fillStyle = colour;
		ctx.fillRect(cell.x * size, cell.y * size, size, size);
	}
}

function handleInit(number) {
	playerNumber = number;
}
function handleGamestate(gameState) {
	if (!gameActive) {
		return;
	}
	gameState = JSON.parse(gameState);
	requestAnimationFrame(() => paintGame(gameState));
}
function handleGameOver(data) {
	if (!gameActive) {
		return;
	}
	data = JSON.parse(data);
	if (data.winner === playerNumber) {
		alert("You Win!");
	} else {
		alert("You loose!");
	}
	gameActive = false;
}
function handleGameCode(gameCode) {
	gameCodeDisplay.innerText = gameCode;
}
function handleUnknownGame() {
	reset();
	alert("Unknown game code");
}
function handleTooManyPlayers() {
	reset();
	alert("this game is already in progres");
}
function reset() {
	playerNumber = null;
	gameCodeInput.value = "";
	gameCodeDisplay.innerText = "";
	initialScreen.style.display = "block";
	gameScreen.style.display = "none";
}
