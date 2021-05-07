<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:guide:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:guide:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:guide:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:guide:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="guideList"
      row-key="guideId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column prop="guideId" label="编号" align="center"></el-table-column> -->
      <el-table-column prop="guideName" label="名称" width="800" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:guide:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:guide:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改新手指南对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
      @close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级目录" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="guideOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="名称" prop="guideName">
          <el-input v-model="form.guideName" placeholder="请输入指南名称" />
        </el-form-item>
        <el-form-item label="指南内容">
          <!-- <editor v-model="form.guideContent" :min-height="192"/> -->
          <!-- <editor-bar v-model="form.guideContent"></editor-bar> -->
          <vue-ueditor-wrap v-model="form.guideContent" :min-height="192" />
        </el-form-item>
        <!-- <el-form-item label="显示的顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示的顺序" />
        </el-form-item> -->
        <!-- <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGuide, getGuide, delGuide, addGuide, updateGuide, exportGuide } from "@/api/system/guide";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Editor from '@/components/Editor';

export default {
  name: "Guide",
  components: { Treeselect, Editor },
  data() {
    return {
      // 指南目录树结构
      guideOptions: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 新手指南表格数据
      guideList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        guideName: null,
        pid: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        guideName: [
          { required: true, message: "指南名称不能为空", trigger: "blur" }
        ],
        pid: [
          { required: true, message: "上级id不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示的顺序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询新手指南列表 */
    getList() {
      this.loading = true;
      listGuide(this.queryParams).then(response => {
        this.guideList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        guideId: null,
        guideName: null,
        guideContent: null,
        pid: null,
        orderNum: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.guideId)
    //   this.single = selection.length !== 1
    //   this.multiple = !selection.length
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.open = true;
      this.title = "添加新手指南";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const guideId = row.guideId || this.ids
      getGuide(guideId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改新手指南";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.guideId != null) {
            updateGuide(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGuide(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const guideIds = row.guideId || this.ids;
      const guideName = row.guideName;
      this.$confirm('是否确认删除新手指南为"' + guideName + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delGuide(guideIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有新手指南数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportGuide(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listGuide().then(response => {
        this.guideOptions = [];
        const guide = { guideId: 0, guideName: '主目录', childern: [] };
        guide.children = this.handleTree(response.rows, "guideId");
        this.guideOptions.push(guide);
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.guideId,
        label: node.guideName,
        children: node.children
      };
    },
    handleClose() {
      this.open = false;
      this.form = {}
    },
  }
};
</script>
