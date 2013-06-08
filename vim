#!/usr/bin/env node

var stdin = process.stdin;

var vim = require('./lib/Vim');

var render = require('../term-render');

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

stdin.resume();

stdin.setEncoding( 'utf8' );


var CSI = function(arg) {
	process.stdout.write('\u001B[' + arg);
}

CSI('0;0f'); //move cursor to zero
		CSI('J'); //clear screen



stdin.on( 'data', function( key ){
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  // write the key to stdout all normal like
  vim.exec(key);

  _text = '';

  var reset = function() {
  	process.stdout.write('\033[0m');
  }

    var blue = function() {
  	process.stdout.write('\033[34m');
  }

  var write = function(text) {

  	CSI('1;1f');

  	var pos = 0;
  	for(var i in text) {
  		reset();
  		pos++;
  		CSI('' + pos + 'G');
  		process.stdout.write(text[i]);
  	}



  	blue();
  	var ct = 1;
  	while(ct--) {
  		CSI('1E');
  		process.stdout.write('~');
  	}

  	reset();
  	

  	_text = text;




  };

//hide cursor
CSI('?25l');


  vim.on('change:text', function() {
  	var text = vim.text();

  	write(text);



  	//CSI('0;0f'); //move cursor to zero
		//CSI('J'); //clear screen

		//CSI('0;0f'); //move cursor to zero
		//CSI('0K') //clear from cursor to end of line

		//process.stdout.write(text);



  })
  //process.stdout.write( key );
});
//   \033[0m

//new line?
//process.stdout.write('\u001B[2J');
//process.stdout.write('\u001B[2J');
//process.stdout.write('\u001B[2J');

//move cursor to top...


//process.stdout.write('\u001B[0;0f');



  setTimeout(function() {
  	//process.stdout.write('\u001B[2J\u001B[0;0f');
  },200)