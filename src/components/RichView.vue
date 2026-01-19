<template>
  <div v-html="content || ''" class="preview-content rich-view"></div>
</template>

<script>
  export default {
    props: {
      content: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~tinymce/skins/content/default/content.min.css';
  .rich-view {
    width: 100%;
    height: 100%;
  }
</style>

<style>
/* 全局样式 - 恢复用户代理样式 */
.preview-content {
  all: initial;
  all: unset;
  display: block;
  font-family: Helvetica;
  font-size: 14px;
  line-height: 1.6;
  color: #000000;
}

.preview-content p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  min-height: 1em;
}

.preview-content h1 {
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.preview-content h2 {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.preview-content h3 {
  display: block;
  font-size: 1.17em;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.preview-content h4,
.preview-content h5,
.preview-content h6 {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.preview-content h4 {
  font-size: 1em;
}
.preview-content h5 {
  font-size: 0.83em;
}
.preview-content h6 {
  font-size: 0.67em;
}

.preview-content ul,
.preview-content ol {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}

.preview-content ol {
  list-style-type: decimal;
}

.preview-content li {
  display: list-item;
  text-align: -webkit-match-parent;
}

.preview-content a {
  color: -webkit-link;
  cursor: pointer;
  text-decoration: underline;
}

.preview-content table {
  display: table;
  border-collapse: separate;
  border-spacing: 2px;
  border-color: gray;
}

.preview-content tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}

.preview-content th,
.preview-content td {
  display: table-cell;
  vertical-align: inherit;
}

.preview-content th {
  font-weight: bold;
}

.preview-content blockquote {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 40px;
  margin-inline-end: 40px;
}

.preview-content strong,
.preview-content b {
  font-weight: bold;
}

.preview-content em,
.preview-content i {
  font-style: italic;
}

.preview-content u {
  text-decoration: underline;
}

.preview-content code {
  font-family: monospace;
}

.preview-content pre {
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0px;
}

.preview-content img {
  display: inline-block;
}

.preview-content ul ::marker {
  color: #0070c0;
}

.preview-content ol ::marker {
  font-size: 18px;
}

.preview-content :is(dir, menu, ol, ul) ul {
  list-style-type: circle;
  margin: 0 !important;
}
</style>