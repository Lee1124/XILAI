<template>
  <div>
    <p style="text-align: center">
      <el-select class="OrderSelect" @change="OrderSelect" v-model="OrderID" placeholder="请选择店铺">
        <el-option
          v-for="item in BranchOrderData"
          :key="item.BranchId"
          :label="item.BranchName"
          :value="item.BranchId">
        </el-option>
      </el-select>
      <span>借鉴文件案例收益设置</span>
    </p>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top: 20px"
      border
    >
      <el-table-column
        label="类型"
        prop="Name" width="150" align="center">
      </el-table-column>

      <el-table-column
        label="计算方式"
        prop="GetIntegralRuleName" align="center">
      </el-table-column>

      <el-table-column
        label="收益岗位" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.IntegralPostPencentList!=null">
            <template v-for="item in scope.row.IntegralPostPencentList">
              <span style="display: block;">{{item.PostName}}*{{item.AmountPercent}}</span>
            </template>
          </span>
          <span v-if="scope.row.IntegralPostPencentList==null">{{scope.row.EarningsPostName}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="最大值"
        prop="MaxIntegral"
        align="center"
        width="80">
      </el-table-column>

      <el-table-column
        label="最小值"
        prop="MinIntegral"
        align="center"
        width="80">
      </el-table-column>

      <el-table-column
        label="店铺收入"
        prop="EarningsBranchRuleName"
        width="200" align="center">
      </el-table-column>

      <el-table-column
        label="未设置模板" align="center" width="100">
        <template slot-scope="scope">
          <span :class="{colorStyleFont:!scope.row.IsSetMuBan}">
            {{ scope.row.IsSetMuBan? '否':'是' }}
          </span>
          <el-tooltip v-if="!scope.row.IsSetMuBan" class="item" effect="dark" content="*如果未设置模板一律按通用模板计算"
                      placement="top">
            <i class="tips"></i>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            style="border: none"
            @click="handleEditS(scope.$index, scope.row,'edits')" v-if="!scope.row.IsSetMuBan&&OrderID==''">编辑
          </el-button>
          <el-button
            size="mini"
            style="border: none"
            @click="handleEditS(scope.$index, scope.row,'add')" v-if="!scope.row.IsSetMuBan&&OrderID!=''">添加
          </el-button>
          <el-button
            size="mini"
            style="border: none"
            @click="handleEditS(scope.$index, scope.row,'edits2')" v-if="scope.row.IsSetMuBan&&OrderID!=''">编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑 or 新增-->
    <el-dialog
      :title="diaLogTitle"
      :visible.sync="centerDialogVisible"
      center
      custom-class="addOrEdit"
      :show-close=false
      @opened="openEvent"
      @close="closeall">
      <i class="closeIcon" @click="closeTip">
        <img src="../../static/img/close.png" alt="关闭">
      </i>
      <div class="addOrEdit-content">
        <p class="Titles">
          <span style="position: relative;left: 5px;top: -1px;">员工收入</span>
        </p>
        <ul class="dialogBox">
          <li>
            <span>计算方式: </span>
            <span class="select1" style="margin-left:2px;">
            <el-select placeholder="请选择" v-model="demo.dem2" @change="selectJSFS1">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </span>
            <span class="input1" style="position:relative;">
            <el-input style="width: 100px" v-model="FromData.IntegralValue" @input="JSFS1Input(FromData.IntegralValue)"
                      @blur="blurInput(FromData.IntegralValue,'jsje')"
                      :placeholder="placeholderText"></el-input>
              <span style="position: absolute;right: -10px;top: 0;color: #000;"
                    v-if="isShowPrence1">%</span>
              <span style="position: absolute;right: -10px;top: 0;color: #000;"
                    v-if="!isShowPrence1">元</span>
          </span>
          </li>

          <li>
            <span>比例分配: </span>
            <span class="select1" style="margin-left:2px;">
            <el-select placeholder="请选择" v-model="demo.dem6" @change="selectJSFS6">
            <el-option
              v-for="item in [{label:'是',value:1},{label:'否',value:0}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
            </span>
          </li>

          <li>
            <div class="sygw" v-if="demo.dem6=='1'">
              <span class="sygw-title">收益岗位: </span>
              <div class="selectBox">
                <template v-for="(items,index) in postSelect">
                    <span class="selectBox-inner">
                       <span class="select1">
                       <el-select placeholder="选择一个岗位" v-model="postSelect[index].name" @change="selectPost(items)">
                       <el-option
                         v-for="item in items.Department"
                         :key="item.PostId"
                         :label="item.PostName"
                         :value="item.PostId">
                       </el-option>
                       </el-select>
                       </span>
                         <span class="input1" style="position:relative;">
                       <el-input style="width: 100px" v-model="postSelect[index].SYScale" @input="SYInput(items)"
                                 placeholder="输入收益比"></el-input>
                      <span style="position: absolute;right: -10px;top: 0;color: #B2B2B2;"
                            v-if="postSelect[index].SYScale==''">%</span>
                      <span style="position: absolute;right: -10px;top: 0;"
                            v-if="postSelect[index].SYScale!=''">%</span>
                       </span>
                     </span>
                </template>


                <!--<span class="selectBox-inner">-->
                <!--<span class="select1">-->
                <!--<el-select placeholder="选择一个岗位" v-model="demo.dem3" @change="OptionAllb">-->
                <!--<el-option-->
                <!--v-for="item in Department"-->
                <!--:key="item.PostId"-->
                <!--:label="item.PostName"-->
                <!--:value="item.PostId">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</span>-->
                <!--<span class="input1">-->
                <!--<el-input style="width: 100px" v-model="FromData.IntegralValue" @input="Integrals()"-->
                <!--placeholder="输入收益比"></el-input>-->
                <!--</span>-->
                <!--</span>-->
              </div>
            </div>

            <div class="sygw" v-if="demo.dem6=='0'">
              <span class="sygw-title">收益岗位: </span>
              <div class="selectBox">
                <template v-for="(items,index) in postSelect">
                    <span class="selectBox-inner">
                       <span class="select1">
                       <el-select placeholder="选择一个岗位" v-model="postSelect[index].name" @change="selectPost(items)">
                       <el-option
                         v-for="item in items.Department"
                         :key="item.PostId"
                         :label="item.PostName"
                         :value="item.PostId">
                       </el-option>
                       </el-select>
                       </span>
                     </span>
                </template>


                <!--<span class="selectBox-inner">-->
                <!--<span class="select1">-->
                <!--<el-select placeholder="选择一个岗位" v-model="demo.dem3" @change="OptionAllb">-->
                <!--<el-option-->
                <!--v-for="item in Department"-->
                <!--:key="item.PostId"-->
                <!--:label="item.PostName"-->
                <!--:value="item.PostId">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <!--</span>-->
                <!--<span class="input1">-->
                <!--<el-input style="width: 100px" v-model="FromData.IntegralValue" @input="Integrals()"-->
                <!--placeholder="输入收益比"></el-input>-->
                <!--</span>-->
                <!--</span>-->
              </div>
            </div>
          </li>

          <li class="num">
            <span>最&nbsp; 大&nbsp; 值: </span>
            <span class="select1">
            <el-input style="width: 100px" v-model="FromData.MaxIntegral" placeholder="请输入内容"></el-input>
          </span>
          </li>
          <li class="num">
            <span>最&nbsp; 小&nbsp; 值: </span>
            <span class="select1">
            <el-input style="width: 100px" v-model="FromData.MinIntegral" placeholder="请输入内容"></el-input>
          </span>
          </li>
          <!--<li v-if="IsSetMuBan">-->
          <!--<span>店铺选择: </span>-->
          <!--<el-select placeholder="请选择" v-model="demo.dem1" :disabled="disableds" @change="OptionAlla">-->
          <!--<el-option-->
          <!--v-for="item in BranchOrderDatas"-->
          <!--:key="item.BranchId"-->
          <!--:label="item.BranchName"-->
          <!--:value="item.BranchId">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</li>-->
          <!--<li>-->
          <!--<span>计算方式: </span>-->
          <!--<el-select  placeholder="请选择" v-model="demo.dem2" @change="OptionAllb">-->
          <!--<el-option-->
          <!--v-for="item in options1"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--<el-input style="width: 100px" v-model="FromData.IntegralValue" @input="Integrals()" placeholder="请输入内容"></el-input>-->
          <!--</li>-->
          <!--<li>-->
          <!--<span>收益岗位: </span>-->
          <!--<el-select v-model="demo.dem3" @change="Departments" multiple placeholder="请选择">-->
          <!--<el-option-->
          <!--v-for="item in Department"-->
          <!--:key="item.PostId"-->
          <!--:label="item.PostName"-->
          <!--:value="item.PostId">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</li>-->
          <!--<li>-->
          <!--<span>最大值: </span>-->
          <!--<el-input style="width: 100px" v-model="FromData.MaxIntegral" placeholder="请输入内容"></el-input>-->
          <!--</li>-->
          <!--<li>-->
          <!--<span>最小值: </span>-->
          <!--<el-input style="width: 100px" v-model="FromData.MinIntegral" placeholder="请输入内容"></el-input>-->
          <!--</li>-->
        </ul>
        <p class="Titles">
          <span style="position: relative;left: 5px;top: -1px;">店铺收入</span>
        </p>
        <ul class="OrderStyle">
          <li>
            <span>店铺收入: </span>
            <span class="select1">
            <el-select placeholder="请选择" v-model="demo.dem4" @change="selectDPSR">
            <el-option
              v-for="item in dianPuYesNoArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </span>
          </li>
          <li class="jsfs" v-if="isShowJSFS2">
            <span>计算方式: </span>
            <span class="select1">
             <el-select placeholder="请选择" v-model="demo.dem5" @change="selectJSFS2">
             <el-option
               v-for="item in options1"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
          </el-select>
          </span>
            <span class="input1" style="position: relative;">
            <el-input style="width: 100px" v-model="FromData.IntegralValue2"
                      @input="JSFS2Input(FromData.IntegralValue2)"
                      :placeholder="placeholderText2"></el-input>
               <span style="position: absolute;right: -10px;top: 0;color: #000;"
                     v-if="isShowPrence2">%</span>
               <span style="position: absolute;right: -10px;top: 0;color: #000;"
                     v-if="!isShowPrence2">元</span>
          </span>
          </li>

          <!--<li>-->
          <!--<span>店铺收入: </span>-->
          <!--<el-select placeholder="请选择" v-model="demo.dem4" @change="OptionAllc">-->
          <!--<el-option-->
          <!--v-for="item in [{value:1,label:'有'},{value:0,label:'无'}]"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</li>-->
          <!--<li v-if="InStart">-->
          <!--<span>计算方式: </span>-->
          <!--<el-select v-model="demo.dem5" placeholder="请选择" @change="OptionAlld">-->
          <!--<el-option-->
          <!--v-for="item in options1"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--<el-input style="width: 100px" v-model="FromData.EarningsBranchValue" placeholder="请输入数额"></el-input>-->
          <!--</li>-->
        </ul>
      </div>
      <!--<div v-if="InStart" class="sublimet" @click="sublimet()">保存</div>-->
      <!--<div v-else="InStart" class="sublimet" @click="sublimets()">保存</div>-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEvent">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "reference",
    data() {
      return {
        userid: getkevalue().userid,     //当前用户id
        tableData: [],               //表格数据
        centerDialogVisible: false,      //弹出框状态
        input: '',                     //固定金额 or 布置金额比例
        value1: '',                    //类型选择
        value2: '',                    //收益岗位
        value3: '',                      //店铺收入
        value4: '',                      //店铺计算方式
        OrderValue: '',                  //店铺选择 (新增)
        options1: [
          {value: 1, label: '固定金额'},
          {value: 2, label: '布置金额*比例'}
        ],
        options2: [
          {value: 1, label: '固定金额'},
          {value: 2, label: '布置金额*比例'}
        ],
        OrderID: '',                      //店铺选择
        BranchOrderData: [],               //店铺信息
        BranchOrderDatas: [],              //店铺信息
        Department: [],                    //岗位信息
        IsSetMuBan: false,                 //是否可新增
        IsSetMuBans: false,              //是否可新增2
        FromData: {
          ID: '',//新增不传此字段 编辑需要传
          IntegralValue: '',            ///员工收入
          IntegralValue2: '',            ///店铺收入
          EarningsBranchValue: "",        ///店铺选择 (比例 or 金额)
          MinIntegral: '',                 //员工收入 (最小值)
          MaxIntegral: '',                      // 员工收入 (最大值)
          EarningsPost: '',                    //人员收入 (收益岗位)
          OrderBranch: '',                   //员工收入 (店铺)
          IntegralRule: '',              // 员工收入 (1固定 2金额*比例)
          EarningsBranchRule: '',         ///店铺选择 (比例 or 金额)
          Type: ''                             //类型id
        },                      //参数
        // postId: [],//选择的收益岗位ID
        // selectID:[],//预存选择的ID
        InStart: false,                   //是否显示店铺收入
        dianPuType: '',
        demo: {                              //绑定model
          dem1: '',
          dem2: '',//员工收入 计算方式值
          dem3: '',//收益岗位选择值
          dem4: '',
          dem5: '',//店铺收入 计算方式值
          dem6: '',//是否按比例分配
          dem7: '',//添加时类型选择
        },
        IsSetMuName: '',
        disableds: false,       //是否可选择店铺

        postSelect: [],//记录收益岗位数量
        num: 0,
        placeholderText: '',
        placeholderText2: '',

        isShowJSFS2: false,

        dianPuYesNoArr: [{value: 1, label: '有'}, {value: 0, label: '无'}],
        isShowPrence1: false,
        isShowPrence2: false,

        caoZuoType: '',
        diaLogTitle:'',
      }
    },
    methods: {
      closeTip() {
        this.centerDialogVisible = false
      },
      Integrals() {
        if (this.demo.dem2 == '固定金额' || this.demo.dem2 == 1) {
          if (this.FromData.IntegralValue <= 0) {
            this.$message.error('固定金额不能低于0!');
            this.FromData.IntegralValue = 1
          }
        } else {
          if (this.demo.dem2 == '布置金额' || this.demo.dem2 == 2) {
            this.$message.error('布置金额比例*金额不能超过1!');
            this.FromData.IntegralValue = 1
          }
        }
      },
      closeall() {
        this.UpdeteDetel()
      },
      //编辑保存
      sublimets() {
        this.sublimet()
      },
      //模板=================编辑
      handleEditS(index, row, type) {
        this.caoZuoType = type;
        this.postSelect = [];
        this.centerDialogVisible = true;
        if (this.caoZuoType == 'add') {
          this.diaLogTitle="["+row.Name+"]"+' 添加至本店'
        } else {
          this.diaLogTitle="["+row.Name+"]"+' 编辑'
        }
        this.IsSetMuName = row.Name;
        this.FromData.IntegralRule = row.IntegralRule;//员工收入的 固定金额或比例
        if (row.IntegralRule == 1) {
          this.FromData.IntegralValue = (row.IntegralValue);
          this.demo.dem2 = row.GetIntegralRuleName.split(':')[0];
          this.isShowPrence1 = false;
        } else {
          this.FromData.IntegralValue = (row.IntegralValue * 100).toFixed(4);
          this.demo.dem2 = row.GetIntegralRuleName.split('*')[0] + '*比例';
          this.isShowPrence1 = true;
        }
        if (row.IsAnBiLiSy) {
          this.demo.dem6 = 1;
          row.IntegralPostPencentList.forEach((item, index, arr) => {
            this.postSelect.push({
              Department: this.Department,
              val: arr[index].PostId,
              name: arr[index].PostName,
              id: this.num + 1,
              isFlag: false,
              SYScale: (arr[index].AmountPercent * 100).toFixed(4)
            })
          });
          this.postSelect.push({
            Department: this.Department,
            val: '',
            name: '',
            id: this.num + 1,
            isFlag: true,
            SYScale: ''
          })
        } else {
          this.demo.dem6 = 0;
          row.EarningsPost.split(',').forEach((item, index, arr) => {
            this.postSelect.push({
              Department: this.Department,
              val: arr[index],
              name: row.EarningsPostName.split(',')[index],
              id: this.num + 1,
              isFlag: false,
              SYScale: ''
            })
          });
          this.postSelect.push({
            Department: this.Department,
            val: '',
            name: '',
            id: this.num + 1,
            isFlag: true,
            SYScale: ''
          })
        }

        // this.isShowJSFS2=true;
        if (row.EarningsBranchRule == '0') {
          this.demo.dem4 = '无';
          this.isShowJSFS2 = false;
        } else if (row.EarningsBranchRule == '1' || row.EarningsBranchRule == '2') {
          this.demo.dem4 = '有';
          this.isShowJSFS2 = true;
        }
        this.dianPuType = row.EarningsBranchRule;//店铺是否收入
        if (row.EarningsBranchRule == '1') {
          this.demo.dem5 = row.EarningsBranchRuleName.split(':')[0];
          this.FromData.IntegralValue2 = (row.EarningsBranchValue);
          this.isShowPrence2 = false;
        } else if (row.EarningsBranchRule == '2') {
          this.demo.dem5 = row.EarningsBranchRuleName.split('*')[0] + '*比例';
          this.FromData.IntegralValue2 = (row.EarningsBranchValue * 100).toFixed(4);
          this.isShowPrence2 = true;
        }

        this.FromData.MaxIntegral = row.MaxIntegral;
        this.FromData.MinIntegral = row.MinIntegral;
        this.FromData.Type = row.Type;

        // let data = []
        // if (row.EarningsPost) {
        //   row.EarningsPost.split(',').forEach(res => data.push(Number(res)))
        // }
        // this.demo.dem3 = data
        // if (row.EarningsBranchRule) {
        //   this.demo.dem4 = '有';
        //   this.InStart = true
        // } else {
        //   this.demo.dem4 = '无';
        //   this.InStart = false
        // }
        // if (row.EarningsBranchRule == 1) {
        //   this.demo.dem5 = row.EarningsBranchRuleName.split(':')[0]
        // } else {
        //   this.demo.dem5 = row.EarningsBranchRuleName.split('*')[0]
        // }
        //
        // this.demo.dem1 = row.OrderBranchName;
        this.IsSetMuBan = row.IsSetMuBan;
        this.FromData.ID = row.ID;
        // this.FromData.OrderBranch = row.OrderBranch;
        // this.FromData.EarningsPost = row.EarningsPost;
        // this.FromData.IntegralRule = row.IntegralRule;
        // this.FromData.EarningsBranchRule = row.EarningsBranchRule
        // this.FromData.EarningsBranchValue = row.EarningsBranchValue
        // this.FromData.Type = row.Type
      },
      //清空Dialog 选择框及文本框数据
      UpdeteDetel() {
        this.FromData.IntegralValue = '';
        this.FromData.IntegralValue2 = '';
        this.FromData.EarningsBranchValue = '';
        this.FromData.MinIntegral = '';
        this.FromData.MaxIntegral = '';
        this.FromData.EarningsPost = '';
        this.FromData.OrderBranch = '';
        this.FromData.IntegralRule = '';
        this.FromData.EarningsBranchRule = '';
        this.FromData.Type = '';
        this.demo.dem1 = '';
        this.demo.dem2 = '';
        this.demo.dem3 = '';
        this.demo.dem4 = '';
        this.demo.dem5 = '';
        this.demo.dem6 = '';
        this.demo.dem7 = '';
      },
      //保存
      Sendout() {
        this.$axios.post('/xlapi/UserIntegral/UserIntegral/UserIntegral/UpdateIntegralRuleModel', this.FromData)
          .then((response) => {
            if (response.data.status) {
              this.$message({
                message: '添加成功!',
                type: 'success'
              });
            } else {
              this.$message.error(response.data.msg);
            }
            this.centerDialogVisible = false;
            this.IntegralRule();
            this.UpdeteDetel();
          }).catch(function (error) {
          console.log(error)
        });
      },
      //保存(内容限制)
      sublimet() {
        if (this.FromData.OrderBranch == '') {
          this.$message.error('请选择人员店铺!');
          return
        }
        if (this.FromData.IntegralRule == '') {
          this.$message.error('请选择人员计算方式!');
          return
        }
        if (this.FromData.IntegralValue == '') {
          this.$message.error('请输入人员金额或者比例!');
          return
        }
        if (this.FromData.EarningsPost == '') {
          this.$message.error('至少选择一个收益岗位!');
          return
        }
        if (this.FromData.MinIntegral == '' || this.FromData.MaxIntegral == '') {
          this.$message.error('请输入最小值或最大值!');
          return
        } else {
          if (this.FromData.MinIntegral > this.FromData.MaxIntegral) {
            this.$message.error('最小值不可以大于最大值!');
            return
          }
          if (this.FromData.MinIntegral < 0 || this.FromData.MaxIntegral < 0) {
            this.$message.error('最小值或最大值不可小于0!');
            return
          }
        }
        if (this.InStart) {
          if (this.FromData.EarningsBranchRule == '') {
            this.$message.error('请选择店铺计算方式');
          }
          if (this.FromData.EarningsBranchValue == '') {
            this.$message.error('请输入店铺金额或者比例');
          }
        } else {
          this.FromData.EarningsBranchRule == 0
        }
        this.Sendout()
      },
      //添加
      handleAdd(index, row) {
        this.centerDialogVisible = true;
        this.FromData.Type = row.Type;
        this.IsSetMuName = row.Name
        this.IsSetMuBans = true
        // this.Department = []
        // this.IsSetMuBan = !row.IsSetMuBan;
        // this.FromData.Type = row.Type
        // console.log(this.demo.dem1)
        // if (this.OrderID) {
        //   this.FromData.OrderBranch = this.OrderID
        // } else {
        //   this.FromData.OrderBranch = this.demo.dem1
        // }
        //
        // //删除全部店铺选项
        // if (this.OrderID) {
        //   let id = this.OrderID;
        //   this.disableds = true
        //   let data = this.BranchOrderData
        //   for (let i = 0; i < data.length; i++) {
        //     if (data[i].BranchId == id) {
        //       this.demo.dem1 = data[i].BranchName
        //     }
        //   }
        // } else {
        //   this.disableds = false
        //   if (this.IsSetMuBan) {
        //     if (this.BranchOrderData[0].BranchName == '全部店铺') {
        //       this.BranchOrderDatas = JSON.parse(JSON.stringify(this.BranchOrderData))
        //       this.BranchOrderDatas.splice(0, 1);
        //     }
        //   }
        // }

      },
      //收益岗位
      Departments(data) {
        this.FromData.EarningsPost = data.join(',')
      },
      //店铺选择
      OrderSelect(id) {
        this.OrderID = id;
        this.IntegralRule();
      },
      //店铺选择
      OptionAlla(id) {
        this.FromData.OrderBranch = id
        // this.PostData(id)
      },
      //计算方式
      OptionAllb(id) {
        this.FromData.IntegralRule = id
      },
      //店铺收入(店铺输入)
      selectDPSR(val) {
        // this.InStart = id
        this.dianPuType = val;//保存店铺是否收入    int
        if (val == 0) {
          this.isShowJSFS2 = false;
        } else {
          this.isShowJSFS2 = true;
        }

        if (val == 1) {
          this.$nextTick(() => {
            this.demo.dem5 = 1;
            this.isShowPrence2 = false;
          })
        }

        this.demo.dem5 = '';
        this.FromData.IntegralValue2 = '';

      },
      //店铺收入(计算方式)
      OptionAlld(id) {
        this.FromData.EarningsBranchRule = id
      },
      //店铺积分规则查询(按店铺)
      IntegralRule() {
        this.$axios.post('/xlapi/UserIntegral/UserIntegral/UserIntegral/GetIntegralRule', {NowBranchId: this.OrderID})
          .then((response) => {
            this.tableData = response.data.data;
          }).catch(function (error) {
          console.log(error)
        });
      },
      //获取当前用户店铺信息
      OrderlistData() {
        this.$axios.post('/xlapi/OrderManager/NewPingFen/NewPingFen/GetNowUserBranch', {UserId: this.userid})
          .then((response) => {
            this.BranchOrderData = response.data.data
            this.BranchOrderData.unshift({BranchId: '', BranchName: '全部店铺'})
          }).catch(function (error) {
          console.log(error)
        });
      },
      //获取岗位
      PostData(id) {
        this.$axios.post('/xlapi/OrderManager/GongZi/SalaryGroup/GetNowBranchUsedPost', {
          UserId: this.userid,
          SearchBranchId: id
        })
          .then((response) => {
            this.Department = response.data.data;
            let val = 'val' + this.num;
            this.postSelect = [
              {Department: this.Department, val: '', name: '', id: this.num, isFlag: true, SYScale: ''}
            ]
          }).catch(function (error) {
          console.log(error)
        });
      },
      // //获取类型
      // getType(){
      //   let url='/xlapi/UserIntegral/UserIntegral/UserIntegral/GetIntegralRuleList';
      //   this.$axios({
      //     method:'POST',
      //     url:url,
      //   }).then(res=>{
      //     this.typeArr=res.data.data;
      //   })
      // },
      //弹框打开时回调
      openEvent() {
        // this.postSelect=this.postSelect;
      },
      //选择收益岗位
      selectPost(obj) {
        obj.val = obj.name;
        //添加一行
        if (obj.isFlag) {
          obj.isFlag = false;
          this.postSelect.push({
            Department: this.Department, val: '', name: '', id: this.num + 1, isFlag: true, SYScale: ''
          });
        }
      },
      //填写收益比
      SYInput(obj) {
        if (obj.SYScale / 100 > '1') {
          this.$message.error('收益比不能大于1!');
          obj.SYScale = '100';
        }
      },
      // 选择计算方式1
      selectJSFS1(val) {
        this.FromData.IntegralRule = val;
        this.FromData.IntegralValue = '';
        if (val == 1) {
          this.placeholderText = '输入金额值';
          this.isShowPrence1 = false;
        } else {
          this.placeholderText = '输入比例值';
          this.isShowPrence1 = true;
        }
      },
      // 选择计算方式2
      selectJSFS2(val) {
        this.FromData.IntegralValue2 = '';
        this.dianPuType = val;
        if (val == 1) {
          this.placeholderText2 = '输入金额值';
          this.isShowPrence2 = false;
        } else {
          this.placeholderText2 = '输入比例值';
          this.isShowPrence2 = true;
        }
      },

      //选择是否按比例分配
      selectJSFS6(val) {
        this.demo.dem6 = val;
        this.postSelect = [
          {Department: this.Department, val: '', name: '', id: this.num, isFlag: true, SYScale: ''}
        ]
      },

      // 员工收入 填写金额  或  比例值
      JSFS1Input(val) {
        if (this.placeholderText == '输入比例值') {
          if (val > '1') {
            // this.$message.error('比例值不能大于1!');
            // this.FromData.IntegralValue = '1';
          }
        }
      },

      //失去焦点
      blurInput(val, type) {
        if (type == 'jsje') {
          if (val != '') {
            if (this.placeholderText = '输入金额值') {
              if (!(/^[0-9]+\.?[0-9]+?$/.test(val)) && !(/^[0-9]+$/.test(val))) {
                // this.$message.error('请填入员工收入的正确金额值!');
              }
            }
          }
        }
      },

      // 店铺收入 填写金额  或  比例值
      JSFS2Input(val) {
        if (this.placeholderText2 == '输入比例值') {
          if (val > '1') {
            // this.$message.error('比例值不能大于1!');
            // this.FromData.IntegralValue2 = '1';
          }
        }
      },
      //选择类型
      selectJSFS7() {

      },
      //添加保存
      confirmEvent() {
        let that = this;
        let IsAnBiLiSy;
        let data;
        let data2;
        let IntegralValue;
        if (this.demo.dem6 == 1) {
          IsAnBiLiSy = true;
        } else if (this.demo.dem6 == 0) {
          IsAnBiLiSy = false;
        }

        //是否填入金额值 或 比例值
        if (this.FromData.IntegralRule == '1') {
          IntegralValue = this.FromData.IntegralValue;
          if (this.FromData.IntegralValue == "") {
            this.$message.error('请输入员工收入的金额值!');
            return;
          } else {
            if (!(/^[0-9]+\.?[0-9]+?$/.test(this.FromData.IntegralValue)) && !(/^[0-9]+$/.test(this.FromData.IntegralValue))) {
              this.$message.error('员工收入的金额值有误!');
              return;
            }
          }
        } else if (this.FromData.IntegralRule == '2') {
          IntegralValue = (parseFloat(this.FromData.IntegralValue) / 100).toFixed(4);
          if (this.FromData.IntegralValue == "") {
            this.$message.error('请输入员工收入的比例值!');
            return;
          } else {
            if (!(/^[0-9]+\.?[0-9]+?$/.test(this.FromData.IntegralValue)) && !(/^[0-9]+$/.test(this.FromData.IntegralValue))) {
              this.$message.error('员工收入的比例值有误!');
              return;
            }
          }
        }

        //最大值最小值是否为空或有误
        if (this.FromData.MaxIntegral == "") {
          this.$message.error('最大值不能为空!');
          return;
        } else {
          if (!(/^[0-9]+\.?[0-9]+?$/.test(this.FromData.MaxIntegral)) && !(/^[0-9]+$/.test(this.FromData.MaxIntegral))) {
            this.$message.error('最大值有误!');
            return;
          }
        }
        if (this.FromData.MinIntegral == "") {
          this.$message.error('最小值不能为空!');
          return;
        } else {
          if (!(/^[0-9]+\.?[0-9]+?$/.test(this.FromData.MinIntegral)) && !(/^[0-9]+$/.test(this.FromData.MinIntegral))) {
            this.$message.error('最小值有误!');
            return;
          }
        }
        if (parseFloat(this.FromData.MinIntegral) > parseFloat(this.FromData.MaxIntegral)) {
          this.$message.error('最小值不能大于最大值!');
          return;
        }

        let EarningsBranchValue;//店铺收入的值
        if (this.dianPuType == 0 || this.dianPuType == '0') {
          EarningsBranchValue = "";
        } else if (this.dianPuType == 1 || this.dianPuType == '1') {
          EarningsBranchValue = parseFloat(this.FromData.IntegralValue2);
        } else if (this.dianPuType == 2 || this.dianPuType == '2') {
          EarningsBranchValue = (parseFloat(this.FromData.IntegralValue2) / 100);
        }

        //判断店铺收入是否有误
        if (this.dianPuType == 1 || this.dianPuType == '1') {
          if (EarningsBranchValue == '') {
            this.$message.error('店铺收入计算方式的金额值不能为空!');
            return;
          } else {
            if (!(/^[0-9]+\.?[0-9]+?$/.test(EarningsBranchValue)) && !(/^[0-9]+$/.test(EarningsBranchValue))) {
              this.$message.error('店铺收入计算方式的金额值有误!');
              return;
            }
          }
        } else if (this.dianPuType == 2 || this.dianPuType == '2') {
          if (EarningsBranchValue == '') {
            this.$message.error('店铺收入计算方式的比例值不能为空!');
            return;
          } else {
            if (!(/^[0-9]+\.?[0-9]+?$/.test(EarningsBranchValue)) && !(/^[0-9]+$/.test(EarningsBranchValue))) {
              this.$message.error('店铺收入计算方式的比例值有误!');
              return;
            }
          }
        }

        //判断是否有岗位
        if (this.postSelect.length == 1) {
          this.$message.error('至少选一个收益岗位!');
          return;
        }

        if (IsAnBiLiSy) {
          //获取是按比例分配时候的岗位名称和比例数据
          let ContentArr = [];
          for (let i = 0; i < this.postSelect.length; i++) {
            if (this.postSelect[i].val != "") {
              if (this.postSelect[i].SYScale == '') {
                this.$message.error('请输入员工收益比例!');
                return;
              } else {
                ContentArr.push({
                  PostId: this.postSelect[i].val,
                  AmountPercent: parseFloat(this.postSelect[i].SYScale) / 100
                });
              }
            }
          }

          data = {
            ID: this.FromData.ID,
            Type: this.FromData.Type,
            IntegralRule: this.FromData.IntegralRule,
            IntegralValue: IntegralValue,
            IsAnBiLiSy: IsAnBiLiSy,
            MaxIntegral: this.FromData.MaxIntegral,
            MinIntegral: this.FromData.MinIntegral,
            EarningsBranchRule: this.dianPuType,
            EarningsBranchValue: EarningsBranchValue,
            OrderBranch: ''
          };
          if (this.caoZuoType == 'add') {
            delete data.ID;//删除ID属性
            data.OrderBranch = this.OrderID;
          } else if (this.caoZuoType == 'edits2') {
            data.OrderBranch = this.OrderID;
          }
          data2 = {
            Content: ContentArr,
          };
        } else if (!IsAnBiLiSy) {
          let EarningsPostArr = [];
          this.postSelect.forEach((item, index, arr) => {
            if (arr[index].val != '') {
              EarningsPostArr.push(arr[index].val)
            }
          });
          data = {
            ID: this.FromData.ID,
            Type: this.FromData.Type,
            IntegralRule: this.FromData.IntegralRule,
            IntegralValue: IntegralValue,
            IsAnBiLiSy: IsAnBiLiSy,
            EarningsPost: EarningsPostArr.join(','),
            MaxIntegral: this.FromData.MaxIntegral,
            MinIntegral: this.FromData.MinIntegral,
            EarningsBranchRule: this.dianPuType,
            EarningsBranchValue: EarningsBranchValue,
            OrderBranch: ''
          };
          if (this.caoZuoType == 'add') {
            delete data.ID;//删除ID属性
            data.OrderBranch = this.OrderID;
          } else if (this.caoZuoType == 'edits2') {
            data.OrderBranch = this.OrderID;
          }
        }

        this.$axios.post('/xlapi/UserIntegral/UserIntegral/UserIntegral/UpdateIntegralRuleModel', data)
          .then((res) => {
            if (IsAnBiLiSy) {
              console.log('进来是比例分配')
              if (res.data.status) {
                this.isAnBiLiEvent(res.data.backId, data2);
              }
            } else {
              let msg;
              if (res.data.status) {
                if (this.caoZuoType == 'add') {
                  msg = '添加成功!'
                } else {
                  msg = '修改成功!'
                }
                this.$message({
                  message: msg,
                  type: 'success',
                });
              } else {
                this.$message.error(res.data.msg);
              }
              this.centerDialogVisible = false;
              this.IntegralRule();
              this.UpdeteDetel();
            }

          }).catch(function (error) {
          console.log(error)
        });
      },
      isAnBiLiEvent(objId, data2) {
        let data = data2;
        data.BackId = objId;
        data.AddUserId = getkevalue().userid;
        this.$axios.post('/xlapi/UserIntegral/UserIntegral/UserIntegral/UpdateIntegralRulePost', data)
          .then((res) => {
            let msg;
            if (res.data.status) {
              if (this.caoZuoType == 'add') {
                msg = '添加成功!'
              } else {
                msg = '修改成功!'
              }
              this.$message({
                message: msg,
                type: 'success',
              });
            } else {
              this.$message.error(res.data.msg);
            }
            this.centerDialogVisible = false;
            this.IntegralRule();
            this.UpdeteDetel();
          }).catch(function (error) {
          console.log(error)
        });
      }
    },
    created() {
      this.PostData();
      // this.getType();
      this.OrderlistData();
      this.IntegralRule();
    },
  }
