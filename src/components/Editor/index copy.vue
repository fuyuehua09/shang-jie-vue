<template>
  <div class="editor" ref="editor" :style="styles">
    <!-- :on-change="onChangeQuill" -->
    <!--       :accept="acceptFile" -->
    <!-- <el-upload
      ref="quillUploader"
      class="photo-uploader"
      :action="upload.url"
      :show-file-list="false"
      :auto-upload="false"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :limit="20"
      :multiple="true"
    > -->
    <el-upload
      class="photo-uploader"
      :action="upload.url"
      :headers="upload.headers"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
    >
    </el-upload>
  </div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { lineHeightStyle } from "@/utils/lineheight";
// import { getToken } from "@/utils/auth";

export default {
  name: "Editor",
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: null,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      // base_url: process.env.VUE_APP_BASE_API,
      // upload: {
      //   // 设置上传的请求头部
      //   headers: { Authorization: "Bearer " + getToken() },
      //   // 商品照片上传
      //   url: process.env.VUE_APP_BASE_API + "/file/upload/cover",
      // },
      Quill: null,
      currentValue: "",
      options: {
        theme: "snow",
        bounds: document.body,
        debug: "warn",
        modules: {
          // 工具栏配置
          // toolbar: [
          //   ["bold", "italic", "underline", "strike"],       // 加粗 斜体 下划线 删除线
          //   ["blockquote", "code-block"],                    // 引用  代码块
          //   [{ list: "ordered" }, { list: "bullet" }],       // 有序、无序列表
          //   [{ indent: "-1" }, { indent: "+1" }],            // 缩进
          //   [{ size: ["small", false, "large", "huge"] }],   // 字体大小
          //   [{ header: [1, 2, 3, 4, 5, 6, false] }],         // 标题
          //   [{ color: [] }, { background: [] }],             // 字体颜色、字体背景颜色
          //   [{ align: [] }],                                 // 对齐方式
          //   ["clean"],                                       // 清除文本格式
          //   ["link", "image", "video"]                       // 链接、图片、视频
          // ],
          toolbar: {
            container: [
              // ["bold", "italic", "underline", "strike"],       // 加粗 斜体 下划线 删除线
              // ["blockquote", "code-block"],                    // 引用  代码块
              // [{ list: "ordered" }, { list: "bullet" }],       // 有序、无序列表
              // [{ indent: "-1" }, { indent: "+1" }],            // 缩进
              // [{ size: ["small", false, "large", "huge"] }],   // 字体大小
              // [{ header: [1, 2, 3, 4, 5, 6, false] }],         // 标题
              // [{ color: [] }, { background: [] }],             // 字体颜色、字体背景颜色
              // [{ align: [] }],                                 // 对齐方式
              // ["clean"],                                       // 清除文本格式
              // ["link", "image", "video"]                       // 链接、图片、视频
              
              ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
              ["blockquote", "code-block"], // 引用  代码块
              [{ header: 1 }, { header: 2 }], // 1、2 级标题
              [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
              [{ script: "sub" }, { script: "super" }], // 上标/下标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              // [{'direction': 'rtl'}],                         // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
              [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
              [{ font: [] }], // 字体种类
              [{ align: [] }], // 对齐方式
              ["clean"], // 清除文本格式
              ["link", "image", "video"] // 链接、图片、视频
            ],
            // handlers: {
            //   image: function (value) {
            //     if (value) {
            //       // 触发element-ui的文件上传
            //       console.log("触发element-ui的文件上传")
            //       document.querySelector(".photo-uploader input").click();
            //     } else {
            //       this.quill.format("image", false);
            //     }
            //   },
            // }
          }
        },
        placeholder: "请输入内容",
        readOnly: false,
      },
    };
  },
  computed: {
    styles() {
      let style = {};
      if (this.minHeight) {
        style.minHeight = `${this.minHeight}px`;
      }
      if (this.height) {
        style.height = `${this.height}px`;
      }
      return style;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val !== this.currentValue) {
          this.currentValue = val === null ? "" : val;
          if (this.Quill) {
            this.Quill.pasteHTML(this.currentValue);
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.Quill = null;
  },
  methods: {
    init() {
      const editor = this.$refs.editor;
      this.Quill = new Quill(editor, this.options);
      this.Quill.pasteHTML(this.currentValue);
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        const html = this.$refs.editor.children[0].innerHTML;
        const text = this.Quill.getText();
        const quill = this.Quill;
        this.currentValue = html;
        this.$emit("input", html);
        this.$emit("on-change", { html, text, quill });
      });
      this.Quill.on("text-change", (delta, oldDelta, source) => {
        this.$emit("on-text-change", delta, oldDelta, source);
      });
      this.Quill.on("selection-change", (range, oldRange, source) => {
        this.$emit("on-selection-change", range, oldRange, source);
      });
      this.Quill.on("editor-change", (eventName, ...args) => {
        this.$emit("on-editor-change", eventName, ...args);
      });
    },
    // 上传图片之前调用
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const isLt1M = file.size / 1024 / 1024 < 3;
        if (!isLt1M) {
          this.msgError('上传头像图片大小不能超过 1MB!');
        }
      }
    },
    // 图片上传成功调用
    handleSuccess(res, file) {
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      let quill = this.$refs.myQuillEditor.quill
      let imgSrc = URL.createObjectURL(file.raw);
      quill.insertEmbed(length, "image", imgSrc)
      // 调整光标到最后
      quill.setSelection(length + 1)
    },
  },
};
</script>

<style>
.editor,
.ql-toolbar {
  white-space: pre-wrap !important;
  line-height: normal !important;
}
.quill-img {
  display: none;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>