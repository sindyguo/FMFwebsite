<template>
  <div :class="['hcontainer vcenter flex-between header-container', {'header-transparent': isTransparent}]">
    <div class="logo" title="The Fetal Medicine Foundation" @click="goto('/')">
      <img src="@/assets/img/logo.svg" alt="The Fetal Medicine Foundation">
    </div>
    <div class="hcontainer menu-wrapper main-container">
      <el-menu
        :default-active="activeId"
        unique-opened
        mode="horizontal"
        class="meBox"
        background-color="transparent"
        :text-color="isTransparent ? '#036fc0' : '#036fc0'"
        
        @select="menuSelect">
        <!-- :active-text-color="isTransparent ? '#036fc0' : '#0E3045'" -->
        <el-menu-item index="/">
          <span class="home-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4.5 10.2L12 4l7.5 6.2v8.3a1 1 0 0 1-1 1H14v-5.2h-4V19.5H5.5a1 1 0 0 1-1-1z" />
            </svg>
          </span>
        </el-menu-item>
        <template v-for="item in listData">
          <el-submenu
            v-if="item.childrenList && item.childrenList.length"
            :popper-class="getSubmenuClass(item)"
            :index="item.id"
            :key="item.id">
            <div slot="title" class="submenu-title" @click.capture="menuSelect(item.id)">
              {{ item.categoryName }}
            </div>
            <!-- 使得点击submenu时高亮 -->
            <!-- <el-menu-item :index="item.id" style="display:none"></el-menu-item> -->
            <el-menu-item
              v-for="childItem in getSortedChildren(item)"
              :key="childItem.id || childItem.categoryName"
              :index="childItem.id">
              <span class="submenu-item">
                <span
                  v-if="isOnlineCoursesMenu(item)"
                  :class="['submenu-icon', getMenuIconClass(childItem.categoryName)]"></span>
                <span class="submenu-text">{{ childItem.categoryName }}</span>
              </span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.id" :key="'menu-item-' + item.id">{{ item.categoryName }}</el-menu-item>
        </template>
      </el-menu>
    </div>
    <button class="menu-toggle" type="button" aria-label="Open menu" @click="isMobileMenuOpen = true">
      <i class="el-icon-menu" aria-hidden="true"></i>
    </button>
    <div class="auth-buttons btnBlock" v-if="isLogin">
      <div class="hcontainer vcenter" @click="goto('/mine')">
        <div class="userimg"></div>
        <div class="username">{{ username }}</div>
      </div>
      <div class="outBtn" @click="logoutClick"><img src="@/assets/img/icon/icon_outin.png" alt=""></div>
    </div>
    <div class="auth-buttons" v-else>
      <button class="login-btn" :style="{color: isTransparent ? '#FFFFFF' : '#036fc0'}" @click="goto('/login')">Login/Register</button>
    </div>
    <el-drawer
      :visible.sync="isMobileMenuOpen"
      direction="rtl"
      :with-header="false"
      size="80%"
      custom-class="mobile-menu-drawer">
      <div class="mobile-menu-content">
        <div class="mobile-menu-header">
          <div class="logo" title="The Fetal Medicine Foundation" @click="goto('/')">
            <img src="@/assets/img/logo.svg" alt="The Fetal Medicine Foundation">
          </div>
          <button class="drawer-close" type="button" aria-label="Close menu" @click="isMobileMenuOpen = false">
            <i class="el-icon-close" aria-hidden="true"></i>
          </button>
        </div>
        <el-menu
          :default-active="activeId"
          unique-opened
          mode="vertical"
          class="mobile-menu"
          background-color="transparent"
          :text-color="isTransparent ? '#036fc0' : '#036fc0'"
          @select="menuSelect">
          <el-menu-item index="/">
            <span class="home-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4.5 10.2L12 4l7.5 6.2v8.3a1 1 0 0 1-1 1H14v-5.2h-4V19.5H5.5a1 1 0 0 1-1-1z" />
              </svg>
            </span>
            <span class="mobile-menu-label">Home</span>
          </el-menu-item>
          <template v-for="item in listData">
            <el-submenu
              v-if="item.childrenList && item.childrenList.length"
              :index="item.id"
              :key="`mobile-${item.id}`">
              <div slot="title" class="submenu-title">
                {{ item.categoryName }}
              </div>
              <el-menu-item :index="item.id" :key="`mobile-parent-${item.id}`">
                {{ item.categoryName }}
              </el-menu-item>
              <el-menu-item
                v-for="childItem in getSortedChildren(item)"
                :key="`mobile-child-${childItem.id || childItem.categoryName}`"
                :index="childItem.id">
                <span class="submenu-item">
                  <span
                    v-if="isOnlineCoursesMenu(item)"
                    :class="['submenu-icon', getMenuIconClass(childItem.categoryName)]"></span>
                  <span class="submenu-text">{{ childItem.categoryName }}</span>
                </span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="item.id" :key="`mobile-menu-item-${item.id}`">
              {{ item.categoryName }}
            </el-menu-item>
          </template>
        </el-menu>
        <div class="mobile-auth">
          <div v-if="isLogin" class="mobile-auth-user" @click="goto('/mine')">
            <div class="userimg"></div>
            <div class="username">{{ username }}</div>
          </div>
          <div v-if="isLogin" class="mobile-auth-actions">
            <button class="mobile-auth-btn" type="button" @click="logoutClick">Logout</button>
          </div>
          <div v-else class="mobile-auth-actions">
            <button class="mobile-auth-btn outline" type="button" @click="goto('/login')">Login/Register</button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  export default {
    name: 'HeaderPage',
    props: {
      isTransparent: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        listData: [],
        isMobileMenuOpen: false
      }
    },
    computed: {
      ...mapState('user', ['activeId']),
      ...mapGetters('user', ['isLogin', 'username'])
    },
    methods: {
      ...mapActions('user', ['logout', 'changeActiveId']),
      getVisibleChildren(item) {
        return (item?.childrenList || []).filter((child) => {
          const name = (child?.categoryName || '').trim()
          return name.length > 0
        })
      },
      getSortedChildren(item) {
        const children = this.getVisibleChildren(item)
        if (!this.isOnlineCoursesMenu(item)) {
          return children
        }
        const order = [
          'fetal echocardiography',
          'fetal neurosonography',
          'genetics for fetal medicine',
          'intrapartum ultrasound',
          'topics in maternal medicine',
          'cervical assessment',
          'fetal abnormalities',
          'placenta accreta spectrum disorders',
          'fetal cardiac scanning',
          'preeclampsia screening'
        ]
        const rank = new Map(order.map((name, idx) => [name, idx]))
        return [...children].sort((a, b) => {
          const aName = (a?.categoryName || '').toLowerCase()
          const bName = (b?.categoryName || '').toLowerCase()
          const aRank = rank.has(aName) ? rank.get(aName) : 999
          const bRank = rank.has(bName) ? rank.get(bName) : 999
          if (aRank !== bRank) {
            return aRank - bRank
          }
          return aName.localeCompare(bName)
        })
      },
      isOnlineCoursesMenu(item) {
        return (item?.categoryName || '').toLowerCase() === 'online courses'
      },
      getSubmenuClass(item) {
        return this.isOnlineCoursesMenu(item)
          ? 'submenu-wrapper online-courses-menu'
          : 'submenu-wrapper'
      },
      getMenuIconClass(name) {
        const label = (name || '').toLowerCase()
        if (label.includes('fmf') && label.includes('lecture')) {
          return 'icon-lecture'
        }
        if (label.includes('twin') && label.includes('pregnan')) {
          return 'icon-twin'
        }
        if (label.includes('cardiac') && label.includes('scan')) {
          return 'icon-probe'
        }
        if (label.includes('echo') || label.includes('cardiography') || label.includes('heart')) {
          return 'icon-heart'
        }
        if (label.includes('dna') || label.includes('genetic')) {
          return 'icon-dna'
        }
        if (label.includes('brain') || label.includes('neuro')) {
          return 'icon-brain'
        }
        if (label.includes('ultrasound') || (label.includes('scan') && !label.includes('cardiac'))) {
          return 'icon-ultrasound'
        }
        if (label.includes('maternal')) {
          return 'icon-maternal'
        }
        if (label.includes('cervical') || label.includes('uterus')) {
          return 'icon-uterus'
        }
        if (label.includes('abnormal') || label.includes('fetal')) {
          return 'icon-fetus'
        }
        if (label.includes('placenta')) {
          return 'icon-placenta'
        }
        if (label.includes('preeclampsia')) {
          return 'icon-pressure'
        }
        return 'icon-dot'
      },
      findMenuItem(items, id) {
        for (const item of items) {
          if (item.id === id) {
            return { item: item, parent: null }
          }
          if (item.childrenList && item.childrenList.length) {
            for (const child of item.childrenList) {
              if (child.id === id) {
                return { item: child, parent: item }
              }
            }
            const found = this.findMenuItem(item.childrenList, id)
            if (found) {
              return found
            }
          }
        }
        return null
      },
      menuSelect(key) {
        this.isMobileMenuOpen = false
        if (this.activeId === key) {
          return
        }
        if (key === '/') {
          this.changeActiveId(key)
          this.$router.replace('/')
          return
        }
        
        const selectedItem = this.findMenuItem(this.listData, key)
        if (!selectedItem) {
          this.$message.info('not found the menu item')
          return
        }

        const self = this
        if (selectedItem.item.id === 'fmf-world-congress') {
          return
        }
        if (selectedItem.item.id === 'fmf-supported-course') {
          self.changeActiveId(key)
          self.$router.push('/fmf-supported-course')
          return
        }
        if ((selectedItem.item.categoryName || '').toLowerCase() === 'research') {
          self.changeActiveId(key)
          self.$router.push('/research')
          return
        }
        if (selectedItem.item.id === 'support-developing') {
          self.changeActiveId(key)
          self.$router.push('/look-for-life')
          return
        }
        if (selectedItem.item.id === 'support-developed') {
          self.changeActiveId(key)
          self.$router.push('/look-for-life-developed')
          return
        }
        if (selectedItem.item.categoryName === 'Courses & Congress' ||
          (selectedItem.parent && selectedItem.parent.categoryName === 'Courses & Congress')) {
          return
        }
        if ((selectedItem.item.categoryName || '').toLowerCase() === 'fmf fellowships') {
          self.changeActiveId(key)
          self.$router.push('/fellowships')
          return
        }
        if ((selectedItem.item.categoryName || '').toLowerCase() === 'look for life') {
          self.changeActiveId(key)
          self.$router.push('/look-for-life')
          return
        }
        if ((selectedItem.item.categoryName || '').toLowerCase() === 'calculators') {
          self.changeActiveId(key)
          self.$router.push('/calculators')
          return
        }
        if ((selectedItem.item.categoryName || '').toLowerCase() === 'fmf certification' ||
          selectedItem.item.id === 'fmf-certification') {
          self.changeActiveId(key)
          self.$router.push('/fmf-certification')
          return
        }
        if (selectedItem.item.categoryName === 'Education' || selectedItem.item.categoryName === 'Online Courses') {
          self.changeActiveId(key)
          self.$router.push('/course?categoryName=' + selectedItem.item.categoryName)
          return
        }
        if (selectedItem.parent && selectedItem.parent.categoryName === 'Education') { // 子级
          self.$utils.checkLoginAndContinue(() => {
            self.changeActiveId(key)
            self.$router.push('/courseDetail?categoryName=' + selectedItem.item.categoryName)
          })
          return
        }
        self.$message.warning('The current page is under developing')
      },
      goto(path) {
        this.isMobileMenuOpen = false
        if (path === '/certs') {
          this.changeActiveId('')
        }
        this.$router.push(path)
      },
      logoutClick() {
        this.isMobileMenuOpen = false
        this.logout().then((resp) => {
          if (resp.code === 200 || resp.code === 0) {
            this.$message.success('Logout successful')
            this.$router.replace('/')
          }
        }).catch((error) => {
          this.$message.error(error.message)
        })
      },
      websiteNavigationFn() {
        this.$api.websiteNavigation().then(resp => {
          if ((resp.code === 200 || resp.code === 0) && Array.isArray(resp.data)) {
            const data = resp.data
            const target = data.find((item) => item?.categoryName === 'Courses & Congress')
            if (target) {
              target.childrenList = [
                { id: 'fmf-world-congress', categoryName: 'FMF World Congress' },
                { id: 'fmf-advances-course', categoryName: 'FMF Advances Course' },
                { id: 'fmf-supported-course', categoryName: 'FMF Supported Course' }
              ]
            }
            const lookForLife = data.find((item) => item?.categoryName === 'Look for Life')
            if (lookForLife) {
              lookForLife.childrenList = [
                { id: 'support-developing', categoryName: 'Support in developing countries' },
                { id: 'support-developed', categoryName: 'Support in developed countries' }
              ]
            }
            const hasCertification = data.some((item) => (item?.categoryName || '').toLowerCase() === 'fmf certification')
            if (!hasCertification) {
              data.push({ id: 'fmf-certification', categoryName: 'FMF Certification' })
            }
            this.listData = data
          } else {
            this.listData = []
          }
        }).catch(err => {
          console.log('err:', err)
        })
      }
    },
    mounted() {
      this.websiteNavigationFn()
    }
  }
