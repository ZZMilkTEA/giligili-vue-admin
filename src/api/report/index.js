import axios from 'axios';

// 创建视频
const listPendingReport = (start, limit,token) => axios.get('/api/v1/pending-reports', {params: { start, limit },headers:{'token':token}}).then(res => res.data);

const handleReport = (form,id,token) => axios.put(`/api/v1/reports/${id}`, form,{headers:{'token':token}}).then(res => res.data);


export{
  listPendingReport,
  handleReport
}
