import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 环境变量配置的基地址
  timeout: 60000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    
    // 添加 token
    const token = store.state.token || sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      }
    }
    
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { data, config } = response
    
    // 如果是文件流，直接返回
    if (config.responseType === 'blob') {
      return data
    }
    
    // 根据后端返回的数据结构进行调整
    if (data.code === 200 || data.code === 0 || data.success) {
      return data
    } else if(data.code === 1001000000 && data.msg.includes('HISTORY')) {
      MessageBox.confirm('Previous users, please use your registered email to reset your password!', 'Tip', {
        confirmButtonText: 'ToReset',
        cancelButtonText: 'Cancel',
        type: 'none'
      }).then(() => {
        router.push('/resetPwd')
      }).catch(() => {})
    } else if (data.msg == 'DUPLICATE_USERNAME') {
      MessageBox.confirm('Duplicate username, please use your registered email to reset your password!', 'Tip', {
        confirmButtonText: 'ToReset',
        cancelButtonText: 'Cancel',
        type: 'none'
      }).then(() => {
        router.push('/resetPwd')
      }).catch(() => {})
    } else {
      // 业务错误处理
      const message = data.message || data.msg || 'request error'
      
      // 如果是登录过期
      if (data.code === 401) {
        MessageBox.confirm('Login has expired, please log in again', 'Tip', {
          confirmButtonText: 'Re login',
          cancelButtonText: 'Cancel',
          type: 'none'
        }).then(() => {
          store.dispatch('user/logout')
          router.push('/login')
        }).catch(() => {})
      } else if (config.url?.includes('captcha/get') || config.url.includes('captcha/check')) {
        return data
      } else {
        Message.error(message)
      }
      
      return Promise.reject(new Error(message))
    }
  },
  error => {
    console.error('response error:', error)
    
    let message = 'network error'
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          message = data.message || 'request error'
          break
        case 401:
          message = 'Unauthorized, please log in again'
          MessageBox.confirm('Login has expired, please log in again', 'Tip', {
          confirmButtonText: 'Re login',
          cancelButtonText: 'Cancel',
            type: 'none'
          }).then(() => {
            store.dispatch('user/logout')
            router.push('/login')
          })
          break
        case 403:
          message = 'Access denied'
          break
        case 404:
          message = 'The requested address does not exist'
          break
        case 405:
          message = 'Request method not allowed'
          break
        case 408:
          message = 'Request timeout'
          break
        case 500:
          message = 'Internal server error'
          break
        case 501:
          message = 'Service not implemented'
          break
        case 502:
          message = 'Bad Gateway '
          break
        case 503:
          message = 'Service unavailable'
          break
        case 504:
          message = 'Gateway timeout '
          break
        case 505:
          message = 'HTTP version is not supported'
          break
        default:
          message = `Connection error ${status}`
      }
    } else if (error.request) {
      message = 'Network connection failed, please check the network'
    } else {
      message = error.message
    }
    
    Message.error(message)
    return Promise.reject(error)
  }
)

/**
 * GET 请求
 * @param {string} url 请求地址
 * @param {object} params 查询参数
 * @param {object} config 额外配置
 * @returns {Promise}
 */
export function get(url, params = {}, config = {}) {
  return service({
    url: url,
    method: 'get',
    params: params,
    ...config
  }).catch(err => err)
}

/**
 * POST 请求
 * @param {string} url 请求地址
 * @param {object} data 请求体数据
 * @param {object} config 额外配置
 * @returns {Promise}
 */
export function post(url, data = {}, config = {}) {
  return service({
    url: url,
    method: 'post',
    data: data,
    ...config
  }).catch(err => err)
}

/**
 * PUT 请求
 * @param {string} url 请求地址
 * @param {object} data 请求体数据
 * @param {object} config 额外配置
 * @returns {Promise}
 */
export function put(url, data = {}, config = {}) {
  return service({
    url: url,
    method: 'put',
    data: data,
    ...config
  }).catch(err => err)
}

/**
 * DELETE 请求
 * @param {string} url 请求地址
 * @param {object} params 查询参数
 * @param {object} config 额外配置
 * @returns {Promise}
 */
export function del(url, params = {}, config = {}) {
  return service({
    url: url,
    method: 'delete',
    params: params,
    ...config
  }).catch(err => err)
}

/**
 * PATCH 请求
 * @param {string} url 请求地址
 * @param {object} data 请求体数据
 * @param {object} config 额外配置
 * @returns {Promise}
 */
export function patch(url, data = {}, config = {}) {
  return service({
    url: url,
    method: 'patch',
    data: data,
    ...config
  }).catch(err => err)
}

/**
 * 文件上传请求
 * @param {string} url 请求地址
 * @param {FormData} formData 表单数据
 * @param {object} config 额外配置
 * @returns {Promise}
 */
export function upload(url, formData, config = {}) {
  return service({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  }).catch(err => err)
}

/**
 * 文件下载请求
 * @param {string} url 请求地址
 * @param {object} params 查询参数
 * @param {string} filename 文件名
 * @param {object} config 额外配置
 * @returns {Promise}
 */
export function download(url, params = {}, filename = 'download', config = {}) {
  return service({
    url,
    method: 'get',
    params,
    responseType: 'blob',
    ...config
  }).then(response => {
    // 创建 blob 链接并下载
    const blob = new Blob([response])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }).catch(err => err)
}

export default service