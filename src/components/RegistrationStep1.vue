<template>
  <div class="registration-step1">
    <div class="registration-step1-form">
      <el-form ref="registrationForm" :model="registrationForm" :rules="registrationRules" label-position="right"
        label-width="180px">
        <input type="text" name="fakeusername" style="position:absolute;left:-9999px" />
        <input type="password" name="fakepassword" style="position:absolute;left:-9999px" />

        <el-form-item label="Login name" prop="username">
          <el-input v-model="registrationForm.username" placeholder="Please enter" clearable
            autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="registrationForm.password" placeholder="Please enter" show-password
            autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Password confirmation" prop="confirmPassword">
          <el-input v-model="registrationForm.confirmPassword" placeholder="Please enter" show-password
            autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="doBtn">
        <el-button type="primary" style="width: 100%;" @click="nextClick">
          Next
        </el-button>
      </div>
    </div>
    <div class="registration-step1-footer">
      Please make a note of your chosen login name and password, as you will need these to submit your logbook.
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('Please input your login name'))
        } else if (value.length < 4 || value.length > 30) {
          callback(new Error('Login name length should be between 4 and 30 characters'))
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          callback(new Error('Login name can only contain letters and numbers'))
        } else {
          callback()
        }
      };
      const validateConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input confirm password'));
        } else if (value !== this.registrationForm.password) {
          callback(new Error('Passwords do not match'));
        } else {
          callback();
        }
      };
      return {
        registrationForm: {
          username: '',
          password: '',
          confirmPassword: ''
        },
        registrationRules: {
          username: [
            { required: true, validator: validateUsername, trigger: ['blur', 'change'] }
          ],
          password: [
            { required: true, message: 'Please input your password', trigger: ['blur', 'change'] },
            { min: 4, max: 16, message: 'Password length should be between 4 and 16 characters', trigger: 'blur' }
          ],
          confirmPassword: [
            { validator: validateConfirmPassword, trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    methods: {
      nextClick() {
        const self = this
        this.$refs.registrationForm.validate(valid => {
          if (valid) {
            self.$emit('nextSuccess', self.registrationForm.username, self.registrationForm.password)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.registration-step1 {
  padding-top: 104px;
  &-form {
    width: 600px;
    margin: 0 auto;
    .doBtn {
      width: 244px;
      margin: 104px auto 171px;
    }
  }
  &-footer {
    font-weight: 400;
    font-size: 14px;
    color: #8A9094;
    line-height: 26px;
  }
}
.el-button--primary {
  background-color: #036fc0;
  border-color: #036fc0;
  color: white;
}

.el-button--primary:hover {
  background-color: #005a9c;
  border-color: #005a9c;
}

.el-button--default {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
}
</style>