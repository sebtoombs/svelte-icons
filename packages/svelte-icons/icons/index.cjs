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
		},
		{
			id: 'ant',
			name: 'Ant Design Icons',
			contents: [
				{
					files: path.resolve(__dirname, 'ant-icons/packages/icons-svg/svg/filled/*.svg'),
					formatter: (name) => `AiFill${name}`
				},
				{
					files: path.resolve(__dirname, 'ant-icons/packages/icons-svg/svg/outline/*.svg'),
					formatter: (name) => `AiOutline${name}`
				},
				{
					files: path.resolve(__dirname, 'ant-icons/packages/icons-svg/svg/twotone/*.svg'),
					formatter: (name) => `AiTwotone${name}`
				}
			]
		},
		{
			id: 'bs',
			name: 'Bootstrap Icons',
			contents: [
				{
					files: path.resolve(__dirname, 'bootstrap-icons/icons/*.svg'),
					formatter: (name) => `Bs${name}`
				}
			]
		}
	]
};
