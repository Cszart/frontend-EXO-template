import * as React from 'react';
import clsx from 'clsx';
import { CypressI } from 'interfaces/cypress';

export interface TypographyProps {
	id?: string;
	// Custom tags
	type:
		| 'custom-p'
		| 'custom-h1'
		| 'custom-h2'
		| 'custom-h3'
		| 'custom-h4'

		// Figma styles (Adapt to your own styles)
		| 'headline-2'
		| 'headline-3'
		| 'headline-4'
		| 'headline-5'
		| 'subtitle-1'
		| 'subtitle-2'
		| 'subtitle-3'
		| 'link-1'
		| 'link-2'
		| 'body-1'
		| 'body-2'
		| 'caption-1'
		| 'caption-2'
		| 'caption-3'
		| 'overline';

	text?: string;
	className?: string;
	children?: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClick?: (data?: any) => void;
}

type Variant = { tag: React.ElementType; className: string };

const variants: Record<string, Variant> = {
	'custom-p': { tag: 'p', className: '' },
	'custom-h1': { tag: 'h1', className: '' },
	'custom-h2': { tag: 'h2', className: '' },
	'custom-h3': { tag: 'h3', className: '' },
	'custom-h4': { tag: 'h4', className: '' },

	'headline-2': {
		tag: 'h1',
		className: 'text-primary font-bold text-3xl xl:text-4xl',
	},
	'headline-3': {
		tag: 'h3',
		className: 'text-primary font-bold text-2xl xl:text-3xl',
	},
	'headline-4': {
		tag: 'h4',
		className: 'text-primary font-bold text-[21px] xl:text-2xl leading-[30px]',
	},
	'headline-5': {
		tag: 'h5',
		className:
			'text-primary font-bold text-lg xl:text-[21px] xl:leading-[26px]',
	},

	'subtitle-1': {
		tag: 'h2',
		className: 'text-primary font-medium text-base xl:text-lg',
	},
	'subtitle-2': {
		tag: 'h2',
		className: 'text-primary font-medium text-sm xl:text-base',
	},
	'subtitle-3': {
		tag: 'h3',
		className: 'text-primary font-bold text-sm xl:text-base leading-5',
	},

	'link-1': { tag: 'h2', className: 'text-primary font-bold text-sm' },
	'link-2': { tag: 'h2', className: 'text-primary font-bold text-xs' },

	'body-1': { tag: 'h2', className: 'text-primary font-normal text-base' },
	'body-2': { tag: 'h2', className: 'text-primary font-normal text-xs' },

	'caption-1': {
		tag: 'h2',
		className: 'text-primary font-light text-[10px] leading-[14px]',
	},
	'caption-2': {
		tag: 'h2',
		className: 'text-primary font-medium text-[10px] leading-[14px]',
	},
	'caption-3': {
		tag: 'h2',
		className: 'text-primary font-extrabold text-[10px] leading-[14px]',
	},

	overline: {
		tag: 'h2',
		className: 'text-primary font-medium text-[8px] leading-[10px]',
	},
};

export const Typography: React.FC<TypographyProps & CypressI> = ({
	id,
	dataCY,
	type,
	text = '',
	className = '',
	children,
	onClick,
}) => {
	const variant = variants[type];
	if (!variant) return null;

	const Tag = variant.tag;
	return (
		<Tag
			id={id}
			data-cy={dataCY}
			className={clsx(variant.className, className)}
			onClick={() => onClick?.()}
		>
			{children || text}
		</Tag>
	);
};
