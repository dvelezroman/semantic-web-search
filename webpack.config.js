const path = require('path');
module.exports = {
	// mode: 'production
	mode: 'none',
	context: path.resolve(__dirname, 'src/scripts'),
	entry: {
		// Background scripts.
		'background/main.js': './background/main.js',
		// Content scripts.
		'content/main.js': './content/main.js'
	},
	output: {
		path: path.resolve(__dirname, 'build/scripts'),
		filename: '[name]'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	}
};
