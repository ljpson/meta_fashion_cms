import axios, { AxiosRequestConfig } from 'axios';
import { Key } from 'antd/lib/table/interface';

// api variables
const {VITE_API_KEY}=import.meta.env
const axiosConfig: AxiosRequestConfig = {
	baseURL: VITE_API_KEY,
};
/**
 * 디자이너 리스트 API
 *
 * @returns
 */
export async function designerListAPI() {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentList = axios.create(axiosConfig);
		const res = await contentList.get('/cms/designers', {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 디자이너 상세 API
 *
 * @returns
 */
export async function designerDetailAPI(id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const designerList = axios.create(axiosConfig);
		const res = await designerList.get(`/cms/designers/${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 디자이너 등록 API
 *
 * @returns
 */
export async function addDesignerAPI(data: any, id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const designersList = axios.create(axiosConfig);
		if(id){
			const res = await designersList.post(`/cms/designers/${id}/save`, data, {headers:{Authorization:`Bearer ${accessToken}`}});
			return res.data;
		} else {
			const res = await designersList.post(`/cms/designers`, data, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 디자이너 수정 API
 *
 * @returns
 */
export async function designerPositionAPI(data: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentPosition = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		let dataset = {data : data}
		console.log('designerPositionAPI dataset',dataset)
		const res = await contentPosition.post('/cms/designers/position', dataset, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 디자이너 노출변경 API
 *
 * @returns
 */
export async function designerShowAPI(data: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const designerShow = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		let dataset = {data : data}
		const res = await designerShow.post('/cms/designers/show', dataset, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 디자이너 탑디자이너 변경 API
 *
 * @returns
 */
export async function designerTopAPI(data: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const designerTop = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		let dataset = {data : data}
		const res = await designerTop.post('/cms/designers/top', dataset, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 디자이너 필터 API
 *
 * @returns
 */
export async function designerFilterAPI(type: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const designerFilter = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		const res = await designerFilter.get(`/cms/designers?type=${type}`,{headers:{Authorization:accessToken}});
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
 * 디자이너 삭제 API
 *
 * @returns
 */
export async function designerDeleteAPI(data: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const contentDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		let dataset = {data : data}
		const res = await contentDelete.post('/cms/designers/delete', dataset, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 디자이너 피드 API
 *
 * @returns
 */
export async function designerFeedAPI(id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const designerFeed = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};
		const res = await designerFeed.get(`/cms/contents?designerId=${id}`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 팔로워 API
 *
 * @returns
 */
export async function followAPI(id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const brandsDelete = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};

		const res = await brandsDelete.get(`/cms/designers/${id}/followers`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 메시지 API
 *
 * @returns
 */
export async function messageListAPI(id: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const messageList = axios.create(axiosConfig);
		const headers = {
			'Content-Type': 'application/json',
			accessToken,
		};

		const res = await messageList.get(`/cms/designers/${id}/contact`, {headers:{Authorization:`Bearer ${accessToken}`}});
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
 * 메시지 API
 *
 * @returns
 */
export async function messageReadAPI(id: any, contactId: any) {
	try {
		const accessToken =	sessionStorage.getItem('accessToken');
		//api
		const messageRead = axios.create(axiosConfig);
		// const headers = {
		// 	'Content-Type': 'application/json',
		// 	accessToken,
		// };
		console.log('accessToken',accessToken)
		const res = await messageRead.post(`/cms/designers/${id}/contact/${contactId}/read`,'', {headers:{Authorization:`Bearer ${accessToken}`}});
		return res.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.log('error message: ', error.message);
		} else {
			console.log('unexpected error: ', error);
		}
	}
}