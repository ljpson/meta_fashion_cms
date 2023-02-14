import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../../api/member';
import { addAdminAPI } from '../../api/permission';
//antd
import { Button, Checkbox, Form, Input, Modal } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const Login = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm()

	const [originalData, setOriginalData] = useState([] as any);
	const [modalState, setModalState] = useState({
		isOpen: false,
		onClickConfirm: () => {},
	});
	useEffect(() => {
		// if (getCookie("id")) { // getCookie함수로 id라는 이름의 쿠키를 불러와서 있을경우
		// 	form.setFieldsValue({
		// 		userName: getCookie("id"),
		// 		rememberId: true,
		// 	})
		// }
		form.setFieldsValue({
			// userName: getCookie("id"),
			userName: 'seerslab',
			rememberId: true,
			password: 'qwer1234!@#$'
		})
	}, [])

	//쿠키 저장함수
	const setCookie = (cname:any, cvalue:any, exdays:any) =>{
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
  }

	// 쿠키에서 값을 가져오는 함수
  const getCookie = (cname:any) => {
    var name = cname + '='
    var decodedCookie = document.cookie

    var ca = decodedCookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  }


	const onFinish = async (values: any) => {
		let data = {
			"account": values.userName,
			"password": values.password
		}
		if(values.rememberId){
			setCookie("id", values.userName, 7);
		} else {
			setCookie("id", values.userName, 0);
	}
	
		let result = await loginAPI(data);
		setOriginalData(result.data)
		if(result.message =='success'){
			if(values.rememberId){
				// userID 저장
				sessionStorage.setItem('userId',values.userName)
			}
			// 토큰 저장
			sessionStorage.setItem('accessToken',result.data.accessToken);

			// 토큰 파싱
			var base64Url = result.data.accessToken.split('.')[1];
			var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
			let parsePayload = JSON.parse(jsonPayload)

			// authority 저장
			sessionStorage.setItem('authority',parsePayload.authority)

			if((values.userName !=='' && values.password !=='') && result.data.passwordChangeYn !== 'Y' ){
				setModalState({
					isOpen: true,
					onClickConfirm: () => {},
				});
			} else if ( (values.userName !=='' && values.password !=='') && (result.data.passwordChangeYn == 'Y' || result.data.passwordChangeYn != null) ) {
				// 디자이너일 경우 게시글 관리로
				if(sessionStorage.getItem('authority') == 'DESIGNER'){
					navigate('/board')
				} else {
					navigate('/category')
				}
			}
		} else {
			if(result.status == 20012){
				alert('비밀번호를 확인해주세요.')
			} else if (result.status == 20003){
				alert('아이디를 찾을 수 없습니다.')
			}
			return
		}
	};

	const onClickLogin = async () =>{
		const usePassword = (document.querySelector('.usePassword') as HTMLInputElement).value;
		const confirmPassword = (document.querySelector('.confirmPassword') as HTMLInputElement).value;
		const reg = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,}$/;
		if(usePassword.match(reg) == null){
			return
		} else if(usePassword !== confirmPassword){
			return
		}else {
			setModalState({
				isOpen: false,
				onClickConfirm: async () => {
				},
			});
			let data = {
				'passwordChangeYn' : 'Y',
				'password' : confirmPassword
			}
			let result = await addAdminAPI(data,originalData.accountId);
			navigate('/category')
		}
		
	}
	const rightId = useCallback((_: any, value: string) => {
		const usePassword = (document.querySelector('.usePassword') as HTMLInputElement).value;
		if (usePassword !== value) {
			return Promise.reject(new Error('패스워드가 동일하지 않습니다.'));
		}
			return Promise.resolve();
	}, [], );

	const NormalPopup = () => {
		let style = {}
		if(modalState.isOpen){
			style = {display : 'block',position:'absolute',height: '45%', width: '40%', top:'50%', left: '50%', transform: 'translate(-50%, -50%)', border: '1px solid #d9d9d9',zIndex:'9999',background: 'rgb(255, 255, 255,0.9)'}
		} else {
			style = {display : 'none'}
		}
		return (
			<LoginForm initialValues={{ remember: true }} style={style}>
				<div>
					<div style={{ width: '100%', height: '50px', fontSize: '24px', display: 'flex', justifyContent: 'start', alignItems: 'center',marginLeft:'30px'}}>
						패스워드 설정
					</div>

					<div style={{display:'gird',gridTemplateColumns: '1fr',width:'80%',margin: '30px 0px 20px 50px',fontSize:'16px',fontWeight:'bold'}}>
						<span>패스워드</span>
						<Form.Item name="usePassword" rules={[{ required: true, pattern: /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{10,}$/, message: '사용할 수 없는 패스워드입니다.' }]} style={{margin:'10px 0 0 0'}}>
							<Input type="password" placeholder="패스워드를 입력하세요." className="usePassword" style={{height:'40px'}}/>
						</Form.Item>
						<div style={{margin:'10px 0px 0px 15px',fontSize:'16px',fontWeight:'bold'}}><span>최소 10자리 이상 : 영어 대문자, 소문자, 숫자, 특수문자 중 2종류 이상 조합</span></div>
					</div>

					<div style={{display:'gird',gridTemplateColumns: '1fr',width:'80%',margin: '30px 0px 20px 50px',fontSize:'16px',fontWeight:'bold'}}>
						<span>패스워드 확인</span>
						<Form.Item name="passwordConfirm" rules={[{ validator: rightId }]}>
							<Input type="password" placeholder="패스워드를 다시 입력해주세요"  className="confirmPassword"  style={{height:'40px'}} />
						</Form.Item>
					</div>

					<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}>
						<button onClick={() => onClickLogin()} style={{width: '220px', height: '40px', borderRadius: '8px',border:'1px solid #787878', background: '#fff', fontSize: '18px', fontWeight: 'bold', cursor:'pointer'}}>로그인</button>
					</div>
				</div>
			</LoginForm>
		);
	};
	
	
	return (
		<>
		<LoginContainer>
			<NormalPopup/>
			<LoginForm initialValues={{ remember: true }} onFinish={onFinish} form={form} >
				<LoginLogo>로그인</LoginLogo>
				<Form.Item name="userName" rules={[{ required: true, message: '아이디를 확인해주세요' }]}>
					<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="아이디"/>
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true, message: '비밀번호를 확인해주세요' }]}>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="패스워드"
					/>
				</Form.Item>
				<Form.Item>
					<Form.Item name="rememberId" valuePropName="checked" noStyle>
						<Checkbox>
							아이디 저장
						</Checkbox>
					</Form.Item>

				</Form.Item>

				<Form.Item>
					<LoginButton type="primary" htmlType="submit">
						로그인
					</LoginButton>
				</Form.Item>
			</LoginForm>
		</LoginContainer>
		</>
	);
};

const LoginContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
`;

const LoginForm = styled(Form)`
	display: flex;
	flex-direction: column;
	min-width: 400px;
	border: 1px solid #eee;
	padding: 10px 20px 0;
`;

const LoginLogo = styled.div`
	align-self: center;
	color: #293450;
	font-size: 30px;
	margin-bottom: 20px;
`;

const LoginButton = styled(Button)`
	width: 100%;
	border-color: #1060ab;
	background: #1060ab;
`;

export default Login;
