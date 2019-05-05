<template>
  <div id="app">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      :default-expand-all="false"
      :default-expanded-keys="['0']"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
  export default {
    name: "Tree",
    props: [],
    data() {
      return {
        api: getkevalue().apiurl,//获取通用api
        // api: 'http://192.168.1.253:8092',//获取通用api
        //树形图
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'text',
          id: 'id',
        },

      };
    },
    methods: {
      handleNodeClick(data) {
        this.$emit('handleNodeClick',data)
      },
      //加载树形数据
      loadTreeData() {
        this.$axios({
          method: 'get',
          url: this.api + '/xlapi/SysManage/Materil/MaterilSave/GetTree',
          headers: {
            // Authorization: 'http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|https://xilai99.com'
            Authorization: localStorage.userinfo
          }
        }).then(res => {
          if (res.status == 200) {
            let treeData = this.toTree(res.data);
            this.treeData = treeData
          }
        }, err => {
          console.log(err)
        })
      }
      ,
      //树形数据递归处理
      toTree(data) {
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
          delete item.children;
        });

        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
        var map = {};
        data.forEach(function (item) {
          map[item.id] = item;
        });

        var val = [];
        data.forEach(function (item) {
          // 以当前遍历项，的pid,去map对象中找到索引的id
          var parent = map[item.parent];
          // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
          if (parent) {
            (parent.children || (parent.children = [])).push(item);
          } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
          }
        });
        return val;
      }
    },
    created() {
      this.loadTreeData();
    },
  }
</script>

<style scoped>
  >>> .el-tree-node__label {
    font-size: 13px;
    color: #222;
  }
</style>
