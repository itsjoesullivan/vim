describe('search', function() { var Vim = require('../index'); var vim = new Vim();
	var expect = require('chai').expect;

	var doc;

	beforeEach(function() {
		doc = new Doc({text:'asdf aloha what\nzxcv\nqwer'});
		vim.curDoc = doc;
	});

	describe('w', function() {
		it('can move cursor to the next word', function() {
			vim.exec('w');
			expect(doc.cursor.char()).equal(5)
		});
		it('catches words at beginning of line', function() {
			vim.exec('w');
			vim.exec('w');
			vim.exec('w');
			expect(doc.cursor.char()).equal(0)
			expect(doc.cursor.line()).equal(1)
		});
		it('distinguishes non-alpha characters as independent words', function() {
			vim = new Vim();
			vim.curDoc = doc;
			doc.cursor.position({
				line: 0,
				col: 0,
				char: 0
			});
			doc.text('h-i ;\n.');
			vim.exec('w');
			expect(doc.cursor.char()).equal(1);
			vim.exec('w');
			expect(doc.cursor.char()).equal(2);
			vim.exec('w');
			expect(doc.cursor.char()).equal(4);
			vim.exec('w');
			expect(doc.cursor.char()).equal(0);
			expect(doc.cursor.line()).equal(1);
		});

	});

	describe('b', function() {
		it('moves cursor to the previous word', function() {
			vim.exec('$');
			vim.exec('b');
			var currentChar = vim.cursor().char();
			expect(currentChar).equal(11);
		});
		it('moves cursor back two if called twice', function() {
			vim.exec('$');
			vim.exec('b');
			vim.exec('b');
			var currentChar = vim.cursor().char();
			expect(currentChar).equal(5);
		});
	})
	describe('/"a', function() {
		beforeEach(function() {
			vim = new Vim();
		});
		it('searches from the "a buffer', function() {
			vim.text('a b c');
			vim.register('a','b');
			vim.exec('/"a\n');
			vim.curChar.should.equal('b');
		});
	});
});
