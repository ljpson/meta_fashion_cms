import { PolicyDataInterface } from '../interface/data';

import axios, { AxiosRequestConfig } from 'axios';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};
/**
 *  이용약관 / 개인정보처리방침 탭List
 *
 * @param {} type
 * @returns
 */
export async function policyListAPI(type: string) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		const policyList = axios.create(axiosConfig);

		const res = await policyList.get(`/cms/policies?type=${type}`, {headers:{Authorization:`Bearer ${accessToken}`}});

		if (res.data.status === 200) {
			return res.data.data
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
 * 약관 해당하는 날짜 리스트 API
 *
 * @returns
 */
export async function policyAPI(data: PolicyDataInterface[]) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		//api
		const policyList = axios.create(axiosConfig);
		const params = {
			accessToken,
		};
		console.log('policyAPI data ::::::::::',data)
		const res = await policyList.get(`/cms/policies/${data}`, {headers:{Authorization:`Bearer ${accessToken}`}});

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
 * 약관 등록 API
 *
 * @param {} data
 * @returns
 */
export async function policyUpdateAPI(data: PolicyDataInterface[]) {
	try {
		const accessToken = sessionStorage.getItem('accessToken');
		const policyUpdate = axios.create(axiosConfig);
		const dataSet = {data:data}
		/* 데이터 양식
		{
  		"data":
			{
				"type": "USE",
				"contents": "sldkfjlsdklsdflskdjf",
				"showFrom": "2023-01-10 10:26:27",
				"showTo": "2023-01-10 10:26:27"
			}
		}
		 */
		

		const res = await policyUpdate.post('/cms/policies', dataSet, {headers:{Authorization:`Bearer ${accessToken}`}});
		
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

