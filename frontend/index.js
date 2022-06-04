import { io } from "socket.io-client";

const BG_COLOUR = "#231f20";
const SNAKE_COLOUR = "#c2c2c2";
const FOOD_COLOUR = "#e66916";
const socket = io("http://localhost:3000");
socket.on("init", handleInit);
socket.on("gameState", handleGamestate);
socket.on("gameOver", handleGameOver);

const gameScreen = document.getElementById("gameScreen");
let canvas, ctx;

function init() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = canvas.height = 600;
	ctx.fillStyle = BG_COLOUR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	document.addEventListener("keydown", keydown);
}

function keydown(e) {
	socket.emit("keydown", e.keyCode);
}

init();

function paintGame(state) {
	ctx.fillStyle = BG_COLOUR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	const food = state.food;
	const gridsize = state.gridsize;
	const size = canvas.width / gridsize;
	ctx.fillStyle = FOOD_COLOUR;
	ctx.fillRect(food.x * size, food.y * size, size, size);
	paintPlayer(state.player, size, SNAKE_COLOUR);
}
function paintPlayer(playerState, size, colour) {
	const snake = playerState.snake;
	for (let cell of snake) {
		ctx.fillStyle = SNAKE_COLOUR;
		ctx.fillRect(cell.x * size, cell.y * size, size, size);
	}
}

function handleInit(msg) {
	console.log(msg);
}
function handleGamestate(gameState) {
	gameState = JSON.parse(gameState);
	requestAnimationFrame(() => paintGame(gameState));
}
function handleGameOver() {
	alert("you loose!");
}