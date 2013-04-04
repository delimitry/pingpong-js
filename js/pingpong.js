//-----------------------------------------------------------------------
// Ping Pong
//
// Author: delimitry
//-----------------------------------------------------------------------


function Ball(x, y, width, height, xdir, ydir) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.xdir = xdir; // horizontal
	this.ydir = ydir; // vertical
}

function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.score = 0;
}

function getRandomRange(min, max) {
	return Math.random() * (max - min + 1) + min;
}

function PingPong(canvas, context) {
	var DIR_NONE = 0;
	var DIR_LEFT = 1;
	var DIR_RIGHT = 2;
	var DIR_UP = 3;
	var DIR_DOWN = 4;

	var BALL_SIZE = 5;
	var PADDLE_INDENT = 10;
	var PADDLE_WIDTH = 5;
	var PADDLE_HEIGHT = 40;

	this.game_speed = 1;
	this.game_paused = false;
	this.game_win = false;
	this.game_over = false;
	this.sound_on = true;

	this.player_paddle = new Paddle(canvas.height / 2, 20);
	this.computer_paddle = new Paddle(canvas.height / 2, 20);
	this.ball = new Ball(canvas.width / 2, canvas.height / 2, BALL_SIZE, BALL_SIZE, DIR_NONE, DIR_NONE);
	
	this.hit_sound = new Audio();

	this.init = function() {		
		this.game_speed = 1.5;
		this.game_paused = false;
		this.game_win = false;
		this.game_over = false;
		this.sound_on = true;

		// init paddles
		this.player_paddle = new Paddle(PADDLE_INDENT, canvas.height / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT);
		this.computer_paddle = new Paddle(canvas.width - PADDLE_INDENT - PADDLE_WIDTH, canvas.height / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT);
		
		// init ball
		this.ball = new Ball(canvas.width / 2, canvas.height / 2, BALL_SIZE, BALL_SIZE, DIR_RIGHT, DIR_DOWN);

		// init audio
		this.hit_sound = new Audio();
		this.hit_sound.setAttribute("src", "hit.wav");
		this.hit_sound.load();
	}

	this.update = function() {
		if (this.game_paused || this.game_win || this.game_over) return;

		if (this.ball.x <= PADDLE_INDENT) {
			this.computer_paddle.score += 1;
			var ball_x = this.computer_paddle.x - this.computer_paddle.width;
			var ball_y = this.computer_paddle.y + this.computer_paddle.height / 2;
			this.ball = new Ball(ball_x, ball_y, BALL_SIZE, BALL_SIZE, DIR_LEFT, DIR_UP);
		}

		if (this.ball.x >= canvas.width - PADDLE_INDENT) {
			this.player_paddle.score += 1;
			var ball_x = this.player_paddle.x + this.player_paddle.width;
			var ball_y = this.player_paddle.y + this.player_paddle.height / 2;
			this.ball = new Ball(ball_x, ball_y, BALL_SIZE, BALL_SIZE, DIR_RIGHT, DIR_DOWN);
		}

		if (this.player_paddle.score >= 5) {
			// you win
			this.game_win = true;
			this.game_over = false;
		} 
		if (this.computer_paddle.score >= 5) {
			// you lose
			this.game_win = false;
			this.game_over = true;
		} 


		if (this.ball.xdir == DIR_LEFT) {
			this.ball.x -= this.game_speed;
		} else if (this.ball.xdir == DIR_RIGHT) {
			this.ball.x += this.game_speed;
		}		
		if (this.ball.ydir == DIR_UP) {
			this.ball.y -= this.game_speed;
		} else if (this.ball.ydir == DIR_DOWN) {
			this.ball.y += this.game_speed;
		}


		if (this.ball.y <= 0) {
			this.ball.ydir = DIR_DOWN;
		}
		if (this.ball.y > canvas.height - BALL_SIZE) {
			this.ball.ydir = DIR_UP;
		}


		if (this.ball.x < this.player_paddle.x + this.player_paddle.width) {
			if (this.ball.y > this.player_paddle.y && this.ball.y + this.ball.height < this.player_paddle.y + this.player_paddle.height) {
				this.ball.xdir = DIR_RIGHT;

				if (this.sound_on) this.hit_sound.play();
			}
		}

		if (this.ball.x > this.computer_paddle.x - this.computer_paddle.width) {
			if (this.ball.y > this.computer_paddle.y && this.ball.y + this.ball.height < this.computer_paddle.y + this.computer_paddle.height) {
				this.ball.xdir = DIR_LEFT;

				if (this.sound_on) this.hit_sound.play();
			}
		}

		// PC move
		if (this.ball.x > canvas.width / 2) {
			if (this.computer_paddle.y + this.computer_paddle.height / 2 < this.ball.y) this.computer_paddle.y += getRandomRange(0, 1.5);
			if (this.computer_paddle.y + this.computer_paddle.height / 2 > this.ball.y) this.computer_paddle.y -= getRandomRange(0, 1.5);
		} else {
			if (this.computer_paddle.y + this.computer_paddle.height / 2 < this.player_paddle.y) this.computer_paddle.y += 1;
			if (this.computer_paddle.y + this.computer_paddle.height / 2 > this.player_paddle.y) this.computer_paddle.y -= 1;
		}

	}

	this.draw = function() {
		// draw paddles
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect(this.player_paddle.x, this.player_paddle.y, this.player_paddle.width, this.player_paddle.height);	 
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect(this.computer_paddle.x, this.computer_paddle.y, this.computer_paddle.width, this.computer_paddle.height);	 

		// draw ball
		context.fillStyle = 'rgb(255,255,255)';
		context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);	 

		// draw score
		context.fillStyle = 'rgb(255,255,255)';
		context.font = 'bold 20px Arial';
		context.fillText('' + this.player_paddle.score, 35, 30);
		context.fillText('' + this.computer_paddle.score, canvas.width - 55, 30);

		if (this.game_paused) {
			context.fillStyle = 'rgb(255,255,255)';
			context.font = 'bold 25px Arial';
			context.fillText('Pause', canvas.width / 2 - 40, canvas.height / 2);
		}

		if (this.game_over) {
			context.fillStyle = 'rgb(255,255,255)';
			context.font = 'bold 25px Arial';
			context.fillText('You lose', canvas.width / 2 - 40, canvas.height / 2);
		}		

		if (this.game_win) {
			context.fillStyle = 'rgb(255,255,255)';
			context.font = 'bold 25px Arial';
			context.fillText('You win', canvas.width / 2 - 40, canvas.height / 2);
		}
		
		// print sound if on
		if (this.sound_on) {
			context.fillStyle = 'rgb(100,100,100)';
			context.font = 'bold 10px Arial';
			context.fillText('sound', canvas.width - 40, 10);
		}		
	}

	this.toggle_pause = function() {
		this.game_paused = !this.game_paused;
	}

	this.toggle_sound = function() {
		this.sound_on = !this.sound_on;
	}

	this.move_player_paddle_up = function() {
		if (this.player_paddle.y > 0) 
			this.player_paddle.y -= 5;
	}

	this.move_player_paddle_down = function() {
		if (this.player_paddle.y < canvas.height - this.player_paddle.height) 
			this.player_paddle.y += 5;
	}

	this.set_player_paddle_y = function(y) {
		if (this.game_paused || this.game_win || this.game_over) return;
		if (y < 0) y = 0;
		if (y > canvas.height - this.player_paddle.height) y = canvas.height - this.player_paddle.height;
		this.player_paddle.y = y;
	}

}
