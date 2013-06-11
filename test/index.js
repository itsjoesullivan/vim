var vim = require('../index');

var Cursor = require('../lib/Cursor');

var expect = function(assertion) {

	return {
		equal: function(obj) {
			if(assertion == obj) return true;
			throw "expected " + assertion + " to equal " + obj;
		}
	}
};

describe('vim', function() {
	it('has Doc property', function() {
		expect('Doc' in vim).equal(true);
	});
});


describe('Cursor', function() {
	var cursor;

	beforeEach(function() {
		cursor = new Cursor();
	});

	it('exists', function() {
		expect(typeof Cursor).equal('function');
	});

	it('fires change event on line change', function() {
		var fired = false;
		cursor.on('change:line', function() {
			fired = true;
		});
		cursor.line(10);
		expect(fired).equal(true);
	});

	it('fires change event on char change', function() {
		var fired = false;
		cursor.on('change:char', function() {
			fired = true;
		});
		cursor.char(10);
		expect(fired).equal(true);
	});

	it('has _line and _char', function() {
		expect('_line' in cursor).equal(true);
		expect('_char' in cursor).equal(true);
	});

	describe('Cursor.line', function() {
		it('sets and gets line', function() {
			cursor.line(10);
			expect(cursor.line()).equal(10);
		});
	});

	describe('Cursor.char', function() {
		it('sets and gets char', function() {
			cursor.char(10);
			expect(cursor.char()).equal(10);
		});
	});

});

describe('Doc', function() {
	var doc;

	beforeEach(function() {
			doc = new Doc({
				text: 'hi'
			});
	});

	describe('doc', function() {
		it('has cursor', function() {
			expect('cursor' in doc).equal(true);
		});
	});

	describe('doc.insert', function() {

		it('exists', function() {
			expect('insert' in doc).equal(true);
		});

		it('can insert a character', function() {
			doc.insert('a');
			expect(doc._text).equal('ahi');
		});

		it('given multiple characters they are each inserted.', function() {
			doc.insert('ab ');
			expect(doc._text).equal('ab hi');
		});
	});

	describe('doc.remove', function() {

		var range = [];

		beforeEach(function() {
			range[0] = { line: 0, char: 0};
			range[1] = { line: 0, char: 1};
		});

		it('throws on bad range', function() {
			var threw = false;
			try {
				doc.remove();
			} catch(e) {
				threw = true;
			}
			expect(threw).equal(true);

		});

		it('fires change event on text change', function() {
			var fired = false;
			doc.on('change:text', function() {
				fired = true;
			});
			doc.set({text: 'hello'});
			expect(fired).equal(true);
		})

		it('can remove a character', function() {
			doc.remove(range);
			expect(doc._text).equal('i');
		});


		it('can remove more than one character', function() {
			doc = new Doc({text:'oh hello there'});
			range[0].char = 3;
			range[1].char = 9;
			doc.remove(range)
			expect(doc._text).equal('oh there');
		});

		it('can remove across lines', function() {
			doc = new Doc({text: 'line one\nand another'});
			range[0].char = 5;
			range[1] = { line: 1, char: 4 };
			doc.remove(range);
			expect(doc._text).equal('line another');
		});

		it('can delete a line', function() {
			doc = new Doc({text: 'line one\nline two'});
			range[0] = { line: 0, char: 0 };
			range[1] = { line: 0, char: doc._lines[1].length };
			doc.remove(range);
			expect(doc._lines.length).equal(1);
			expect(doc._text).equal('line two');
		});

		it('can remove, delete a line, and remove', function() {
			doc = new Doc({text: 'one\ntwo\nthree'});
			range[0] = { line: 0, char: 1 };
			range[1] = { line: 2, char: 2 };
			doc.remove(range);
			expect(doc._text).equal('oree');
		});

	});

	describe('doc.find', function() {
		it('finds things', function() {
			doc = new Doc({text:' hi'});
			var res = doc.find(/(hi)/);
			expect(res.line).equal(0);
			expect(res.char).equal(1);
		})
	});

	describe('doc.checkString', function() {

		var doc;
		beforeEach(function() {
			doc = new vim.Doc();
		})

		it('exists', function() {
			expect('checkString' in doc).equal(true);
		});

		it('returns -1 when no match', function() {
			expect(doc.checkString(/(h)/,'abcd')).equal(-1);
		});

		it('returns 0 when found at zero', function() {
			expect(doc.checkString(/(h)/,'h')).equal(0);
		});

		it('returns 1 when found at 1', function() {
			expect(doc.checkString(/(h)/,' h')).equal(1);
		});

		it('returns null when present in line but not after offset', function() {
			expect(doc.checkString(/(h)/,'hello',1)).equal(-1);
		});

		it('returns correct line when present in line before and after the offset', function() {
			expect(doc.checkString(/(h)/,'hello there',1)).equal(7);
		});

		it('correctly does not treat the beginning of the offset string as the beginning of the line', function() {
			expect(doc.checkString(/^ello/,'hello there',1)).equal(-1);
		});



	});

	describe('doc.getRange', function() {
		var doc;
		beforeEach(function() {
			doc = new Doc({text: 'qwer\nasdf\nzxcv'});
		});

		it('returns a string value for the range if it is one line', function() {
			var range = [{line: 0, char: 0}, { line:0, char: 3}];
			var text = doc.getRange(range);
			expect(text).equal('qwer');
		})

		it('includes a carriage return if it is multiline', function() {
			var range = [{line: 0, char: 0}, { line:1, char: 2}];
			var text = doc.getRange(range);
			expect(text).equal('qwer\nas');
		})

	})

});

