import axios from 'axios'
import service from '@/utils/request'

/**
 * 通用文件上传（预签名 URL 流程）
 * 1. 获取预签名上传地址
 * 2. 直接 PUT 文件到 OSS
 * 3. 调用 /infra/file/create 注册文件记录
 *
 * @param {File}   file       原生 File 对象
 * @param {string} directory  存储目录（可选）
 * @param {string} note       文件备注（可选）
 * @returns {Promise<{ url: string, id: any }>}
 */
export function uploadFile(file, directory, note, filename=null) {
  return service({
    url: '/admin-api/infra/file/presigned-url',
    method: 'get',
    params: {
      name: filename? filename : file.name,
      directory: directory,
      note: note,
    },
  })
    .then((presignedResponse) => {
      const presignedInfo = presignedResponse.data

      return axios
        .put(presignedInfo.uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
        .then(() => {
          const fileInfo = {
            configId: '35',
            url: presignedInfo.url,
            path: presignedInfo.path,
            name: filename? filename : file.name,
            type: file.type,
            size: file.size,
          }
          return service({
            url: '/admin-api/infra/file/create',
            method: 'post',
            data: fileInfo,
          }).then((res) => ({
            ...fileInfo,
            id: res.data,
          }))
        })
    })
    .catch((error) => {
      console.error('uploadFile error:', error)
      throw error
    })
}


/**
 * 附件上传
 * @param {*} file 本地上传文件流 File
 * @param {*} uploadObj 上传附件配置项
 * @param {*} callback 方法回执
 * @returns 
 */
export function beforeUploadFn(file, uploadObj={accept: '.JPG,.JPEG,.PNG', size: 10*1024*1024}, callback) {
  let fileTypeArr = uploadObj.accept.split(",");
  fileTypeArr = fileTypeArr.map(item=>item.trim().toLowerCase());
  const flag = fileTypeArr.some(item=>file.name.endsWith(item));
  if(!flag) {
    this.$message.warning(`只能上传${uploadObj.accept}文件`);
    return;
  }
  if(file.size > uploadObj.size) {
    this.$message.warning(`单个文件不能超过${uploadObj.size/(1024*1024)}M！`);
    return;
  }
  callback(file);
}

export default {
  uploadFile,
  beforeUploadFn,
}
