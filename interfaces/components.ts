import * as React from 'react';
import { SyntheticEvent } from 'react';
import { ErrorOption, RegisterOptions } from 'react-hook-form';

export interface InputProps {
	name: string;
	id?: string;
	onChangeCustom?: (e: SyntheticEvent) => void;
	isLogin?: boolean;
	title?: string;
	register?: (
		name: string,
		RegisterOptions?: RegisterOptions
	) => {
		onChange: (e: SyntheticEvent) => void;
		onBlur: (e: SyntheticEvent) => void;
		name: string;
		ref: React.Ref<any>;
	};
	customPlaceholder?: string;
	rules?: Record<string, unknown>;
	rightImg?: string | undefined;
	isDirty?: boolean;
	leftImg?: string | undefined;
	setValueInput?: any;
	labelVisible?: boolean;
	primary?: boolean;
	rightClick?: () => void;
	leftClick?: () => void;
	error?: object;
	setError?: (name: string, error: ErrorOption) => void;
}
