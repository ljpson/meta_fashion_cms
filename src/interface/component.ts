import { MouseEventHandler, ChangeEventHandler, CSSProperties } from 'react';
import type { ReactElement } from 'react';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { ButtonType } from 'antd/lib/button';
import type { Key } from 'antd/lib/table/interface';

import type { SelectItemType } from '../type/component';

export interface NormalButtonInterface {
	title: string;
	type?: ButtonType;
	size?: SizeType;
	disabled?: boolean;
	style?: CSSProperties;
	icon?: ReactElement;
	onClick?: MouseEventHandler;
}

export interface DeleteButtonInterface {
	size?: SizeType;
	style?: CSSProperties;
	onClick: MouseEventHandler;
}

export interface NormalSelectInterface {
	items: SelectItemType[];
	defaultValue?: Key[] | never[] | any;
	value?: any;
	placeholder?: string;
	size?: SizeType;
	style?: CSSProperties;
	onChange: any;
}

export interface NormalInputInterface {
	type: string;
	style?: CSSProperties;
	placeholder?: string;
	value: string | number;
	maxLength: number;
	onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}


export interface MemberSelectInterface {
	items: SelectItemType[];
	defaultValue?: Key[] | never[] | any;
	value?: any;
	id?: any;
	placeholder?: string | any;
	size?: SizeType | any;
	style?: CSSProperties | any;
	onChange: any;
	disabled: any;
}


export interface MemberInputInterface {
	type: string;
	style?: CSSProperties;
	disabled?: boolean;
	placeholder?: string;
	value: string | number;
	maxLength: number;
	onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export interface ColumnHeadingInterface {
	text: string;
	essential?: boolean;
	style?: CSSProperties;
}

export interface NormalModalInterface {
	title: string;
	description: string;
	isOpen: boolean;
	onClickConfirm: MouseEventHandler;
	onClickCancle: MouseEventHandler;
	okText: string | any;
	cancelText: string | any;
}
