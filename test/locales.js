import 'babel-polyfill';
import Locales from '../src/lib';
import Chai    from 'chai';

Chai.should();

global.expect = Chai.expect;

describe('Locales', () => {

	let locales = null;

	it('should create Locales instance', () => {
		locales = new Locales();
	});

	it('should collect locales from JavaScript sources', async () => {

		await locales.fromFiles('test/fixtures/**/*.js');

		locales.locales.length.should.be.equal(6);

		let [ce__, ce__n1, ce__n2, di__, tte__, tte__n] = locales.locales;

		ce__.type.should.be.equal('CallExpression');
		ce__n1.type.should.be.equal('CallExpression');
		ce__n2.type.should.be.equal('CallExpression');
		di__.type.should.be.equal('TaggedTemplateExpression');
		tte__.type.should.be.equal('TaggedTemplateExpression');
		tte__n.type.should.be.equal('TaggedTemplateExpression');

		ce__.fn.should.be.equal('__');
		ce__n1.fn.should.be.equal('__n');
		ce__n2.fn.should.be.equal('__n');
		di__.fn.should.be.equal('__');
		tte__.fn.should.be.equal('__');
		tte__n.fn.should.be.equal('__n');

		ce__.string.should.be.equal('test locale');
		ce__n1.string.should.be.equal('locale %s');
		ce__n2.string.should.be.equal('locales %s');
		di__.string.should.be.equal('object.notation');
		tte__.string.should.be.equal('test locale');
		tte__n.string.should.be.equal('locale %s');
	});

	it('should get difference between locales from source and translations', () => {

		locales = locales.diff([
			'locale %s',
			'locales %s',
			'unused locale'
		]);

		locales.locales.length.should.be.equal(3);
		locales.unused.length.should.be.equal(1);

		let [ce__, di__, tte__] = locales.locales;

		ce__.type.should.be.equal('CallExpression');
		di__.type.should.be.equal('TaggedTemplateExpression');
		tte__.type.should.be.equal('TaggedTemplateExpression');

		ce__.fn.should.be.equal('__');
		di__.fn.should.be.equal('__');
		tte__.fn.should.be.equal('__');

		ce__.string.should.be.equal('test locale');
		di__.string.should.be.equal('object.notation');
		tte__.string.should.be.equal('test locale');

		locales.unused[0].should.be.equal('unused locale');
	});

	it('should exclude locales', () => {

		locales.exclude([
			'test locale',
			'unused locale'
		]);

		locales.locales.length.should.be.equal(1);
		locales.unused.length.should.be.equal(0);
	});

	it('should work with object notation', () => {

		locales.locales.length.should.be.equal(1);

		locales = locales.diff({
			object: {
				notation: 'object notation'
			}
		});

		locales.locales.length.should.be.equal(0);
	});
});
