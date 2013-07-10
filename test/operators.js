var Vim = require('../index');
var vim;
describe('~', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('switches the case', function() {
		vim.text('a');
		vim.exec('~');
		vim.text().should.equal('A');
	});
	it('does so in visual mode', function() {
		vim.text('AsDf');
		vim.exec('v');
		vim.exec('l');
		vim.exec('l');
		vim.exec('l');
		vim.exec('~');
		vim.text().should.equal('aSdF');
	});
});
describe('g~', function() {
	beforeEach(function() {
		vim = new Vim();
	});
	it('works as ~ in visual', function() {
		vim.text('AsDf');
		vim.exec('v');
		vim.exec('l');
		vim.exec('l');
		vim.exec('l');
		vim.exec('~');
		vim.text().should.equal('aSdF');
	});
});
