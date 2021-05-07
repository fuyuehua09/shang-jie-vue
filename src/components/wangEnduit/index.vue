<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import E from 'wangeditor'
export default {
  name: 'editoritem',
  data() {
    return {
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 商品照片上传
        url: process.env.VUE_APP_BASE_API + "/file/upload/contentPicture",
      },
      // uploadPath,
      editor: null,
      info_: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value: function (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      // 兼容老版本和旧版本
      this.editor.customConfig = this.editor.customConfig ? this.editor.customConfig : this.editor.config;

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'lineHeight', // 行高
        'indent', // 缩进
        'list', // 列表
        'justify', // 对齐方式
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'quote', // 引用
        // 'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        'fullScreen', // 全屏
      ]
      // 自定义字体大小
      this.editor.customConfig.fontSizes = {
        'x-small': {
          name: '10px',
          value: '1',
        },
        small: {
          name: '13px',
          value: '2',
        },
        normal: {
          name: '16px',
          value: '3',
        },
        large: {
          name: '18px',
          value: '4',
        },
        'x-large': {
          name: '24px',
          value: '5',
        },
        'xx-large': {
          name: '32px',
          value: '6',
        },
      };
      // 自定义行高
      this.editor.customConfig.lineHeights = ['1.0', '1.3', '1.5', '2.0', '2.5', '3.0'];

      // 图片上传配置
      // base 64 存储图片的格式（true: base64, false: 文件路径）
      this.editor.customConfig.uploadImgShowBase64 = false
      // 配置服务器端地址
      this.editor.customConfig.uploadImgServer = this.upload.url
      // 自定义 header
      this.editor.customConfig.uploadImgHeaders = {
        Authorization: "Bearer " + getToken()
      }
      // 后端接受上传文件的参数名
      this.editor.customConfig.uploadFileName = 'file'
      // 默认限制图片大小是 5M ，可以自己修改。
      this.editor.customConfig.uploadImgMaxSize = 1 * 1024 * 1024
      // 限制一次最多上传 1 张图片
      this.editor.customConfig.uploadImgMaxLength = 1
      // 设置超时时间
      this.editor.customConfig.uploadImgTimeout = 1000 * 60 * 3
      // 上传图片回调函数
      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          let url = result.img
          insertImg(url)
        }
      }

      // // 视频上传配置
      // // 配置服务器端地址
      // this.editor.customConfig.uploadVideoServer = this.upload.url
      // // 自定义 header
      // this.editor.customConfig.uploadVideoHeaders = {
      //   Authorization: "Bearer " + getToken()
      // }
      // // 默认限制视频大小是( 1 * 1024 * 1024 * 1024)1024m ，可以自己修改。
      // this.editor.customConfig.uploadVideoMaxSize = 1 * 1024 * 1024 * 20 //20m
      // // 限制类型
      // this.editor.customConfig.uploadVideoAccept = ['mp4']
      // // 后端接受上传文件的参数名
      // this.editor.customConfig.uploadVideoName = 'file'
      // // timeout 即上传接口等待的最大时间，默认是 5分钟，可以自己修改。
      // this.editor.customConfig.uploadVideoTimeout = 1000 * 60 * 3

      // // 上传视频回调函数
      // this.editor.customConfig.uploadVideoHooks = {
      //   // 上传视频之前
      //   before: function (xhr) {
      //     console.log(xhr)

      //     // 可阻止视频上传
      //     return {
      //       prevent: true,
      //       msg: '需要提示给用户的错误信息'
      //     }
      //   },
      //   // 视频上传并返回了结果，视频插入已成功
      //   success: function (xhr) {
      //     console.log('success', xhr)
      //   },
      //   // 视频上传并返回了结果，但视频插入时出错了
      //   fail: function (xhr, editor, resData) {
      //     console.log('fail', resData)
      //   },
      //   // 上传视频出错，一般为 http 请求的错误
      //   error: function (xhr, editor, resData) {
      //     console.log('error', xhr, resData)
      //   },
      //   // 上传视频超时
      //   timeout: function (xhr) {
      //     console.log('timeout')
      //   },
      //   // 视频上传并返回了结果，想要自己把视频插入到编辑器中
      //   // 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
      //   customInsert: function (insertVideoFn, result) {
      //     // result 即服务端返回的接口
      //     console.log('customInsert', result)

      //     // insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
      //     insertVideoFn(result.data.url)
      //   }
      // }

      this.editor.customConfig.onchange = (html) => {
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      // 创建富文本编辑器
      this.editor.create()
    }
  }
}
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
}
</style>