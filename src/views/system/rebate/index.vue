<template>
  <div class="app-container">
    <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:rebate:add']"
        >新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:rebate:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:rebate:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:rebate:export']"
        >导出</el-button>
      </el-col> -->
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="rebateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="rebateId" v-if="false"/>
      <el-table-column label="会员费" align="center" prop="memberFee">
        <template slot-scope="scope">
          <p>￥{{scope.row.memberFee}}元</p>
        </template>
      </el-table-column>
      <el-table-column label="合伙人返佣金额" align="center" prop="agentRebateAmount">
        <template slot-scope="scope">
          <p>￥{{scope.row.agentRebateAmount}}元</p>
        </template>
      </el-table-column>
      <el-table-column label="间接推荐人返佣金额" align="center" prop="indirectRecommenderAmount">
        <template slot-scope="scope">
          <p>￥{{scope.row.indirectRecommenderAmount}}元</p>
        </template>
      </el-table-column>
      <el-table-column label="直接推荐人返佣金额" align="center" prop="directRecommenderAmount">
        <template slot-scope="scope">
          <p>￥{{scope.row.directRecommenderAmount}}元</p>
        </template>
      </el-table-column>
      <el-table-column label="用户积分" align="center" prop="integral">
        <template slot-scope="scope">
          <p>{{scope.row.integral}}</p>
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
            v-hasPermi="['system:rebate:edit']"
          >修改</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:rebate:remove']"
          >删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改会员费返佣设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="会员费" prop="memberFee">
          <el-input v-model="form.memberFee" placeholder="请输入会员费" ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="合伙人" prop="agentRebateAmount">
          <el-input v-model="form.agentRebateAmount" placeholder="请输入合伙人返佣金额" ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="间接推荐人" prop="indirectRecommenderAmount">
          <el-input v-model="form.indirectRecommenderAmount" placeholder="请输入间接推荐人返佣金额" ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="直接推荐人" prop="directRecommenderAmount">
          <el-input v-model="form.directRecommenderAmount" placeholder="请输入直接推荐人返佣金额" ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="用户积分" prop="integral">
          <el-input v-model="form.integral" placeholder="用户积分" />
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
import { listRebate, getRebate, delRebate, addRebate, updateRebate, exportRebate } from "@/api/system/rebate";

export default {
  name: "Rebate",
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
      // 会员费返佣设置表格数据
      rebateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        agentRebateAmount: [
          { required: true, message: "合伙人返佣金额不能为空", trigger: "blur" }
        ],
        firstRecommenderAmount: [
          { required: true, message: "一级推荐人返佣金额不能为空", trigger: "blur" }
        ],
        secondRecommenderAmount: [
          { required: true, message: "二级推荐人返佣金额不能为空", trigger: "blur" }
        ],
        memberFee: [
          { required: true, message: "会员金额不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询会员费返佣设置列表 */
    getList() {
      this.loading = true;
      listRebate(this.queryParams).then(response => {
        this.rebateList = response.rows;
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
        agentRebateAmount: null,
        firstRecommenderAmount: null,
        secondRecommenderAmount: null,
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
      this.title = "添加会员费返佣设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rebateId = row.rebateId || this.ids
      getRebate(rebateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改会员费返佣设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rebateId != null) {
            updateRebate(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRebate(this.form).then(response => {
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
      this.$confirm('是否确认删除会员费返佣设置编号为"' + rebateIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRebate(rebateIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有会员费返佣设置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRebate(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
