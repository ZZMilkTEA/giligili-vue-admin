import axios from 'axios';

// 用户登录
const userLogin = form => axios.post('/api/v1/login', form).then(res => res.data);

//获取用户信息
const userGetInfo = id => axios.get(`/api/v1/users/${id}`).then(res => res.data);

//获取登陆用户信息
const userTokenGetInfo = token => axios.get('/api/v1/verify',{headers:{'token':token}}).then(res => res.data);

//获取用户信息
const listUsers = (start, limit, token) => axios.get(`/api/v1/users`,{ params: { start, limit },headers:{'token':token} }).then(res => res.data);

//改变用户信息
const changeUserInfo = (form, id, token) => axios.put(`/api/v1/users/${id}`,form,{headers:{'token':token}}).then(res => res.data);

export {
  userLogin,
  userGetInfo,
  userTokenGetInfo,
  listUsers,
  changeUserInfo,
};
