import axios, { AxiosRequestConfig } from 'axios';
import { Key } from 'antd/lib/table/interface';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};

const accesstoken =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjE2LCJpYXQiOjE2NjkwMDk1MTQsImV4cCI6MTY2OTg3MzUxNCwiaXNzIjoic2VydmVyLmNtcyIsInN1YiI6InNlc3Npb24ifQ.tq_Nwa3Oljv_8gcQSE7qhq8ojdV0FVe_kXQVFSjnos4';

/**
 * 컨텐츠 생성 API
 *
 * @returns
 */
export async function contentCreateAPI(data: any) {
	try {
		//api
		const contentCreate = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'multipart/form-data',
			accesstoken,
		};
		const res = await contentCreate.post('/v1/content/create', data, { headers });

		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

/**
 * 컨텐츠 리스트 API
 *
 * @returns
 */
export async function contentListAPI() {
	try {
		//api
		const contentList = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accesstoken,
		};
		const res = await contentList.post('/v1/content/list', { body: '' }, { headers });
		return res.data.command.contents;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

/**
 * 컨텐츠 상세 API
 *
 * @returns
 */
export async function contentDetailAPI(id: number) {
	try {
		//api
		const contentDetail = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accesstoken,
		};
		const res = await contentDetail.post('/v1/content/detail', { id }, { headers });
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

/**
 * 컨텐츠 업데이트 API
 *
 * @returns
 */
export async function contentUpdateAPI(data: any, id: number) {
	try {
		//api
		const contentUpdate = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'multipart/form-data',
			accesstoken,
			id,
		};
		const res = await contentUpdate.post('/v1/content/update', data, { headers });
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

/**
 * 컨텐츠 삭제 API
 *
 * @returns
 */
export async function contentDeleteAPI(idList: Key[]) {
	try {
		//api
		const contentDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accesstoken,
		};
		const res = await contentDelete.post('/v1/content/delete', idList, { headers });
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}
