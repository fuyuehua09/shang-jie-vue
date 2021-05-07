<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="78px"
    >
      <el-form-item label="银行名称" prop="merCardName">
        <el-input
          v-model="queryParams.merCardName"
          placeholder="请输入银行名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:list:add']"
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
          v-hasPermi="['system:list:edit']"
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
          v-hasPermi="['system:list:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-refresh"
          size="mini"
          @click="handleReset"
          v-hasPermi="['system:list:edit']"
          >更新</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="listList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="LOGO" align="center" prop="icon" width="200">
        <template slot-scope="scope">
          <span>
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.merCardImg"
            >
            </el-image>
          </span>
          <span>
            <el-image
              style="width: 100px; height: 60px"
              :src="scope.row.creditSingleUrl"
            >
            </el-image>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="信用卡办卡返佣id"
        align="center"
        prop="rebateId"
        v-if="false"
      />
      <el-table-column label="银行名称" align="center" prop="merCardName" />
      <!-- <el-table-column label="银行标识1" align="center" prop="bankId" /> -->
      <el-table-column label="银行标识" align="center" width="150px">
        <template slot-scope="scope">
          {{scope.row.bankId}}-{{scope.row.merCardId}}
        </template>
      </el-table-column>
      <el-table-column label="分类信息" align="center" prop="classify" />
      <el-table-column label="推广信息" align="center" prop="extension" />
      <!-- <el-table-column label="用户积分" align="center" prop="integral">
        <template slot-scope="scope">
          <p>{{ scope.row.integral }}</p>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="合伙人" align="center" prop="agentRebateAmount">
        <template slot-scope="scope">
          <p>￥{{ scope.row.agentRebateAmount }}元</p>
        </template>
      </el-table-column>
      <el-table-column
        label="间接推荐人"
        align="center"
        prop="indirectRecommenderAmount"
      >
        <template slot-scope="scope">
          <p>￥{{ scope.row.indirectRecommenderAmount }}元</p>
        </template>
      </el-table-column>
      <el-table-column
        label="直接推荐人"
        align="center"
        prop="directRecommenderAmount"
      >
        <template slot-scope="scope">
          <p>￥{{ scope.row.directRecommenderAmount }}元</p>
        </template>
      </el-table-column>
      <el-table-column label="普通用户" align="center" prop="applicantAmount">
        <template slot-scope="scope">
          <p>￥{{ scope.row.applicantAmount }}元</p>
        </template>
      </el-table-column>
      <el-table-column label="VIP用户" align="center" prop="vipAmount">
        <template slot-scope="scope">
          <p>￥{{ scope.row.vipAmount }}元</p>
        </template>
      </el-table-column> -->
      <el-table-column label="最高返额" align="center" prop="maximumAmount">
        <template slot-scope="scope">
          <p>￥{{ scope.row.maximumAmount }}元</p>
        </template>
      </el-table-column>
      <el-table-column label="办卡/信贷" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.type"
            active-value="1"
            inactive-value="0"
            @change="handleTypeChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="隐藏/显示" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visible"
            active-value="1"
            inactive-value="0"
            @change="handleVisibleChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" /> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-upload"
            @click="handeUpload(scope.row)"
            v-hasPermi="['system:applyCardrebate:edit']"
            >上传</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:applyCardrebate:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:applyCardrebate:remove']"
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

    <!-- 添加或修改银行资源列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="名称" prop="merCardName">
          <el-input
            v-model="form.merCardName"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="分类信息" prop="classify">
          <el-input
            v-model="form.classify"
            placeholder="请输入分类信息"
          />
        </el-form-item>
        <el-form-item label="推广信息" prop="extension">
          <el-input
            v-model="form.extension"
            placeholder="请输入推广信息"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合伙人返额" prop="agentRebateAmount">
              <el-input
                v-model="form.agentRebateAmount"
                placeholder="请输入合伙人返佣金额"
                ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="间接推荐人" prop="indirectRecommenderAmount">
              <el-input
                v-model="form.indirectRecommenderAmount"
                placeholder="请输入间接推荐人返佣金额"
                ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="直接推荐人" prop="directRecommenderAmount">
              <el-input
                v-model="form.directRecommenderAmount"
                placeholder="请输入直接推荐人返佣金额"
                ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="普通用户" prop="applicantAmount">
              <el-input
                v-model="form.applicantAmount"
                placeholder="请输入普通用户返佣金额"
                ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="VIP用户" prop="vipAmount">
              <el-input
                v-model="form.vipAmount"
                placeholder="请输入VIP用户返佣金额"
                ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input
              >
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="最高返额" prop="maximumAmount">
              <el-input
                v-model="form.maximumAmount"
                placeholder="请输入VIP用户返佣金额"
                ><i slot="prefix">￥</i><i slot="suffix">元</i></el-input
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12"> </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
        <el-row>
          <el-col :span="12"> </el-col>
          <el-col :span="12"> </el-col>
        </el-row>
        <el-form-item label="申请条件">
          <vue-ueditor-wrap v-model="form.conditions" :min-height="192"/>
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

    <el-dialog
      title="上传图片"
      :visible.sync="shareOpen"
      width="300px"
      append-to-body
    >
      <el-upload
        :action="upload.url"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :headers="upload.headers"
        :limit="1"
      >
        <div class="block">
          <el-image v-if="form.sharePhoto" :src="form.sharePhoto"></el-image>
        </div>
        <el-button size="small" type="primary" icon="el-icon-upload"
          >点击上传</el-button
        >
      </el-upload>
      <div class="link">
        <el-link
          v-if="form.sharePhoto"
          :href="form.sharePhoto"
          target="_blank"
          type="primary"
          >查看原图</el-link
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listList, getList, delList, addList, updateList, exportList, changeType, changeVisible, reset } from "@/api/system/bankList";
import Editor from '@/components/Editor';
import { getToken } from "@/utils/auth";