</script>

<style lang="scss" scoped>
  .header-container {
    display: flex;
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 72px;
    padding: 0px 48px;
    background-color: #ffffff;
    transition: all 0.3s ease;
    box-shadow: 0 0 32px rgba($color: #000, $alpha: 0.08);
    justify-content: space-between;
    .logo {
      height: 48px;
      width: 108px;
      // background: url('#{$iconUrl}/icon_logo.png') no-repeat center;
      background-size: contain;
      cursor: pointer;
      img{
        height: 100%;
        display: block;
      }
    }
    .menu-wrapper {
      width: auto;
      // height: 40px;
      margin: 0 auto;
      // position: absolute;
      // left: 0;
      // right: 0;
      overflow-x: auto;
      overflow-y: hidden;
      font-weight: bold;
      &::-webkit-scrollbar {
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }
      .el-menu.el-menu--horizontal {
        border-bottom: none;
      }
    }
    .auth-buttons {
      width: auto;
      min-width: 0;
      display: flex;
      gap: 15px;
      justify-content: center;
      justify-items: center;
      flex-wrap: wrap;
      .userimg {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background:#b3d9ff;
        cursor: pointer;
      }
      .username {
        color: #036fc0;
        font-size: 18px;
        justify-content: center;
        justify-items: center;
        line-height: 24px;
        margin-left: 3px;
        cursor: pointer;
      }
      .outBtn{
        margin-left: 20px;
        cursor: pointer;
      }
      .login-btn {
        background: none;
        border: none;
        color: #0E3045;
        font-size: 18px;
        // font-weight: bold;
        cursor: pointer;
      }
      .register-btn {
        background-color: #036fc0;
        color: #ffffff;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 18px;
        cursor: pointer;
        // font-weight: bold;
      }
    }
    .btnBlock{
      gap: 5px;
    }
    .menu-toggle {
      display: none;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 1px solid rgba(3, 111, 192, 0.2);
      background-color: #ffffff;
      color: #036fc0;
      font-size: 22px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
      i {
        font-size: 22px;
      }
      &:hover {
        background-color: #f1f6fb;
        border-color: rgba(3, 111, 192, 0.35);
      }
    }
  }
  .header-transparent {
    box-shadow: none;
    background-color: rgba(255, 255, 255, 0.1) !important;
    .logo {
      // background-image: url('#{$iconUrl}/icon_logo_white.png');
      img{
        filter: none;
      }
    }
    .login-btn, .username {
      color: #036fc0 !important;
    }
    .register-btn {
      background-color: #036fc0;
      color: #ffffff;
    }
    .home-icon {
      color: #036fc0;
    }
    .outBtn img {
      filter: brightness(20);
    }
    .userimg {
      background: #fff !important;
    }
    .menu-toggle {
      border-color: rgba(255, 255, 255, 0.4);
      background-color: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }
  }
  @media (max-width: 1024px) {
    .header-container {
      padding: 0 20px;
      .menu-wrapper {
        display: none;
      }
      .auth-buttons {
        display: none;
      }
      .menu-toggle {
        display: inline-flex;
      }
    }
  }
</style>

<style lang="scss">
  .mobile-menu-drawer {
    width: min(88vw, 380px);
    .el-drawer__body {
      padding: 0;
      background-color: #f7f9fc;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
  .mobile-menu-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background-color: #ffffff;
    border-bottom: 1px solid #e6edf5;
    .logo {
      width: 110px;
      height: 44px;
      cursor: pointer;
      img {
        height: 100%;
        display: block;
      }
    }
    .drawer-close {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: none;
      background: #f1f6fb;
      color: #0e3045;
      font-size: 18px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
  .mobile-menu {
    flex: 1;
    border-right: none;
    padding: 12px 16px 0;
    background-color: transparent !important;
    .el-menu-item,
    .el-submenu__title {
      height: auto !important;
      line-height: 1.3;
      padding: 12px 12px !important;
      border-radius: 12px;
      font-size: 16px !important;
      color: #0e3045 !important;
      background-color: #ffffff !important;
      box-shadow: 0 10px 18px rgba(15, 42, 67, 0.06);
      margin-bottom: 10px;
    }
    .el-submenu__title {
      background-color: #f4f8fc !important;
      border: 1px solid #e3edf7;
    }
    .el-submenu.is-active .el-submenu__title {
      background-color: #eaf2fb !important;
    }
    .el-menu-item.is-active {
      color: #036fc0 !important;
    }
    .submenu-item {
      gap: 10px;
    }
    .submenu-text {
      white-space: normal;
    }
    .mobile-menu-label {
      margin-left: 8px;
    }
    .home-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      color: #036fc0;
    }
    .home-icon svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }
  }
  .mobile-auth {
    padding: 16px 20px 24px;
    border-top: 1px solid #e6edf5;
    background: #ffffff;
  }
  .mobile-auth-user {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    cursor: pointer;
    .userimg {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #b3d9ff;
    }
    .username {
      color: #036fc0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .mobile-auth-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .mobile-auth-btn {
    flex: 1 1 140px;
    border: none;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 15px;
    background: #036fc0;
    color: #ffffff;
    cursor: pointer;
    &.outline {
      background: #ffffff;
      color: #036fc0;
      border: 1px solid #036fc0;
    }
  }
  .submenu-wrapper {
    width: 360px;
    max-width: calc(100vw - 24px);
    min-width: 280px;
    padding: 8px;
    border-radius: 14px;
    background-color: #ffffff;
    box-shadow: 0 20px 40px rgba(12, 36, 56, 0.18);
    .el-menu {
      background-color: transparent !important;
      display: grid;
      grid-template-columns: 1fr;
      align-content: start;
      gap: 10px;
      padding: 12px;
      border-radius: 12px;
    }
    .el-menu::before,
    .el-menu::after {
      content: none !important;
      display: none !important;
    }
    .home-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      color: #036fc0;
    }
    .home-icon svg {
      width: 14px;
      height: 14px;
      fill: currentColor;
    }
    .el-menu-item {
      background: linear-gradient(135deg, #f7f8fb 0%, #eff2f7 100%) !important;
      color: #2a3b4f !important;
      font-size: 15px !important;
      font-weight: 600;
      line-height: 1.2;
      border-radius: 16px;
      padding: 16px 18px !important;
      height: auto !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
      position: relative;
      overflow: hidden;
      padding-left: 16px !important;
      border: 1px solid #edf1f6;
      box-shadow: 0 10px 24px rgba(15, 42, 67, 0.08);
      &.is-active, &:hover {
        color: #1f3346 !important;
        background: linear-gradient(135deg, #f9fbff 0%, #eef3f9 100%) !important;
        box-shadow: 0 14px 28px rgba(15, 42, 67, 0.12);
        transform: translateY(-2px);
      }
    }
    .submenu-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .submenu-text {
      white-space: nowrap;
    }
    .submenu-icon {
      width: 28px;
      height: 28px;
      flex: 0 0 28px;
      border-radius: 8px;
      background-color: #f1f6fb;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    .icon-dot {
      background-image: radial-gradient(circle at 50% 50%, #2b6cb0 0 5px, transparent 6px);
    }
    .icon-heart {
      background-image: url("~@/assets/img/online_course_icons/icon_heart.png");
    }
    .icon-dna {
      background-image: url("~@/assets/img/online_course_icons/icon_dna.png");
    }
    .icon-brain {
      background-image: url("~@/assets/img/online_course_icons/icon_brain.png");
    }
    .icon-fetus {
      background-image: url("~@/assets/img/online_course_icons/icon_fetus.png");
    }
    .icon-ultrasound {
      background-image: url("~@/assets/img/online_course_icons/icon_ultrasound.png");
    }
    .icon-uterus {
      background-image: url("~@/assets/img/online_course_icons/icon_uterus.png");
    }
    .icon-maternal {
      background-image: url("~@/assets/img/online_course_icons/icon_maternal.png");
    }
    .icon-placenta {
      background-image: url("~@/assets/img/online_course_icons/icon_placenta.png");
    }
    .icon-probe {
      background-image: url("~@/assets/img/online_course_icons/icon_probe.png");
    }
    .icon-pressure {
      background-image: url("~@/assets/img/online_course_icons/icon_pressure.png");
    }
    .icon-lecture {
      background-image: url("~@/assets/img/menu_lecture.jpeg");
    }
    .icon-twin {
      background-image: url("~@/assets/img/menu_twin_pregnancy.jpeg");
    }
  }

  .submenu-wrapper.online-courses-menu {
    width: 700px;
    min-width: 560px;
    .el-menu {
      grid-template-columns: repeat(2, minmax(300px, 1fr));
    }
  }
  
  .meBox {
    display: flex;
    
    // 普通菜单项
    .el-menu-item {
      // height: 48px !important;
      // line-height: 42px;
      font-size: 18px !important;
      position: relative;
      transition: none; // 防止element-ui覆盖过渡效果
      background-color: transparent !important;
      font-weight: normal;
      &::after {
        content: none;
      }
    }
    
    // 子菜单标题
    .el-submenu .el-submenu__title {
      // height: 48px !important;
      // line-height: 42px;
      font-size: 18px !important;
      position: relative;
      padding: 0 12px !important;
      transition: none; // 防止element-ui覆盖过渡效果
      background-color: transparent !important;
      font-weight: normal;
      &::after {
        content: none;
      }
    }
    
    // 当子菜单处于激活状态时添加下划线
    .el-submenu.is-active .el-submenu__title {
      background-color: transparent !important;
      &::after {
        content: none;
      }
    }
    
    .el-submenu.is-disabled .el-menu-item, 
    .el-submenu.is-disabled .el-submenu__title {
      color: #036fc0 !important;
      opacity: 0.4 !important;
      background-color: transparent !important;
    }
    .home-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: #036fc0;
    }
    .home-icon svg {
      width: 28px;
      height: 28px;
      fill: currentColor;
    }
  }
  
  .header-transparent {
    .el-submenu.is-disabled .el-menu-item, 
    .el-submenu.is-disabled .el-submenu__title {
      color: #fff !important;
      opacity: 0.4 !important;
    }
  }


  .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: none !important;
    color: #036fc0;
  }
</style>
