import { NoticeDataInterface } from '../interface/data';

import axios, { AxiosRequestConfig } from 'axios';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};
/**
 * 이용약관/개인정보방침 리스트 API
 *
 * @returns
 */
export async function noticeListAPI(type: string) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const noticeList = axios.create(axiosConfig);
		const params = {
			accessToken,
			command: {
				type,
			},
		};
		const res = await noticeList.post('/app/v1/policy/list', params, {headers:{Authorization:`Bearer ${accessToken}`}});

		return res.data.command;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}

/**
 * 이용약관/개인정보방침 등록 API
 *
 * @returns
 */
export async function noticeCreateAPI(data: NoticeDataInterface) {
	try {
		//api
		const accessToken = sessionStorage.getItem('accessToken');
		const noticeCreate = axios.create(axiosConfig);
		const params = {
			accessToken,
			command: data,
		};
		const res = await noticeCreate.post('/app/v1/policy/create', params, {headers:{Authorization:`Bearer ${accessToken}`}});

		if (res.data.status === 200) {
			alert('등록 완료 ');
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}
