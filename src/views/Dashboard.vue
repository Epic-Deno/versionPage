<template>
  <div class="dashboard-container">
    <!-- 顶部区域 -->
    <div class="header">
      <div class="safe-days">
        <span class="label">安全生产天数</span>
        <div class="day-counter">
          <span class="digit" v-for="(digit, index) in safeDaysDigits" :key="index">{{ digit }}</span>
        </div>
        <span class="unit">天</span>
      </div>
      <div class="title-wrapper">
        <div class="title-decor-left"></div>
        <div class="title">某某某车间看板</div>
        <div class="title-decor-right"></div>
      </div>
      <div class="datetime">{{ currentDateTime }}</div>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 左侧区域 -->
      <div class="left-section">
        <!-- 设备状态 -->
        <div class="panel equipment-status">
          <div class="panel-title-bar">
            <div class="title-indicator"></div>
            <span>设备状态</span>
          </div>
          <div class="panel-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <div class="status-charts">
            <div class="status-item" v-for="item in equipmentStatus" :key="item.name">
              <div class="chart-wrapper" :ref="'equipmentChart_' + item.name"></div>
              <div class="status-label">{{ item.name }}</div>
            </div>
          </div>
        </div>

        <!-- 近24小时半成品检验信息 -->
        <div class="panel inspection-info">
          <div class="panel-title-bar">
            <div class="title-indicator"></div>
            <span>近24小时半成品检验信息</span>
          </div>
          <div class="panel-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <div class="stats-row">
            <div class="stat-card" v-for="stat in inspectionStats" :key="stat.label">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
          <a-table
            :columns="inspectionColumns"
            :data-source="inspectionData"
            :pagination="false"
            :scroll="{ y: 180 }"
            size="small"
            class="dark-table"
          >
            <template slot="result" slot-scope="text">
              <span :class="['status-tag', getResultClass(text)]">{{ text }}</span>
            </template>
          </a-table>
        </div>

        <!-- 一次合格率 -->
        <div class="panel first-pass-rate">
          <div class="panel-title-bar">
            <div class="title-indicator"></div>
            <span>一次合格率</span>
          </div>
          <div class="panel-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <a-table
            :columns="firstPassColumns"
            :data-source="firstPassData"
            :pagination="false"
            :scroll="{ y: 150 }"
            size="small"
            class="dark-table"
          >
            <template slot="rate" slot-scope="text">
              <span class="highlight-orange">{{ text }}</span>
            </template>
          </a-table>
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="center-section">
        <!-- 产线状态表格 -->
        <div class="panel production-line">
          <div class="panel-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <a-table
            :columns="productionLineColumns"
            :data-source="productionLineData"
            :pagination="false"
            :scroll="{ y: 280 }"
            size="small"
            class="dark-table"
          >
            <template slot="status" slot-scope="text">
              <span v-if="text" :class="['status-tag', getStatusClass(text)]">{{ text }}</span>
            </template>
            <template slot="progress" slot-scope="text">
              <div class="progress-cell" v-if="text">
                <div class="progress-bg"></div>
                <div class="progress-bar" :style="{ width: text }">
                  <span class="progress-text">{{ text }}</span>
                </div>
              </div>
            </template>
          </a-table>
        </div>

        <!-- 进度监控 -->
        <div class="panel progress-monitor">
          <div class="panel-title-bar">
            <div class="title-indicator"></div>
            <span>进度监控</span>
          </div>
          <div class="panel-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <div class="monitor-sections">
            <!-- 月度生产进度监控 -->
            <div class="monitor-item">
              <div class="monitor-title">月度生产进度监控</div>
              <div class="monitor-content">
                <div class="chart-wrapper" ref="monthlyProgressChart"></div>
                <div class="monitor-stats">
                  <div class="stat-row">
                    <span class="label">计划产量：</span>
                    <span class="value">10000</span>
                  </div>
                  <div class="stat-row">
                    <span class="label">累计产量：</span>
                    <span class="value">10000</span>
                  </div>
                  <div class="stat-row">
                    <span class="label">剩余产量：</span>
                    <span class="value">10000</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 日度生产进度监控 -->
            <div class="monitor-item">
              <div class="monitor-title">日度生产进度监控</div>
              <div class="monitor-content">
                <div class="chart-wrapper" ref="dailyProgressChart"></div>
                <div class="monitor-stats">
                  <div class="stat-row">
                    <span class="label">计划产量：</span>
                    <span class="value">10000</span>
                  </div>
                  <div class="stat-row">
                    <span class="label">累计产量：</span>
                    <span class="value">10000</span>
                  </div>
                  <div class="stat-row">
                    <span class="label">剩余产量：</span>
                    <span class="value">10000</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 巡检任务进度监控 -->
            <div class="monitor-item">
              <div class="monitor-title">巡检任务进度监控</div>
              <div class="monitor-content">
                <div class="chart-wrapper" ref="inspectionProgressChart"></div>
                <div class="monitor-stats">
                  <div class="stat-row">
                    <span class="label">巡检任务：</span>
                    <span class="value">10000</span>
                  </div>
                  <div class="stat-row">
                    <span class="label">已完成任务：</span>
                    <span class="value">10000</span>
                  </div>
                  <div class="stat-row">
                    <span class="label">剩余任务：</span>
                    <span class="value">10000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-section">
        <!-- 维保任务 -->
        <div class="panel maintenance-tasks">
          <div class="panel-header">
            <div class="panel-title-bar" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
              <div class="title-indicator"></div>
              <span>维保任务（10）</span>
            </div>
            <div class="task-summary">
              <span class="pending">待处理：<em>2</em></span>
              <span class="processing">进行中：<em>1</em></span>
              <span class="completed">已完成：<em>1</em></span>
            </div>
          </div>
          <div class="panel-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <a-table
            :columns="maintenanceColumns"
            :data-source="maintenanceData"
            :pagination="false"
            :scroll="{ y: 180 }"
            size="small"
            class="dark-table"
          >
            <template slot="status" slot-scope="text">
              <span :class="['status-tag', getMaintenanceStatusClass(text)]">{{ text }}</span>
            </template>
          </a-table>
        </div>

        <!-- 告警记录 -->
        <div class="panel alarm-records">
          <div class="panel-title-bar">
            <div class="title-indicator"></div>
            <span>告警记录（999+）</span>
          </div>
          <div class="panel-corners">
            <span class="corner tl"></span>
            <span class="corner tr"></span>
            <span class="corner bl"></span>
            <span class="corner br"></span>
          </div>
          <a-table
            :columns="alarmColumns"
            :data-source="alarmData"
            :pagination="false"
            :scroll="{ y: 200 }"
            size="small"
            class="dark-table"
          >
            <template slot="deviceNo" slot-scope="text">
              <span class="highlight-orange">{{ text }}</span>
            </template>
            <template slot="alarmInfo" slot-scope="text">
              <span class="highlight-red">{{ text }}</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

