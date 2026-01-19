<template>
  <div class="vcontainer vcenter hcenter login">
    <div class="hcontainer login-container">
      <div class="vcontainer flex-between login-left">
        <img src="@/assets/img/icon/icon_logo.png" class="logo-img " alt="">
        <span class="markInfo">Note to new users: if you do not have a login name and password, you will need to register and then attend the FMF courses. </span>
      </div>
      <div class="fill vcontainer">
        <span class="title">The Fetal Medicine Foundation</span>
        <div class="hcontainer vcenter flex-between">
          <span class="please">Please log in</span>
          <div class="registration" @click="goto('/registration')">
            Registration <img src="@/assets/img/icon/icon_jt.png" alt="">
          </div>
        </div>
        <el-form
          :model="loginForm"
          :rules="loginRules"
          label-position="left"
          ref="loginForm"
          class="login-form"
          label-width="130px">
          <el-form-item label="Login name" prop="username">
            <el-input v-model="loginForm.username" placeholder="Please enter" clearable></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="loginForm.password" placeholder="Please enter"
              show-password></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="handleLogin" style="width: 100%;">
          login
        </el-button>
        <div class="hcontainer vcenter flex-between footer-links">
          <a class="reset-pwd" @click="goto('/resetPwd')">Forgotten your password?</a>
          <a class="contact-us">Contact us</a>
        </div>
      </div>
    </div>
    <span class="copyright">© 2025 The Fetal Medicine Foundation</span>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'loginPage',
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            { required: true, message: 'Please input your login name', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please input your password', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions('user', ['login', 'changeActiveId']),
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.login(this.loginForm).then((resp) => {
              if (resp.code === 200 || resp.code === 0) {
                this.changeActiveId('')
                this.$router.replace({ path: '/' });
              }
            }).catch(() => {
              console.log('Login failed');
            });
          } else {
            console.log('Login failed');
          }
        });
      },
      goto(e) {
        this.$router.push(e)
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  font-size: 18px;
  color: #8A9094;
  .login-container {
    width: 1000px;
    height: 500px;
    padding: 50px 30px 50px 30px;
    background-color: #ffffff;
    .login-left {
      width: 400px;
      margin-right: 20px;
      .logo-img {
        width: 178PX;
        height: 80PX;
      }
    }
    .title {
      font-weight: bold;
      font-size: 25px;
      color: #0E3045;
      margin-bottom: 30px;
    }
    .registration {
      color: #036fc0;
      font-weight: bold;
      cursor: pointer;
    }
    .el-button--primary {
      height: 48px;
      background-color: #036fc0;
      border-color: #036fc0;
      color: #ffffff;
      &:hover {
        background-color: #005a9c;
        border-color: #005a9c;
      }
    }
    .footer-links {
      color: #0E3045;
      font-size: 15px;
      margin-top: 20px;
      .reset-pwd,
      .contact-us {
        text-decoration: none;
        cursor: pointer;
      }
      .reset-pwd:hover,
      .contact-us:hover {
        color: #036fc0;
      }
    }
  }
  .copyright {
    width: 1000px;
    margin-top: 15px;
  }
}
.markInfo{
  text-align: justify;
}
</style>

<style lang="scss">
  .login-form {
    margin: 60px 0 30px;
    .el-form-item__label {
      font-weight: bold !important;
      font-size: 18px !important;
      color: #0E3045 !important;
    }
    .el-input__inner {
      font-size: 16px !important;
    }
     
  }
  .el-button--primary{
      font-size: 16px !important;
     }
</style>