import axios, { AxiosRequestConfig } from 'axios';
import { Key } from 'antd/lib/table/interface';

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
export async function popupListAPI() {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const contentList = axios.create(axiosConfig);
		const res = await contentList.get('/cms/popups', {headers:{Authorization:`Bearer ${accessToken}`}});
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
export async function popupDetailAPI(id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const popupDetail = axios.create(axiosConfig);
		const res = await popupDetail.get(`/cms/popups/${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
export async function addPopupAPI(data: any, id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const popupList = axios.create(axiosConfig);
		if(id){
			const res = await popupList.post(`/cms/popups/${id}/save`, data, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		} else {
			const res = await popupList.post(`/cms/popups`, data, {headers:{Authorization:`Bearer ${accessToken}`}});
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