<template>
  <div style="width: 100%; height: 100vh; overflow: auto;">
    <!-- iframe 加载 public 下的 HTML 文件 -->
    <iframe
      :src="htmlPath"
      width="100%"
      height="100%"
      frameborder="0"
      ref="iframeRef"
      :title="htmlTitle"
      @load="onIframeLoad"
      @error="onIframeError"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'StaticHtml',
  data() {
    return {
      title: 'Previous World Congresses', // 添加默认标题
      fileName: 'previousWorldCongresses/2015/abstracts', // 可配置的文件路径
      isLoaded: false,
      hasError: false
    }
  },
  computed: {
    // 拼接 HTML 文件路径（适配 hash 模式和 BASE_URL）
    htmlPath() {
      // 使用绝对路径从根目录开始，确保指向 public 目录下的文件
      // 注意：public 目录下的文件会被复制到构建输出的根目录
      return `${process.env.BASE_URL}previousWorldCongresses/${this.$route.query.id}/index.html`;
    },
    htmlTitle() {
      return this.title;
    }
  },
  methods: {
    onIframeLoad() {
      console.log('Iframe loaded successfully');
      this.isLoaded = true;
    },
    onIframeError() {
      console.error('Failed to load iframe content');
      this.hasError = true;
      // 提供错误处理或备选方案
      alert('Failed to load the requested content. Please make sure the file exists in the public directory.');
    }
  },
  mounted() {
    // 监听路由变化，并更新文件路径
    // 获取iframe元素
    const iframe = document.getElementById('myIframe');
    console.log(`${process.env.BASE_URL}previousWorldCongresses/2014/assets/modern-congress.css`)

    

    // 监听iframe加载完成事件
    iframe.addEventListener('load', function() {
      try {
        // 获取iframe文档对象
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // eslint-disable-next-line no-inner-declarations
        function injectCssFile(cssUrl, cssId) {
            console.log(cssUrl)
          if (iframeDoc.getElementById(cssId)) return;
          
          const linkTag = iframeDoc.createElement('link');
          linkTag.id = cssId;
          linkTag.rel = 'stylesheet';
          linkTag.href = cssUrl;
          
          linkTag.onload = () => console.log(`CSS加载成功：${cssUrl}`);
          linkTag.onerror = (err) => console.error(`CSS加载失败：${cssUrl}`, err);
          
          iframeDoc.head.appendChild(linkTag);
        }


        // 调用示例：引入CDN CSS和本地CSS
        injectCssFile(`${process.env.BASE_URL}previousWorldCongresses/2014/assets/modern-congress.css`, 'bootstrap-css');
        injectCssFile('custom-style.css', 'custom-css'); // 本地public目录下的CSS

      } catch (e) {
        console.error('注入CSS失败：', e);
      }
    });
  }
};
</script>

<style scoped>
/* 添加一些样式以改善显示 */
iframe {
  min-height: 500px; /* 设置最小高度 */
  border: none; /* 可选：移除边框 */
}



:root {
  --ink: #102a43;
  --muted: #51606f;
  --accent: #1b6b6f;
  --accent-2: #e9c46a;
  --card: #ffffff;
  --line: #e3e8ee;
  --shadow: 0 16px 40px rgba(16, 42, 67, 0.08);
}

body.fmf {
  font-family: Helvetica, Arial, sans-serif;
  color: var(--ink);
  background: #f2f4f0;
  position: relative;
}

body.fmf::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(233, 196, 106, 0.18), transparent 45%),
    radial-gradient(circle at 80% 10%, rgba(27, 107, 111, 0.12), transparent 40%),
    linear-gradient(180deg, #f6f3ea 0%, #f2f4f0 50%, #eef2f1 100%);
  z-index: 0;
  pointer-events: none;
}

#all-but-footer,
#main-footer {
  position: relative;
  z-index: 1;
}

#main-header {
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 6px 20px rgba(16, 42, 67, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

#main-header .container-fluid {
  padding: 18px 24px;
}

