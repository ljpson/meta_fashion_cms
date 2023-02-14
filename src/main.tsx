import ReactDOM from 'react-dom/client';
import Router from './Router';

//tanstack-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import GlobalStyle from './style/GlobalStyle';

/**
 * dayjs 설정
 */
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'; // 윤년 판단 플러그인
import 'dayjs/locale/ko'; // 한국어 가져오기
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)


dayjs.extend(isLeapYear); // 플러그인 등록
dayjs.locale('ko'); // 언어 등록

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			//refetchOnMount: false,
			refetchOnWindowFocus: false,
		},
	},
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<QueryClientProvider client={queryClient}>
		<GlobalStyle />
		<Router />
		{/* <ReactQueryDevtools initialIsOpen={false} /> */}
	</QueryClientProvider>
);
