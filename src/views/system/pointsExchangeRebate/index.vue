<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="银行名称" prop="bankName">
        <el-input
          v-model="queryParams.bankName"
          placeholder="请输入银行名称"
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:pointsExchangeRebate:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:pointsExchangeRebate:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:pointsExchangeRebate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:pointsExchangeRebate:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pointsExchangeRebateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="积分兑换成功返佣id" align="center" prop="rebateId" v-if="false"/>
      <el-table-column label="银行名称" align="center" prop="bankName" />
      <el-table-column label="银行编号" align="center" prop="bankNo" />
      <el-table-column label="合伙人返佣比例" align="center" prop="agentRebateAmount" >
        <template slot-scope="scope">
          <p>{{scope.row.agentRebateAmount}}%</p>
        </template>
      </el-table-column>
      <el-table-column label="间接推荐人返佣比例" align="center" prop="indirectRecommenderAmount">
        <template slot-scope="scope">
          <p>{{scope.row.indirectRecommenderAmount}}%</p>
        </template>
      </el-table-column>
      <el-table-column label="直接推荐人返佣比例" align="center" prop="directRecommenderAmount">
        <template slot-scope="scope">
          <p>{{scope.row.directRecommenderAmount}}%</p>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:pointsExchangeRebate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:pointsExchangeRebate:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改积分返额对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="form.bankName" placeholder="请输入银行名称" />
        </el-form-item>
        <el-form-item label="银行编号" prop="bankNo">
          <el-input v-model="form.bankNo" placeholder="请输入银行编号" />
        </el-form-item>
        <el-form-item label="合伙人返佣比例" prop="agentRebateAmount">
          <el-input v-model="form.agentRebateAmount" placeholder="请输入合伙人返佣比例"  ><i slot="suffix">%</i></el-input>
        </el-form-item>
        <el-form-item label="间接推荐人返佣比例" prop="indirectRecommenderAmount">
          <el-input v-model="form.indirectRecommenderAmount" placeholder="请输入间接推荐人返佣比例" ><i slot="suffix">%</i></el-input>
        </el-form-item>
        <el-form-item label="直接推荐人返佣比例" prop="directRecommenderAmount">
          <el-input v-model="form.directRecommenderAmount" placeholder="请输入直接推荐人返佣比例" ><i slot="suffix">%</i></el-input>
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
import { listPointsExchangeRebate, getPointsExchangeRebate, delPointsExchangeRebate, addPointsExchangeRebate, updatePointsExchangeRebate, exportPointsExchangeRebate } from "@/api/system/pointsExchangeRebate";

export default {
  name: "PointsExchangeRebate",
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
      // 积分返额表格数据
      pointsExchangeRebateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bankName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        agentRebateAmount: [
          { required: true, message: "合伙人返佣比例不能为空", trigger: "blur" }
        ],
        directRecommenderAmount: [
          { required: true, message: "直接推荐人返佣比例不能为空", trigger: "blur" }
        ],
        indirectRecommenderAmount: [
          { required: true, message: "间接推荐人返佣比例不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询积分返额列表 */
    getList() {
      this.loading = true;
      listPointsExchangeRebate(this.queryParams).then(response => {
        this.pointsExchangeRebateList = response.rows;
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
        rebateId: null,
        bankName: null,
        bankNo: null,
        agentRebateAmount: null,
        directRecommenderAmount: null,
        indirectRecommenderAmount: null,
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
      this.ids = selection.map(item => item.rebateId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加积分返额";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rebateId = row.rebateId || this.ids
      getPointsExchangeRebate(rebateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改积分返额";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rebateId != null) {
            updatePointsExchangeRebate(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPointsExchangeRebate(this.form).then(response => {
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
      const rebateIds = row.rebateId || this.ids;
      this.$confirm('是否确认删除积分返额编号为"' + rebateIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPointsExchangeRebate(rebateIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有积分返额数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPointsExchangeRebate(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
