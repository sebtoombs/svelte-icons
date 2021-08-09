const SVGO = require('svgo');

const config = {
	plugins: [
		'cleanupAttrs',
		'removeDoctype',
		'removeXMLProcInst',
		'removeComments',
		'removeMetadata',
		'removeTitle',
		'removeDesc',
		'removeUselessDefs',
		'removeEditorsNSData',
		'removeEmptyAttrs',
		'removeHiddenElems',
		'removeEmptyText',
		'removeEmptyContainers',
		'removeViewBox',
		'cleanupEnableBackground',
		'convertStyleToAttrs',
		{
			name: 'convertColors',
			params: {
				currentColor: true
			}
		},
		'convertPathData',
		'convertTransform',
		'removeUnknownsAndDefaults',
		'removeNonInheritableGroupAttrs',
		'removeUselessStrokeAndFill',
		'removeUnusedNS',
		'cleanupIDs',
		'cleanupNumericValues',
		'moveElemsAttrsToGroup',
		'moveGroupAttrsToElems',
		'collapseGroups',
		'removeRasterImages',
		'mergePaths',
		'convertShapeToPath',
		'sortAttrs',
		'removeDimensions',
		{
			name: 'removeAttributesBySelector',
			params: {
				selector: '*:not(svg)',
				attributes: ['stroke']
			}
		},
		{
			name: 'removeAttrs',
			params: { attrs: 'data.*' }
		}
	]
};

const optimize = (svgString) => SVGO.optimize(svgString, config);

module.exports = {
	optimize
};
