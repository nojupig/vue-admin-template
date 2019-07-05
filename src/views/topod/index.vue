<template>
  <div class="app-container">
    <el-row :gutter="20" style="border-bottom:solid 1px #DCDFE6 ">
      <el-col :sm="7" :md="3" style="border-right:solid 1px #DCDFE6 ">
        <!--    <div id="tree"></div> -->
        <el-tree
          :data="treedata"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          @node-click="treeNodeClick"
          style="font-size: 12px"
        >
          //用了以下这个节点图标能加上了
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i class="el-icon-share"></i>
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :sm="12" :md="6" style="border-right:solid 2px #DCDFE6 ">
        <el-row>
          <el-form @submit.native.prevent>
            <el-form-item>
              <el-input v-model="input" id="txtSearch">
                <el-button icon="el-icon-search" slot="append" @click="searchDev()"></el-button>
              </el-input>
              <el-button type="success" size="mini">{{ ototal }}</el-button>
              <el-button type="info" size="mini">{{ $t('message.reviewer') }}</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="devs"
              empty-text="\"
              @current-change="handleCurrentChange"
              highlight-current-row
            >
              <el-table-column>
                <template slot-scope="scope">
                  <img v-bind:src="scope.row.imgg">
                </template>
              </el-table-column>
              <el-table-column prop="addr" label="IP"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.isonline"
                    type="success"
                    size="mini"
                    icon="el-icon-d-arrow-right"
                    @click="opendev(scope.row)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
      <el-col :sm="24" :md="12">
        <el-row>
          <el-button type="success" size="mini">{{ level0 }}</el-button>
          <el-button type="warning" size="mini">{{ level1 }}</el-button>
          <el-button type="danger" size="mini">{{ level2 }}</el-button>
          <el-tag v-if="nettype != 'x'" type="info">{{ nettype }}</el-tag>
          <el-tag v-if="lastonlinetime!= 'x'" type="info">{{ lastonlinetime }}</el-tag>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="traps" :cell-class-name="rowClass">
              <!-- <el-table :data="traps" :row-style="tableRowStyle"> -->
              <el-table-column prop="traplogid" label="ID"></el-table-column>
              <el-table-column prop="name" :label="$t('message.type')"></el-table-column>
              <el-table-column prop="leveldiscription" :label="$t('message.level')">
                <!-- <template slot-scope="scope">
                            <span v-if="scope.row.level==0"
                                style="background-color:#F2F6FC">{{ scope.row.leveldiscription }}</span>
                            <span v-else-if="scope.row.level==1"
                                style="background-color:#E6A23C">{{ scope.row.leveldiscription }}</span>
                            <span v-else style="background-color: #F56C6C">{{ scope.row.leveldiscription }}</span>
                </template>-->
              </el-table-column>
              <el-table-column prop="trapdevaddress" label="IP"></el-table-column>
              <el-table-column prop="traplogcontent" :label="$t('message.content')"></el-table-column>
              <el-table-column prop="timestring" :label="$t('message.time')"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="line"></div>
    <el-row id="log">
      <el-col :sm="24" :md="24">
        <audio id="player" src="/wav/beephihi.wav"></audio>
        <el-table :data="trapsb" :cell-class-name="rowClass">
          <el-table-column prop="traplogid" label="ID"></el-table-column>
          <el-table-column prop="name" :label="$t('message.type')"></el-table-column>
          <el-table-column prop="leveldiscription" :label="$t('message.level')">
            <!-- <template slot-scope="scope">
                        <span v-if="scope.row.level==0"
                            style="background-color:#F2F6FC">{{ scope.row.leveldiscription }}</span>
                        <span v-else-if="scope.row.level==1"
                            style="background-color:#E6A23C">{{ scope.row.leveldiscription }}</span>
                        <span v-else style="background-color: #F56C6C">{{ scope.row.leveldiscription }}</span>
            </template>-->
          </el-table-column>
          <el-table-column prop="trapdevaddress" label="IP"></el-table-column>
          <el-table-column prop="traplogcontent" :label="$t('message.content')"></el-table-column>
          <el-table-column prop="timestring" :label="$t('message.time')"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTreevue } from "@/api/topod";
