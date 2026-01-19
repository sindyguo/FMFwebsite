import { get, post, download, put } from '@/utils/request'
import axios from 'axios'

// 用户相关 API
export default {
  /**
   * 注册用户
   * @param {Object} data - 登录数据
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise}
   */
  register(data) {
    return post('/admin-api/system/auth/register', data)
  },
  /**
   * 用户登录
   * @param {Object} data - 登录数据
   * @param {string} data.username - 用户名
   * @param {string} data.password - 密码
   * @returns {Promise}
   */
  login(data) {
    return post('/admin-api/system/auth/login', data)
  },
  /**
   * 获取用户信息
   * @param {string} tenant-id - 租户编号
   * @returns {Promise}
   */
  getUserInfo() {
    return get('/admin-api/system/user/profile/get', {})
  },
  /**
   * 退出登录
   * @returns {Promise}
   */
  logout() {
    return post('/admin-api/system/auth/logout', {})
  },
  // 获取验证图片以及token
  captchaGet(data) {
    return post('/admin-api/system/captcha/get', data)
  },
  // 滑动或者点选验证
  captchaCheck(data) {
    return post('/admin-api/system/captcha/check', data)
  },
  /**
   * 修改密码发送邮箱验证码
   * @param {string} email - 邮箱
   * @param {string} captchaVerification - 图片验证码
   * @returns {Promise}
   */
  sendEmailCode(data) {
    return post('/admin-api/system/auth/send-email-code', data)
  },
  /**
   * 修改密码
   * @param {string} email - 邮箱
   * @param {string} code - 邮箱验证码
   * @param {string} password - 新密码
   * @returns {Promise}
   */
  emailResetPassword(data) {
    return post('/admin-api/system/auth/email-reset-password', data)
  },
  /** 获得证书申请审核分页
   * @param {string} pageNo - 页码，从1开始
   * @param {string} pageSize - 每页条数，最大100
   * @returns {Promise}
   */
  webUserLearingProcessPage(data) {
    return get('/app-api/fmf/webuser/getUserLearingProcessPage', data)
  },
  /** 完课证明pdf文件预览
   * @param {string} courseId - 课程id
   * @param {string} userId - 用户id
   * @returns {Promise}
   */
  websiteCourseCompletionCertificate(courseId, userId) {
    return get(`/app-api/fmf/website/courseCompletionCertificate/${courseId}/${userId}`, {}, {responseType: 'blob'})
  },
  
  /** 网站导航
   * @param {string} categoryName - 分类名称
   * @returns {Promise}
   */
  websiteNavigation(params) {
    // return get('/app-api/fmf/website/navigation', params)
    return get('/app-api/fmf/website/navigation', params)
  },
  /** 课程导航
   * @param {string} categoryName - 分类名称
   * @returns {Promise}
   */
  websiteCourseNavigation(params) {
    return get('/app-api/fmf/website/courseNavigation', params)
  },
  /** 文章导航
   * @param {string} categoryName - 分类名称
   * @returns {Promise}
   */
  websiteArticleNavigation(params) {
    return get('/app-api/fmf/website/articleNavigation', params)
  },
  /** 课程内容
   * @param {string} id - 课程id
   * @param {string} language - 语言(English)
   * @returns {Promise}
   */
  websiteCourse(params) {
    return get('/app-api/fmf/website/course', params)
  },

  /** 获取练习题
   * @param {string} pageid - 分页id
   * @returns {Promise}
   */
  webuserCourseExercises(params) {
    return get('/app-api/fmf/webuser/courseExercises', params)
  },
  /** 获取考试题
   * @param {string} courseId - 课程id
   * @returns {Promise}
   */
  webuserCourseExamination(params) {
    return get('/app-api/fmf/webuser/courseExamination', params)
  },
  /** 提交考试答案
   * @param {string} courseId - 课程id
   * @returns {Promise}
   */
  webuserSubmitCourseExamination(data) {
    return post('/app-api/fmf/webuser/submitCourseExamination', data)
  },
  /** 验证邮箱是否已经注册
   * @param {emails} emails - 邮箱集合，用英文逗号分隔
   * @param {type} type - 业务类型，registration: 注册，presentation: 演讲
   * @returns {Promise}
   */
  userCongressVerifyEmail(params) {
    return get('/app-api/fmf/user/congress/verify-email', params)
  },

  /**
   * 上传文件
   * @param {File} file 文件对象 (必填)
   * @param {string} directory 文件目录，例如：'user/avatar' 或 'document/temp' (可选)
   * @returns {Promise} 返回上传结果
   */
  uploadFile(file, directory, note) {
    const formData = new FormData()
    formData.append('file', file)
    return get('/admin-api/infra/file/presigned-url', {
      name: file.name,
      directory: directory,
      note: note
    }).then(presignedResponse => { 
      const presignedInfo = presignedResponse.data


      return axios.put(presignedInfo.uploadUrl, file, {
        headers: {
          'Content-Type': file.type
        },
        // onUploadProgress: uploadProgressHandler
      })
      .then((res) => {
        console.log('res:', res);
        console.log('presignedInfo.url:', presignedInfo);
        console.log(file)
        var infodata = {
          configId: presignedInfo.configId,
          url: presignedInfo.url,
          path: presignedInfo.path,
          name: file.name,
          type: file.type,
          size: file.size
        }
        return post('/admin-api/infra/file/create', infodata).then(res => {
          return { 
            url: presignedInfo.url,
            id: res.data
          };
        })
      });



      // const infodata = {
      //   configId: presignedInfo.configId,
      //   url: presignedInfo.url,
      //   path: presignedInfo.path,
      //   name: file.name,
      //   type: file.type,
      //   size: file.size
      // }
      // return post('/admin-api/infra/file/create', infodata).then(res => {
      //   return { 
      //     url: presignedInfo.url,
      //     id: res.data
      //   };
      // })
    }).catch(error => {
      console.error('Error getting presigned URL:', error);
      throw error;
    })
  },
  /**
   * 文件下载
   * @param {string} fileId - 文件ID
   * @param {string} filename - 文件名
   * @returns {Promise}
   */
  downloadFile(fileId, filename) {
    return download('/download', { fileId }, filename)
  },
  // 获取国家下拉选项
  getCountries() {
    return get('/app-api/fmf/website/countries')
  },
  // 获取语言下拉选项
  getLanguages() {
    return get('/app-api/fmf/website/languages')
  },
  
  /** 世界大会user */
  // 更新订单支付状态
  userCongressUpdateOrder(orderId) {
    return post(`/app-api/fmf/user/congress/updateOrder/${orderId}`, {})
  },
  // 参会报名注册提交
  userCongressRegistrationSubmit(data) {
    return post('/app-api/fmf/user/congress/registration/submit', data)
  },
  // 参会报名注册初始化
  userCongressRegistrationInit(data) {
    return post('/app-api/fmf/user/congress/registration/init', data)
  },
  // 创建演讲者注册信息
  userCongressPresentationCreate(data) {
    return post('/app-api/fmf/user/congress/presentation/create', data)
  },
  // 团体参会报名注册提交
  userCongressGroupRegistrationSubmit(data) {
    return post('/app-api/fmf/user/congress/groupregistration/submit', data)
  },
  // 团体参会报名注册补充提交
  userCongressGroupRegistrationComplementSubmit(data) {
    return post('/app-api/fmf/user/congress/groupregistration/complementSubmit', data)
  },
  // 团体参会报名注册补充初始化
  userCongressGroupRegistrationComplementInit(data) {
    return post('/app-api/fmf/user/congress/groupregistration/complementInit', data)
  },
  // 创建支付token
  createPayToken(data) {
    return post('/app-api/fmf/webuser/create-token', data)
  },
  // 查询支付状态
  getPaymentStatus(paymentToken) {
    return get(`/app-api/fmf/webuser/payment-status/${paymentToken}`)
  },

  /** 世界大会web */
  // 获得会议列表
  websiteCongressList(data) {
    return get('/app-api/fmf/website/congress/list', data)
  },
  // 获得会议
  websiteCongressGet(data) {
    return get(`/app-api/fmf/website/congress/get`,data)
  },
  // 获得会议报名
  registrationGet(data) {
    return get(`/app-api/fmf/user/registration/page`,data)
  },
  // 演讲者
  presentationGet(data) {
    return get(`/app-api/fmf/user/presentation/page`,data)
  },
  // 演讲者详情
  presentationDetail(data) {
    return get(`/app-api/fmf/user/presentation/get`, data)
  },
  // 更新演讲者注册信息
  presentationUpdate(data) {
    return put(`/app-api/fmf/user/presentation/update`, data)
  },
  // 获得订单列表
  orderGet(data) {
    return get(`/app-api/fmf/user/order/page`,data)
  },
  // 订单详情
  orderDetail(data) {
    return get(`/app-api/fmf/user/order/get`,data)
  },

  // 获得订单列表
  companyGet(data) {
    return get(`/admin-api/fmf/company/page`,data)
  },
  // 获得订单列表
  getOwnUserInfo(data) {
    return get(`/app-api/fmf/user/own-page/profile`,data)
  },
  // 获取赞助商详情
  getSponsorDetail(data) {
    return get(`/admin-api/fmf/company/get`,data)
  },
  
}
