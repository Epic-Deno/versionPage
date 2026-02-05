Vue.use(antd);

new Vue({
  el: '#app',
  data() {
    return {
      now: '',
      equipmentColumns: [
        { title: '产线', dataIndex: 'line', key: 'line', width: 100 },
        { title: '设备状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' }, width: 95 },
        { title: '当日非产数量', dataIndex: 'downtime', key: 'downtime', width: 110 },
        { title: '待执行数量', dataIndex: 'todo', key: 'todo', width: 95 },
        { title: '已完成数量', dataIndex: 'done', key: 'done', width: 95 },
        { title: '当前执行批次', dataIndex: 'batch', key: 'batch', width: 250 },
        { title: '总工步', dataIndex: 'totalStep', key: 'totalStep', width: 75 },
        { title: '当前工步', dataIndex: 'currentStep', key: 'currentStep', width: 75 },
        { title: '生产进度', dataIndex: 'progress', key: 'progress', scopedSlots: { customRender: 'progress' }, width: 160 }
      ],
      equipmentData: [
        { key: 1, line: '单PU1#动混机', status: '故障', downtime: 4, todo: 1, done: 3, batch: '26012901-Z-115-1 SGZ', totalStep: 10, currentStep: 2, progress: 20 },
        { key: 2, line: '单PU2#动混机', status: '闲置', downtime: 0, todo: 0, done: 0, batch: '-', totalStep: 0, currentStep: 0, progress: 0 },
        { key: 3, line: '单PU3#动混机', status: '运行', downtime: 0, todo: 0, done: 0, batch: '-', totalStep: 0, currentStep: 0, progress: 0 },
        { key: 4, line: '单PU4#动混机', status: '-', downtime: '', todo: '', done: '', batch: '', totalStep: '', currentStep: '', progress: 0 },
        { key: 5, line: '单PU5#动混机', status: '-', downtime: '', todo: '', done: '', batch: '', totalStep: '', currentStep: '', progress: 0 },
        { key: 6, line: '单PU6#动混机', status: '-', downtime: '', todo: '', done: '', batch: '', totalStep: '', currentStep: '', progress: 0 },
        { key: 7, line: '单PU7#动混机', status: '-', downtime: '', todo: '', done: '', batch: '', totalStep: '', currentStep: '', progress: 0 },
        { key: 8, line: '单PU8#动混机', status: '-', downtime: '', todo: '', done: '', batch: '', totalStep: '', currentStep: '', progress: 0 }
      ],
      checkColumns: [
        { title: '批次号', dataIndex: 'batch', key: 'batch', width: 170 },
        { title: '物料编号', dataIndex: 'code', key: 'code', width: 95 },
        { title: '物料名称', dataIndex: 'name', key: 'name' },
        { title: '检验结果', dataIndex: 'result', key: 'result', scopedSlots: { customRender: 'result' }, width: 90 }
      ],
      checkData: [1,2,3,4,5].map((i)=>({ key:i, batch:'26012901-Z-115-1 SGZ', code:'203035001', name:'HT906乙太阳能光伏组件专用密封胶SLC', result: i===2? 'NG' : (i===3?'待质检':'OK') })),
      passColumns: [
        { title: '物料编号', dataIndex: 'code', key: 'code', width: 110 },
        { title: '物料名称', dataIndex: 'name', key: 'name' },
        { title: '一次合格率', dataIndex: 'rate', key: 'rate', width: 100 },
        { title: '排名', dataIndex: 'rank', key: 'rank', width: 75 }
      ],
      passData: [
        { key:1, code:'203035001', name:'HT906乙太阳能光伏组件专用密封胶SLC', rate:'80%', rank:1 },
        { key:2, code:'203035001', name:'HT906乙太阳能光伏组件专用密封胶SLC', rate:'70%', rank:2 },
        { key:3, code:'203035001', name:'HT906乙太阳能光伏组件专用密封胶SLC', rate:'60%', rank:3 },
        { key:4, code:'203035001', name:'HT906乙太阳能光伏组件专用密封胶SLC', rate:'50%', rank:4 }
      ],
      maintColumns: [
        { title: '设备编号', dataIndex: 'id', key: 'id', width: 110 },
        { title: '设备名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '维保人', dataIndex: 'owner', key: 'owner', width: 90 },
        { title: '状态', dataIndex: 'state', key: 'state', width: 90 }
      ],
      maintData: [
        { key:1,id:'1G1-067',name:'PU双-6#动混机',owner:'孙华卿',state:'待处理' },
        { key:2,id:'1G1-067',name:'PU双-6#动混机',owner:'孙华卿',state:'处理中' },
        { key:3,id:'1G1-067',name:'PU双-6#动混机',owner:'孙华卿',state:'待处理' },
        { key:4,id:'1G1-067',name:'PU双-6#动混机',owner:'孙华卿',state:'已完工' },
        { key:5,id:'1G1-067',name:'PU双-6#动混机',owner:'孙华卿',state:'待处理' }
      ],
      warnColumns: [
        { title: '设备编号', dataIndex: 'id', key: 'id', width: 100 },
        { title: '设备名称', dataIndex: 'name', key: 'name', width: 130 },
        { title: '告警时间', dataIndex: 'time', key: 'time', width: 120 },
        { title: '告警信息', dataIndex: 'msg', key: 'msg' }
      ],
      warnData: [1,2,3,4].map((i)=>({key:i,id:'1G1-067',name:'PU双-6#动混机',time:'2025-01-02 04:00:00',msg:'xxxxxxxxxxxxxxxx 告警'}))
    };
  },
  mounted() {
    this.tick();
    setInterval(this.tick, 1000);
    this.$nextTick(() => {
      ['runRing', 'idleRing', 'faultRing', 'monthRing', 'dayRing', 'taskRing'].forEach((id) => this.renderRing(id));
    });
  },
  methods: {
    tick() {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      this.now = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    },
    renderRing(id, value = 50) {
      const dom = document.getElementById(id);
      if (!dom) return;
      const chart = echarts.init(dom);
      chart.setOption({
        series: [{
          type: 'pie',
          radius: ['70%', '87%'],
          silent: true,
          label: { show: true, position: 'center', formatter: `${value}%`, color: '#e4f6ff', fontSize: 26, fontWeight: 700 },
          data: [
            { value, itemStyle: { color: new echarts.graphic.LinearGradient(0,0,1,1,[{offset:0,color:'#26e3ff'},{offset:1,color:'#2b74ff'}]) } },
            { value: 100 - value, itemStyle: { color: 'rgba(90,145,198,0.15)' } }
          ]
        }]
      });
    },
    statusClass(status) {
      if (status === '故障') return 'ng';
      if (status === '闲置') return 'inspect';
      if (status === '运行') return 'ok';
      return 'pending';
    },
    resultClass(result) {
      if (result === 'OK') return 'ok';
      if (result === 'NG') return 'ng';
      if (result === '待质检') return 'inspect';
      return 'pending';
    }
  },
  template: `
    <div class="dashboard">
      <div class="header">
        <div class="safe-days">
          <div class="label">安全生产天数</div>
          <div class="digits"><span>0</span><span>0</span><span>3</span><span>7</span><span>5</span><span>1</span></div>
        </div>
        <div class="title">某某某车间看板</div>
        <div class="time">{{ now }}</div>
      </div>
      <div class="content">
        <div class="col">
          <div class="panel" style="height:300px;">
            <div class="panel-title">设备状态</div>
            <div class="status-wrap">
              <div class="status-item"><div class="ring" id="runRing"></div><div class="name">运行</div></div>
              <div class="status-item"><div class="ring" id="idleRing"></div><div class="name">闲置</div></div>
              <div class="status-item"><div class="ring" id="faultRing"></div><div class="name">故障</div></div>
            </div>
          </div>

          <div class="panel" style="height:326px;">
            <div class="panel-title">近24小时半成品检验信息</div>
            <div class="metric-cards" style="margin-bottom:8px;">
              <div class="metric"><div class="num">100</div><div class="label">待检验数量</div></div>
              <div class="metric"><div class="num">100</div><div class="label">已检验数量</div></div>
              <div class="metric"><div class="num">100</div><div class="label">检验OK批次</div></div>
              <div class="metric"><div class="num">100%</div><div class="label">合格率</div></div>
            </div>
            <div class="table-box">
              <a-table :columns="checkColumns" :data-source="checkData" :pagination="false" size="small" :scroll="{ y: 166 }">
                <span slot="result" slot-scope="text"><span class="tag" :class="resultClass(text)">{{text}}</span></span>
              </a-table>
            </div>
          </div>

          <div class="panel" style="height:330px;">
            <div class="panel-title">一次合格率</div>
            <div class="table-box">
              <a-table :columns="passColumns" :data-source="passData" :pagination="false" size="small" :scroll="{ y: 245 }"></a-table>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="panel" style="height:430px;">
            <div class="panel-title">生产执行</div>
            <div class="table-box">
              <a-table :columns="equipmentColumns" :data-source="equipmentData" :pagination="false" size="small" :scroll="{ y: 340, x: 1030 }">
                <span slot="status" slot-scope="text"><span class="tag" :class="statusClass(text)">{{text}}</span></span>
                <span slot="progress" slot-scope="text">
                  <a-progress :percent="Number(text||0)" size="small" :show-info="false" :stroke-color="{ '0%':'#25e6ff','100%':'#2b79ff' }"/>
                  <span style="font-size:20px;color:#9cd9ff;">{{text||0}}%</span>
                </span>
              </a-table>
            </div>
          </div>
          <div class="panel" style="height:638px;">
            <div class="panel-title">进度监控</div>
            <div class="center-progress">
              <div class="progress-card">
                <div class="ring" id="monthRing"></div>
                <div class="values">
                  <div class="line"><span>月度计划产量:</span><span>10000</span></div>
                  <div class="line"><span>累计产量:</span><span>10000</span></div>
                  <div class="line"><span>剩余产量:</span><span>10000</span></div>
                </div>
              </div>
              <div class="progress-card">
                <div class="ring" id="dayRing"></div>
                <div class="values">
                  <div class="line"><span>日度计划产量:</span><span>10000</span></div>
                  <div class="line"><span>累计产量:</span><span>10000</span></div>
                  <div class="line"><span>剩余产量:</span><span>10000</span></div>
                </div>
              </div>
              <div class="progress-card">
                <div class="ring" id="taskRing"></div>
                <div class="values">
                  <div class="line"><span>巡检任务:</span><span>10000</span></div>
                  <div class="line"><span>已完成任务:</span><span>10000</span></div>
                  <div class="line"><span>剩余任务:</span><span>10000</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="panel" style="height:470px;">
            <div class="panel-title">维保任务（10）</div>
            <div class="right-status"><div>待处理: <span class="red">2</span></div><div>进行中: <span class="yellow">1</span></div><div>已完成: <span class="green">1</span></div></div>
            <div class="table-box">
              <a-table :columns="maintColumns" :data-source="maintData" :pagination="false" size="small" :scroll="{ y: 345 }"></a-table>
            </div>
          </div>
          <div class="panel" style="height:486px;">
            <div class="panel-title">告警记录（999+）</div>
            <div class="table-box">
              <a-table :columns="warnColumns" :data-source="warnData" :pagination="false" size="small" :scroll="{ y: 405 }"></a-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
});
