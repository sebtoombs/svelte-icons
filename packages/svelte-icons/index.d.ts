// Type definitions for svelte-icons

/// <reference types="svelte" />
import { SvelteComponentTyped } from 'svelte';

export interface SvelteIconProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['svg']> {
	/** @type {string} [id] */
	id?: string;

	/** @type {string} [class] */
	class?: string;

	/** @type {string} [tabindex] */
	tabindex?: string;

	/** @type {boolean} [focusable] */
	focusable?: boolean;

	/** @type {string} [title] */
	title?: string;

	/** @type {string} [style] */
	style?: string;

	/**
	 * Fill color
	 * @type {string} [fill="#161616"]
	 */
	fill?: string;

	/**
	 * Stroke color
	 * @type {string} [stroke="currentColor"]
	 */
	stroke?: string;

	/** @type {string} [width="48"] */
	width?: string;

	/** @type {string} [height="48"] */
	height?: string;
}

export interface SvelteIconEvents {
	click: WindowEventMap['click'];
	mouseover: WindowEventMap['mouseover'];
	mouseenter: WindowEventMap['mouseenter'];
	mouseleave: WindowEventMap['mouseleave'];
	keyup: WindowEventMap['keyup'];
	keydown: WindowEventMap['keydown'];
}

export declare class SvelteIcon extends SvelteComponentTyped<
	SvelteIconProps,
	SvelteIconEvents,
	{ default: {} }
> {}