</script>

<style scoped>
  ul {
    padding: 0;
    margin: 0;
  }

  .tips {
    content: '';
    display: inline-block;
    width: 19px;
    height: 19px;
    background: url("../../static/img/tipsb.png") no-repeat center;
    position: relative;
    top: 4px;
  }

  .tips:hover {
    background: url("../../static/img/tipsa.png") no-repeat center;
  }

  .colorStyleFont {
    color: red;
  }

  /deep/ .el-button:focus, .el-button:hover {
    color: #BB9860;
    background-color: #f5f7fa;
  }

  /deep/ .el-select-dropdown__item.selected {
    color: #BB9860 !important;
  }

  /deep/ .OrderSelect .el-input__inner {
    color: #BB9860;
    font-size: 16px;
  }

  /deep/ .OrderSelect .el-input {
    width: 150px;
  }

  /deep/ .OrderSelect .el-input__inner {
    border: none;
  }

  .Titles:before {
    content: '';
    width: 3px;
    height: 15px;
    background: #BB9860;
    display: inline-block;
    position: relative;
    top: 2px;
  }

  .Titles span {
    color: #BB9860;
    position: relative;
  }

  /deep/ .el-input__inner:focus {
    border-color: #BB9860 !important;
  }

  /deep/ .el-select .el-input__inner:focus {
    border-color: #BB9860;
  }

  /deep/ .el-select .el-input.is-focus .el-input__inner {
    border-color: #BB9860;
  }

  /*.OrderStyle li {*/
  /*margin: 10px 0;*/
  /*}*/

  /deep/ .has-gutter tr th {
    background: #E6E6E6;
    color: #808080;
    text-align: center;
  }

  ul li {
    list-style: none;
  }

  .dialogBox {
    max-height: 242px;
    overflow: auto;
  }

  .dialogBox::-webkit-scrollbar {
    width: 3px;
    height: 4px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .dialogBox::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 3px;
    width: 3px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .dialogBox li {
    width: 378px;
    margin: 12px auto;
  }

  .OrderStyle li {
    width: 378px;
    margin: 0 auto;
  }

  ul li span {
    /*display: inline-block;*/
    /*width: 80px;*/
    /*text-align: right;*/
    /*padding-right: 10px;*/
  }

  >>> .addOrEdit .el-dialog__header {
    margin-bottom: 0;
  }

  >>> .addOrEdit .el-dialog__footer {
    padding: 0;
    margin: 0;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }

  >>> .addOrEdit .el-dialog__footer .el-button {
    padding: 0;
    width: 96px;
    height: 34px;
    background: rgba(187, 152, 96, 1);
    border-radius: 5px;
    color: white;
    text-align: center;
    outline: none;
    border: 0;
  }

  >>> .addOrEdit {
    width: 550px;
    height: 540px;
    border-radius: 5px;
  }

  >>> .addOrEdit .el-dialog__body {
    padding: 0 50px;
  }

  >>> .addOrEdit .el-dialog__title {
    color: #808080;
    font-size: 17px;
  }

  .closeIcon {
    width: 18px;
    height: 18px;
    text-align: center;
    display: block;
    font-style: normal;
    position: absolute;
    right: 18px;
    top: 18px;
    cursor: pointer;
    z-index: 99988;
    box-sizing: border-box;
    transition: all .3s;
  }

  .closeIcon img {
    width: 100%;
    height: 100%;
  }

  >>> .select1 .el-input__inner {
    width: 170px;
    height: 34px;
  }

  >>> .addOrEdit .el-select {
    margin: 0 10px;
  }

  >>> .select1 .el-input__icon {
    line-height: 34px;
  }

  >>> .input1 .el-input__inner {
    width: 120px;
    height: 34px;
    padding: 0 12px;
  }

  .selectBox {
    /*display: inline-block;*/
    flex-basis: 154%;
  }

  .sygw {
    display: flex;
  }

  .sygw .selectBox-inner {
    margin-bottom: 12px;
    display: inline-block;
  }

  .sygw .selectBox-inner:last-child {
    margin-bottom: 0;
  }

  .sygw-title {
    flex-basis: 32%;
    padding-top: 6px;
  }

  .num .select1 {
    margin-left: 8px;
  }

  .OrderStyle .jsfs {
    margin-top: 12px;
  }

  .el-select-dropdown__item.selected {
    color: rgba(187, 152, 96, 1);
  }


</style>

<style>
  .el-message {
    min-width: 200px !important;
  }
</style>
