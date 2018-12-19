import axios from 'axios'
import qs from 'qs'

/*axios.defaults.timeout = 30000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// POST传参序列化
axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})*/

function execute(url, params) {
  return new Promise(function (resove, reject) {
    axios({
      type: "get",
      url: url,
      dataType: "json",
      data: params,
      success: function (data) {
        console.log(data);
        resove(data);
      },
      error: function (err) {
        reject(err);
      }
    })
  })
}
function uploadStru (data) {
  return axios({
    method: 'post',
    url: 'http://127.0.0.1:8080/redis/stru',
    timeout: 20000,
    data: data
  })
}
function uploadFile (data) {
  return axios({
    method: 'post',
    url: 'http://127.0.0.1:8080/syncFile/multifileUpload',
    timeout: 20000,
    data: data
  })
}
//https://minfo.gildata.com/memcached_visual_announcement/json?xxxx_2018_allIndex
function getNumData(orgcode,year) {
  return execute("/api/memcached_visual_announcement/json?" + orgcode+"_"+year+"_allIndex")
}

export {
  uploadStru,
  uploadFile
}
