import { CategoryDataInterface } from '../interface/data';

import axios, { AxiosRequestConfig } from 'axios';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};
// const accessToken = sessionStorage.getItem('accessToken');

/**
 * 카테고리 리스트 API
 *
 * @returns
 */
export async function categoryListAPI() {
	try {
		//api
		const accessToken = sessionStorage.getItem('accessToken');
		console.log('accessToken',accessToken)
		const categoryList = axios.create(axiosConfig);
		const params = {
			accessToken,
		};
		const res = await categoryList.get('/cms/categories', {headers:{Authorization:`Bearer ${accessToken}`}});

		// if (res.data.status === 401) {
		// 	throw res.data.failedMessage;
		// }
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
 * 카테고리 리스트 수정 API
 *
 * @param {} data
 * @returns
 */
export async function categoryUpdateAPI(data: CategoryDataInterface[]) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		const categoryUpdate = axios.create(axiosConfig);
		const dataSet = {data:data}
		

		const res = await categoryUpdate.post('/cms/categories',dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
		
		if (res.data.status === 200) {
			alert('수정 완료 ');
		}
		return res
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

/**
 * 카테고리 삭제 API
 *
 * @param {} categoryId
 * @returns
 */
 export async function categoryDeleteAPI(categoryId: number) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		const categoryDelete = axios.create(axiosConfig);
		const res = await categoryDelete.delete(`/cms/categories/${categoryId}`, {headers:{Authorization:`Bearer ${accessToken}`}});

		if (res.data.status === 200) {
			alert('삭제 완료 ');
			return res
		}
		if (res.data.status === 20054) {
			alert('사용중인 카테고리 입니다. ');
			return false;
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

