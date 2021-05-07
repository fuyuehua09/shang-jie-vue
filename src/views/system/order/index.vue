<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="订单编号" prop="userId">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递名称" prop="expressId">
        <el-input
          v-model="queryParams.expressId"
          placeholder="请输入快递名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递单号" prop="expressNo">
        <el-input
          v-model="queryParams.expressNo"
          placeholder="请输入快递单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="兑换状态" prop="exchangeStatus">
        <el-select
          v-model="queryParams.exchangeStatus"
          placeholder="请选择兑换状态"
          clearable
          size="small"
        >
          <el-option
            v-for="item in exchangeStatusOptions"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="下单时间" prop="deliveryTime">
        <el-date-picker
          clearable
          size="small"
          style="width: 200px"
          v-model="queryParams.deliveryTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择发货时间"
        >
        </el-date-picker>
      </el-form-item> -->
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
          v-hasPermi="['system:order:add']"
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
          v-hasPermi="['system:order:edit']"
          >发货</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:order:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
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
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" v-if="false" />
      <el-table-column
        label="订单编号"
        align="center"
        prop="orderNo"
        width="120"
      />
      <el-table-column
        label="商品名称"
        align="center"
        prop="goodsName"
        width="120"
      />
      <el-table-column label="商品图片" align="center" width="140">
        <template slot-scope="scope">
          <img :src="base_url + scope.row.goodsPhoto" class="tablePhoto" />
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="80">
        <template slot-scope="scope">
          <p>{{ scope.row.total }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="收货人姓名"
        align="center"
        prop="fullName"
        width="100"
      />
      <el-table-column
        label="收货人电话"
        align="center"
        prop="mobile"
        width="110"
      />
      <el-table-column label="地址" align="center" width="200">
        <template slot-scope="scope">
          <p>
            {{ scope.row.provinceName }}、{{ scope.row.cityName }}、{{
              scope.row.areaName
            }}
          </p>
          <p>{{ scope.row.address }}</p>
        </template>
      </el-table-column>
      <el-table-column label="兑换积分" align="center" prop="goodsIntegral" />
      <el-table-column label="兑换状态" align="center" prop="exchangeStatus">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.exchangeStatus === 0"
            >未发货</el-tag
          >
          <el-tag type="warning" v-else-if="scope.row.exchangeStatus === 1"
            >已发货</el-tag
          >
          <el-tag type="success" v-else-if="scope.row.exchangeStatus === 2"
            >确认收货</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="快递名称"
        align="center"
        prop="expressName"
        width="180"
      />
      <el-table-column
        label="快递单号"
        align="center"
        prop="expressNo"
        width="180"
      />
      <el-table-column
        label="发货时间"
        align="center"
        prop="deliveryTime"
        width="180"
      />
      <el-table-column
        label="确认收货时间"
        align="center"
        prop="receivingTime"
        width="180"
      />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:order:edit']"
            >发货</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:order:remove']"
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

    <!-- 添加或修改订单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col span="12">
            <el-form-item label="收货人姓名" prop="fullName">
              <el-input
                v-model="form.fullName"
                placeholder="请输入收货人姓名"
              />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="收货人电话" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入收货人电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="provinceNo">
          <el-row>
            <el-col :span="8">
              <el-select
                v-model="form.provinceNo"
                placeholder="请选择省份"
                clearable
                size="small"
                @change="provinceChage"
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="form.cityNo"
                placeholder="请选择城市"
                clearable
                size="small"
                @change="cityChage"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="form.areaNo"
                placeholder="请选择区县"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="address">
              <el-input v-model="form.address" placeholder="请输入详细地址" />
            </el-form-item>
          </el-row>
        </el-form-item>

        <!-- <el-form-item label="城市" prop="cityNo">
         
        </el-form-item>
        <el-form-item label="区县" prop="areaNo">
          
        </el-form-item> -->
        <!-- <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详细地址" />
        </el-form-item> -->
        <el-form-item label="快递名称">
          <!-- <el-input v-model="form.expressId" placeholder="请输入快递公司名称" /> -->
          <el-select
            v-model="form.expressId"
            placeholder="请选择快递公司"
            clearable
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="item in expressList"
              :key="item.id"
              :label="item.expressName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="form.expressNo" placeholder="请输入快递单号" />
        </el-form-item>
        <el-form-item label="兑换状态">
          <el-radio-group v-model="form.exchangeStatus">
            <el-radio
              v-for="dict in exchangeStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder, exportOrder } from "@/api/system/order";
import { getProvince, getCity, getArea } from "@/api/system/address";
import { getExpressList } from "@/api/system/express";

export default {
  name: "Order",
  data() {
    return {
      base_url: process.env.VUE_APP_BASE_API,
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
      // 订单管理表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        userId: null,
        fullName: null,
        mobile: null,
        provinceNo: null,
        cityNo: null,
        areaNo: null,
        areaCode: null,
        address: null,
        goodsId: null,
        goodsIntegral: null,
        expressId: null,
        expressNo: null,
        exchangeStatus: null,
        deliveryTime: null,
        receivingTime: null,
      },
      // 表单参数
      form: {},
      // 省市县
      provinceList: [],
      cityList: [],
      areaList: [],
      exchangeStatusOptions: [
        {
          dictValue: 0,
          dictLabel: "未发货"
        },
        {
          dictValue: 1,
          dictLabel: "已发货"
        },
        {
          dictValue: 2,
          dictLabel: "确认收货"
        }
      ],
      expressList: [],
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        fullName: [
          { required: true, message: "收货人姓名不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "收货人电话不能为空", trigger: "blur" }
        ],
        provinceNo: [
          { required: true, message: "省份编码不能为空", trigger: "blur" }
        ],
        cityNo: [
          { required: true, message: "城市编码不能为空", trigger: "blur" }
        ],
        areaNo: [
          { required: true, message: "区县编码不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ],
        goodsId: [
          { required: true, message: "商品id不能为空", trigger: "blur" }
        ],
        goodsIntegral: [
          { required: true, message: "兑换积分不能为空", trigger: "blur" }
        ],
        exchangeStatus: [
          { required: true, message: "积分兑换状态不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getProvinces();
    this.getExpress();
  },
  methods: {
    // 查询快递列表
    getExpress() {
      getExpressList().then(response => {
        this.expressList = response.rows;
      });
    },
    /** 查询订单管理列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
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
        fullName: null,
        mobile: null,
        provinceNo: null,
        cityNo: null,
        areaNo: null,
        areaCode: null,
        address: null,
        goodsId: null,
        goodsIntegral: null,
        expressId: null,
        expressNo: null,
        exchangeStatus: 0,
        createTime: null,
        deliveryTime: null,
        receivingTime: null,
        createBy: null,
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
      this.title = "添加订单管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改订单管理";
        this.getCitys(response.data.provinceNo)
        this.getAreas(response.data.cityNo)
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
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
      this.$confirm('是否确认删除订单管理编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delOrder(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有订单管理数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportOrder(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    // 查询省份列表
    getProvinces() {
      getProvince().then(response => {
        this.provinceList = response.rows;
      });
    },
    getCitys(code) {
      getCity(code).then(response => {
        this.cityList = response.rows;
      });
    },
    getAreas(code) {
      getArea(code).then(response => {
        this.areaList = response.rows;
      });
    },
    provinceChage(code) {
      this.form.cityNo = null;
      this.form.areaNo = null;
      this.form.provinceNo = code;
      this.cityList = [];
      this.areaList = [];
      // 查询城市列表
      getCity(code).then(response => {
        this.cityList = response.rows;
      });
    },
    cityChage(code) {
      if (!code) {
        this.form.areaNo = null;
        this.areaList = [];
      } else {
        this.form.cityNo = code;
        // 查询区县列表
        getArea(code).then(response => {
          this.areaList = response.rows;
        });
      }
    },
  }
};
</script>

<style scoped>
.avatar {
  /* width: 178px; */
  /* height: 178px; */
  width: 320px;
  height: 280px;
  display: block;
}

.tablePhoto {
  width: 60px;
  height: 60px;
  /* display: block; */
}
</style>

