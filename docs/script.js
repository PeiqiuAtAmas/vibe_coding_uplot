// ===== 多通道管理與全局狀態 =====

// 6 個通道的顏色方案
const CHANNEL_COLORS = [
  '#00ff41', // 綠
  '#ff6b6b', // 紅
  '#4da6ff', // 藍
  '#ffff00', // 黃
  '#ff66ff', // 紫
  '#00ffff' // 青
]

// 多通道資料結構
let channels = [
  {
    id: 1,
    active: true,
    frequency: 1,
    amplitude: 50,
    waveType: 'sine',
    color: CHANNEL_COLORS[0]
  },
  {
    id: 2,
    active: true,
    frequency: 2,
    amplitude: 50,
    waveType: 'sine',
    color: CHANNEL_COLORS[1]
  },
  {
    id: 3,
    active: true,
    frequency: 3,
    amplitude: 50,
    waveType: 'sine',
    color: CHANNEL_COLORS[2]
  },
  {
    id: 4,
    active: false,
    frequency: 1,
    amplitude: 50,
    waveType: 'sine',
    color: CHANNEL_COLORS[3]
  },
  {
    id: 5,
    active: false,
    frequency: 2,
    amplitude: 50,
    waveType: 'sine',
    color: CHANNEL_COLORS[4]
  },
  {
    id: 6,
    active: false,
    frequency: 3,
    amplitude: 50,
    waveType: 'sine',
    color: CHANNEL_COLORS[5]
  }
]

// 全局播放狀態
let isPlaying = true
let animationTime = 0
let animationFrameId = null
let visibleChannelCount = 3 // 初始顯示 3 個通道

// Canvas 參考
const canvas = document.getElementById('waveform-canvas')
const ctx = canvas.getContext('2d')

// Canvas 參數
const PADDING = 40
const GRID_COLOR = '#005500' // 高對比網格
const AXIS_COLOR = '#666666'
const BG_COLOR = '#0d0d0d'

// ===== 波形生成函數 =====

function generateSineWave(time, x) {
  return Math.sin(2 * Math.PI * time + (2 * Math.PI * x) / canvas.width)
}

function generateSquareWave(time, x) {
  const value = Math.sin(2 * Math.PI * time + (2 * Math.PI * x) / canvas.width)
  return value >= 0 ? 1 : -1
}

function generateTriangleWave(time, x) {
  const phase = (time + x / canvas.width) % 1
  if (phase < 0.25) {
    return 4 * phase
  } else if (phase < 0.75) {
    return 2 - 4 * phase
  } else {
    return 4 * phase - 4
  }
}

function generateNoiseWave(time, x) {
  return Math.random() * 2 - 1
}

// 獲取指定通道、位置的波形值
function getChannelWaveformValue(channelId, time, x) {
  const channel = channels.find((c) => c.id === channelId)
  if (!channel) return 0

  let value = 0
  const frequency = channel.frequency
  const phase =
    2 * Math.PI * frequency * time + (2 * Math.PI * x) / canvas.width

  switch (channel.waveType) {
    case 'sine':
      value = Math.sin(phase)
      break
    case 'square':
      value = Math.sin(phase) >= 0 ? 1 : -1
      break
    case 'triangle':
      const trianglePhase = (frequency * time + x / canvas.width) % 1
      if (trianglePhase < 0.25) {
        value = 4 * trianglePhase
      } else if (trianglePhase < 0.75) {
        value = 2 - 4 * trianglePhase
      } else {
        value = 4 * trianglePhase - 4
      }
      break
    case 'noise':
      value = Math.random() * 2 - 1
      break
    default:
      value = Math.sin(phase)
  }
  return value
}

// ===== Canvas 繪製函數 =====

