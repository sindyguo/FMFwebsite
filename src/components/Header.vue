<template>
  <div :class="['hcontainer vcenter flex-between header-container']">
    <div class="logo" title="The Fetal Medicine Foundation" @click="goto('/')">
      <img src="@/assets/img/logo.svg" alt="The Fetal Medicine Foundation">
    </div>

    <!-- Hidden measurement spans (always off-screen, used to calculate overflow) -->
    <div class="menu-measure-wrap" ref="measureContainer" aria-hidden="true">
      <span
        v-for="item in listData"
        :key="'m-' + item.id"
        class="menu-measure-item">{{ item.categoryName }}</span>
      <span class="menu-measure-item menu-measure-more">More</span>
    </div>

    <!-- Desktop / Tablet navigation -->
    <div class="hcontainer menu-wrapper" ref="menuWrapper">
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
          <!-- <img v-show="isTransparent" src="@/assets/img/icon/icon_home_white.png" alt="The Fetal Medicine Foundation" /> -->
          <img class="logoImg" style="margin-left: 30px;" src="@/assets/img/svg/icon_home.svg" alt="The Fetal Medicine Foundation"/>
        </el-menu-item>

        <!-- Visible nav items -->
        <template v-for="item in visibleMenuItems">
          <el-submenu
            v-if="item.childrenList && item.childrenList.length"
            popper-class="submenu-wrapper"
            :index="item.id"
            :key="item.id">
            <div slot="title" class="submenu-title" @click.capture="menuSelect(item.id)">
              {{ item.categoryName }}
            </div>
            <!-- 使得点击submenu时高亮 -->
            <!-- <el-menu-item :index="item.id" style="display:none"></el-menu-item> -->
            <el-menu-item
              v-for="childItem in item.childrenList"
              :key="childItem.id"
              :index="childItem.id">
              {{ childItem.categoryName }}
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.id" :key="'menu-item-' + item.id">{{ item.categoryName }}</el-menu-item>
        </template>

        <!-- "More" overflow submenu (tablet/laptop only, when items overflow) -->
        <el-submenu
          v-if="moreMenuItems.length > 0"
          index="__more__"
          key="__more__"
          popper-class="submenu-wrapper more-submenu-popper">
          <template slot="title">More</template>
          <template v-for="item in moreMenuItems">
            <el-submenu
              v-if="item.childrenList && item.childrenList.length"
              popper-class="submenu-wrapper"
              :index="item.id"
              :key="'more-sub-' + item.id">
              <div slot="title" @click.capture="menuSelect(item.id)">{{ item.categoryName }}</div>
              <el-menu-item
                v-for="childItem in item.childrenList"
                :key="'mc-' + childItem.id"
                :index="childItem.id">
                {{ childItem.categoryName }}
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-else
              :index="item.id"
              :key="'more-mi-' + item.id">
              {{ item.categoryName }}
            </el-menu-item>
          </template>
        </el-submenu>
      </el-menu>
    </div>

    <!-- Auth buttons (desktop / tablet) -->
    <div class="auth-buttons btnBlock desktop-auth" v-if="isLogin">
      <div class="hcontainer vcenter" @click="goto('/mine')">
        <!-- <div class="userimg"></div> -->
        <div class="username">{{ userName || username }}</div>
      </div>
      <div class="outBtn" @click="logoutClick"><img src="@/assets/img/icon/icon_outin.png" alt=""></div>
    </div>
    <div class="auth-buttons desktop-auth" v-else>
      <button class="login-btn" :style="{color: isTransparent ? '#036fc0' : '#036fc0'}" @click="goto('/login')">Login/Register</button>
      <!-- <button class="register-btn" @click="goto('/registration')">Registration</button> -->
    </div>

    <!-- Mobile right section (hidden on desktop/tablet) -->
    <div class="mobile-header-right">
      <button
        v-if="!isLogin"
        class="mobile-login-compact"
        @click="goto('/login')">Login</button>
      <div
        v-else
        class="mobile-user-icon"
        @click="goto('/mine')">
        <i class="el-icon-user-solid"></i>
      </div>
      <button
        class="hamburger-btn"
        :class="{active: mobileMenuOpen}"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle navigation menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile navigation drawer -->
    <transition name="overlay-fade">
      <div
        v-if="mobileMenuOpen"
        class="mobile-nav-overlay"
        @click.self="mobileMenuOpen = false">
        <div class="mobile-nav-drawer">
          <div class="mobile-drawer-head">
            <img src="@/assets/img/logo.svg" alt="FMF" class="drawer-logo">
            <button class="drawer-close-btn" @click="mobileMenuOpen = false">
              <i class="el-icon-close"></i>
            </button>
          </div>
          <div class="mobile-nav-body">
            <div class="mobile-nav-item mobile-home-item" @click="mobileSelect('/')">
              <i class="el-icon-s-home"></i>
              <span>Home</span>
            </div>
            <template v-for="item in listData">
              <div
                class="mobile-nav-item"
                :key="'mn-' + item.id"
                @click="mobileNavClick(item)">
                <span class="mobile-nav-label">{{ item.categoryName }}</span>
                <i
                  v-if="item.childrenList && item.childrenList.length"
                  :class="expandedMobileItem === item.id ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                  class="mobile-expand-icon">
                </i>
              </div>
              <div
                v-if="item.childrenList && item.childrenList.length && expandedMobileItem === item.id"
                :key="'mc-' + item.id"
                class="mobile-nav-children">
                <div
                  v-for="child in item.childrenList"
                  :key="'mcc-' + child.id"
                  class="mobile-nav-child"
                  @click="mobileSelect(child.id)">
                  <i class="el-icon-arrow-right"></i>
                  {{ child.categoryName }}
                </div>
              </div>
            </template>
          </div>
          <div class="mobile-drawer-footer">
            <template v-if="isLogin">
              <div class="mobile-user-row" @click="goto('/mine'); mobileMenuOpen = false">
                <i class="el-icon-user-solid"></i>
                <span>{{ userName || username }}</span>
              </div>
              <button class="mobile-logout-btn" @click="mobileLogout">
                <img src="@/assets/img/icon/icon_outin.png" alt="" style="width:16px;height:16px;">
                Logout
              </button>
            </template>
            <button v-else class="mobile-auth-btn" @click="goto('/login'); mobileMenuOpen = false">
              Login / Register
            </button>
          </div>
        </div>
      </div>
    </transition>
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
        mobileMenuOpen: false,
        expandedMobileItem: null,
        windowWidth: window.innerWidth,
        visibleCount: null,
      }
    },
    computed: {
      ...mapState('user', ['activeId']),
      ...mapGetters('user', ['isLogin', 'username', 'userName']),
      visibleMenuItems() {
        if (this.windowWidth >= 1280 || this.visibleCount === null) return this.listData
        return this.listData.slice(0, this.visibleCount)
      },
      moreMenuItems() {
        if (this.windowWidth >= 1280 || this.visibleCount === null) return []
        return this.listData.slice(this.visibleCount)
      }
    },
    methods: {
      ...mapActions('user', ['logout', 'changeActiveId']),
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
        if (selectedItem.item.routePath) {
          self.changeActiveId(key)
          self.$router.push(selectedItem.item.routePath)
          return
        }
        // if (selectedItem.item.categoryName === 'Courses & Congress' ||
        //   (selectedItem.parent && selectedItem.parent.categoryName === 'Courses & Congress')) {
        //   self.changeActiveId(key)
        //   self.$router.push('/congress')
        //   return
        // }
        // console.log(selectedItem)
        if (selectedItem.parent && selectedItem.parent.categoryName === 'Online Courses') { // 子级
          self.$utils.checkLoginAndContinue(() => {
            self.changeActiveId(key)
            self.$router.push('/courseDetail?categoryName=' + selectedItem.item.categoryName)
          })
          return
        }

        

        if (selectedItem.item.categoryName === 'FMF Fellowships') {
          self.changeActiveId(key)
            self.$router.push('/fellowships')
          return
        }


        if (selectedItem.item.categoryName === 'Calculators') {
          self.changeActiveId(key)
            self.$router.push('/calculators')
          return
        }


        if (selectedItem.item.id === 'fmf-world-congress') {
          self.changeActiveId(key)
          self.$router.push('/congress')
          return;
        }

        console.log('selectedItem.item.id', selectedItem.item.id)
        if (selectedItem.item.id === 'fmf-advances-course') {
          self.changeActiveId(key)
          self.$router.push('/fmf-advances-courses')
          return
        }
        if (selectedItem.item.id === 'fmf-supported-courses') {
          self.changeActiveId(key)
          self.$router.push('/fmf-supported-courses')
          return
        }
        if ((selectedItem.item.categoryName || '').toLowerCase() === 'research') {
          self.changeActiveId(key)
          self.$router.push('/research')
          return
        }
        if (selectedItem.item.categoryName === 'Courses & Congress') {
           // self.changeActiveId(key)
          // self.$router.push('/congress')
          return
        }

        if (selectedItem.item.categoryName === 'Look for Life') {
          self.changeActiveId(key)
            self.$router.push('/look-for-life')
          return
        }
        

        if ((selectedItem.item.categoryName || '').toLowerCase() === 'fmf software') {
          self.changeActiveId(key)
          self.$router.push('/fmf-software')
          return
        }

        if (selectedItem.item.categoryName === 'Online Courses') {
          self.changeActiveId(key)
          self.$router.push('/course?categoryName=' + selectedItem.item.categoryName)
          return
        }

        self.$message({
          type: 'warning',
          message: 'The current page is under developing',
          duration: 5000
        })
      },
      goto(path) {
        if (path === '/certs' || path === '/mine') {
          this.changeActiveId(path)
        }
        this.$router.push(path)
      },
      logoutClick() {
        this.logout().then((resp) => {
          if (resp.code === 200 || resp.code === 0) {
            this.$message.success('Logout successful')
            this.$router.replace('/')
          }
        }).catch((error) => {
          this.$message.error(error.message)
        })
      },
      mobileLogout() {
        this.mobileMenuOpen = false
        this.logoutClick()
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
                { id: 'fmf-supported-courses', categoryName: 'FMF Supported Courses' }
              ]
            }
            const lookForLife = data.find((item) => item?.categoryName === 'Look for Life')
            if (lookForLife) {
              delete lookForLife.childrenList
            }
            const researchItem = data.find((item) => (item?.categoryName || '').toLowerCase() === 'research')
            if (researchItem) {
              delete researchItem.childrenList
            }
            const softwareItem = data.find((item) => (item?.categoryName || '').toLowerCase() === 'fmf software')
            if (softwareItem) {
              delete softwareItem.childrenList
              softwareItem.categoryName = 'FMF Software'
              softwareItem.routePath = '/fmf-software'
              delete softwareItem.linkUrl
            } else {
              data.push({
                id: 'fmf-software',
                categoryName: 'FMF Software',
                routePath: '/fmf-software'
              })
            }
            const affiliationsChildren = [
              {
                id: 'fmf-affiliations-usa',
                categoryName: 'USA',
                routePath: '/fmf-affiliations/usa'
              },
              {
                id: 'fmf-affiliations-india',
                categoryName: 'India',
                routePath: '/fmf-affiliations/india'
              },
              {
                id: 'fmf-affiliations-italy',
                categoryName: 'Italy',
                routePath: '/fmf-affiliations/italy'
              },
              {
                id: 'fmf-affiliations-czech-republic',
                categoryName: 'Czech Republic',
                routePath: '/fmf-affiliations/czech-republic'
              }
            ]
            const affiliationsItem = data.find((item) => {
              const categoryName = (item?.categoryName || '').toLowerCase()
              return categoryName === 'fmf affiliations' || categoryName === 'fmf affiliates'
            })
            if (affiliationsItem) {
              affiliationsItem.categoryName = 'FMF Affiliates'
              affiliationsItem.routePath = '/fmf-affiliations'
              affiliationsItem.childrenList = affiliationsChildren
              delete affiliationsItem.linkUrl
            } else {
              data.push({
                id: 'fmf-affiliations',
                categoryName: 'FMF Affiliates',
                routePath: '/fmf-affiliations',
                childrenList: affiliationsChildren
              })
            }
            const onlineIndex = data.findIndex((item) => (item?.categoryName || '').toLowerCase() === 'online courses')
            if (onlineIndex > -1) {
              const [onlineItem] = data.splice(onlineIndex, 1)
              data.push(onlineItem)
            }
            this.listData = data
          } else {
            this.listData = []
          }
        }).catch(err => {
          console.log('err:', err)
        })
      },
      goto1(url) {
        this.$router.push(url)
      },

      /* ── Responsive: window resize handler ── */
      handleWindowResize() {
        this.windowWidth = window.innerWidth
        this.$nextTick(() => {
          this.calculateVisibleCount()
        })
      },

      /* ── Responsive: calculate how many items fit in the menu bar ── */
      calculateVisibleCount() {
        if (this.windowWidth >= 1280 || this.windowWidth < 768 || !this.listData.length) {
          this.visibleCount = null
          return
        }

        const measureContainer = this.$refs.measureContainer
        const menuWrapper = this.$refs.menuWrapper
        if (!measureContainer || !menuWrapper) {
          this.visibleCount = null
          return
        }

        const measureItems = Array.from(
          measureContainer.querySelectorAll('.menu-measure-item:not(.menu-measure-more)')
        )
        const moreEl = measureContainer.querySelector('.menu-measure-more')
        const moreWidth = moreEl ? moreEl.offsetWidth + 24 : 100

        const containerWidth = menuWrapper.clientWidth
        const homeIconWidth = 80
        let available = containerWidth - homeIconWidth
        let count = 0

        const widths = measureItems.map(el => el.offsetWidth + 24)

        for (let i = 0; i < widths.length; i++) {
          const remaining = widths.length - count
          const wouldNeedMore = remaining > 1
          const neededSpace = widths[i] + (wouldNeedMore ? moreWidth : 0)

          if (available >= neededSpace) {
            available -= widths[i]
            count++
          } else {
            break
          }
        }

        this.visibleCount = (count >= this.listData.length) ? null : count
      },

      /* ── Mobile nav: toggle children expansion ── */
      mobileNavClick(item) {
        if (item.categoryName === 'Online Courses') {
          this.mobileMenuOpen = false
          this.expandedMobileItem = null
          this.$router.push('/course?categoryName=Online%20Courses')
          return
        }
        if (item.childrenList && item.childrenList.length) {
          this.expandedMobileItem = (this.expandedMobileItem === item.id) ? null : item.id
        } else {
          this.mobileSelect(item.id)
        }
      },

      /* ── Mobile nav: select item and close drawer ── */
      mobileSelect(key) {
        this.mobileMenuOpen = false
        this.expandedMobileItem = null
        this.$nextTick(() => {
          this.menuSelect(key)
        })
      },
    },
    mounted() {
      this.websiteNavigationFn()
      window.addEventListener('resize', this.handleWindowResize)
      this.$nextTick(() => {
        this.calculateVisibleCount()
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleWindowResize)
    },
    watch: { 
      listData() {
        this.$nextTick(() => {
          this.calculateVisibleCount()
        })
      },
      '$route'(to, from) { 
        console.log(to, from)
        if (to.path !== '/login') {
          localStorage.setItem('currentUrl', to.fullPath)
        }
        this.mobileMenuOpen = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-container {
    display: flex;
    position: fixed;
    top: 0;
    z-index: 90000000000;
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
      min-width: 160px;
      display: flex;
      gap: 15px;
      justify-content: center;
      justify-items: center;
      margin-bottom: 6px;
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
        margin-left: 16px;
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
  }
  .header-transparent {
    box-shadow: none;
    background-color: rgba(255, 255, 255, 0.1) !important;
    .logo {
      // background-image: url('#{$iconUrl}/icon_logo_white.png');
      img{
        filter: brightness(0) invert(1);
      }
    }
    .login-btn, .username {
      color: #ffffff !important;
    }
    .register-btn {
      background-color: #036fc0;
      color: #ffffff;
    }
    .outBtn img {
      filter: brightness(20);
    }
    .userimg {
      background: #fff !important;
    }
  }

  /* ============================================================
     Measurement container — always off-screen, never visible
     ============================================================ */
  .menu-measure-wrap {
    position: fixed;
    top: -9999px;
    left: 0;
    visibility: hidden;
    pointer-events: none;
    display: flex;
    white-space: nowrap;
    z-index: -1;
  }
  .menu-measure-item {
    font-size: 18px;
    font-weight: normal;
    font-family: Helvetica, sans-serif;
    padding: 0 12px;
    display: inline-block;
  }

  /* ============================================================
     Mobile header right section
     ============================================================ */
  .mobile-header-right {
    display: none;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  /* Hamburger button */
  .hamburger-btn {
    width: 36px;
    height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 4px;
    flex-shrink: 0;

    span {
      display: block;
      width: 22px;
      height: 2px;
      background-color: #036fc0;
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.3s ease;
      transform-origin: center;
    }

    &.active {
      span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      span:nth-child(2) { opacity: 0; transform: scaleX(0); }
      span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    }
  }

  /* Mobile compact login button */
  .mobile-login-compact {
    background: none;
    border: 1.5px solid #036fc0;
    color: #036fc0;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
  }

  /* Mobile user icon (logged-in state) */
  .mobile-user-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e8f4fd;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #036fc0;
    font-size: 18px;
    cursor: pointer;
  }

  /* ============================================================
     Mobile navigation overlay + drawer
     ============================================================ */
  .mobile-nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 90000000001;
    display: flex;
  }

  .mobile-nav-drawer {
    width: 280px;
    max-width: 85vw;
    height: 100%;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
  }

  .mobile-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 64px;
    border-bottom: 1px solid #e8e8e8;
    flex-shrink: 0;
    background: #ffffff;
  }

  .drawer-logo {
    height: 36px;
  }

  .drawer-close-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: #666;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;

    &:hover {
      background: #f5f5f5;
      color: #333;
    }
  }

  .mobile-nav-body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }

  .mobile-nav-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 20px;
    font-size: 15px;
    color: #333;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.15s;

    &:hover {
      background: #f0f8ff;
      color: #036fc0;
    }

    &.mobile-home-item {
      gap: 10px;
      justify-content: flex-start;
      color: #036fc0;
      font-weight: 600;
    }

    .mobile-nav-label { flex: 1; }
    .mobile-expand-icon { color: #999; font-size: 12px; }
  }

  .mobile-nav-children {
    background: #f8f9fa;
  }

  .mobile-nav-child {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px 11px 32px;
    font-size: 14px;
    color: #555;
    cursor: pointer;
    border-bottom: 1px solid #eeeeee;
    transition: background 0.15s;

    i { font-size: 11px; color: #bbb; }

    &:hover {
      background: #e8f4fd;
      color: #036fc0;
      i { color: #036fc0; }
    }
  }

  .mobile-drawer-footer {
    padding: 16px;
    border-top: 1px solid #e8e8e8;
    flex-shrink: 0;
    background: #ffffff;
  }

  .mobile-user-row {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #036fc0;
    font-size: 15px;
    padding: 8px 4px;
    cursor: pointer;
    margin-bottom: 10px;

    i { font-size: 18px; }
    &:hover { opacity: 0.8; }
  }

  .mobile-logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 12px;
    background: #f5f5f5;
    border: none;
    border-radius: 6px;
    color: #555;
    font-size: 14px;
    cursor: pointer;
    justify-content: center;

    &:hover { background: #eee; }
  }

  .mobile-auth-btn {
    width: 100%;
    padding: 12px;
    background: #036fc0;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
    font-weight: 600;

    &:hover { background: #025aa0; }
  }

  /* Overlay transition */
  .overlay-fade-enter-active { transition: opacity 0.25s ease; }
  .overlay-fade-leave-active { transition: opacity 0.2s ease; }
  .overlay-fade-enter, .overlay-fade-leave-to { opacity: 0; }

  /* ============================================================
     RESPONSIVE BREAKPOINTS
     ============================================================ */

  /* Mobile: < 768px */
  @media (max-width: 767px) {
    .header-container {
      padding: 0 16px !important;

      .logo {
        height: 40px;
        width: 90px;
        flex-shrink: 0;
      }

      .menu-wrapper {
        display: none !important;
      }

      .desktop-auth {
        display: none !important;
      }
    }

    .mobile-header-right {
      display: flex !important;
    }

    /* Measurement font at mobile matches tablet font for consistency */
    .menu-measure-item {
      font-size: 14px;
    }
  }

  /* Tablet: 768px ~ 1023px */
  @media (min-width: 768px) and (max-width: 1023px) {
    .header-container {
      padding: 0 16px !important;

      .logo {
        height: 42px;
        width: 96px;
        flex-shrink: 0;
      }

      .menu-wrapper {
        flex: 1;
        min-width: 0;
        margin: 0 8px;
        justify-content: center;
      }

      .auth-buttons {
        min-width: 110px;
        flex-shrink: 0;

        .login-btn { font-size: 14px; }
        .username { font-size: 14px; margin-left: 8px; }
      }
    }

    .menu-measure-item {
      font-size: 14px;
    }
  }

  /* Laptop: 1024px ~ 1279px */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .header-container {
      .menu-wrapper {
        flex: 1;
        min-width: 0;
        margin: 0 8px;
        justify-content: center;
      }

      .auth-buttons {
        min-width: 140px;
        flex-shrink: 0;

        .login-btn { font-size: 16px; }
      }
    }

    .menu-measure-item {
      font-size: 15px;
    }
  }

  /* Very small: < 360px */
  @media (max-width: 359px) {
    .header-container {
      padding: 0 12px !important;

      .logo {
        height: 36px;
        width: 80px;
      }
    }
  }
</style>

<style lang="scss">
  .submenu-wrapper {
    .el-menu {
      background-color: #ffffff !important;
      .el-menu-item {
        background-color: #ffffff !important;
        color: #000000 !important;
        font-size: 18px !important;
        margin: 10px 0;
        font-weight: normal;
        &.is-active, &:hover {
          color: #409EFF !important;
        }
      }
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
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #036fc0;
        transition: width 0.3s ease;
      }
      
      &:not(.is-active):hover {
        background-color: transparent !important;
        &::after {
          width: 100%;
        }
      }
      
      &.is-active {
        background-color: transparent !important;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0px;
          background-color: #036fc0;
        }
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
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #036fc0;
        transition: width 0.3s ease;
      }
      
      &:not(.is-active):hover {
        background-color: transparent !important;
        &::after {
          width: 100%;
        }
      }
    }
    
    // 当子菜单处于激活状态时添加下划线
    .el-submenu.is-active .el-submenu__title {
      background-color: transparent !important;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #036fc0;
      }
    }
    
    .el-submenu.is-disabled .el-menu-item, 
    .el-submenu.is-disabled .el-submenu__title {
      color: #036fc0 !important;
      opacity: 0.4 !important;
      background-color: transparent !important;
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

  .el-menu--popup{
    border-radius: 0 0 10px 10px;
    // overflow: hidden;
  }
  .el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
    border-bottom: none !important;
  }
  .meBox .el-submenu.is-active .el-submenu__title::after{
    height: 0 !important;
  }

  // 媒体查询1440以下的尺寸
  @media screen and (max-width: 1440px) { 
    .header-container{
      padding: 0 18px !important;
    }
    .meBox .el-submenu .el-submenu__title{
      padding: 0 8px !important;
    }
    .el-dropdown-menu__item, .el-menu-item{
      padding: 0 8px !important;
    }
  }

  /* More dropdown popper */
  .more-submenu-popper {
    min-width: 160px !important;

    .el-menu {
      background-color: #ffffff !important;

      .el-menu-item {
        background-color: #ffffff !important;
        color: #333333 !important;
        font-size: 18px !important;
        font-weight: normal;
        margin: 6px 0;

        &:hover { color: #409EFF !important; }
      }

      .el-submenu .el-submenu__title {
        font-size: 18px !important;
        color: #333333 !important;
        font-weight: normal;
        background-color: #ffffff !important;

        &:hover { color: #409EFF !important; }
      }
    }
  }

  /* Tablet: reduce menu font sizes so items fit better */
  @media (min-width: 768px) and (max-width: 1023px) {
    .meBox {
      .el-menu-item {
        font-size: 14px !important;
        padding: 0 6px !important;
      }
      .el-submenu .el-submenu__title {
        font-size: 14px !important;
        padding: 0 6px !important;
      }
    }
  }

  /* Laptop: slightly smaller than desktop */
  @media (min-width: 1024px) and (max-width: 1279px) {
    .meBox {
      .el-menu-item {
        font-size: 15px !important;
      }
      .el-submenu .el-submenu__title {
        font-size: 15px !important;
      }
    }
  }
</style>
