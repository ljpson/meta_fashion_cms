import axios, { AxiosRequestConfig } from 'axios';
import { Key } from 'antd/lib/table/interface';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};

/**
 * 브랜드 리스트 API
 *
 * @returns
 */
export async function brandListAPI() {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const brandsList = axios.create(axiosConfig);
		const res = await brandsList.get('/cms/brands', {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 브랜드 리스트 API
 *
 * @returns
 */
export async function brandShowAPI(data: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const brandsList = axios.create(axiosConfig);
		let dataSet  = {data:data}
		
		const res = await brandsList.post('/cms/brands/show',dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 브랜드 상세 API
 *
 * @returns
 */
export async function brandDetailAPI(id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const brandsList = axios.create(axiosConfig);
		const res = await brandsList.get(`/cms/brands/${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 브랜드 피드 API
 *
 * @returns
 */
export async function brandFeedAPI(id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const brandFeed = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		const res = await brandFeed.get(`/cms/contents?brandId=${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 브랜드 등록 API
 *
 * @returns
 */
export async function addBrandAPI(data: any, id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const brandsList = axios.create(axiosConfig);
		let dataSet = {data: data}
		if(id){
			const res = await brandsList.post(`/cms/brands/${id}/save`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		} else {
			const res = await brandsList.post(`/cms/brands`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 브랜드 삭제 API
 *
 * @returns
 */
export async function brandDeleteAPI(data: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const brandsDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		const dataSet = {data:data}

		// const res = await brandsDelete.post('/cms/brands/delete', idList, { headers });
		const res = await brandsDelete.post('/cms/brands/delete', dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 팔로워 API
 *
 * @returns
 */
export async function followAPI(id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const brandsDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};

		const res = await brandsDelete.get(`/cms/brands/${id}/followers`, {headers:{Authorization:`Bearer ${accessToken}`}});
		return res.data.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}