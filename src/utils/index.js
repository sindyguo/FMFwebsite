import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'

export default {
  // 检测是否登录，未登录则询问是否跳转到登录页
  checkLoginAndContinue(continueFunc = null) {
    if (!store.getters['user/isLogin']) {
      MessageBox.confirm('Not currently logged in, do you want to log in now?', 'Tip', {
        confirmButtonText: 'Log in',
        cancelButtonText: 'Cancel',
        type: 'none'
      }).then(() => {
        router.push('/login')
      }).catch(() => {})
    } else {
      continueFunc && continueFunc()
    }
  },
  // 开始考试
  startExam(courseId, courseTitle) {
    const { origin, pathname } = window.location 
    sessionStorage.setItem('courseId', courseId)
    sessionStorage.setItem('courseTitle', courseTitle)
    window.open(`${origin}${pathname}#/exam`, '_blank')
  },
  // 验证表单的多个字段(formRef - 表单引用 (this.$refs.form), fields - 要验证的字段名数组)
  validateFormFields(formRef, fields) {
    return new Promise((resolve) => {
      // 如果fields为空，验证整个表单
      if (!fields || fields.length === 0) {
        formRef.validate((valid) => {
          resolve({
            isValid: valid,
            failedFields: valid ? [] : ['form is invalid'],
            allFields: []
          })
        })
        return
      }
      // 将每个字段的验证转换为Promise
      const validationPromises = fields.map(field => {
        return new Promise((resolveField) => {
          formRef.validateField(field, (error) => {
            resolveField({
              field: field,
              error: error
            })
          })
        })
      })
      
      // 等待所有字段验证完成
      Promise.all(validationPromises).then(results => {
        // 过滤出验证失败的字段
        const failedFields = results.filter(result => result.error)
        resolve({
          isValid: failedFields.length === 0,
          failedFields: failedFields.map(item => ({
            name: item.field,
            error: item.error
          })),
          allFields: results
        })
      })
    })
  },
  // 将树转为扁平数组，树对象增加索引index
  flatTree(tree, childrenKey = 'children', keepChildren = true) {
    let index = 0;
    const src = Array.isArray(tree) ? tree : [tree];
    const res = [];

    (function dfs(nodes) {
      for (const node of nodes) {
        // eslint-disable-next-line no-unused-vars
        const newNode = keepChildren ? { ...node, index: index++ } : (({ [childrenKey]: _, ...rest }) => ({ ...rest, index: index++ }))(node);
        res.push(newNode);

        const children = node[childrenKey] || [];
        if (children.length) dfs(children);
      }
    })(src);

    return res
  },
  // 下载文件流
  downloadFile(flowData, fileName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19).replace('T', '_')
    const fname = fileName || `${timestamp}`
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(flowData, fname)
    } else {
      const a = document.createElement('a')
      a.download = fname
      a.href = URL.createObjectURL(flowData)
      a.click()
      a.remove()
      setTimeout(() => {
        URL.revokeObjectURL(flowData)
      }, 100)
    }
  },
  // 下载文件地址
  downloadUrl(fileUrl, fileName) {
    const token = store.state.token || sessionStorage.getItem('token')
    const headers = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    fetch(fileUrl, { headers }).then(async res => {
      if (!res.ok) {
        throw new Error(res.status)
      }
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json()
        throw new Error(errorData.msg || errorData.code)
      }
      return res.blob()
    }).then(blob => {
      this.downloadFile(blob, fileName)
    }).catch(errMsg => {
      Message.error(errMsg || 'Download failed')
    })
  }
}