function clearCanvas() {
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// 繪製高對比網格線
function drawGrid() {
  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 1

  const gridSpacing = 40

  // 垂直網格線
  for (let x = PADDING; x < canvas.width - PADDING; x += gridSpacing) {
    ctx.beginPath()
    ctx.moveTo(x, PADDING)
    ctx.lineTo(x, canvas.height - PADDING)
    ctx.stroke()
  }

  // 水平網格線
  for (let y = PADDING; y < canvas.height - PADDING; y += gridSpacing) {
    ctx.beginPath()
    ctx.moveTo(PADDING, y)
    ctx.lineTo(canvas.width - PADDING, y)
    ctx.stroke()
  }
}

// 繪製 Y 軸刻度標籤
function drawYAxisLabels() {
  const plotHeight = canvas.height - 2 * PADDING
  const centerY = plotHeight / 2 + PADDING

  ctx.fillStyle = '#999999'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'

  // Y 軸刻度標籤：100%, 50%, 0%, -50%, -100%
  const labels = [
    { value: '100%', y: PADDING },
    { value: '50%', y: PADDING + plotHeight / 4 },
    { value: '0%', y: centerY },
    { value: '-50%', y: centerY + plotHeight / 4 },
    { value: '-100%', y: canvas.height - PADDING }
  ]

  labels.forEach((label) => {
    ctx.fillText(label.value, PADDING - 15, label.y)
  })
}

// 繪製坐標軸
function drawAxes() {
  ctx.strokeStyle = AXIS_COLOR
  ctx.lineWidth = 1

  const plotHeight = canvas.height - 2 * PADDING
  const centerY = plotHeight / 2 + PADDING

  // X軸
  ctx.beginPath()
  ctx.moveTo(PADDING, canvas.height - PADDING)
  ctx.lineTo(canvas.width - PADDING, canvas.height - PADDING)
  ctx.stroke()

  // Y軸
  ctx.beginPath()
  ctx.moveTo(PADDING, PADDING)
  ctx.lineTo(PADDING, canvas.height - PADDING)
  ctx.stroke()

  // Y = 0 中線
  ctx.strokeStyle = AXIS_COLOR
  ctx.lineWidth = 0.5
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(PADDING, centerY)
  ctx.lineTo(canvas.width - PADDING, centerY)
  ctx.stroke()
  ctx.setLineDash([])

  // 軸標籤
  ctx.fillStyle = '#999999'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('t', canvas.width - 20, canvas.height - 25)

  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('A', PADDING - 15, PADDING)
}

// 繪製多路波形
function drawWaveforms() {
  const plotWidth = canvas.width - 2 * PADDING
  const plotHeight = canvas.height - 2 * PADDING
  const centerY = plotHeight / 2 + PADDING

  // 遍歷所有通道，繪製 active 的波形
  channels.forEach((channel) => {
    if (!channel.active) return

    ctx.strokeStyle = channel.color
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let pixelX = 0; pixelX < plotWidth; pixelX++) {
      // 獲取該通道的波形值
      const value = getChannelWaveformValue(channel.id, animationTime, pixelX)

      // 轉換為 Canvas 座標
      const canvasX = pixelX + PADDING
      const canvasY =
        centerY - ((value * channel.amplitude) / 100) * (plotHeight / 2)

      if (pixelX === 0) {
        ctx.moveTo(canvasX, canvasY)
      } else {
        ctx.lineTo(canvasX, canvasY)
      }
    }

    ctx.stroke()
  })
}

// 繪製標籤（顯示選中通道資訊）
function drawLabels() {
  ctx.fillStyle = '#cccccc'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  const margin = 10
  ctx.fillText(`顯示通道數: ${visibleChannelCount}`, margin, margin)

  // 顯示各個 active 通道的資訊
  let yOffset = margin + 25
  channels.forEach((channel) => {
    if (channel.active) {
      ctx.fillStyle = channel.color
      ctx.fillText(
        `通道 ${channel.id}: ${channel.waveType} (${channel.frequency.toFixed(1)} Hz)`,
        margin,
        yOffset
      )
      yOffset += 20
    }
  })
}

// ===== 主動畫循環 =====

function animate() {
  clearCanvas()
  drawGrid()
  drawYAxisLabels()
  drawAxes()
  drawWaveforms()
  drawLabels()

  if (isPlaying) {
    animationTime += 0.01
  }

  animationFrameId = requestAnimationFrame(animate)
}

// ===== Canvas 尺寸適應 =====

function resizeCanvas() {
  const container = canvas.parentElement
  const rect = container.getBoundingClientRect()

  canvas.width = rect.width
  canvas.height = rect.height
}

// ===== 參數更新函數 =====