// 颜色配置
const colors = {
  bgPrimary: '#041527',
  bgSecondary: '#0a1e36',
  bgPanel: 'rgba(6, 30, 55, 0.85)',
  borderPrimary: '#1a4a7a',
  borderGlow: '#00d4ff',
  textPrimary: '#ffffff',
  textSecondary: '#8ab4d8',
  textMuted: '#5a7a9a',
  accentCyan: '#00d4ff',
  accentOrange: '#ff9f43',
  accentGreen: '#00e676',
  accentRed: '#ff5252',
  accentYellow: '#ffd93d',
  accentBlue: '#448aff'
}

export default {
  name: 'Dashboard',
  data() {
    return {
      currentDateTime: '',
      safeDays: 3751,
      charts: {},
      equipmentStatus: [
        { name: '运行', value: 50, color: colors.accentGreen },
        { name: '闲置', value: 50, color: colors.accentYellow },
        { name: '故障', value: 50, color: colors.accentRed }
      ],
      inspectionStats: [
        { label: '待检测数量', value: 100 },
        { label: '已检测数量', value: 100 },
        { label: '检验OK批次数', value: 100 },
        { label: '合格率', value: '100%' }
      ],
      inspectionColumns: [
        { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 150 },
        { title: '物料编号', dataIndex: 'materialNo', key: 'materialNo', width: 100 },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
        { title: '检验结果', dataIndex: 'result', key: 'result', width: 80, scopedSlots: { customRender: 'result' } }
      ],
      inspectionData: [
        { key: '1', batchNo: '26012901-Z-115-1 SGZ', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', result: 'OK' },
        { key: '2', batchNo: '26012901-Z-115-1 SGZ', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', result: 'NG' },
        { key: '3', batchNo: '26012901-Z-115-1 SGZ', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', result: '待质检' },
        { key: '4', batchNo: '26012901-Z-115-1 SGZ', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', result: 'OK' },
        { key: '5', batchNo: '26012901-Z-115-1 SGZ', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', result: 'OK' }
      ],
      firstPassColumns: [
        { title: '物料编号', dataIndex: 'materialNo', key: 'materialNo', width: 100 },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 150 },
        { title: '一次合格率', dataIndex: 'rate', key: 'rate', width: 100, scopedSlots: { customRender: 'rate' } },
        { title: '排名', dataIndex: 'rank', key: 'rank', width: 60 }
      ],
      firstPassData: [
        { key: '1', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', rate: '80%', rank: 1 },
        { key: '2', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', rate: '70%', rank: 2 },
        { key: '3', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', rate: '60%', rank: 3 },
        { key: '4', materialNo: '203035001', materialName: 'HT906Z太阳能光伏组件专用密封胶SLC', rate: '50%', rank: 3 }
      ],
      productionLineColumns: [
        { title: '产线', dataIndex: 'line', key: 'line', width: 100 },
        { title: '设备状态', dataIndex: 'status', key: 'status', width: 80, scopedSlots: { customRender: 'status' } },
        { title: '当日排产数量', dataIndex: 'planned', key: 'planned', width: 100 },
        { title: '待执行数量', dataIndex: 'pending', key: 'pending', width: 100 },
        { title: '已完成数量', dataIndex: 'completed', key: 'completed', width: 100 },
        { title: '当前执行批次', dataIndex: 'currentBatch', key: 'currentBatch', width: 150 },
        { title: '总工步', dataIndex: 'totalSteps', key: 'totalSteps', width: 70 },
        { title: '当前工步', dataIndex: 'currentStep', key: 'currentStep', width: 80 },
        { title: '生产进度', dataIndex: 'progress', key: 'progress', width: 100, scopedSlots: { customRender: 'progress' } }
      ],
      productionLineData: [
        { key: '1', line: '单PU1#动混机', status: '故障', planned: 4, pending: 1, completed: 3, currentBatch: '26012901-Z-115-1 SGZ', totalSteps: 10, currentStep: 2, progress: '20%' },
        { key: '2', line: '单PU2#动混机', status: '闲置', planned: 0, pending: '', completed: '', currentBatch: '', totalSteps: '', currentStep: '', progress: '' },
        { key: '3', line: '单PU3#动混机', status: '运行', planned: 0, pending: '', completed: '', currentBatch: '', totalSteps: '', currentStep: '', progress: '' },
        { key: '4', line: '单PU4#动混机', status: '', planned: '', pending: '', completed: '', currentBatch: '', totalSteps: '', currentStep: '', progress: '' },
        { key: '5', line: '单PU5#动混机', status: '', planned: '', pending: '', completed: '', currentBatch: '', totalSteps: '', currentStep: '', progress: '' },
        { key: '6', line: '单PU6#动混机', status: '', planned: '', pending: '', completed: '', currentBatch: '', totalSteps: '', currentStep: '', progress: '' },
        { key: '7', line: '单PU7#动混机', status: '', planned: '', pending: '', completed: '', currentBatch: '', totalSteps: '', currentStep: '', progress: '' },
        { key: '8', line: '单PU8#动混机', status: '', planned: '', pending: '', completed: '', currentBatch: '', totalSteps: '', currentStep: '', progress: '' }
      ],
      maintenanceColumns: [
        { title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 80 },
        { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 100 },
        { title: '维保人', dataIndex: 'maintainer', key: 'maintainer', width: 70 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 70, scopedSlots: { customRender: 'status' } }
      ],
      maintenanceData: [
        { key: '1', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', maintainer: '孙华佩', status: '待处理' },
        { key: '2', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', maintainer: '孙华佩', status: '处理中' },
        { key: '3', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', maintainer: '孙华佩', status: '待处理' },
        { key: '4', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', maintainer: '孙华佩', status: '已完工' },
        { key: '5', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', maintainer: '孙华佩', status: '待处理' }
      ],
      alarmColumns: [
        { title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 80, scopedSlots: { customRender: 'deviceNo' } },
        { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 100 },
        { title: '告警时间', dataIndex: 'alarmTime', key: 'alarmTime', width: 100 },
        { title: '告警信息', dataIndex: 'alarmInfo', key: 'alarmInfo', width: 150, scopedSlots: { customRender: 'alarmInfo' } }
      ],
      alarmData: [
        { key: '1', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', alarmTime: '2025-01-02 04:00:00', alarmInfo: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx告警' },
        { key: '2', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', alarmTime: '2025-01-02 04:00:00', alarmInfo: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx告警' },
        { key: '3', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', alarmTime: '2025-01-02 04:00:00', alarmInfo: 'xxxxxxxxxx告警' },
        { key: '4', deviceNo: '1G1-067', deviceName: 'PU双-6#动混机', alarmTime: '2025-01-02 04:00:00', alarmInfo: 'xxxxxxxxxx告警' }
      ]
    }
  },
  computed: {
    safeDaysDigits() {
      return this.safeDays.toString().padStart(6, '0').split('')
    }
  },
  mounted() {
    this.updateDateTime()
    this.timer = setInterval(this.updateDateTime, 1000)
    this.$nextTick(() => {
      this.initEquipmentCharts()
      this.initProgressCharts()
    })
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.dispose()
      }
    })
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    getResultClass(result) {
      const classMap = {
        'OK': 'status-success',
        'NG': 'status-error',
        '待质检': 'status-info'
      }
      return classMap[result] || ''
    },
    getStatusClass(status) {
      const classMap = {
        '故障': 'status-error',
        '闲置': 'status-warning',
        '运行': 'status-success'
      }
      return classMap[status] || ''
    },
    getMaintenanceStatusClass(status) {
      const classMap = {
        '待处理': 'status-warning',
        '处理中': 'status-info',
        '已完工': 'status-success'
      }
      return classMap[status] || ''
    },
    initEquipmentCharts() {
      this.equipmentStatus.forEach(item => {
        const refName = `equipmentChart_${item.name}`
        const refs = this.$refs[refName]
        if (refs && refs[0]) {
          const chart = echarts.init(refs[0])
          this.charts[refName] = chart
          const option = {
            series: [{
              type: 'pie',
              radius: ['60%', '80%'],
              center: ['50%', '50%'],
              data: [
                { 
                  value: item.value, 
                  itemStyle: { 
                    color: {
                      type: 'linear',
                      x: 0, y: 0, x2: 1, y2: 1,
                      colorStops: [
                        { offset: 0, color: item.color },
                        { offset: 1, color: item.color + '88' }
                      ]
                    },
                    shadowColor: item.color,
                    shadowBlur: 10
                  } 
                },
                { value: 100 - item.value, itemStyle: { color: 'rgba(0, 212, 255, 0.15)' } }
              ],
              label: {
                show: true,
                position: 'center',
                formatter: `${item.value}%`,
                fontSize: 14,
                fontWeight: 'bold',
                color: '#ffffff'
              },
              emphasis: {
                scale: false
              }
            }]
          }
          chart.setOption(option)
        }
      })
    },
    initProgressCharts() {
      const progressConfigs = [
        { ref: 'monthlyProgressChart', value: 50 },
        { ref: 'dailyProgressChart', value: 50 },
        { ref: 'inspectionProgressChart', value: 50 }
      ]
      progressConfigs.forEach(config => {
        const el = this.$refs[config.ref]
        if (el) {
          const chart = echarts.init(el)
          this.charts[config.ref] = chart
          const option = {
            series: [{
              type: 'pie',
              radius: ['60%', '80%'],
              center: ['50%', '50%'],
              data: [
                { 
                  value: config.value, 
                  itemStyle: { 
                    color: {
                      type: 'linear',
                      x: 0, y: 0, x2: 1, y2: 1,
                      colorStops: [
                        { offset: 0, color: colors.accentCyan },
                        { offset: 1, color: colors.accentCyan + '88' }
                      ]
                    },
                    shadowColor: colors.accentCyan,
                    shadowBlur: 10
                  } 
                },
                { value: 100 - config.value, itemStyle: { color: 'rgba(0, 212, 255, 0.15)' } }
              ],
              label: {
                show: true,
                position: 'center',
                formatter: `${config.value}%`,
                fontSize: 14,
                fontWeight: 'bold',
                color: '#ffffff'
              },
              emphasis: {
                scale: false
              }
            }]
          }
          chart.setOption(option)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 颜色变量
@bg-primary: #041527;
@bg-secondary: #0a1e36;
@bg-panel: rgba(6, 30, 55, 0.85);
@border-primary: #1a4a7a;
@border-glow: #00d4ff;
@text-primary: #ffffff;
@text-secondary: #8ab4d8;
@text-muted: #5a7a9a;
@accent-cyan: #00d4ff;
@accent-orange: #ff9f43;
@accent-green: #00e676;
@accent-red: #ff5252;
@accent-yellow: #ffd93d;
@accent-blue: #448aff;

.dashboard-container {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(135deg, @bg-primary 0%, @bg-secondary 100%);
  padding: 16px;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 16px;
  height: 50px;

  .safe-days {
    display: flex;
    align-items: center;
    gap: 10px;

    .label {
      font-size: 18px;
      font-weight: 600;
      color: @accent-cyan;
      text-shadow: 0 0 10px fade(@accent-cyan, 60%);
    }

    .day-counter {
      display: flex;
      gap: 4px;

      .digit {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 36px;
        background: fade(@accent-cyan, 10%);
        border: 1px solid @accent-cyan;
        border-radius: 4px;
        font-size: 20px;
        font-weight: bold;
        color: @accent-cyan;
        box-shadow: 0 0 8px fade(@accent-cyan, 40%), inset 0 0 10px fade(@accent-cyan, 20%);
      }
    }

    .unit {
      font-size: 18px;
      font-weight: 600;
      color: @text-primary;
    }
  }

  .title-wrapper {
    display: flex;
    align-items: center;
    gap: 20px;

    .title-decor-left {
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, transparent, @accent-cyan);
    }

    .title-decor-right {
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, @accent-cyan, transparent);
    }
  }

  .title {
    font-size: 32px;
    font-weight: bold;
    color: @text-primary;
    text-shadow: 0 0 20px fade(@accent-cyan, 60%);
    letter-spacing: 4px;
  }

  .datetime {
    font-size: 20px;
    font-weight: 500;
    color: @accent-cyan;
    text-shadow: 0 0 10px fade(@accent-cyan, 40%);
  }
}

.main-content {
  display: flex;
  gap: 16px;
  height: calc(100% - 66px);
}

.left-section {
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.center-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-section {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel {
  position: relative;
  background: @bg-panel;
  border: 1px solid @border-primary;
  border-radius: 4px;
  padding: 16px;
  box-shadow: inset 0 0 30px fade(@accent-cyan, 3%), 0 0 20px rgba(0, 0, 0, 0.3);

  .panel-corners {
    .corner {
      position: absolute;
      width: 12px;
      height: 12px;
      border-color: @accent-cyan;
      border-style: solid;
      border-width: 0;

      &.tl {
        top: 0;
        left: 0;
        border-top-width: 2px;
        border-left-width: 2px;
      }
      &.tr {
        top: 0;
        right: 0;
        border-top-width: 2px;
        border-right-width: 2px;
      }
      &.bl {
        bottom: 0;
        left: 0;
        border-bottom-width: 2px;
        border-left-width: 2px;
      }
      &.br {
        bottom: 0;
        right: 0;
        border-bottom-width: 2px;
        border-right-width: 2px;
      }
    }
  }

  .panel-title-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid @border-primary;

    .title-indicator {
      width: 4px;
      height: 18px;
      background: linear-gradient(180deg, @accent-cyan, transparent);
      border-radius: 2px;
    }

    span {
      font-size: 16px;
      font-weight: 600;
      color: @text-primary;
      text-shadow: 0 0 10px fade(@accent-cyan, 40%);
    }
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid @border-primary;
  }
}

// 状态标签
.status-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 12px;

  &.status-success {
    background: fade(@accent-green, 15%);
    color: @accent-green;
    border: 1px solid @accent-green;
    box-shadow: 0 0 6px fade(@accent-green, 40%);
  }

  &.status-error {
    background: fade(@accent-red, 15%);
    color: @accent-red;
    border: 1px solid @accent-red;
    box-shadow: 0 0 6px fade(@accent-red, 40%);
  }

  &.status-warning {
    background: fade(@accent-orange, 15%);
    color: @accent-orange;
    border: 1px solid @accent-orange;
    box-shadow: 0 0 6px fade(@accent-orange, 40%);
  }

  &.status-info {
    background: fade(@accent-blue, 15%);
    color: @accent-blue;
    border: 1px solid @accent-blue;
    box-shadow: 0 0 6px fade(@accent-blue, 40%);
  }
}

// 高亮文字
.highlight-orange {
  color: @accent-orange;
  font-weight: bold;
  text-shadow: 0 0 8px fade(@accent-orange, 40%);
}

.highlight-red {
  color: @accent-red;
}

.equipment-status {
  .status-charts {
    display: flex;
    justify-content: space-around;
    padding-top: 8px;

    .status-item {
      text-align: center;

      .chart-wrapper {
        width: 90px;
        height: 90px;
      }

      .status-label {
        margin-top: 8px;
        font-size: 13px;
        color: @text-secondary;
      }
    }
  }
}

.inspection-info {
  flex: 1;
  display: flex;
  flex-direction: column;

  .stats-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 8px;

    .stat-card {
      flex: 1;
      text-align: center;
      padding: 12px 8px;
      background: fade(@accent-cyan, 5%);
      border: 1px solid @border-primary;
      border-radius: 4px;

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: @accent-cyan;
        text-shadow: 0 0 10px fade(@accent-cyan, 40%);
      }

      .stat-label {
        font-size: 12px;
        color: @text-secondary;
        margin-top: 4px;
      }
    }
  }
}

.progress-monitor {
  flex: 1;

  .monitor-sections {
    display: flex;
    gap: 24px;

    .monitor-item {
      flex: 1;
      padding: 16px;
      background: fade(@accent-cyan, 3%);
      border: 1px solid fade(@border-primary, 60%);
      border-radius: 4px;

      .monitor-title {
        font-size: 14px;
        font-weight: 600;
        color: @text-primary;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px dashed @border-primary;
      }

      .monitor-content {
        display: flex;
        align-items: center;
        gap: 20px;

        .chart-wrapper {
          width: 80px;
          height: 80px;
        }

        .monitor-stats {
          flex: 1;

          .stat-row {
            margin-bottom: 10px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;

            .label {
              color: @text-secondary;
            }

            .value {
              font-weight: 600;
              color: @accent-orange;
              text-shadow: 0 0 8px fade(@accent-orange, 40%);
            }
          }
        }
      }
    }
  }
}

.maintenance-tasks {
  .task-summary {
    display: flex;
    gap: 16px;
    font-size: 13px;

    .pending {
      color: @accent-orange;
    }

    .processing {
      color: @accent-blue;
    }

    .completed {
      color: @accent-green;
    }

    em {
      font-style: normal;
      font-weight: bold;
    }
  }
}

.alarm-records {
  flex: 1;
}

// 进度条
.progress-cell {
  position: relative;
  width: 100%;
  height: 20px;

  .progress-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: fade(@accent-cyan, 10%);
    border-radius: 3px;
    border: 1px solid @border-primary;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, @accent-green, @accent-cyan);
    border-radius: 3px;
    box-shadow: 0 0 10px fade(@accent-green, 60%);
    display: flex;
    align-items: center;
    justify-content: center;

    .progress-text {
      color: #fff;
      font-size: 11px;
      font-weight: bold;
      text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
    }
  }
}

// 深色表格样式
.dark-table {
  /deep/ .ant-table {
    background: transparent;
    color: @text-secondary;

    .ant-table-thead > tr > th {
      background: fade(@accent-cyan, 10%);
      color: @accent-cyan;
      border-bottom: 1px solid @border-primary;
      text-shadow: 0 0 5px fade(@accent-cyan, 30%);
      font-weight: 600;
    }

    .ant-table-tbody > tr > td {
      background: transparent;
      color: @text-secondary;
      border-bottom: 1px solid fade(@border-primary, 40%);
    }

    .ant-table-tbody > tr:hover > td {
      background: fade(@accent-cyan, 5%);
    }

    .ant-table-placeholder {
      background: transparent;
      color: @text-muted;
    }
  }

  /deep/ .ant-table-body {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: @bg-secondary;
    }

    &::-webkit-scrollbar-thumb {
      background: @border-primary;
      border-radius: 3px;

      &:hover {
        background: @accent-cyan;
      }
    }
  }
}
</style>
