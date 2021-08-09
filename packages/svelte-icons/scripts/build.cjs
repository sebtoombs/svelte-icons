const path = require('path');
const fs = require('fs').promises;
const glob = require('glob');
const { optimize } = require('./svgo.cjs');
const cheerio = require('cheerio');
const { icons } = require('../icons/index.cjs');
const mkdirp = require('mkdirp');

const ignore = (err) => {
	if (err.code === 'EEXIST') return;
	throw err;
};

const componentTemplate = (svgAttrs, content) => `
<script>
	export let title = '';
	let className = '';
	export { className as class };
</script>

<svg
	stroke="currentColor"
	fill="currentColor"
	stroke-width="0"
	class={className}
	height={'1em'}
	width={'1em'}
	xmlns="http://www.w3.org/2000/svg"
	${svgAttrs}
>
	{#if title}
		<title>{title}</title>
	{/if}
	${content}
</svg>

`;

const componentIndexTemplate = (
	componentName
) => `import ${componentName} from './${componentName}.svelte';
export default ${componentName};
`;

const componentDecTemplate = (componentName) =>
	`export { ${componentName} as default } from '../';`;

const indexTemplate = (id, componentName) =>
	`export { default as ${componentName} } from './${id}/${componentName}';`;

const decTemplate = (componentName) =>
	`export declare class ${componentName} extends SvelteIcon {}`;

async function main() {
	const packageDir = path.join(process.cwd(), '..', '_svelte-icons_all');

	const sourceDir = process.cwd();

	// rm dist
	await rmDirRecursive(packageDir);

	// Make packages/svelte-icons-all
	await mkdirp(packageDir);

	// Copy package.json
	const packageJson = await readJson(path.join(sourceDir, 'package.json'));
	packageJson.name = 'svelte-icons';
	await fs.writeFile(
		path.join(packageDir, 'package.json'),
		JSON.stringify(packageJson, null, '\t')
	);

	const iconsOutput = [];

	//
	// Make icon components
	//

	for (const icon of icons) {
		// create packages/svelte-icons-all/{icon-lib}
		const iconLibDir = path.join(packageDir, icon.id);
		await mkdirp(iconLibDir).catch(ignore);

		for (const content of icon.contents) {
			const files = await globPromise(content.files);
			for (const file of files) {
				// basename without ext
				const basename = path.basename(file, path.extname(file));
				// camelcased
				const camelCaseFileName = ucFirst(toCamelCase(basename));

				const componentName = content.formatter(camelCaseFileName);

				const svgContentRaw = await fs.readFile(file, 'utf8');
				const svgStr = optimize(svgContentRaw).data;

				const iconData = convertIconData(svgStr);

				const svgAttrs = attrsToString(iconData.attr);
				const svgContent = treeToString(iconData.children);

				const componentContent = componentTemplate(svgAttrs, svgContent);

				const componentIndex = componentIndexTemplate(componentName);

				const componentDec = componentDecTemplate(componentName);

				const componentDir = path.join(iconLibDir, componentName);

				// packages/svelte-icons-all/{icon-lib}/{ComponentName}
				await fs.mkdir(componentDir);

				// Create the .svelte component
				await fs.writeFile(
					path.join(componentDir, `${componentName}.svelte`),
					componentContent,
					'utf8'
				);

				// Create the index.js
				await fs.writeFile(path.join(componentDir, 'index.js'), componentIndex, 'utf8');

				// Create the index.d.ts
				await fs.writeFile(path.join(componentDir, 'index.d.ts'), componentDec, 'utf8');

				iconsOutput.push({
					id: icon.id,
					name: componentName
				});
			}
		}
	}

	// Make svelte-icons-all/index.js
	const indexContent = iconsOutput.reduce((str, icon) => {
		return str + `${indexTemplate(icon.id, icon.name)}\n`;
	}, '');
	await fs.writeFile(path.join(packageDir, 'index.js'), indexContent, 'utf8');

	// Make svelte-icons-all/index.d.ts
	const decContent = iconsOutput.reduce((str, icon) => {
		return str + `${decTemplate(icon.name)}\n`;
	}, '');
	await fs.copyFile(path.join(sourceDir, 'index.d.ts'), path.join(packageDir, 'index.d.ts'));
	await fs.appendFile(path.join(packageDir, 'index.d.ts'), decContent, 'utf8');
}

main();

async function readJson(path) {
	const data = await fs.readFile(path, 'utf-8');
	try {
		return JSON.parse(data);
	} catch (e) {
		throw e;
	}
}

function ucFirst(string) {
	return string.length && string.length > 1
		? string.charAt(0).toUpperCase() + string.slice(1)
		: string;
}

async function rmDirRecursive(dest) {
	try {
		for (const entry of await fs.readdir(dest, { withFileTypes: true })) {
			const dPath = path.join(dest, entry.name);
			if (entry.isDirectory()) {
				await rmDirRecursive(dPath);
			} else {
				await fs.unlink(dPath);
			}
		}
		await fs.rmdir(dest);
	} catch (err) {
		if (err.code === 'ENOENT') return;
		throw err;
	}
}

function globPromise() {
	return new Promise((resolve, reject) => {
		glob(...arguments, function (err, files) {
			if (err) {
				return reject(err);
			}
			return resolve(files);
		});
	});
}

function toCamelCase(string) {
	string = string.trim().replace(/(^[-_\s]+)|([-_\s]+$)/, '');
	if (string.match(/^[^-_\s]+$/)) return string;
	return string
		.split('')
		.map((char, index) => {
			if (char === '-' || char === '_') return index ? ' ' : '';
			return char;
		})
		.join('')
		.trim()
		.split(' ')
		.map((part, index) =>
			index ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part.toLowerCase()
		)
		.join('');
}

function convertIconData(svgStr) {
	const $svg = cheerio.load(svgStr, { xmlMode: true })('svg');

	const attrConverter = (attrs, tagName) =>
		attrs &&
		Object.keys(attrs)
			.filter(
				(name) =>
					![
						'class',
						...(tagName === 'svg' ? ['xmlns', 'xmlns:xlink', 'xml:space', 'width', 'height'] : []) // if tagName is svg remove size attributes
					].includes(name)
			)
			.reduce((obj, name) => ({ ...obj, [name]: attrs[name] }), {});

	const elementsToTree = (elements) =>
		elements
			.filter((e) => e.name && !['style'].includes(e.name))
			.map((e) => ({
				tag: e.name,
				attr: attrConverter(e.attribs, e.name),
				children: e.children && e.children.length ? elementsToTree(e.children) : undefined
			}));

	const tree = elementsToTree([$svg[0]]);
	return tree[0];
}

function attrsToString(attrs) {
	if (!attrs || typeof attrs !== 'object' || !Object.keys(attrs).length) return '';

	return Object.keys(attrs)
		.map((attr) => `${attr}="${attrs[attr]}"`)
		.join('\n\t');
}
function treeToString(tree) {
	let str = '';
	for (const element of tree) {
		const attrString = attrsToString(element.attr);
		str += `<${element.tag}${attrString.length ? ' ' + attrString : ''}>`;
		if (element.children && element.children.length) {
			str += treeToString(element.children);
		}
		str += `</${element.tag}>`;
	}
	return str;
}
