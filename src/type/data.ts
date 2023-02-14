export type ContentsType = {
	[key: string]: number | string | string[];
	type: number;
	description: string;
	title: string;
	parentId: number;
	tags: string[];
	asset: string;
};

export type DesignerType = {
	[key: string]: string;
	name: string;
	feild: string;
	introduction: string;
};
