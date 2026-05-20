import { ReactNode } from 'react';

/**
 * General option props
 */
export interface Option {
	name: string;
	label: string;
	href?: string;
	icon?: ReactNode;
	onClick?: ((instance: any) => void) | (() => void);
	customRender?: ReactNode;
	placeholder?: boolean;
}