function setChannelActive(channelId, active) {
  const channel = channels.find((c) => c.id === channelId)
  if (channel) {
    channel.active = active
  }
}

function setChannelFrequency(channelId, value) {
  const channel = channels.find((c) => c.id === channelId)
  if (channel) {
    channel.frequency = parseFloat(value)
  }
  // 更新 UI 顯示
  const display = document.getElementById(
    `channel-${channelId}-frequency-value`
  )
  if (display) {
    display.textContent = channel.frequency.toFixed(1)
  }
}

function setChannelAmplitude(channelId, value) {
  const channel = channels.find((c) => c.id === channelId)
  if (channel) {
    channel.amplitude = parseFloat(value)
  }
  // 更新 UI 顯示
  const display = document.getElementById(
    `channel-${channelId}-amplitude-value`
  )
  if (display) {
    display.textContent = channel.amplitude
  }
}

function setChannelWaveType(channelId, type) {
  const channel = channels.find((c) => c.id === channelId)
  if (channel) {
    channel.waveType = type
  }
}

function setChannelCount(count) {
  visibleChannelCount = parseInt(count)

  // 更新通道 active 狀態：只激活前 count 個通道
  channels.forEach((channel, index) => {
    channel.active = index < count
  })
}

function togglePlayPause() {
  isPlaying = !isPlaying
  const btn = document.getElementById('play-pause-btn')
  if (btn) {
    if (isPlaying) {
      btn.textContent = '暫停'
      btn.classList.add('playing')
    } else {
      btn.textContent = '啟動'
      btn.classList.remove('playing')
    }
  }
}

// ===== 初始化 =====

function init() {
  // 設置初始 Canvas 尺寸
  resizeCanvas()

  // 綁定全局播放控制
  const playPauseBtn = document.getElementById('play-pause-btn')
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause)
    if (isPlaying) {
      playPauseBtn.textContent = '暫停'
      playPauseBtn.classList.add('playing')
    }
  }

  // 綁定通道數選擇
  const channelCountSelect = document.getElementById('channel-count-select')
  if (channelCountSelect) {
    channelCountSelect.addEventListener('change', function (e) {
      setChannelCount(e.target.value)
    })
    // 初始化：設置預設值
    setChannelCount(channelCountSelect.value)
  }

  // 綁定各通道的控制
  for (let i = 1; i <= 6; i++) {
    // 通道開關
    const toggleBtn = document.getElementById(`channel-${i}-toggle`)
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const channel = channels.find((c) => c.id === i)
        if (channel) {
          channel.active = !channel.active
          // 更新按鈕樣式
          if (channel.active) {
            toggleBtn.textContent = '關閉'
            toggleBtn.classList.add('active')
          } else {
            toggleBtn.textContent = '開啟'
            toggleBtn.classList.remove('active')
          }
        }
      })
      // 初始化按鈕狀態
      const channel = channels.find((c) => c.id === i)
      if (channel && channel.active) {
        toggleBtn.textContent = '關閉'
        toggleBtn.classList.add('active')
      } else {
        toggleBtn.textContent = '開啟'
        toggleBtn.classList.remove('active')
      }
    }

    // 波形選擇
    const waveformSelect = document.getElementById(`channel-${i}-waveform`)
    if (waveformSelect) {
      waveformSelect.addEventListener('change', function (e) {
        setChannelWaveType(i, e.target.value)
      })
    }

    // 頻率滑桖
    const frequencySlider = document.getElementById(`channel-${i}-frequency`)
    if (frequencySlider) {
      frequencySlider.addEventListener('input', function (e) {
        setChannelFrequency(i, e.target.value)
      })
      setChannelFrequency(i, frequencySlider.value)
    }

    // 振幅滑桖
    const amplitudeSlider = document.getElementById(`channel-${i}-amplitude`)
    if (amplitudeSlider) {
      amplitudeSlider.addEventListener('input', function (e) {
        setChannelAmplitude(i, e.target.value)
      })
      setChannelAmplitude(i, amplitudeSlider.value)
    }
  }

  // 視口變化時調整 Canvas 尺寸
  window.addEventListener('resize', resizeCanvas)

  // 啟動動畫循環
  animate()
}

// 頁面載入完畢後初始化
document.addEventListener('DOMContentLoaded', init)
