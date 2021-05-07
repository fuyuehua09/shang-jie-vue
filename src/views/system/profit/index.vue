<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:bill:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:bill:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:bill:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:bill:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="billList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="账单id" align="center" prop="billId" v-if="false"/>
      <el-table-column label="用户" align="center" prop="userName" />
      <!-- <el-table-column label="账单类型" align="center" prop="billType" /> -->
      <!-- <el-table-column label="代理商id" align="center" prop="agentId" /> -->
      <el-table-column label="流水类型" align="center" prop="serialType" >
        <template slot-scope="scope">
          <p v-if="scope.row.serialType === 1">购买会员</p>
          <p v-else-if="scope.row.serialType === 2">风险测评</p>
          <p v-else-if="scope.row.serialType === 3">信用卡办理</p>
          <p v-else-if="scope.row.serialType === 4">贷款办理</p>
        </template>
      </el-table-column>
      <!-- <el-table-column label="关联id" align="center" prop="recordId" /> -->
      <el-table-column label="收益金额" align="center" prop="amount" >
        <template slot-scope="scope">
          <p>￥{{scope.row.amount}}元</p>
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" prop="integral" />
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:bill:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:bill:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改账单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="账单类型" prop="billType">
          <el-select v-model="form.billType" placeholder="请选择账单类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="代理商id" prop="agentId">
          <el-input v-model="form.agentId" placeholder="请输入代理商id" />
        </el-form-item>
        <el-form-item label="流水类型" prop="serviceType">
          <el-select v-model="form.serviceType" placeholder="请选择流水类型">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联id" prop="recordId">
          <el-input v-model="form.recordId" placeholder="请输入关联id" />
        </el-form-item>
        <el-form-item label="消费金额" prop="consumeAmount">
          <el-input v-model="form.consumeAmount" placeholder="请输入消费金额" />
        </el-form-item>
        <el-form-item label="收益金额" prop="profitAmount">
          <el-input v-model="form.profitAmount" placeholder="请输入收益金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listBill, getBill, delBill, addBill, updateBill, exportBill } from "@/api/system/bill";

export default {
  name: "Bill",
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
      // 账单管理表格数据
      billList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        // 只查收益记录
        billType: 1,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        billType: [
          { required: true, message: "账单类型不能为空", trigger: "change" }
        ],
        agentId: [
          { required: true, message: "代理商id不能为空", trigger: "blur" }
        ],
        serviceType: [
          { required: true, message: "流水类型不能为空", trigger: "change" }
        ],
        consumeAmount: [
          { required: true, message: "消费金额不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询账单管理列表 */
    getList() {
      this.loading = true;
      listBill(this.queryParams).then(response => {
        this.billList = response.rows;
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
        billId: null,
        userId: null,
        billType: null,
        agentId: null,
        serviceType: null,
        recordId: null,
        consumeAmount: null,
        profitAmount: null,
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
      this.ids = selection.map(item => item.billId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加账单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const billId = row.billId || this.ids
      getBill(billId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改账单管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.billId != null) {
            updateBill(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBill(this.form).then(response => {
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
      const billIds = row.billId || this.ids;
      this.$confirm('是否确认删除账单管理编号为"' + billIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBill(billIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有账单管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBill(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