import { getdevsv } from "@/api/topod";
import { getdevlogsv } from "@/api/topod";
import { getlogsvuev } from "@/api/topod";

export default {
  data() {
    return {
      filterText: "",

      treedata: [], //treeview
      devs: [], //devlist
      input: "",
      traps: [], //right trap list of dev
      total: 0, //dev totals
      ototal: 0, //online dev totals
      level0: 0,
      level1: 0,
      level2: 0,
      nettype: "x",
      lastonlinetime: "x",
      websocketstatus: "",
  trapsb: [],
                activeNames: ['1'],
                cols: [
                    { prop: 'traplogid', label: 'id' },
                    { prop: 'trapdevaddress', label: 'trapdevaddress' },
                    { prop: 'name', label: 'name' },
                    { prop: 'traplogcontent', label: 'traplogcontent' },
                    { prop: 'timestring', label: 'timestring' }
                ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted() {
    this.fetchData();
    this.getlogsvue();
  },
  methods: {
    fetchData() {
      getTreevue()
        .then(response => {
          this.treedata = response;
        })
        .catch(err => {});
    },
    getdevs(id, content) {
      getdevsv(id, content)
        .then(response => {
          this.devs = response.devs;
          this.total = response.total;
          this.ototal = response.ototal;
        })
        .catch(err => {
          //console.log(error);
        });
    },
    getDevLogs(addr) {
      var _this = this; //很重要！！
      getdevlogsv(addr)
        .then(response => {
          _this.traps = response.data;
          _this.level0 = response.level0;
          _this.level1 = response.level1;
          _this.level2 = response.level2;
        })
        .catch(err => {
          //console.log(error);
        });
    },
    getDevInfo: function(addr) {
      // var _this = this //很重要！！
      // axios.get('/getdevinfo', {
      //     params: {
      //         addr: addr
      //     }
      // }).then(function (res) {
      //     console.log(res);
      //     _this.nettype = res.data.nettype;
      //     _this.lastonlinetime = res.data.lastonlinetime;
      // })
      //     .catch(function (error) {
      //         console.log(error);
      //     });
    },
    handleCurrentChange(val) {
      var addr = val.addr;
      this.getDevLogs(addr);
      //this.getDevInfo(addr);
    },
    changeDevStatus(addr, status) {
      this.devs.forEach(item => {
        if (item.addr == addr) {
          item.isonline = status;
        }
      });
    },
    devItemClick: function(s) {
      //去除其他项的高亮形式
      for (var i = 0, len = this.devs.length; i < len; i++) {
        if (this.devs[i].active) {
          this.devs[i].active = 0;
        }
      }
      s.active = 1;
      var addr = s.addr;
      this.getDevLogs(addr);
      this.getDevInfo(addr);
    },
    opendev: function(s) {
      // if (s.isactive) {
      window.open("/rece/" + s.addr);
      // }
    },
    treeNodeClick(data) {
      //get devs
      //alert(data.id);
      this.getdevs(data.id, "noneed");
    },
    tableRowStyle({ row, rowIndex }) {
      if (row.level == 1) return "background-color: #E6A23C";
      else if (row.level == 2) return "background-color: #F56C6C";
      else return "background-color: #F2F6FC";
    },
    rowClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 1) {
        if (row.level == 1) return "logc1";
        else if (row.level == 2) return "logc2";
        else return "logc0";
      } else {
        return "logc0";
      }
    },
    getlogsvue() {    


 var _this = this; //很重要！！
      getlogsvuev()
        .then(response => {       
            _this.trapsb = response.traplist;
        })
        .catch(err => {
          //console.log(error);
        });

    },
    shownotify: function(ctt) {
      const h = this.$createElement;
      this.$notify({
        title: "标题名称",
        message: h("i", { style: "color: teal" }, ctt)
      });
    },
    searchDev() {
      var scontent = this.input;

      if (scontent.length > 0) {
        //获得
        // if (ipvalidate(scontent.trim())) {

        //     alert(scontent.trim());

        // } else {
        // $('#devarea').text("搜索结果");

        this.getdevs(-1, scontent.trim());
      }
    }
  }
};
</script>

