/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(1);
	
	class Game {
	  constructor(board) {
	    this.isPaused = true;
	    this.fps = 45;
	    this.board = board;
	
	    this.togglePause = this.togglePause.bind(this);
	    this.runAnimation = this.runAnimation.bind(this);
	    this.getNextGeneration = this.getNextGeneration.bind(this);
	    this.adjustFps = this.adjustFps.bind(this);
	    this.start = this.start.bind(this);
	
	    this.clearGrid = this.clearGrid.bind(this);
	  }
	
	  togglePause(e) {
	    if (e.keyCode === 32 || e.type === 'click') {
	      e.preventDefault();
	      $('.play').toggleClass('block-button');
	      $('.pause').toggleClass('block-button');
	      this.isPaused = !this.isPaused;
	    }
	  }
	
	  runAnimation() {
	    if (!this.isPaused) {
	      this.board.drawMirrorGrid();
	      this.board.updateGrid();
	    }
	    setTimeout(() => (requestAnimationFrame(this.runAnimation)), 1000/this.fps);
	  }
	
	  start() {
	    this.runAnimation();
	  }
	
	  getNextGeneration(e) {
	    if (e.type === "click" || e.keyCode === 78) {
	      if (!this.isPaused) {
	        this.isPaused = true;
	        $('.play').toggleClass('block-button');
	        $('.pause').toggleClass('block-button');
	      }
	      this.board.updateGrid();
	      this.board.drawMirrorGrid();
	    }
	  }
	
	  adjustFps(e) {
	    this.fps = e.currentTarget.value;
	    $('#slider-max').html(`${this.fps} fps`);
	  }
	
	  toggleGrid() {
	    $('#grid').toggleClass("block-grid");
	    $('#toggle-grid').toggleClass("pressed");
	  }
	
	  clearGrid() {
	    this.board.setupInitialGrid();
	    this.board.drawMirrorGrid();
	  }
	}
	
	
	document.addEventListener("DOMContentLoaded", function() {
	
	  let game = new Game(new Board());
	
	    $("#easel").click(function(e) {
	
	      let cellWidth = game.board.settings.cellWidth;
	      let parentOffset = $(this).offset();
	      let relX = Math.floor(((e.pageX - parentOffset.left) / cellWidth));
	      let relY = Math.floor(((e.pageY - parentOffset.top) / cellWidth));
	      let squareObj = game.board.squares[[relX, relY]];
	
	      squareObj.toggleAliveStatus();
	      game.board.toggleGridAliveStatus(relX, relY);
	      game.board.drawMirrorGrid();
	    });
	
	    $('.play').on('click', game.togglePause);
	    $('.pause').on('click', game.togglePause);
	    $('body').on('keyup', game.togglePause);
	
	    $('.next').on('click', game.getNextGeneration);
	    $('body').on('keyup', game.getNextGeneration);
	
	    $('#random').on('click', game.board.setupRandomGrid);
	    $('#toggle-grid').on('click', game.toggleGrid);
	    $('#clear-grid').on('click', game.clearGrid);
	    $('#slider').change('change', game.adjustFps);
	
	    $(".configs-dropdown").change(function(e) {
	      e.preventDefault();
	      let pattern = e.currentTarget.value;
	      switch (pattern) {
	        case 'glider':
	          game.board.setupGliders();
	          break;
	        case 'benchmark':
	          game.board.setupBenchmark();
	          break;
	        case 'beacon-maker':
	          game.board.setupBeaconMaker();
	          break;
	        case 'gosper-gun':
	          game.board.setupGosperGun();
	          break;
	        case 'growth-gun':
	          game.board.setupInfiniteGrowthGun();
	          break;
	        case 'superstring':
	        case 'lightwire':
	        case 'electricFence':
	        case 'spaceRake':
	          game.board.setupCellsHorizontal(pattern);
	          break;
	        case 'piOrbital':
	          game.board.setupCellsVertical(pattern);
	          break;
	        case 'boatStretcher':
	        case 'wickerStretcher':
	          game.board.setupCellsHorizontalReverse(pattern);
	          break;
	        case 'pinwheel':
	        case 'kokGalaxy':
	        case 'quasar':
	        case 'hectic':
	        case 'pulShuttle':
	        case 'gliderDuplicator':
	        case 'spaceshipBouncer':
	        case 'trafficCircle':
	        case 'spacefiller':
	          game.board.setupCellsCenter(pattern);
	          break;
	      }
	    });
	    game.start();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Cell = __webpack_require__(2);
	const configs = __webpack_require__(3);
	
	class Board {
	  constructor() {
	    this.squares = {};
	
	    this.settings = {
	      canvasWidth: 1000,
	      canvasHeight: 440,
	      colNum: 140,
	      rowNum: 60,
	      cellWidth: 1200/160,
	    };
	
	    $("#grid, #easel, .canvas-container").attr({
	      "height": `${this.settings.canvasHeight}`,
	      "width": `${this.settings.canvasWidth}`,
	    });
	
	    this.setupInitialGrid = this.setupInitialGrid.bind(this);
	    this.setupInitialGrid();
	    this.drawGridBackground = this.drawGridBackground.bind(this);
	    this.drawGridBackground();
	
	    this.parseTextIntoConfig = this.parseTextIntoConfig.bind(this);
	    this.setupRandomGrid = this.setupRandomGrid.bind(this);
	    this.setupGliders = this.setupGliders.bind(this);
	    this.setupBenchmark = this.setupBenchmark.bind(this);
	    this.setupBeaconMaker = this.setupBeaconMaker.bind(this);
	    this.setupGosperGun = this.setupGosperGun.bind(this);
	    this.setupInfiniteGrowthGun = this.setupInfiniteGrowthGun.bind(this);
	    this.setupCellsHorizontal = this.setupCellsHorizontal.bind(this);
	    this.setupCellsHorizontalReverse = this.setupCellsHorizontalReverse.bind(this);
	    this.setupCellsVertical = this.setupCellsVertical.bind(this);
	    this.setupCellsCenter = this.setupCellsCenter.bind(this);
	
	    this.getNeighborCount = this.getNeighborCount.bind(this);
	    this.updateGrid = this.updateGrid.bind(this);
	    this.drawMirrorGrid = this.drawMirrorGrid.bind(this);
	    this.toggleGridAliveStatus = this.toggleGridAliveStatus.bind(this);
	  }
	
	  drawMirrorGrid() {
	    this.stage = this.stage || new createjs.Stage("easel");
	    this.stage.removeAllChildren();
	    let width = this.settings.cellWidth;
	
	    Object.keys(this.squares).forEach((key) => {
	      let squareObj = this.squares[key];
	      let square = new createjs.Shape();
	
	      if (squareObj.alive === true) {
	        if (squareObj.isColorToggled) {
	          square.graphics.beginFill(squareObj.color);
	        } else {
	          square.graphics.beginFill("#ffffff");
	        }
	        square.graphics.setStrokeStyle(1);
	        square.graphics.drawRect(0, 0, width - 3, width - 3);
	        square.x = squareObj.xPos * width + 1.5;
	        square.y = squareObj.yPos * width + 1.5;
	        this.stage.addChild(square);
	        squareObj.id = square.parent.getChildIndex(square);
	      }
	    });
	
	    this.stage.update();
	  }
	
	  drawGridBackground() {
	    this.background = this.background || new createjs.Stage("grid");
	    this.background.removeAllChildren();
	    let width = this.settings.cellWidth;
	
	    Object.keys(this.squares).forEach((key) => {
	      let square = new createjs.Shape();
	
	      square.graphics.beginStroke("#4d4d4d");
	      square.graphics.setStrokeStyle(0.5);
	      square.graphics.drawRect(0, 0, width, width);
	      square.x = this.squares[key].xPos * width;
	      square.y = this.squares[key].yPos * width;
	
	      this.background.addChild(square);
	    });
	    this.background.update();
	
	  }
	
	  setupInitialGrid() {
	    this.grid = [];
	    for (let col = 0; col < this.settings.colNum; col++) {
	      this.grid[col] = [];
	      for (let row = 0; row < this.settings.rowNum; row++) {
	        let cell = new Cell();
	        cell.xPos = col;
	        cell.yPos = row;
	        cell.width = this.settings.cellWidth;
	        this.squares[[col, row]] = cell;
	        this.grid[col][row] = 0;
	      }
	    }
	    this.mirrorGrid = JSON.parse(JSON.stringify(this.grid));
	  }
	
	  setupGliders() {
	    this.setupInitialGrid();
	
	    for (let col = 10; col < this.grid.length - 40; col += 5) {
	      for (let row = 10; row < 15; row += 5) {
	
	        this.toggleGridAliveStatus((1 + col), (0 + row));
	        this.toggleGridAliveStatus((2 + col), (1 + row));
	        this.toggleGridAliveStatus((0 + col), (2 + row));
	        this.toggleGridAliveStatus((1 + col), (2 + row));
	        this.toggleGridAliveStatus((2 + col), (2 + row));
	
	      }
	    }
	
	    this.drawMirrorGrid();
	  }
	
	  setupBenchmark() {
	    this.setupInitialGrid();
	
	    for (let col = 0; col < this.grid.length; col++) {
	      this.toggleGridAliveStatus((0 + col), (30));
	    }
	    this.drawMirrorGrid();
	  }
	
	  setupRandomGrid() {
	    this.setupInitialGrid();
	
	    for (let col = 0; col < this.grid.length; col++) {
	      for (let row = 0; row < this.grid[col].length; row++) {
	        let bool = Math.random() > 0.8;
	
	        this.grid[col][row] = (bool)? 1 : 0;
	        this.squares[[col, row]].alive = bool;
	      }
	    }
	
	    this.drawMirrorGrid();
	  }
	
	  setupBeaconMaker() {
	    this.setupInitialGrid();
	    this.toggleGridAliveStatus(28, 40);
	    this.toggleGridAliveStatus(29, 40);
	    this.toggleGridAliveStatus(30, 40);
	    this.toggleGridAliveStatus(30, 41);
	    this.toggleGridAliveStatus(30, 42);
	
	    for (let i = 0; i < 29; i++) {
	      this.toggleGridAliveStatus((31 + i), (39 - i));
	    }
	    this.toggleGridAliveStatus(60, 11);
	    this.toggleGridAliveStatus(60, 12);
	
	    this.drawMirrorGrid();
	  }
	
	  setupGosperGun() {
	    this.setupInitialGrid();
	
	    let gun =[
	     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
	     [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	     [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
	     [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	     [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
	     [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	     [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	     [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	   ];
	
	    for (let i = 0; i < gun.length; i++) {
	      for (let j = 0; j < gun[i].length; j++) {
	        if (gun[i][j] === 1) {
	          this.toggleGridAliveStatus((10 + j), (3 + i));
	        }
	      }
	    }
	
	    this.drawMirrorGrid();
	  }
	
	  setupInfiniteGrowthGun() {
	    this.setupInitialGrid();
	
	    let gun = [
	      [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1]
	    ];
	
	    for (let i = 0; i < gun.length; i++) {
	      for (let j = 0; j < gun[i].length; j++) {
	        if (gun[i][j] === 1) {
	          this.toggleGridAliveStatus((60), (10 + j));
	        }
	      }
	    }
	
	    this.drawMirrorGrid();
	  }
	
	  parseTextIntoConfig(string) {
	    let setupArray = string.split("\n").map((line) => {
	      line = line.replace(/\s+/g, '');
	      return line.split("");
	    });
	    return setupArray;
	  }
	
	  setupCellsHorizontal(pattern) {
	    this.setupInitialGrid();
	
	    let setupArray = this.parseTextIntoConfig(configs[pattern]);
	
	    for (let i = 0; i < setupArray.length; i++) {
	      for (let j = 0; j < setupArray[i].length; j++) {
	
	        if (setupArray[i][j] === "O") {
	          this.toggleGridAliveStatus((j), (i + 20));
	        }
	      }
	    }
	
	    this.drawMirrorGrid();
	  }
	
	  setupCellsHorizontalReverse(pattern) {
	    this.setupInitialGrid();
	
	    let setupArray = this.parseTextIntoConfig(configs[pattern]);
	
	    setupArray = setupArray.map((line) => {
	      return line.reverse();
	    });
	
	    for (let i = 0; i < setupArray.length; i++) {
	      for (let j = 0; j < setupArray[i].length; j++) {
	
	        if (setupArray[i][j] === "O") {
	          this.toggleGridAliveStatus((j), (i + 20));
	        }
	      }
	    }
	    this.drawMirrorGrid();
	  }
	
	  setupCellsVertical(pattern) {
	    this.setupInitialGrid();
	
	    let setupArray = this.parseTextIntoConfig(configs[pattern]);
	
	    for (let i = 0; i < setupArray.length; i++) {
	      for (let j = 0; j < setupArray[i].length; j++) {
	
	        if (setupArray[i][j] === "O") {
	          this.toggleGridAliveStatus(i, j);
	        }
	      }
	    }
	    this.drawMirrorGrid();
	  }
	
	  setupCellsCenter(pattern) {
	    this.setupInitialGrid();
	
	    let setupArray = this.parseTextIntoConfig(configs[pattern]);
	
	    for (let i = 0; i < setupArray.length; i++) {
	      for (let j = 0; j < setupArray[i].length; j++) {
	
	        if (setupArray[i][j] === "O") {
	          this.toggleGridAliveStatus((i + 30), (j + 10));
	        }
	      }
	    }
	    this.drawMirrorGrid();
	  }
	
	  getNeighborCount(coordinates) {
	    let liveNeighborCount = 0;
	
	    const DELTAS = [
	      [-1, -1],
	      [-1, 0],
	      [-1, 1],
	      [0, -1],
	      [0, 1],
	      [1, -1],
	      [1, 0],
	      [1, 1]
	    ];
	
	    let col = coordinates[0];
	    let row = coordinates[1];
	
	    DELTAS.forEach((delta) => {
	      let colDirection = delta[0];
	      let rowDirection = delta[1];
	
	      if ((col + colDirection) < 0 || (col + colDirection >= this.grid.length)) { return; }
	      if ((row + rowDirection) < 0 || (row + rowDirection) >= this.grid[col].length) { return; }
	
	      if (this.grid[col + colDirection][row + rowDirection] === 1) {
	        liveNeighborCount += 1;
	        if (liveNeighborCount > 3) { return; }
	      }
	
	    });
	
	    return liveNeighborCount;
	  }
	
	  updateGrid() {
	    let changedCellsCount = 0;
	    Object.keys(this.squares).forEach((key) => {
	      let squareObj = this.squares[key];
	
	      let neighborCount = this.getNeighborCount([squareObj.xPos, squareObj.yPos]);
	      let isLiving = squareObj.alive;
	
	      if ((neighborCount === 2 || neighborCount === 3) && isLiving) {
	        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 1;
	        squareObj.alive = true;
	
	      } else if (neighborCount === 3 && !isLiving) {
	        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 1;
	        squareObj.toggleAliveStatus();
	
	      } else if ((neighborCount < 2 || neighborCount > 3) && isLiving) {
	        this.mirrorGrid[squareObj.xPos][squareObj.yPos] = 0;
	        squareObj.toggleAliveStatus();
	
	      }
	    });
	
	    this.grid = JSON.parse(JSON.stringify(this.mirrorGrid));
	  }
	
	  toggleGridAliveStatus(xPos, yPos) {
	    if (this.grid[xPos][yPos] === 1) {
	      this.grid[xPos][yPos] = 0;
	      this.squares[[xPos, yPos]].alive = false;
	    } else {
	      this.grid[xPos][yPos] = 1;
	      this.squares[[xPos, yPos]].alive = true;
	    }
	  }
	
	}
	
	module.exports = Board;


/***/ },
/* 2 */
/***/ function(module, exports) {

	const COLORS = [
	  "#FF0000",
	  "#FD5F00",
	  "#FFFF00",
	  "#00FF00",
	  "#00FFFF",
	  "#FF00FF"
	];
	
	class Cell {
	
	  constructor() {
	    this.alive = false;
	    this.xPos;
	    this.yPos;
	    this.width;
	    this.color = "white";
	
	    this.toggleAliveStatus = this.toggleAliveStatus.bind(this);
	    this.stepColor = this.stepColor.bind(this);
	  }
	
	
	  toggleAliveStatus() {
	    this.alive = (this.alive === true) ? false : true;
	    if (this.isColorToggled) { this.stepColor(); }
	  }
	
	  stepColor() {
	    if (this.alive) {
	      let newColorIdx = COLORS.indexOf(this.color) + 1;
	      this.color = COLORS[newColorIdx % COLORS.length];
	    }
	
	  }
	}
	
	Cell.prototype.isColorToggled = false;
	
	Cell.prototype.toggleRainbow = function() {
	  $('#toggle-colors').toggleClass('pressed');
	  if (Cell.prototype.isColorToggled === true) {
	    Cell.prototype.isColorToggled = false;
	  } else {
	    Cell.prototype.isColorToggled = true;
	  }
	};
	
	document.addEventListener("DOMContentLoaded", function(){
	  $('#toggle-colors').on('click', Cell.prototype.toggleRainbow);
	});
	
	
	
	module.exports = Cell;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const superstring =
	  ".OO..........................................................\n\
	  O..O...O...O...O...O...O...O...O...O...O...O...O...O...O...O.\n\
	  ....O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O\n\
	  O..O...O...O...O...O...O...O...O...O...O...O...O...O...O...O.\n\
	  .OOO.........................................................\n\
	  ..OO.........................................................\n\
	  ..OO.........................................................\n\
	  ...O.........................................................\n\
	  ...O.........................................................\n\
	  ...O.........................................................\n\
	  ...O.........................................................\n\
	  ...O.........................................................\n\
	  ...O.........................................................\n\
	  ...O.........................................................\n\
	  ..OO.........................................................\n\
	  ..OO.........................................................\n\
	  .OOO.........................................................\n\
	  O..O...O...O...O...O...O...O...O...O...O...O...O...O...O...O.\n\
	  ....O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O.O\n\
	  O..O...O...O...O...O...O...O...O...O...O...O...O...O...O...O.\n\
	  .OO..........................................................";
	
	const spaceRake =
	"...........OO.....OOOO\n\
	.........OO.OO...O...O\n\
	.........OOOO........O\n\
	..........OO.....O..O.\n\
	......................\n\
	........O.............\n\
	.......OO........OO...\n\
	......O.........O..O..\n\
	.......OOOOO....O..O..\n\
	........OOOO...OO.OO..\n\
	...........O....OO....\n\
	......................\n\
	......................\n\
	......................\n\
	..................OOOO\n\
	O..O.............O...O\n\
	....O................O\n\
	O...O............O..O.\n\
	.OOOO.................";
	
	const piOrbital =
	"..............OO....OO....OO...............................\n\
	.............O..O.O....O.O..O..............................\n\
	.............OOO..........OOO..............................\n\
	................OO......OO.................................\n\
	...............O..OOOOOO..O................................\n\
	...............OO........OO................................\n\
	...........................................................\n\
	........O.............................OO..........O........\n\
	.......O...OOO......O.........O.......OO.........O.O.......\n\
	........O.OOOOO..........OOO...O...........................\n\
	............O...O.....O.OOOOO.O..................O.........\n\
	............OO....OOO.....O......................OO........\n\
	............OO....OOO....OO...................OOOOO........\n\
	...................O.....OO...................OO.OO.....OO.\n\
	.................................................O......O.O\n\
	.....................................................OO.O.O\n\
	.....................................................O.O.O.\n\
	.......................................................O...\n\
	...................................OOO.........O.O...O..O..\n\
	.......OO..........................O..O........O..O.....O..\n\
	.......OO..............................O.......O.O..O...O..\n\
	...................................O..O.............O...O..\n\
	...................................OOO..................O..\n\
	.....................................................O..O..\n\
	................................................O......O...\n\
	.............................................OO.OO...O.O.O.\n\
	.............................................OOOOO...OO.O.O\n\
	.........O......................................OO......O.O\n\
	........O.O.....................................O.......OO.\n\
	...........................................................\n\
	.OO.......O.....................................O.O........\n\
	O.O......OO......................................O.........\n\
	O.O.OO...OOOOO.............................................\n\
	.O.O.O...OO.OO.............................................\n\
	...O......O................................................\n\
	..O..O.....................................................\n\
	..O........................................................\n\
	..O...O....................................................\n\
	..O...O..O.O......................................OO.......\n\
	..O.....O..O......................................OO.......\n\
	..O..O...O.O...............................................\n\
	...O.......................................................\n\
	.O.O.O.....................................................\n\
	O.O.OO.....................................................\n\
	O.O......O.................................................\n\
	.OO.....OO.OO...................OO.....O...................\n\
	........OOOOO...................OO....OOO....OO............\n\
	........OO......................O.....OOO....OO............\n\
	.........O..................O.OOOOO.O.....O...O............\n\
	...........................O...OOO..........OOOOO.O........\n\
	.......O.O.........OO.......O.........O......OOO...O.......\n\
	........O..........OO.............................O........\n\
	...........................................................\n\
	................................OO........OO...............\n\
	................................O..OOOOOO..O...............\n\
	.................................OO......OO................\n\
	..............................OOO..........OOO.............\n\
	..............................O..O.O....O.O..O.............\n\
	...............................OO....OO....OO..............";
	
	const quasar =
	"..........OOO...OOO..........\n\
	.............................\n\
	........O....O.O....O........\n\
	........O....O.O....O........\n\
	........O....O.O....O........\n\
	..........OOO...OOO..........\n\
	.............................\n\
	........OOO.......OOO........\n\
	..OOO..O....O...O....O..OOO..\n\
	.......O....O...O....O.......\n\
	O....O.O....O...O....O.O....O\n\
	O....O.................O....O\n\
	O....O..OOO.......OOO..O....O\n\
	..OOO...................OOO..\n\
	.............................\n\
	..OOO...................OOO..\n\
	O....O..OOO.......OOO..O....O\n\
	O....O.................O....O\n\
	O....O.O....O...O....O.O....O\n\
	.......O....O...O....O.......\n\
	..OOO..O....O...O....O..OOO..\n\
	........OOO.......OOO........\n\
	.............................\n\
	..........OOO...OOO..........\n\
	........O....O.O....O........\n\
	........O....O.O....O........\n\
	........O....O.O....O........\n\
	.............................\n\
	..........OOO...OOO..........";
	
	const lightwire =
	"....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....\n\
	....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....\n\
	..........................................................\n\
	..OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO..\n\
	.O......O...............................................O.\n\
	O.OOOOO....OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO.O\n\
	.O.....O................................................O.\n\
	..OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO..\n\
	..........................................................\n\
	....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....\n\
	....OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO..OO....";
	
	
	const hectic =
	"......................OO...............\n\
	......................OO...............\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.........O..........OO...OO............\n\
	.......O.O............OOO..............\n\
	......O.O............O...O.............\n\
	OO...O..O.............O.O..............\n\
	OO....O.O..............O...............\n\
	.......O.O......O.O....................\n\
	.........O......OO.....................\n\
	.................O...O.................\n\
	.....................OO......O.........\n\
	....................O.O......O.O.......\n\
	...............O..............O.O....OO\n\
	..............O.O.............O..O...OO\n\
	.............O...O............O.O......\n\
	..............OOO............O.O.......\n\
	............OO...OO..........O.........\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	.......................................\n\
	...............OO......................\n\
	...............OO......................";
	
	let pulShuttle =
	".............O..............O.............\n\
	............O.O.......O....O.O............\n\
	.............O......OO.OO...O.............\n\
	......................O...................\n\
	..OO......OO..................OO......OO..\n\
	O....O..O....O..............O....O..O....O\n\
	O....O..O....O..............O....O..O....O\n\
	O....O..O....O........O.....O....O..O....O\n\
	..OO......OO........OO.OO.....OO......OO..\n\
	......................O...................\n\
	..........................................\n\
	..........................................\n\
	..OO......OO..................OO......OO..\n\
	O....O..O....O........O.....O....O..O....O\n\
	O....O..O....O......OO.OO...O....O..O....O\n\
	O....O..O....O........O.....O....O..O....O\n\
	..OO......OO..................OO......OO..\n\
	..........................................\n\
	..........................................\n\
	......................O...................\n\
	..OO......OO........OO.OO.....OO......OO..\n\
	O....O..O....O........O.....O....O..O....O\n\
	O....O..O....O..............O....O..O....O\n\
	O....O..O....O..............O....O..O....O\n\
	..OO......OO..................OO......OO..\n\
	......................O...................\n\
	.............O......OO.OO...O.............\n\
	............O.O.......O....O.O............\n\
	.............O..............O.............";
	
	let gliderDuplicator =
	"..........O.O.......................\n\
	...........OO.......................\n\
	...........O........................\n\
	....................................\n\
	....................................\n\
	....................................\n\
	........................OO....O.....\n\
	..................O.....OO....OO....\n\
	...................OO........O.O....\n\
	..................OO................\n\
	....................................\n\
	....................................\n\
	....................................\n\
	....................................\n\
	......................OO............\n\
	.......................OO...........\n\
	............O.........O.............\n\
	............O.O.....................\n\
	.............O.O.........OO.........\n\
	OO...........O..O.......OOO.........\n\
	OO...........O.O.....O.OO...........\n\
	............O.O......O..O...........\n\
	............O........O.OO...........\n\
	........................OOO.....OO..\n\
	.........................OO.....O.O.\n\
	..................................O.\n\
	..................................OO";
	
	let spaceshipBouncer =
	"O..O.................................\n\
	....O................................\n\
	O...O................................\n\
	.OOOO................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	...................OO..............OO\n\
	..................OO...............OO\n\
	...................OOOOO.............\n\
	..OO................OOOO.............\n\
	..OO.....O...........................\n\
	........OOO.........OOOO.............\n\
	.......O.O.O.......OOOOO.............\n\
	........O..O......OO...............OO\n\
	........OOO........OO..............OO\n\
	.........O...........................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	..O.......O..........................\n\
	.....................................\n\
	OOO.......OOO........................\n\
	.OO.OO.OO.OO.........................\n\
	..OOO...OOO..........................\n\
	...O.....O...........................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	.....................................\n\
	..OO.....OO..........................\n\
	..OO.....OO..........................";
	
	let pinwheel =
	"......OO....\n\
	......OO....\n\
	............\n\
	....OOOO....\n\
	OO.O....O...\n\
	OO.O..O.O...\n\
	...O...OO.OO\n\
	...O.O..O.OO\n\
	....OOOO....\n\
	............\n\
	....OO......\n\
	....OO......";
	
	let trafficCircle =
	".....................OO....OO...................\n\
	.....................O.O..O.O...................\n\
	.......................O..O.....................\n\
	......................OO..OO....................\n\
	.....................OOO..OOO...................\n\
	.......................O..O.....................\n\
	...............................O................\n\
	..............................O.OO..............\n\
	..................................O.............\n\
	..........................O...O..O.O............\n\
	..........................O.....O..O............\n\
	..........................O......OO.............\n\
	.........OO.....................................\n\
	........O..O..........OOO...OOO.................\n\
	.......O.O.O....................................\n\
	......OOO.O...............O.....................\n\
	......OOO.................O.....................\n\
	..........................O.....................\n\
	............OOO.................................\n\
	OO..O................OOO........................\n\
	O..OO.....O.....O...............................\n\
	.OOOOO....O.....O..O.....O.................O..OO\n\
	..........O.....O..O.....O.................OO..O\n\
	...................O.....O.......OOO......OOOOO.\n\
	.OOOOO......OOO.................................\n\
	O..OO................OOO.......O.....O..........\n\
	OO..O..........................O.....O....OOOOO.\n\
	...............................O.....O.....OO..O\n\
	...........................................O..OO\n\
	.................................OOO............\n\
	.......................................OO.......\n\
	......................................OOO.......\n\
	.....................................O.OO.......\n\
	....................................O.O.........\n\
	....................OOO.............O..O........\n\
	.....................................OO.........\n\
	.............OO....O..O.........................\n\
	............O..O................................\n\
	............O.O.O...............................\n\
	.............O..O...............................\n\
	.................O..............................\n\
	..............O.O...............................\n\
	.....................O..O.......................\n\
	...................OOO..OOO.....................\n\
	....................OO..OO......................\n\
	.....................O..O.......................\n\
	...................O.O..O.O.....................\n\
	...................OO....OO.....................";
	
	let wickerStretcher =
	".................OO..............................\n\
	.............OO....O.............................\n\
	............OOO.O................................\n\
	O.OO..OO...O...OOOO.O.O....OO.......OO...........\n\
	O....OO..O........O.OOO....O....OO.O..O.OO.O.....\n\
	O.OO....OO.OO....O...........O...O.O.OO.O.OO.....\n\
	......O.......O.............OO.....O..O.O...OO...\n\
	.....O.........O.O....OOO...O....O..O.O.OOO...O..\n\
	.....O.........O.O....OOO.OO.O..OO.O.O...O..OO.O.\n\
	......O.......O.............OO.O...OO....OO....O.\n\
	O.OO....OO.OO....O..........O........OO.O.O.OO.OO\n\
	O....OO..O........O.OOO........O...O...OO.O..O.O.\n\
	O.OO..OO...O...OOOO.O.O.......O.O...OO....O..O.O.\n\
	............OOO.O..............O.....O.OOO....O..\n\
	.............OO....O.................O.O.........\n\
	.................OO...................O..........";
	
	let gliderLoop =
	".....................................................O.O\n\
	.....................................................OO.\n\
	......................................................O.\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	........................................................\n\
	................................................OO......\n\
	................................................O.......\n\
	..............................................O.O.......\n\
	..............................................OO........\n\
	..............................O.O.......................\n\
	..............................OO........................\n\
	...............................O........................\n\
	........................................................\n\
	.......................OOO..............................\n\
	OO........OOO........OO.O.OO............................\n\
	OO........O...O.....O.....OO............................\n\
	..........O....O.....OO.O.OO............................\n\
	...........O...O.......OOO..............................\n\
	........................................................\n\
	...........O...O........................................\n\
	..........O....O........................................\n\
	OO........O...O............OO...........................\n\
	OO........OOO..............OO...........................";
	
	let electricFence =
	"..........O..................................................\n\
	.........O.O........................OO.......................\n\
	..O....OOO.O.....O...................O...O..O......O.....OO..\n\
	.O.O..O....OO...O.O..................O.OOO..OOO...O.O....O...\n\
	.O.O..O.OO.......O....................O...OO...O.O..O......O.\n\
	OO.OO.O.O.OOOOO.....O..................OO...O..O.O.OO.OO..OO.\n\
	.O.O..O...O..O..O.......OO...OO...OO....OO.OO..O.O..O.O.O....\n\
	.O..OO....OO......OOO.OO...OO...OO...OOO.....OOOO.OOO.O...OO.\n\
	..O..OOO..O..O.OOOO...OO...OO...OO...OOO.OO..O....O.O....O..O\n\
	...OO...O.O..O.....OO...OO...OO...OO......O............O...OO\n\
	.....OO.O.OO.O.OO..O......................O........OO.O......\n\
	.....O.OO.O..O.OO....O.................OO.O.O................\n\
	...........OO.......OO..................O..OO................\n\
	......................................O.O....................\n\
	......................................OO.....................";
	
	let kokGalaxy =
	"OOOOOO.OO\n\
	OOOOOO.OO\n\
	.......OO\n\
	OO.....OO\n\
	OO.....OO\n\
	OO.....OO\n\
	OO.......\n\
	OO.OOOOOO\n\
	OO.OOOOOO";
	
	let boatStretcher =
	"............OO..........\n\
	OOO.........O.O.........\n\
	O..OOO......O.........O.\n\
	.O.O................OO.O\n\
	......O....OO..O...OO..O\n\
	....O......OO..O.OO..O..\n\
	......O.OO.O...OOOOO....\n\
	...............OO.......\n\
	.......O..OOOOOO........\n\
	........OOOOOOO.........\n\
	..........OOO...........\n\
	........................\n\
	.............O..........\n\
	............O.O.........\n\
	.............OO.........";
	
	let spacefiller =
	"..................O........\n\
	.................OOO.......\n\
	............OOO....OO......\n\
	...........O..OOO..O.OO....\n\
	..........O...O.O..O.O.....\n\
	..........O....O.O.O.O.OO..\n\
	............O....O.O...OO..\n\
	OOOO.....O.O....O...O.OOO..\n\
	O...OO.O.OOO.OO.........OO.\n\
	O.....OO.....O.............\n\
	.O..OO.O..O..O.OO..........\n\
	.......O.O.O.O.O.O.....OOOO\n\
	.O..OO.O..O..O..OO.O.OO...O\n\
	O.....OO...O.O.O...OO.....O\n\
	O...OO.O.OO..O..O..O.OO..O.\n\
	OOOO.....O.O.O.O.O.O.......\n\
	..........OO.O..O..O.OO..O.\n\
	.............O.....OO.....O\n\
	.OO.........OO.OOO.O.OO...O\n\
	..OOO.O...O....O.O.....OOOO\n\
	..OO...O.O....O............\n\
	..OO.O.O.O.O....O..........\n\
	.....O.O..O.O...O..........\n\
	....OO.O..OOO..O...........\n\
	......OO....OOO............\n\
	.......OOO.................\n\
	........O..................";
	
	
	
	
	
	
	
	const configs = {
	  superstring: superstring,
	  spaceRake: spaceRake,
	  piOrbital: piOrbital,
	  quasar: quasar,
	  lightwire: lightwire,
	  hectic: hectic,
	  pulShuttle: pulShuttle,
	  gliderDuplicator: gliderDuplicator,
	  spaceshipBouncer: spaceshipBouncer,
	  pinwheel: pinwheel,
	  trafficCircle: trafficCircle,
	  wickerStretcher: wickerStretcher,
	  gliderLoop: gliderLoop,
	  electricFence: electricFence,
	  kokGalaxy: kokGalaxy,
	  boatStretcher: boatStretcher,
	  spacefiller: spacefiller
	};
	
	module.exports = configs;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map