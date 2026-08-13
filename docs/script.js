// ===== 全局變數 =====
let frequency = 2 // Hz，範圍 1-10
let amplitude = 50 // 相對單位，範圍 1-100
let waveType = 'sine' // 波形類型
let isPlaying = true // 播放狀態

let animationTime = 0 // 累積時間（秒）
let animationFrameId = null

const canvas = document.getElementById('waveform-canvas')
const ctx = canvas.getContext('2d')

// Canvas 參數
const PADDING = 40 // 邊距
const GRID_COLOR = '#003300' // 網格顏色
const AXIS_COLOR = '#666666' // 坐標軸顏色
const WAVEFORM_COLOR = '#00ff41' // 波形顏色
const BG_COLOR = '#0d0d0d' // 背景色

// ===== 波形生成函數 =====

// 正弦波
function generateSineWave(time, x) {
  return Math.sin(
    2 * Math.PI * frequency * time + (2 * Math.PI * x) / canvas.width
  )
}

// 方波
function generateSquareWave(time, x) {
  const value = Math.sin(
    2 * Math.PI * frequency * time + (2 * Math.PI * x) / canvas.width
  )
  return value >= 0 ? 1 : -1
}

// 三角波
function generateTriangleWave(time, x) {
  const phase = (frequency * time + x / canvas.width) % 1
  if (phase < 0.25) {
    return 4 * phase
  } else if (phase < 0.75) {
    return 2 - 4 * phase
  } else {
    return 4 * phase - 4
  }
}

// 噪聲
function generateNoiseWave(time, x) {
  return Math.random() * 2 - 1
}

// 根據波形類型生成波形值
function getWaveformValue(time, x) {
  let value = 0
  switch (waveType) {
    case 'sine':
      value = generateSineWave(time, x)
      break
    case 'square':
      value = generateSquareWave(time, x)
      break
    case 'triangle':
      value = generateTriangleWave(time, x)
      break
    case 'noise':
      value = generateNoiseWave(time, x)
      break
    default:
      value = generateSineWave(time, x)
  }
  return value
}

// ===== Canvas 繪製函數 =====

// 清空畫布
function clearCanvas() {
  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// 繪製網格
function drawGrid() {
  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 0.5

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

// 繪製坐標軸
function drawAxes() {
  ctx.strokeStyle = AXIS_COLOR
  ctx.lineWidth = 1

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
  const centerY = (canvas.height - 2 * PADDING) / 2 + PADDING
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
  ctx.fillText('t', canvas.width - 20, canvas.height - 25)

  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillText('A', PADDING - 15, PADDING)
}

// 繪製波形曲線
function drawWaveform() {
  ctx.strokeStyle = WAVEFORM_COLOR
  ctx.lineWidth = 2
  ctx.beginPath()

  const plotWidth = canvas.width - 2 * PADDING
  const plotHeight = canvas.height - 2 * PADDING
  const centerY = plotHeight / 2 + PADDING

  for (let pixelX = 0; pixelX < plotWidth; pixelX++) {
    // 獲取波形值
    const value = getWaveformValue(animationTime, pixelX)

    // 轉換為 Canvas 座標
    const canvasX = pixelX + PADDING
    const canvasY = centerY - ((value * amplitude) / 100) * (plotHeight / 2)

    if (pixelX === 0) {
      ctx.moveTo(canvasX, canvasY)
    } else {
      ctx.lineTo(canvasX, canvasY)
    }
  }

  ctx.stroke()
}

// 繪製標籤（參數值）
function drawLabels() {
  ctx.fillStyle = '#cccccc'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  const margin = 10
  ctx.fillText(`波形: ${waveType}`, margin, margin)
  ctx.fillText(`頻率: ${frequency.toFixed(1)} Hz`, margin, margin + 25)
  ctx.fillText(`振幅: ${amplitude}`, margin, margin + 50)
}

// ===== 主動畫循環 =====

function animate() {
  clearCanvas()
  drawGrid()
  drawAxes()
  drawWaveform()
  drawLabels()

  if (isPlaying) {
    animationTime += 0.01 // 每幀增加 0.01 秒
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

function setFrequency(value) {
  frequency = parseFloat(value)
  const display = document.getElementById('frequency-value')
  if (display) {
    display.textContent = frequency.toFixed(1)
  }
}

function setAmplitude(value) {
  amplitude = parseFloat(value)
  const display = document.getElementById('amplitude-value')
  if (display) {
    display.textContent = amplitude
  }
}

function setWaveType(type) {
  waveType = type
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

  // 綁定事件監聽器
  const playPauseBtn = document.getElementById('play-pause-btn')
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause)
    // 初始化按鈕狀態（根據 isPlaying 設置）
    if (isPlaying) {
      playPauseBtn.textContent = '暫停'
      playPauseBtn.classList.add('playing')
    } else {
      playPauseBtn.textContent = '啟動'
      playPauseBtn.classList.remove('playing')
    }
  }

  const waveformSelect = document.getElementById('waveform-select')
  if (waveformSelect) {
    waveformSelect.addEventListener('change', function (e) {
      setWaveType(e.target.value)
    })
  }

  const frequencySlider = document.getElementById('frequency-slider')
  if (frequencySlider) {
    frequencySlider.addEventListener('input', function (e) {
      setFrequency(e.target.value)
    })
    setFrequency(frequencySlider.value)
  }

  const amplitudeSlider = document.getElementById('amplitude-slider')
  if (amplitudeSlider) {
    amplitudeSlider.addEventListener('input', function (e) {
      setAmplitude(e.target.value)
    })
    setAmplitude(amplitudeSlider.value)
  }

  // 視口變化時調整 Canvas 尺寸
  window.addEventListener('resize', resizeCanvas)

  // 啟動動畫循環
  animate()
}

// 頁面載入完畢後初始化
document.addEventListener('DOMContentLoaded', init)