describe('vim.exec', function() {
	it('exists', function() {
		expect('exec' in vim).equal(true);
	})

	it('executes basic', function() {
		vim.exec('i');
		expect(vim.modeName).equal('insert');
	});
});

describe('modes', function() {

	beforeEach(function() {
		vim.mode('command');
		var doc = new Doc({text: "oh hello\nthere"});
		vim.docs.push(doc);
		vim.curDoc = doc;

	});

	describe('command', function() {

		describe('i', function() {
			it('moves to insert mode', function() {
				vim.exec('i');
				expect(vim.modeName).equal('insert');
			})
		})



		describe('s', function() {
			it('moves to insert mode', function() {
				vim.exec('s');
				expect(vim.modeName).equal('insert');
			})
		})

		describe('S', function() {
			it('moves to insert mode', function() {
				vim.exec('S');
				expect(vim.modeName).equal('insert');
			})
		})

		describe('/', function() {
			it('moves to search mode', function() {
				vim.exec('/');
				expect(vim.modeName).equal('search');
			})
		});

		describe('h', function() {
			it('moves the cursor left', function() {
				vim.cursor().char(4);
				vim.exec('h');
				expect(vim.cursor().char()).equal(3);
			});

			it('stays at zero if already at zero', function() {
				vim.cursor().char(0);
				vim.exec('h');
				expect(vim.cursor().char()).equal(0);
			});
		});

		describe('l', function() {
			it('moves the cursor right', function() {
				vim.cursor().char(2);
				vim.exec('l');
				expect(vim.cursor().char()).equal(3);
			});

			it('stays at end of line if already there', function() {
				vim.cursor().char(7);
				vim.exec('l');
				expect(vim.cursor().char()).equal(7);
			});
		});

		describe('j', function() {
			it('moves the cursor down', function() {
				vim.cursor().line(0);
				vim.exec('j');
				expect(vim.cursor().line()).equal(1);
			});

			it('stays at last line if already there', function() {
				vim.cursor().line(1);
				vim.exec('j');
				expect(vim.cursor().line()).equal(1);
			});
		});

		describe('k', function() {
			it('moves the cursor up', function() {
				vim.cursor().line(1);
				vim.exec('k');
				expect(vim.cursor().line()).equal(0);
			});

			it('stays at zero if already there', function() {
				vim.cursor().line(0);
				vim.exec('k');
				expect(vim.cursor().line()).equal(0);
			});
		});

		describe('{n}(h|j|k|l)', function() {

			beforeEach(function() {
				vim.mode('command');
				var doc = new Doc({text: "oh hello\nthere\nthird\nfourth"});
				vim.docs.push(doc);
				vim.curDoc = doc;
				vim.cursor().line(0);
				vim.cursor().char(0);
			});

			it('does j multiple times', function() {
				expect(vim.cursor().line()).equal(0);
				vim.exec('2j');
				expect(vim.cursor().line()).equal(2);
			});

			it('does l multiple times', function() {
				vim.exec('2l');
				expect(vim.cursor().char()).equal(2);
			});
		});

		describe('$', function() {
			it('moves to the end of the line', function() {
				vim.new();
				vim.curDoc.text('hello');
				vim.exec('$');
				expect(vim.cursor().char()).equal(4);
			});
			
		});

		describe('w', function() {
			it('moves to the next word', function() {
				vim.new();
				vim.curDoc.text('hello there thar');
				vim.exec('w');
				expect(vim.cursor().char()).equal(6);
			});

			it('moves thence to the third', function() {
				vim.new();
				vim.curDoc.text('hello there thar\nhey what');
				vim.exec('w');
				vim.exec('w');
				expect(vim.cursor().char()).equal(12);
			});

			it('moves to line two when necessary', function() {
				vim.new();
				vim.curDoc.text('hello there thar\nhey what');
				vim.exec('w');
				vim.exec('w');
				vim.exec('w');
				expect(vim.cursor().line()).equal(1);
				expect(vim.cursor().char()).equal(0);
			});
		});

		describe('W', function() {
			it('moves to the next word', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.exec('W');
				expect(vim.cursor().char()).equal(6);
			});
		});

		describe('b', function() {
			it('moves to the previous word', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.cursor().char(8);
				vim.exec('b');
				expect(vim.cursor().char()).equal(0);
			});
		});

		describe('B', function() {
			it('moves to the previous word', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.cursor().char(8);
				vim.exec('B');
				expect(vim.cursor().char()).equal(0);
			});
		});

		describe('x', function() {
			it('deletes the character', function() {
				vim.new();
				vim.curDoc.text('hello there');
				vim.cursor().char(4);
				vim.exec('x');
				expect(vim.text()).equal('hell there');
			});

			it('doesn\'t have a problem if the line is empty', function() {
				throw '';
			})
		});

		describe('^', function() {
			it('moves to the first non-blank character in the line', function() {
				vim.new();
				vim.curDoc.text(' hey');
				vim.exec('^');
				expect(vim.cursor().char()).equal(1);
			});
		})

		describe('g_', function() {
			it('moves to the last non-blank character in the line', function() {
				vim.new();
				vim.curDoc.text(' hey  ');
				vim.exec('g_');
				expect(vim.cursor().char()).equal(3);
			});
		})

	});

	describe('insert', function() {
		it('inserts text', function() {

			vim.exec('i');

			vim.exec('asdf');
			expect(vim.text()).equal('asdfoh hello\nthere');
		});
	});
});

