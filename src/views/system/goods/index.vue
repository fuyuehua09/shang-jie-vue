<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="商品分类" prop="goodsCategoryId">
        <el-select
          v-model="queryParams.goodsCategoryId"
          placeholder="请选择商品分类"
          clearable
          size="small"
        >
          <el-option
            v-for="item in goodsCategory"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          >
          </el-option>
        </el-select>
        <!-- <el-cascader :options="normalizer" :show-all-levels="false"></el-cascader> -->
        <!-- <treeselect
            style="width: 20%"
            v-model="queryParams.goodsCategoryId"
            :options="goodsCategory"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择分类目录"
          /> -->
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
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
          v-hasPermi="['system:goods:add']"
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
          v-hasPermi="['system:goods:edit']"
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
          v-hasPermi="['system:goods:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:goods:export']"
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
      :data="goodsList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="商品id"
        align="center"
        prop="goodsId"
        v-if="false"
      />
      <el-table-column label="商品图片" align="center" prop="goodsPhoto">
        <template slot-scope="scope">
          <!-- <img :src="base_url + scope.row.goodsPhoto" class="tablePhoto" /> -->
          <img :src="scope.row.goodsPhoto" class="tablePhoto" />
        </template>
      </el-table-column>
      <el-table-column
        label="商品分类"
        align="center"
        prop="goodsCategoryName"
      />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="商品价格" align="center" prop="goodsPrice" />
      <el-table-column
        label="兑换所需积分"
        align="center"
        prop="goodsIntegral"
      />
      <el-table-column label="单位" align="center" prop="goodsUnit" />
      <el-table-column label="重量" align="center" prop="goodsWeight" />
      <el-table-column label="商品库存" align="center" prop="goodsStock" />
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
            v-hasPermi="['system:goods:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:goods:remove']"
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

    <!-- 添加或修改商品列表对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
      @close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="10">
            <el-row>
              <el-form-item label="商品名称" prop="goodsName">
                <el-input
                  v-model="form.goodsName"
                  placeholder="请输入商品名称"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="商品买点" prop="goodsDesc">
                <el-input
                  v-model="form.goodsDesc"
                  type="textarea"
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="商品分类" prop="goodsCategoryId">
                <el-select
                  v-model="form.goodsCategoryId"
                  placeholder="请选择商品分类"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in goodsCategory"
                    :key="item.categoryId"
                    :label="item.categoryName"
                    :value="item.categoryId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="兑换积分" prop="goodsIntegral">
                <el-input
                  v-model="form.goodsIntegral"
                  placeholder="请输入兑换所需积分"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="商品规格" prop="goodsUnit">
                <el-input
                  v-model="form.goodsUnit"
                  placeholder="请输入商品规格"
                />
              </el-form-item>
            </el-row>
          </el-col>
          <el-col :span="14">
            <el-form-item label="商品图片" prop="goodsPhoto">
              <!-- <el-input v-model="form.goodsPhoto" placeholder="请输入商品图片" /> -->
              <el-upload
                :action="upload.url"
                :show-file-list="false"
                :headers="upload.headers"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-progress="onProgress"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <el-button v-else size="small"
                  >上传<i class="el-icon-upload el-icon--right"></i>
                </el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品重量" prop="goodsWeight">
              <el-input v-model="form.goodsWeight" placeholder="请输入重量"  ><i slot="suffix">kg</i></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="商品库存" prop="goodsStock">
              <el-input
                v-model="form.goodsStock"
                placeholder="请输入商品库存"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品详情">
          <!-- <editor v-model="form.goodsInfo" :min-height="192" /> -->
          <vue-ueditor-wrap v-model="form.goodsInfo" :min-height="192" />
        </el-form-item>
        <!-- <el-form-item label="商品价格" prop="goodsPrice">
          <el-input v-model="form.goodsPrice" placeholder="请输入商品价格" />
        </el-form-item> -->
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
import { listGoods, getGoods, delGoods, addGoods, updateGoods, exportGoods } from "@/api/system/goods";
import Editor from '@/components/Editor';
import { getListCategory } from "@/api/system/category";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Goods",
  // components: { Editor },
  components: { Treeselect, Editor },
  data() {
    return {
      base_url: process.env.VUE_APP_BASE_API,
      upload: {
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 照片上传路径
        url: process.env.VUE_APP_BASE_API + "/file/upload/goods",
      },
      // 图片路径
      imageUrl: "",
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
      // 商品列表表格数据
      goodsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsCategoryId: null,
        goodsName: null,
      },
      goodsCategory: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsCategoryId: [
          { required: true, message: "商品分类不能为空", trigger: "change" }
        ],
        goodsName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        goodsDesc: [
          { required: true, message: "商品描述不能为空", trigger: "blur" }
        ],
        goodsPhoto: [
          { required: true, message: "商品图片不能为空", trigger: "blur" }
        ],
        goodsInfo: [
          { required: true, message: "商品详情不能为空", trigger: "blur" }
        ],
        goodsIntegral: [
          { required: true, message: "兑换所需积分不能为空", trigger: "blur" }
        ],
        goodsStock: [
          { required: true, message: "商品库存不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getCategory();
  },
  methods: {
    // 获取所有商品分类
    getCategory() {
      getListCategory().then(response => {
        this.goodsCategory = response.rows
      })
    },
    /** 查询商品列表列表 */
    getList() {
      this.loading = true;
      listGoods(this.queryParams).then(response => {
        this.goodsList = response.rows;
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
        goodsId: null,
        goodsCategoryId: null,
        goodsName: null,
        goodsDesc: null,
        goodsPhoto: null,
        goodsInfo: null,
        goodsPrice: null,
        goodsIntegral: null,
        goodsUnit: null,
        goodsWeight: null,
        delFlag: null,
        createBy: null,
        goodsStock: null,
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
      this.ids = selection.map(item => item.goodsId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const goodsId = row.goodsId || this.ids
      getGoods(goodsId).then(response => {
        this.form = response.data;
        this.imageUrl = response.data.goodsPhoto;
        // this.imageUrl = this.base_url + response.data.goodsPhoto;
        this.open = true;
        this.title = "修改商品列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.goodsId != null) {
            updateGoods(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGoods(this.form).then(response => {
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
      const goodsIds = row.goodsId || this.ids;
      this.$confirm('是否确认删除商品列表编号为"' + goodsIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delGoods(goodsIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有商品列表数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportGoods(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    // 图片上传成功调用
    handleSuccess(res, file) {
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.goodsPhoto = res.data.id
      this.loading = false;
    },
    // 上传图片之前调用
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    },
    handleClose() {
      this.imageUrl = ""
    },
    onProgress() {
      // 文件上传中执行
      this.loading = true;
    },
    /** 转换菜单数据结构 */
    // normalizer(node) {
    //   if (node.children && !node.children.length) {
    //     delete node.children;
    //   }
    //   return {
    //     id: node.categoryId,
    //     label: node.categoryName,
    //     children: node.children
    //   };
    // },
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
