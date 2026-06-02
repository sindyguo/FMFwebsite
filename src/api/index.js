import service, { get, post, download, put, del } from '@/utils/request'
import axios from 'axios'

function encodeQueryWithPercent20(params = {}) {
  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== undefined && item !== null) {
          searchParams.append(key, item)
        }
      })
      return
    }

    searchParams.append(key, value)
  })

  return searchParams
    .toString()
    .replace(/\+/g, '%20')
    .replace(/%2C/g, ',')
}

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
   * 用户登录
   * @param {Object} data - 登录数据
   * @param {string} data.email - 邮箱
   * @param {string} data.password - 密码
   * @param {string} data.login_user_type - 密码
   * @returns {Promise}
   */
  emailLogin(data) {
    return post('/admin-api/system/auth/email-login', data)
  },
  /**
   * 刷新token
   * @param {string} refreshToken - 刷新token
   * @returns {Promise}
   */
  refreshToken(refreshToken) {
    return post('/admin-api/system/auth/refresh-token?refreshToken=' + refreshToken)
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
   * 快速注册入口发送邮箱验证码
   * @param {string} email - 邮箱
   * @param {string} captchaVerification - 图片验证码
   * @returns {Promise}
   */
  sendEmailCode2(data) {
    return post('/admin-api/system/auth/send-email-code2', data)
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
  sendLoginEmailCode(data) {
    return post('/admin-api/system/auth/send-login-email-code', data)
  },
  emailCodeLogin(data) {
    return post('/admin-api/system/auth/email-code-login', data)
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
  // 参会注册入口请求
  userCongressAttendeeRegistration(data) {
    return get('/app-api/fmf/user/congress/attendeeRegistration', data || {})
  },
  // 摘要提交入口请求
  userCongressAbstractSubmission(data) {
    return get('/app-api/fmf/user/congress/abstractSubmission', data || {})
  },
  // 创建支付token
  createPayToken(data) {
    return post('/app-api/fmf/webuser/create-token', data)
  },
  // 查询支付状态
  getPaymentStatus(paymentToken) {
    return get(`/app-api/fmf/webuser/payment-status/${paymentToken}`)
  },

  // 创建支付session
  createPaySession(data) {
    return post('/app-api/fmf/webuser/stripe/create-checkout-session', data)
  },
  // 查询支付状态
  getPaySessionStatus(paySessionId) {
    return get(`/app-api/fmf/webuser/stripe/session-status?session_id=${paySessionId}`)
  },

  /** 世界大会web */
  // 获得会议列表
  websiteCongressList(data) {
    return get('/app-api/fmf/website/congress/list', data, {
      paramsSerializer: {
        serialize: params => encodeQueryWithPercent20(params)
      }
    })
  },
  // 获得会议
  websiteCongressGet(data) {
    return get(`/app-api/fmf/website/congress/get`,data)
  },
  // 后台会议详情
  congressGet(data) {
    return get(`/admin-api/fmf/congress/get`, data)
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
  // 更新演讲者注册信息（congress）
  congressPresentationUpdate(data) {
    return put(`/app-api/fmf/user/congress/presentation/update`, data)
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
  // 发送邮箱验证码注册验证码
  sendRegisterRmailCode(data) {
    return post(`/admin-api/system/auth/send-register-email-code`,data)
  },

  // 验证注册邮箱验证码验证码
  validateRegisterRmailCode(data) {
    return post(`/admin-api/system/auth/validate-register-email-code`,data)
  },
  // 下载证书, templateCode: abstract-certificate01, abstract-certificate02, certificate, confirmation, invoice, receipt, visa
  exportCongressFile(templateCode,congressId,fileId,fileName) {
    return download(`/app-api/fmf/user/congress/${templateCode}/${congressId}`,fileId,fileName+'.pdf')
  },

  // 获取内容设置
  getConfiguration(data) {
    return get(`/admin-api/content/configuration/page`,data)
  },
  

  // student获取登录用户信息TDSY-142#1.1detail
  // getOwnUserInfo(data) {
  //   return get(`/admin-api/fmf/user/own-page/profile`,data)
  // },

  // student更新用户信息TDSY-142#1.1.1edit
  updateOwnUserInfo(data) {
    return put(`/app-api/fmf/user/own-page/updateForUser`,data)
  },

  // 删除我的账户（ids: array of user id）
  deleteOwnUserList(data) {
    return del('/app-api/fmf/user/own-page/delete-list', data)
  },

  // student修改邮箱校验或发送验证码TDSY-142#1.1.3ChangeEmail
  sendMailCodeForEditEmail(data) {
    return post(`/admin-api/system/auth/sendMailCodeForEditEmail`,data)
  },
  // student邮箱登录人修改TDSY-142#1.1.3ChangeEmail
  resetEmail(data) {
    return post(`/admin-api/fmf/user/resetEmail`,data)
  },
  
  // /admin-api/fmf/research-publications/search
  getResearchPublications(data) {
    return get(`/admin-api/fmf/research-publications/search`,data)
  },

  // 按课程统计各个国家的完课情况
  getCourseCountry(data) {
    return get(`/app-api/fmf/statistics/courseCountry`,data)
  },

  // 按课程国家获取完课人员清单
  getCourseCountryUserList(data) {
    return get(`/app-api/fmf/statistics/courseCountryUserList`,data)
  },

  // 按 identity（diploma / fellowship）统计各国人数
  getUsersMapCountry(data) {
    return get(`/app-api/fmf/statistics/usersMapCountry`, data)
  },

  // 按 identity + country 获取该国详细用户列表
  getUsersMapCountryUserList(data) {
    return get(`/app-api/fmf/statistics/usersMapCountryUserList`, data)
  },

  // OAuth 授权（参数以 query string 形式传递）
  oauthAuthorize(params) {
    return service({
      url: '/admin-api/fmf/oauth/authorize',
      method: 'post',
      params
    }).catch(err => err)
  },
  // 获取网站 abstracts 年份列表
  getWebsiteAbstracts(data) {
    return get('/app-api/fmf/website/presentation/abstracts', data)
  },

  // 查询图片大赛列表（用于判断当前用户是否已提交）
  getImageContestPage(data) {
    return get('/app-api/fmf/user-image/page', data)
  },

  // 提交图片大赛
  submitImageContest(data) {
    return post('/app-api/fmf/user-image/create', data)
  },

  // 快速注册（未登录/免登录）提交
  unregisteredSubmit(data) {
    return post('/admin-api/fmf/registration/admin/unregisteredSubmit', data)
  },

  // 检查注册状态
  checkRegistration(data) {
    return service({
      url: '/app-api/fmf/user/presentation/checkRegistration',
      method: 'put',
      data
    }).catch(err => err)
  },

  // 下载 FMF License V1
  downloadLicenceV1() {
    return download(`/admin-api/fmf/license/download_v2`, {}, 'licence.xml')
  },

  // 下载 FMF License V2
  downloadLicenceV2() {
    return download(`/admin-api/fmf/license/download`, {}, 'licence.xml')
  },
  getCourseCertificatePage(params) {
    return service({
      url: '/admin-api/fmf/userCourseCertificate/page',
      method: 'get',
      params
    })
  },
  getImageReviewLogPage(params) {
    return service({
      url: '/app-api/fmf/appImageReviewLog/page',
      method: 'get',
      params
    })
  },
  getImageReviewLogUserPage(params) {
    return service({
      url: '/app-api/fmf/appImageReviewLog/userPage',
      method: 'get',
      params
    })
  },
  getImageReviewPublishDetail(params) {
    return service({
      url: '/admin-api/fmf/image-review-publish/get',
      method: 'get',
      params
    })
  },
  createImageReviewLog(data) {
    return service({
      url: '/app-api/fmf/appImageReviewLog/create',
      method: 'post',
      data
    })
  },
  updateImageReviewLog(data) {
    return service({
      url: '/app-api/fmf/appImageReviewLog/update',
      method: 'put',
      data
    })
  },
  getImageReviewLogDetail(id) {
    return service({
      url: '/app-api/fmf/appImageReviewLog/get?id='+id,
      method: 'get',
    })
  },
  /**课程校验 */
  getUserLearingProcessResult(courseId) {
    return service({
      url: '/app-api/fmf/webuser/getUserLearingProcessResult?courseId='+courseId,
      method: 'get',
    })
  },
}
