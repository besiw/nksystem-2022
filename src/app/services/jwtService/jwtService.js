import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.request.use(function (config) {
			const { url, ...rest } = config;
			const updated = {
				...rest,
				url: `${process.env.REACT_APP_API_URL}/api${url}`
			};
			/* 			console.log(updated); */
			return updated;
		});
		axios.interceptors.response.use(
			response => response,
			err => {
				console.log(err);
				return new Promise((resolve, reject) => {
					if (err.response && err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid accessToken');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const accessToken = this.getAccessToken();
		const userId = this.getSessionUserId();
		if (!accessToken) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(accessToken)) {
			this.setSession(accessToken, userId);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'accessToken expired');
		}
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			const url = `/users/Authenticate`;

			const options = {
				url,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					UserName: email,
					Password: password
				}
			};

			axios(options)
				.then(response => {
					if (response.data) {
						this.setSession(response.data.token, response.data.id);
						const user = response.data;

						const toReturn = {
							role: ['admin'], // guest
							data: {
								companyId: user.companyId,
								id: user.id,
								userName: user.userName,
								displayName: user.fullName
								/* 							photoURL: 'assets/images/avatars/Velazquez.jpg',
							email: 'johndoe@withinpixels.com',
							shortcuts: ['calendar', 'mail', 'contacts', 'todo'] */
							}
						};

						resolve(toReturn);
					} else {
						reject(response.data.error);
					}
				})
				.catch(error => {
					reject(error.message);
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			const token = this.getAccessToken();
			const id = this.getSessionUserId();
			axios
				.get(`/UserProfile/GetUserProfile`, {
					params: {
						UserProfileID: id
					},
					headers: {
						Authorization: `Bearer ${token}`
					}
				})
				.then(response => {
					if (response.data && response.data.userProfile) {
						const user = response.data.userProfile;
						const toReturn = {
							role: ['admin'], // guest
							data: {
								companyId: user.companyId,
								id: user.id,
								userName: user.userName,
								displayName: user.userName
								/* 								photoURL: 'assets/images/avatars/Velazquez.jpg',
								email: 'johndoe@withinpixels.com',
								shortcuts: ['calendar', 'mail', 'contacts', 'todo'] */
							}
						};
						resolve(toReturn);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	setSession = (accessToken, id) => {
		if (accessToken && id) {
			localStorage.setItem('session_userId', id);
			localStorage.setItem('jwt_accessToken', accessToken);
			console.log(accessToken);
			axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
		} else {
			localStorage.removeItem('session_userId');
			localStorage.removeItem('jwt_accessToken');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = accessToken => {
		if (!accessToken) {
			return false;
		}
		const decoded = jwtDecode(accessToken);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_accessToken');
	};

	getSessionUserId = () => {
		return window.localStorage.getItem('session_userId');
	};
}

const instance = new JwtService();

export default instance;
