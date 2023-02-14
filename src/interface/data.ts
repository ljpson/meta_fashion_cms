import type { UploadFile } from 'antd/es/upload/interface';

export interface BoardDataInterface {
	// [key: string]: number | boolean | UploadFile[] | string | object;
	name?: string | any;
	email?: string | any;
	nickname?: string | any;
	id?: string;
	newCategory?: string;
	profile: any;
	categoryId: string;
	isShow: number;
	deleted: number;
	title: string;
	description: string;
	type: any[] | string | any;
	tags: string[];
	thumbnails: string[];
	showYn: any;
	contents: any;
	followers: any;
	concept: {
		title: string;
		description: string;
		url: string[];
	};
	media: {
		title: string;
		description: string;
		url: string[];
	};
	detail: {
		title: string;
		description: string;
		url: string[];
	};
	assets: {
		info: {
			name: string;
			description: string;
			thumbnail: string;
			watermarkUrl: string;
		};
		aos: {
			avatarUrl: string;
			arUrl: string;
			updateDt: number;
		};
		ios: {
			avatarUrl: string;
			arUrl: string;
			updateDt: number;
		};
	};
	designer: { name: string; description: string; profileUrl: string };
}

export interface designerInterface {
	// [key: string]: number | boolean | UploadFile[] | string | object;
	name?: string | any;
	id?: string | any;
	newCategory?: string;
	categoryId: string;
	isShow: number;
	deleted: number;
	title: string;
	description: string;
	type: any[] | string;
	tags: string[];
	thumbnails: string[];
	concept: {
		title: string;
		description: string;
		url: string[];
	};
	media: {
		title: string;
		description: string;
		url: string[];
	};
	detail: {
		title: string;
		description: string;
		url: string[];
	};
	assets: {
		info: {
			name: string;
			description: string;
			thumbnail: string;
			watermarkUrl: string;
		};
		aos: {
			avatarUrl: string;
			arUrl: string;
			updateDt: number;
		};
		ios: {
			avatarUrl: string;
			arUrl: string;
			updateDt: number;
		};
	};
	designer: { name: string; description: string; profileUrl: string };
}
export interface CategoryDataInterface {
	categoryId?: number | null | string;
	id: number | null | string;
	name?: string;
	title?: string;
	description?: string;
	deleted?: number;
	regDt?: string;
	updateDt?: string;
	isShow?: number;
	position?: number;
	newCategory?: boolean;
}
export interface PolicyDataInterface {
	categoryId?: number | null | string;
	id: number | null | string;
	name?: string;
	title?: string;
	description?: string;
	deleted?: number;
	regDt?: string;
	updateDt?: string;
	isShow?: number;
	position?: number;
	newCategory?: boolean;
	
}

export interface NoticeDataInterface {
	type: string;
	version?: NoticeDataInterface[];
	noticeId?: number;
	title?: string;
	description?: string;
	deleted?: number;
	updateDt?: string;
}