#main-header .main-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

#main-header .brand img {
  height: 56px;
  width: auto;
}

#main-header .top-nav {
  display: flex;
  align-items: center;
  gap: 36px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

#main-header .top-nav a {
  text-decoration: none;
  color: #036fc0;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  font-size: 18px;
  line-height: 1.2;
  padding: 0;
  border-radius: 0;
  border-bottom: 2px solid transparent;
  text-shadow: none;
  transition: border-color 0.2s ease, color 0.2s ease;
}

#main-header .top-nav a:hover {
  background: transparent;
  border-color: #036fc0;
  color: #036fc0;
}

#main-nav {
  height: 4px;
  min-height: 4px;
  background: #036fc0;
  border: 0;
}

#main-content .container-fluid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px 64px;
}

#main {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  overflow: visible;
}

.breadcrumb-fill {
  display: none;
}

#main-sidebar .left-nav {
  background: var(--card);
  border-radius: 18px;
  padding: 18px;
  margin-left: 0;
  margin-right: 0;
  box-shadow: var(--shadow);
  border: 1px solid var(--line);
  position: sticky;
  top: 110px;
}

#side-menu-nav {
  list-style: none;
  margin: 0;
  padding: 0;
}

#main-sidebar ul,
#main-sidebar ul li {
  list-style: none;
}

#side-menu-nav > li {
  margin-bottom: 6px;
}

#side-menu-nav a {
  display: block;
  padding: 10px 12px 10px 28px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--ink);
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

#side-menu-nav > li > a {
  position: relative;
}

#side-menu-nav > li > a::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #036fc0;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

#side-menu-nav li.active > a,
#side-menu-nav a:hover {
  background: rgba(3, 111, 192, 0.12);
  color: #036fc0;
}

#side-menu-nav ul {
  margin: 6px 0 8px 12px;
  padding-left: 12px;
  border-left: 1px solid var(--line);
}

#side-menu-nav ul a {
  font-size: 0.95em;
  font-weight: 500;
  padding: 6px 8px;
}

.panel {
  border: none;
  border-radius: 18px;
  overflow: hidden;
  background: var(--card);
  box-shadow: var(--shadow);
}

.panel-heading {
  background: linear-gradient(120deg, rgba(27, 107, 111, 0.12), rgba(233, 196, 106, 0.18));
  border-bottom: 1px solid var(--line);
  padding: 0 22px;
  min-height: 56px;
  display: flex;
  align-items: center;
}

.panel-heading h2 {
  margin: 0;
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
}

.panel-body {
  padding: 22px;
  color: var(--muted);
  font-size: 0.98rem;
}

#main .archive-title {
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink);
  font-weight: 600;
  margin-bottom: 10px;
}

#abstracts-list .items {
  margin: 0;
  padding: 0;
}

#abstracts-list ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

#abstracts-list .items li {
  list-style: none;
  margin: 0;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

#abstracts-list .items li:last-child {
  border-bottom: 0;
}

#abstracts-list .items li a {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-decoration: none;
  color: #0b3c49;
  line-height: 1.4;
}

#abstracts-list .items li a img.dl-pdf {
  width: 20px;
  height: 20px;
  margin-left: auto;
  opacity: 0.7;
}

#main-footer {
  background: #036fc0;
  color: #f1f5f9;
  padding: 18px 24px;
  font-size: 0.9rem;
}

@media (max-width: 991px) {
  #main-sidebar {
    margin-bottom: 18px;
  }

  #main-sidebar .left-nav {
    position: static;
  }
}

@media (max-width: 767px) {
  #main-header .container-fluid {
    padding: 14px 16px;
  }

  #main-header .main-header-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  #main-header .top-nav {
    flex-wrap: wrap;
    white-space: normal;
    gap: 18px;
  }

  #main-header .brand img {
    height: 44px;
  }

  #main-content .container-fluid {
    padding: 20px 16px 40px;
  }

  .panel-heading h2 {
    font-size: 1.15rem;
  }
}

</style>