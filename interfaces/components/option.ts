import { ReactNode } from 'react';

/**
 * General option props
 */
export interface Option {
	name: string;
	label: string;
	href?: string;
	icon?: ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onClick?: ((instance: any) => void) | (() => void);
	customRender?: ReactNode;
	placeholder?: boolean;
}