describe('f{m}', function() {
	beforeEach(function() {
		vim.exec('esc');
		var doc = new Doc({text: 'hello\nthere\nabcdefo'});
		vim.curDoc = doc;
	});

	it('finds the next m', function() {
		vim.exec('fe');
		expect(vim.cursor().char()).equal(1);
	});

});

describe('{n}f{m}', function() {
	beforeEach(function() {
		vim.exec('esc');
		var doc = new Doc({text: 'hello\nthere\nabcdefo'});
		vim.curDoc = doc;
	});

	it('searches for the nth occurence of m', function() {
		vim.exec('3fe');
		expect(vim.cursor().char()).equal(4);
	});

});

describe('search', function() {
	beforeEach(function() {
		vim.exec('esc');
		var doc = new Doc({text: 'hello\nthere\nabcdefo'});
		vim.curDoc = doc;
		vim.exec('/');
	});

	it('exists', function() {
		expect(vim.modeName).equal('search');
	});

	it('looks for the phrase', function() {
		vim.exec('o\n');
		expect(vim.cursor().char()).equal(4);
	});

	it('moves to the next instance', function() {
		vim.exec('o\n');
		expect(vim.cursor().char()).equal(4);
		vim.exec('n');
		expect(vim.cursor().char()).equal(6);
	});
});

describe('mode:visual', function() {

	var doc;
	beforeEach(function(){ 
		vim.exec('esc');
		doc = new Doc({text: 'here\nthere\neverywhere'});
		vim.curDoc = doc;
	});

	it('is entered from command by pressing v', function() {
		vim.exec('v');
		expect(vim.modeName).equal('visual');
	});

	it('sets selection', function() {
		var sel = vim.curDoc.selection();
		expect(sel[0].line).equal(0);
		expect(sel[1].line).equal(0);
		vim.exec('v');
		vim.exec('j');
		var sel = vim.curDoc.selection();
		expect(sel[0].line).equal(0);
		expect(sel[1].line).equal(1);
	});


	it('accepts multiple motions without resetting', function() {

		vim.exec('v');
		vim.exec('j');
		var sel = vim.curDoc.selection();
		expect(sel[0].line).equal(0);
		expect(sel[1].line).equal(1);

		vim.exec('l');
		var sel = vim.curDoc.selection();
		expect(sel[1].char).equal(2);
		expect(sel[1].line).equal(1);
		
	});

	it('clears selection to cursor on esc', function() {

		vim.exec('v');
		vim.exec('j');
		var sel = vim.curDoc.selection();

		vim.exec('l');
		var sel = vim.curDoc.selection();

		vim.exec('esc');

		var sel = vim.curDoc.selection();
		
	});


	it('performs yank when y hit in visual mode', function() {
		vim.exec('v');
		vim.exec('$');
		vim.exec('y');
		expect(false).equal(true);
	});


});

describe('yank', function() {

});


describe('motion, general', function() {
	var doc;
	beforeEach(function(){ 
		vim.exec('esc');
		var doc = new Doc();
		vim.curDoc = doc;
	});

	it('accepts return on empty file', function() {
		vim.exec('i');
		var err = false
		try {
			vim.exec('\n');
		} catch(e) {
			//console.log(e);
			err = true;
		}
		
		expect(vim.curDoc._lines[0]).equal('');
		expect(vim.curDoc._lines[1]).equal('');
	});

});