export default {
  name: "List",
  components: { Editor },
  data() {
    return {
      base_url: process.env.VUE_APP_BASE_API,
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 照片上传路径
        url: process.env.VUE_APP_BASE_API + "/file/upload/carouselMap",
      },
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
      // 银行资源列表表格数据
      listList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示上传图片的弹出层
      shareOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        merCardName: null,
        bankId: null,
        merCardId: null,
        cardType: null,
        cardAmount: null,
        labelTitle: null,
        littleFlag: null,
        merCardImg: null,
        auditType: null,
        gatewayId: null,
        applicantAmount: null,
        agentRebateAmount: null,
        directRecommenderAmount: null,
        indirectRecommenderAmount: null,
        integral: null,
        applicantRebate: null,
        agentRebate: null,
        directRecommenderRebate: null,
        indirectRecommenderRebate: null,
        loanIntegral: null,
        type: 0,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bankId: [
          { required: true, message: "银行编号不能为空", trigger: "blur" }
        ],
        merCardId: [
          { required: true, message: "卡片编号不能为空", trigger: "blur" }
        ],
        applicantAmount: [
          { required: true, message: "申请人返佣金额不能为空", trigger: "blur" }
        ],
        agentRebateAmount: [
          { required: true, message: "合伙人返佣金额不能为空", trigger: "blur" }
        ],
        directRecommenderAmount: [
          { required: true, message: "直接推荐人返佣金额不能为空", trigger: "blur" }
        ],
        indirectRecommenderAmount: [
          { required: true, message: "间接推荐人返佣金额不能为空", trigger: "blur" }
        ],
        integral: [
          { required: true, message: "返给用户的积分不能为空", trigger: "blur" }
        ],
        applicantRebate: [
          { required: true, message: "申请人返佣金额不能为空", trigger: "blur" }
        ],
        agentRebate: [
          { required: true, message: "合伙人返佣金额不能为空", trigger: "blur" }
        ],
        directRecommenderRebate: [
          { required: true, message: "直接推荐人返佣金额不能为空", trigger: "blur" }
        ],
        indirectRecommenderRebate: [
          { required: true, message: "间接推荐人返佣金额不能为空", trigger: "blur" }
        ],
        loanIntegral: [
          { required: true, message: "返给用户的积分不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询银行资源列表列表 */
    getList() {
      this.loading = true;
      listList(this.queryParams).then(response => {
        this.listList = response.rows;
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
        merCardName: null,
        bankId: null,
        merCardId: null,
        cardType: null,
        cardAmount: null,
        labelTitle: null,
        littleFlag: null,
        merCardImg: null,
        auditType: null,
        gatewayId: null,
        applicantAmount: null,
        agentRebateAmount: null,
        directRecommenderAmount: null,
        indirectRecommenderAmount: null,
        integral: null,
        applicantRebate: null,
        agentRebate: null,
        directRecommenderRebate: null,
        indirectRecommenderRebate: null,
        loanIntegral: null,
        sharePhoto: null,
        type: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加银行资源列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rebateId = row.rebateId || this.ids
      getList(rebateId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改银行资源列表";
      });
    },
    handeUpload(row) {
      const rebateId = row.rebateId || this.ids
      getList(rebateId).then(response => {
        this.form = response.data;
        this.shareOpen = true;
      });
    },
    // 图片上传之前
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!(isJPG || isPNG)) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!');
      }
      return (isJPG || isPNG) && isLt1M;
    },
    // 图片上传成功
    handleSuccess(res, file) {
      this.form.sharePhoto = res.img;
      updateList(this.form).then(response => {
        this.msgSuccess("上传成功");
        this.open = false;
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rebateId != null) {
            updateList(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              // console.log("测试")
              this.getList();
            });
          } else {
            addList(this.form).then(response => {
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
      this.$confirm('是否确认删除银行资源列表编号为"' + rebateIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delList(rebateIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有银行资源列表数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportList(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    // 修改类型
    handleTypeChange(row) {
      let text = row.type === "0" ? "办卡" : "信贷";
      this.$confirm('确认改为"' + text + '"业务吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeType(row.rebateId, row.type);
      }).then(() => {
        this.msgSuccess(text + "业务修改成功");
        this.getList();
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 修改显示状态
    handleVisibleChange(row) {
      let text = row.visible === "0" ? "隐藏" : "显示";
      this.$confirm('确认改为"' + text + '"状态吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeVisible(row.rebateId, row.visible);
      }).then(() => {
        this.msgSuccess("修改成功");
        this.getList();
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 更新银行接口
    handleReset(){
      reset().then(response =>{
        console.log(response)
        this.getList();
      })
    }
  }
};
</script>

<style scoped>
.link {
  margin-top: 10px;
  text-align: center;
}
</style>
