<template>
  <div class="registration-step1">
    <div class="registration-step1-form">
      <el-form ref="registrationForm" :model="registrationForm" :rules="registrationRules" label-position="right"
        label-width="220px">
        <input type="text" name="fakeusername" style="position:absolute;left:-9999px" />
        <input type="password" name="fakepassword" style="position:absolute;left:-9999px" />

        <!-- <el-form-item label="Login name" prop="username">
          <el-input v-model="registrationForm.username" placeholder="Please enter" clearable
            autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="registrationForm.email" placeholder="Please enter" clearable>

            <template #append>
              <el-button 
                :disabled="isCountdownActive || !canSendCode"
                :class="[canSendCode ? 'isCountdownActive' : '']"
                @click="sendEmailCode"
                :loading="sendingCode"
              >
                {{ countdownText }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="registrationForm.password" placeholder="Please enter" show-password
            autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Password confirmation" prop="confirmPassword">
          <el-input v-model="registrationForm.confirmPassword" placeholder="Please enter" show-password
            autocomplete="off"></el-input>
        </el-form-item>

        

        <el-form-item label="Verification code" prop="code">
          <el-input 
            v-model="registrationForm.code" 
            placeholder="Please enter" 
            clearable
          >
            
          </el-input>
        </el-form-item>

      </el-form>
      <div class="doBtn">
        <el-button type="primary" style="width: 100%;" @click="nextClick">
          Next
        </el-button>
      </div>
    </div>
    <!-- <div class="registration-step1-footer">
      Please make a note of your chosen login name and password, as you will need these to submit your logbook.
    </div> -->
  </div>
</template>

<script>
  export default {
    data() {
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
        return this.isCountdownActive ? `Resend in ${this.countdownSeconds}s` : 'Verify my email';
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
          firstName: this.registrationForm.username,
          lastName: this.registrationForm.username,
          email: this.registrationForm.email
        })
        .then(res => {
          // this.$message.success('Verification code sent successfully!');
          
          // Start countdown timer
          
          console.log('res:', res)
          // Optionally populate the code field if returned in response
          if (res.data && res.code == 0) {
            this.registrationForm.code = res.data.code;
            this.startCountdown();
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
              if(res.code == 0 ){
                
                self.$emit('nextSuccess', self.registrationForm.password, self.registrationForm.email)
              }
              
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
/* ── Step 1 wrapper ──────────────────────────────────────── */
.registration-step1 {
  padding-top: 32px;

  &-form {
    width: 100%;
    max-width: 560px;
    margin: 0 auto;

    .doBtn {
      width: 100%;
      max-width: 320px;
      margin: 36px auto 24px;

      ::v-deep .el-button {
        height: 48px;
        font-size: 16px;
        border-radius: 10px;
        letter-spacing: 0.3px;
      }
    }
  }

  &-footer {
    font-weight: 400;
    font-size: 14px;
    color: #8a9094;
    line-height: 26px;
  }
}

/* ── Form field overrides ────────────────────────────────── */
::v-deep .el-form-item__label {
  font-size: 15px !important;
  color: #4a5b6a !important;
  font-weight: 500 !important;
  line-height: 1.4 !important;
}

::v-deep .el-input__inner {
  border-radius: 8px !important;
  border-color: #d6e2ee !important;
  height: 44px !important;
  line-height: 44px !important;
  font-size: 15px !important;
  color: #0e3045 !important;
  transition: border-color 0.2s, box-shadow 0.2s !important;

  &:focus {
    border-color: #036fc0 !important;
    box-shadow: 0 0 0 3px rgba(3, 111, 192, 0.1) !important;
  }
}

::v-deep .el-input-group__append {
  border-radius: 0 8px 8px 0 !important;
  border-color: #d6e2ee !important;
  background: #f4f8fd !important;
  padding: 0 14px !important;
}

/* Verify button in email append slot */
.isCountdownActive {
  background: #ecf5ff !important;
  color: #409eff !important;
  border-radius: 0 8px 8px 0 !important;
  border: 1px solid #c6e2ff !important;
}

/* ── Responsive ──────────────────────────────────────────── */

/* Mobile: ≤ 767px — switch labels above inputs */
@media (max-width: 767px) {
  .registration-step1 {
    padding-top: 20px;

    &-form {
      .doBtn {
        max-width: 100%;
        margin: 28px auto 20px;
      }
    }
  }

  /* Stack label above input */
  ::v-deep .el-form-item {
    display: block !important;
    margin-bottom: 14px !important;
  }

  ::v-deep .el-form-item__label {
    display: block !important;
    width: 100% !important;
    text-align: left !important;
    padding-bottom: 5px !important;
    padding-right: 0 !important;
    font-size: 13px !important;
  }

  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
  }

  ::v-deep .el-input__inner {
    height: 42px !important;
    line-height: 42px !important;
  }
}

/* Small mobile: ≤ 479px */
@media (max-width: 479px) {
  .registration-step1 {
    padding-top: 12px;
  }

  ::v-deep .el-form-item__label {
    font-size: 12px !important;
  }

  ::v-deep .el-input__inner {
    font-size: 14px !important;
  }
}
</style>