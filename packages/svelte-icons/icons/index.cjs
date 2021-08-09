const path = require('path');

module.exports = {
	icons: [
		{
			id: 'eva',
			name: 'Eva Icons',
			contents: [
				{
					files: path.resolve(__dirname, 'eva-icons/package/icons/+(fill|outline)/svg/*.svg'),
					formatter: (name) => `Eva${name}`
				}
			]
		}
	]
};
