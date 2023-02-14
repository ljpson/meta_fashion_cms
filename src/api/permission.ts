import axios, { AxiosRequestConfig } from 'axios';
import { Key } from 'antd/lib/table/interface';
import { Console } from 'console';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};
/**
 * 팝업 리스트 API
 *
 * @returns
 */
export async function adminListAPI() {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const contentList = axios.create(axiosConfig);
		const res = await contentList.get('/cms/admins', {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 팝업 상세 API
 *
 * @returns
 */
export async function adminDetailAPI(id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const adminDetail = axios.create(axiosConfig);
		const res = await adminDetail.get(`/cms/admins/${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 팝업 등록 API
 *
 * @returns
 */
export async function addAdminAPI(data: any, id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const adminList = axios.create(axiosConfig);
		let dataSet = {data: data}
		
		if(id){
			const res = await adminList.post(`/cms/admins/${id}/save`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		} else {
			const res = await adminList.post(`/cms/admins`, dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
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