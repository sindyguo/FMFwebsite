import Vue from 'vue'
import AlternativeEmailDialog from '@/components/AlternativeEmailDialog.vue'
import BackupEmailDialog from '@/components/BackupEmailDialog.vue'
import AlternativeEmailForCodeLoginDialog from '@/components/AlternativeEmailForCodeLoginDialog.vue'

const AlternativeEmailDialogConstructor = Vue.extend(AlternativeEmailDialog)
const BackupEmailDialogConstructor = Vue.extend(BackupEmailDialog)
const AlternativeEmailForCodeLoginDialogConstructor = Vue.extend(AlternativeEmailForCodeLoginDialog)

export function showAlternativeEmailDialog(loginEmail) {
  const instance = new AlternativeEmailDialogConstructor()
  instance.loginEmail = loginEmail || ''
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true
}

export function showBackupEmailDialog(loginEmail) {
  const instance = new BackupEmailDialogConstructor()
  instance.loginEmail = loginEmail || ''
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true
}

export function showAlternativeEmailForCodeLoginDialog(loginEmailList) {
  const emailStr = Array.isArray(loginEmailList) && loginEmailList.length > 0
    ? loginEmailList[0]
    : (loginEmailList || '')
  const instance = new AlternativeEmailForCodeLoginDialogConstructor()
  instance.loginEmail = emailStr
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true
}
