<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="用户名" prop="userId">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <!-- <el-option label="请选择字典生成" value="paymentStatusOptions" /> -->
          <el-option
            v-for="item in paymentStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:withdrawal:add']"
          >新增</el-button
        >
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:withdrawal:edit']"
          >修改</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:withdrawal:remove']"
          >删除</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:withdrawal:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="withdrawalList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" v-if="false" />
      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <el-table-column label="提现用户" align="center" prop="userName" />
      <el-table-column label="提现金额" align="center" prop="amount">
        <template slot-scope="scope">
          <p>￥{{ scope.row.amount }}元</p>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center" prop="realName" />
      <el-table-column label="银行" align="center" prop="baneName" />
      <el-table-column label="账号" align="center" prop="cardNo" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.status === 0">待打款</el-tag>
          <el-tag type="success" v-else-if="scope.row.status === 1"
            >已打款</el-tag
          >
          <el-tag type="danger" v-else-if="scope.row.status === 2"
            >已驳回</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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
            v-hasPermi="['system:withdrawal:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:withdrawal:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户提现对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户" disabled />
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
          <el-input
            v-model="form.amount"
            placeholder="请输入提现金额"
            disabled
          ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            v-model="form.realName"
            placeholder="请输入真实姓名"
            disabled
          />
        </el-form-item>
        <el-form-item label="银行名称" prop="baneName">
          <el-input
            v-model="form.baneName"
            placeholder="请输入银行名称"
            disabled
          />
        </el-form-item>
        <el-form-item label="账号" prop="cardNo">
          <el-input v-model="form.cardNo" placeholder="请输入账号" disabled />
        </el-form-item>
        <el-form-item label="账号状态">
          <el-radio-group v-model="form.status">
            <!-- <el-radio label="1">请选择字典生成</el-radio> -->
            <el-radio
              v-for="item in paymentStatusOptions"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWithdrawal, getWithdrawal, delWithdrawal, addWithdrawal, updateWithdrawal, exportWithdrawal } from "@/api/system/withdrawal";

export default {
  name: "Withdrawal",
  data() {
    return {
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
      // 用户提现表格数据
      withdrawalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        amount: null,
        userName: null,
        realName: null,
        baneName: null,
        cardNo: null,
        status: null,
      },
      // 打款状态
      paymentStatusOptions: [
        {
          value: 0,
          label: "待打款"
        },
        {
          value: 1,
          label: "已打款"
        },
        {
          value: 2,
          label: "已驳回"
        }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "提现金额不能为空", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "提现人真实姓名不能为空", trigger: "blur" }
        ],
        baneName: [
          { required: true, message: "银行名称不能为空", trigger: "blur" }
        ],
        cardNo: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "账号状态不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户提现列表 */
    getList() {
      this.loading = true;
      listWithdrawal(this.queryParams).then(response => {
        this.withdrawalList = response.rows;
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
        id: null,
        userId: null,
        amount: null,
        realName: null,
        baneName: null,
        cardNo: null,
        status: 0,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户提现";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWithdrawal(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户提现";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWithdrawal(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWithdrawal(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除用户提现编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delWithdrawal(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户提现数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportWithdrawal(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
