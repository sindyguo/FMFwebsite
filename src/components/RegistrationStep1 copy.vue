<template>
  <div class="registration-step1">
    <div class="registration-step1-form">
      <el-form ref="registrationForm" :model="registrationForm" :rules="registrationRules" label-position="right"
        label-width="220px">
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

        <el-form-item label="Email (alternative)" prop="email">
          <el-input v-model="registrationForm.email" placeholder="Please enter" clearable></el-input>
        </el-form-item>

        <el-form-item label="Code" prop="code">
          <el-input 
            v-model="registrationForm.code" 
            placeholder="Please enter" 
            clearable
            :disabled="isCountdownActive"
          >
            <template #append>
              <el-button 
                :disabled="isCountdownActive || !canSendCode"
                @click="sendEmailCode"
                :loading="sendingCode"
              >
                {{ countdownText }}
              </el-button>
            </template>
          </el-input>
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
          confirmPassword: '',
          email: '',
          code: ''
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
          ],
          email: [
            { required: true, message: 'Please input your email', trigger: 'blur' }
          ],
          code: [
            { required: true, message: 'Please input your code', trigger: 'blur' }
          ]
        },
        isCountdownActive: false,
        countdownSeconds: 60,
        countdownTimer: null,
        sendingCode: false,
        canSendCode: false
      }
    },
    computed: {
      countdownText() {
        return this.isCountdownActive ? `${this.countdownSeconds}s` : 'Send Code';
      }
    },
    watch: {
      'registrationForm.email': function(newVal) {
        console.log('Email changed:', newVal);
        this.updateCanSendCode();
      }
    },
    methods: {
      sendEmailCode() {
        // Validate basic form requirements before sending code
        if (!this.registrationForm.email) {
          this.$message.error('Please enter your email address first');
          return;
        }

        this.sendingCode = true;

        // Call API to send verification code
        this.$api.sendRegisterRmailCode({
          username: this.registrationForm.username,
          password: this.registrationForm.password,
          email: this.registrationForm.email
        })
        .then(res => {
          this.$message.success('Verification code sent successfully!');
          
          // Start countdown timer
          this.startCountdown();
          
          // Optionally populate the code field if returned in response
          if (res.data && res.data.code) {
            this.registrationForm.code = res.data.code;
          }
        })
        .catch(err => {
          this.$message.error('Failed to send verification code: ' + err.message);
        })
        .finally(() => {
          this.sendingCode = false;
        });
      },

      startCountdown() {
        this.isCountdownActive = true;
        this.countdownSeconds = 60;
        
        this.countdownTimer = setInterval(() => {
          this.countdownSeconds--;
          
          if (this.countdownSeconds <= 0) {
            this.isCountdownActive = false;
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
          }
        }, 1000);
      },

      // Update validation method to check if email is valid before allowing send
      updateCanSendCode() {
        // Check if email is valid before enabling send button
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.canSendCode = emailRegex.test(this.registrationForm.email);
      },

      nextClick() {
        const self = this
        this.$refs.registrationForm.validate(valid => {
          if (valid) {
            self.$api.validateRegisterRmailCode({
              email: self.registrationForm.email,
              code: self.registrationForm.code
            }).then(res => { 
              console.log('res:', res)
              // self.$emit('nextSuccess', self.registrationForm.username, self.registrationForm.password)
            })
            
          }
        })
      }
    },
    beforeDestroy() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
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

::v-deep .el-form-item__label {
  font-size: 18px !important;
}
.registration-step1-footer{
  font-size: 18px;
}
</style>