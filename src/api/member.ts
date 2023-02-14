import axios, { AxiosRequestConfig } from 'axios';
import { Key } from 'antd/lib/table/interface';
import { Console } from 'console';
const {VITE_API_KEY}=import.meta.env
// api variables
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};

/**
 * 맴버 리스트 API
 *
 * @returns
 */
export async function memberListAPI() {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const contentList = axios.create(axiosConfig);
		console.log('contentList',contentList)
		const res = await contentList.get('/cms/users', {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 맴버 상세 API
 *
 * @returns
 */
export async function memberDetailAPI(id: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const memberDetail = axios.create(axiosConfig);
		const res = await memberDetail.get(`/cms/users/${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
		// 피드 조회
		// const res = await memberDetail.get(`/cms/users/${id}/follow?keywords={CONTENT | DESIGNER | BRAND}`); 
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
 * 맴버 상세 API - 탭부분
 *
 * @returns
 */
export async function memberTabListAPI(id:any, type: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const memberDetail = axios.create(axiosConfig);
		// 피드 조회
		const res = await memberDetail.get(`/cms/users/${id}/follow?keywords=${type}`, {headers:{Authorization:`Bearer ${accessToken}`}}); 
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
 * 맴버 탈퇴 API
 *
 * @returns
 */
export async function memberDeleteAPI(data: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const memberDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		const dataSet = {data:data}

		const res = await memberDelete.post('/cms/users/leave', dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 *로그인 API
 *
 * @returns
 */
export async function loginAPI(data: any) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const memberDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		const dataSet = {data:data}
		const res = await memberDelete.post('/cms/session/login', dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}