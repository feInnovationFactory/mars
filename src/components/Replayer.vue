<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-upload
        class="upload-demo"
        action="none"
        :before-upload="beforeAvatarUpload">
        <el-tooltip content="文件不会上传到服务器，只会在浏览器进行内容读取">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-tooltip>
        <div slot="tip" class="el-upload__tip">只能上传 *.log 文件，且不超过 10MB</div>
      </el-upload>

      <el-alert title=" " type="info" style="margin-top: 10px;">地图会先从日志中进行读取，如果日志中不存在地图信息则使用第一张地图</el-alert>

      <div style="margin-bottom: 12px;" v-if="replayLogs.length > 1">
        <div>
          <el-slider
            :disabled="!replayLogs || replayLogs.length === 0"
            v-model="currentStep"
            :min="1"
            :max="replayLogs.length > 1 ? replayLogs.length: 1">
          </el-slider>
        </div>
        <div style="margin-bottom: 10px;">
          <el-input-number
            :disabled="!replayLogs || replayLogs.length === 0"
            v-model="currentStep"></el-input-number>
        </div>

        <el-button :type="playStatus.playing ? 'danger' : 'primary'" @click="play">
          {{ playStatus.playing ? '暂停' : '播放' }}
        </el-button>
        <el-button @click="reset">重置</el-button>
        <el-tooltip content="暂停后才能更改速度" style="vertical-align: top; margin-left: 10px; width: 100px;">
          <el-select v-model="playStatus.speed">
            <el-option :value="300" label="0.3s"></el-option>
            <el-option :value="500" label="0.5s"></el-option>
            <el-option :value="1000" label="1s"></el-option>
            <el-option :value="2000" label="2s"></el-option>
            <el-option :value="5000" label="5s"></el-option>
          </el-select>
        </el-tooltip>

        <el-input :value="JSON.stringify(currentState)"
          type="textarea"
          style="margin-top: 10px;"
          :autosize="{ minRows: 8, maxRows: 20 }"
          readonly></el-input>
      </div>
    </el-col>
    <el-col :span="18">
      <div class="tank-replayer--legend">
        <tank class="is-legend" type="blue"></tank>{{ blueHost }}
        <tank class="is-legend" type="red"></tank>{{ redHost }}
        <a href="https://git.elenet.me/long.zhang/tank-replayer"
           target="blank"
           style="float: right;"
           class="el-button el-button--default el-button--info el-button--mini">Source Code</a>
      </div>
      <div class="tank-replayer">
        <tank-map
          :data="map.data"
          :size="map.size">
          <flag :position="(currentState.flag || {}).position"></flag>
        </tank-map>

        <tank v-for="tank in currentState.tanks"
          :key="tank.id"
          :id="tank.id"
          :type="tank.type"
          :dir="tank.dir"
          :status="tank.status"
          :speed="playStatus.speed"
          :position="tank.position"></tank>

        <bullet v-for="bullet in currentState.shells"
          :key="'' + bullet.id + '-' + bullet.status"
          :type="bullet.type || 'red'"
          :dir="bullet.dir"
          :status="bullet.status"
          :speed="playStatus.speed"
          :position="bullet.position"></bullet>
      </div>
    </el-col>
  </el-row>
</template>

<style>
.tank-replayer {
  position: relative;
}

.tank.is-legend {
  display: inline-block;
  position: static;
  margin-right: 10px;
  zoom: 0.5;
  vertical-align: bottom;
}

.tank-replayer--legend {
  line-height: 25px;
  vertical-align: middle;
  margin-bottom: 10px;
}
</style>

<script>
import { firstMap, parseMap } from '@/map'
import TankMap from '@/components/Map'
import Bullet from '@/components/Bullet'
import Tank from '@/components/Tank'
import Flag from '@/components/Flag'

export default {
  name: 'Replayer',

  components: {
    TankMap,
    Bullet,
    Tank,
    Flag
  },

  computed: {
    currentState () {
      return this.replayLogs[this.currentStep - 1] || {}
    }
  },

  methods: {
    play () {
      const { playing } = this.playStatus

      const stop = () => {
        clearInterval(this.playStatus.interval)
        this.playStatus.interval = null
        this.playStatus.playing = false
      }

      if (!playing) {
        this.playStatus.playing = true
        this.currentStep += 1
        this.playStatus.interval = setInterval(() => {
          this.currentStep += 1
          if (this.currentStep >= this.replayLogs.length) {
            stop()
          }
        }, this.playStatus.speed)
      } else {
        stop()
      }
    },

    reset () {
      const { interval } = this.playStatus
      clearInterval(interval)
      this.playStatus.interval = null
      this.playStatus.playing = false
      this.currentStep = 0
    },

    beforeAvatarUpload (file) {
      var reader = new FileReader()
      reader.onload = (event) => {
        this.formatRawLog(event.target.result)
      }
      reader.readAsText(file)
      return false
    },

    formatRawLog (rawLog) {
      const mapDataMatches = /const\s+MAP_1\s+=\s+'([\d\s\n\r]*)'/g.exec(rawLog || '')
      if (mapDataMatches) {
        const mapSource = mapDataMatches[1]
        this.map = parseMap(mapSource)
      }
      const logs = (rawLog || '').split('\n').filter((line) => {
        return line.indexOf('ReplayLog:') !== -1
      }).map((log) => {
        return log.replace(/ReplayLog:/g, '').replace(/,,/g, ',').replace(/(dir|status|owner):([\w\-\.:]+)/g, ($1, $2, $3) => { // eslint-disable-line
          return $2 + ':' + `"${$3}"`
        })
      })
      try {
        const replayLogs = eval('[' + logs.join(',') + ']') // eslint-disable-line
        const firstLog = (replayLogs || [])[0]
        let blueHost, redHost
        if (firstLog && firstLog.tanks) {
          firstLog.tanks.forEach((tank) => {
            if (!blueHost) {
              blueHost = tank.owner
            }
            if (!redHost && blueHost !== tank.owner) {
              redHost = tank.owner
            }
          })
        }
        this.blueHost = blueHost
        this.redHost = redHost
        replayLogs.forEach(({ tanks = [], shells = [] }) => {
          tanks.forEach((tank) => {
            tank.type = (blueHost === tank.owner) ? 'blue' : 'red'
            tank.dir = (tank.dir || '').toLowerCase()
          })
          shells.forEach((shell) => {
            shell.dir = (shell.dir || '').toLowerCase()
          })
        })
        this.replayLogs = replayLogs
      } catch (e) {
        if (window.Raven) window.Raven.captureException(e)
        this.$message.error('文件解析发生错误：' + e)
      }
    }
  },

  data () {
    return {
      playStatus: {
        interval: null,
        playing: false,
        speed: 500
      },
      currentStep: 0,
      replayLogs: [],
      map: firstMap,
      blueHost: 'blue:80',
      redHost: 'red:80'
    }
  }
}
</script>
