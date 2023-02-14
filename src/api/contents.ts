import axios, { AxiosRequestConfig } from 'axios';
import { Key } from 'antd/lib/table/interface';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};
/**
 * 게시글 리스트 API
 *
 * @returns
 */
export async function contentListAPI() {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentsList = axios.create(axiosConfig);
		const res = await contentsList.get('/cms/contents', {headers:{Authorization:`Bearer ${accessToken}`}});
		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}
/**
 * 게시글 등록 API
 *
 * @returns
 */
export async function contentCreateAPI(data: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentCreate = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'multipart/form-data',
			accessToken,
		};
		const res = await contentCreate.post('/cms/contents', data, {headers:{Authorization:`Bearer ${accessToken}`}})

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
 * 브랜드 등록 API
 *
 * @returns
 */
export async function addBrandAPI(data: any, id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const brandsList = axios.create(axiosConfig);
		let dataSet = {data: data}
		if(id){
			const res = await brandsList.post(`/cms/brands/${id}/save`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		} else {
			const res = await brandsList.post(`/cms/brands/`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}
/**
 * 게시글 수정
 *
 * @returns
 */
export async function contentUpdateAPI(data:any,id:any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const headers = {
			'Content-Type': 'multipart/form-data',
			accessToken,
			id,
		};
		const contentsList = axios.create(axiosConfig);
		// const res = await contentsList.post('/cms/contents', data, { headers });
		if(id){
			const res = await contentsList.post(`/cms/contents/${id}/save`, data, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		} else {
			const res = await contentsList.post('/cms/contents', data, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		}
		
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}
/**
 * 게시글 노출 여부 API
 *
 * @returns
 */
export async function contentShowAPI(data: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentsList = axios.create(axiosConfig);
		let dataSet  = {data:data}
		
		const res = await contentsList.post('/cms/contents/show',dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 게시글 상세 API
 *
 * @returns
 */
export async function contentDetailAPI(id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentsList = axios.create(axiosConfig);
		const res = await contentsList.get(`/cms/contents/${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 게시글 등록 API
 *
 * @returns
 */
export async function addContentAPI(data: any, id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentsList = axios.create(axiosConfig);
		let dataSet = {data: data}
		if(id){
			const res = await contentsList.post(`/cms/contents/${id}/save`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		} else {
			const res = await contentsList.post(`/cms/contents`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

/**
 * 게시글 삭제 API
 *
 * @returns
 */
export async function contentDeleteAPI(data: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentsDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		const dataSet = {data:data}

		const res = await contentsDelete.post('/cms/contents/delete', dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}