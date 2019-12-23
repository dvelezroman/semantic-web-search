const path = require('path');
module.exports = {
	// mode: 'production
	mode: 'none',
	context: path.resolve(__dirname, 'src/scripts'),
	entry: {
		// Background scripts.
		'background/script.js': './background/script.js',
		// Content scripts.
		'content/script.js': './content/script.js'
	},
	output: {
		path: path.resolve(__dirname, 'build/scripts'),
		filename: '[name]'
	}
};
