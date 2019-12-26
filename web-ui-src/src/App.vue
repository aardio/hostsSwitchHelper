<template>
  <div id="app">
    <el-container style="height:100%">
      <el-aside width="200px;">
        <el-menu
          :default-active="activeIndex"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          style="width:250px;"
          @select="changeMenu"
        >
          <el-menu-item index="0">
            <i class="el-icon-setting" />
            <span slot="title">系统hosts</span>
          </el-menu-item>

          <el-menu-item v-for="(item,key) in config" :key="key" :index="item.name">
            <span slot="title">
              <span style="float:left;">{{ item.name }}</span>
              <span style="float:right;">
                <el-switch v-model="item.status" @change="updateStatus(item)" />
                <span style="margin-left:20px;">
                  <span class="el-icon-edit" title="修改" @click="update(item)" />
                  <span class="el-icon-delete" title="删除" @click="del(item)" />
                </span>
              </span>
            </span>
          </el-menu-item>
        </el-menu>
        <span style="position: fixed;bottom: 0;">
          <el-button
            type="primary"
            size="small"
            plain
            icon="el-icon-circle-plus"
            title="添加"
            @click="create"
          />
          <el-tooltip class="item" effect="dark" content="将打开chrome自动清理缓存" placement="top">
            <el-button type="primary" size="small" plain @click="clearCache">清chrome缓存</el-button>
          </el-tooltip>&nbsp;
          <a href="https://github.com/xuzhenjun130/hostsSwitchHelper.git" target="_blank">
            <el-button type="info" size="small" icon="el-icon-message" plain>关于</el-button>
          </a>
        </span>
      </el-aside>
      <el-main>
        <codemirror v-model="code" :options="cmOptions" @changes="changeCode" />
      </el-main>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <span>
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// language js
import 'codemirror/mode/ttcn-cfg/ttcn-cfg.js';
import aardio from 'aardio';

export default {
  name: 'AppHosts',
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      value: true,
      systemCode: '', // 系统hosts
      code: '', // 当前生效的hosts
      activeIndex: '0',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/x-ttcn-cfg',
        lineNumbers: true,
        line: true,
        readOnly: true
      },
      config: [],
      temp: { name: '', status: true, hosts: '' },
      rules: {
        name: [{ required: true, message: '不得为空' }]
      },
      currentItem: {} // 当前正在编辑
    };
  },

  created() {
    // 禁用页面的ctrl功能，来禁止ctrl+s保存功能
    window.addEventListener('keydown', function(e) {
      if (
        e.keyCode === 83 &&
        (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
      }
    });
  },

  mounted() {
    this.systemHosts();
    this.getList();
  },

  methods: {
    systemHosts() {
      // 获取系统配置
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        aardio.loadSystemHostText().then(data => {
          this.systemCode = data;
          this.code = data;
        });
      }, 100);
    },
    getList() {
      // 获取全部配置
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        aardio.getAllSections().then(data => {
          if (data.length) {
            for (const item of data) {
              item.status = item.status === 'on';
            }
            this.config = data;
          } else {
            this.config = [];
          }
        });
      }, 200);
    },
    clearCache() {
      // eslint-disable-next-line no-undef
      aardio.clearDnsCache().then(rs => {
        this.$notify({ title: '操作成功', message: '已完成清chrome缓存' });
      });
    },
    // 左侧菜单切换
    changeMenu(index) {
      this.activeIndex = index;
      if (index === '0') {
        this.systemHosts();
        this.cmOptions.readOnly = true;
      } else {
        this.cmOptions.readOnly = false;
        for (const item of this.config) {
          if (item.name === index) {
            this.code = item.hosts;
            break;
          }
        }
      }
    },
    // 右侧 编辑
    changeCode() {
      for (const item of this.config) {
        // 更新配置
        if (this.activeIndex !== '0' && item.name === this.activeIndex) {
          item.hosts = this.code;
          // eslint-disable-next-line no-undef
          aardio.updateSection(
            item.name,
            item.name,
            item.status === true ? 'on' : 'off',
            item.hosts
          );
          console.log(item, '更新配置');
          break;
        }
      }
    },
    create() {
      this.temp.name = '';
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // eslint-disable-next-line no-undef
          aardio.createSection(this.temp.name);
          this.config.push({
            name: this.temp.name,
            status: true,
            hosts: '# ' + this.temp.name
          });
          // 激活当前配置
          this.activeIndex = this.temp.name;
          this.code = '# ' + this.temp.name;
          this.cmOptions.readOnly = false;
          this.dialogFormVisible = false;
        }
      });
    },
    // 修改名称弹窗
    update(item) {
      this.currentItem = item;
      this.temp = Object.assign({}, item); // copy obj
      this.temp.oldName = item.name;
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.currentItem.name = this.temp.name; // 修改名称
          // eslint-disable-next-line no-undef
          aardio.update(
            this.temp.oldName,
            this.temp.name,
            this.temp.status === true ? 'on' : 'off',
            this.temp.hosts
          );
          this.dialogFormVisible = false;
        }
      });
    },
    // 修改状态
    updateStatus(item) {
      // eslint-disable-next-line no-undef
      aardio.updateSection(
        item.name,
        item.name,
        item.status === true ? 'on' : 'off',
        item.hosts
      );
    },
    del(item) {
      this.$confirm('是否要删除: ' + item.name + '？', '操作确认')
        .then(() => {
          // eslint-disable-next-line no-undef
          aardio.delSection(item.name);
          const i = this.config.indexOf(item);
          this.config.splice(i, 1);
          this.activeIndex = '0';
        })
        .catch(() => {});
    }
  }
};
</script>

<style type="text/css"  >
html,
body,
#app,
.vue-codemirror，.el-container,
.el-aside,
.el-main {
  height: 100%;
}
.el-aside .menubar,
.vue-codemirror {
  height: 100%;
}
.el-main {
  padding: 0 !important;
  margin: 0;
}
body {
  margin: 0;
}
.CodeMirror {
  height: 100% !important;
}
.el-aside {
  background: rgb(84, 92, 100);
  height: 100%;
}
.el-menu-item.is-active {
  background: rgb(67, 74, 80) !important;
}
</style>
