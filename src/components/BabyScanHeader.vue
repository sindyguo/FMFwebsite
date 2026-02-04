<template>
  <div class="baby-scan-header" ref="scanContainer">
    <!-- The ghost/hidden layer (background) -->
    <div class="scan-layer hidden-layer">
      <img :src="imgSrc" alt="Ultrasound Scan Hidden">
      <div class="scan-overlay"></div>
    </div>

    <!-- The revealed layer (foreground) -->
    <div class="scan-layer revealed-layer" ref="revealedLayer">
      <img :src="imgSrc" alt="Ultrasound Scan">
    </div>

    <!-- The scanning beam -->
    <div class="scan-beam" ref="scanBeam">
      <div class="light-column" ref="lightColumn"></div>
    </div>

    <!-- Content Slot for overlay text -->
    <div class="header-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BabyScanHeader',
  props: {
    loop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imgSrc: require('@/assets/img/online_course_header.png'),
      scanDuration: 4000
    }
  },
  mounted() {
    // Start animation loop
    this.startScan()
  },
  beforeDestroy() {
    if (this.animationTimer) clearTimeout(this.animationTimer)
    if (this.loopTimer) clearTimeout(this.loopTimer)
  },
  methods: {
    startScan() {
      const revealedLayer = this.$refs.revealedLayer
      const scanBeam = this.$refs.scanBeam
      const lightColumn = this.$refs.lightColumn
      const container = this.$refs.scanContainer

      if (!revealedLayer || !scanBeam || !lightColumn || !container) return

      // Reset state
      revealedLayer.style.transition = 'none'
      scanBeam.style.transition = 'none'
      lightColumn.style.transition = 'none'

      revealedLayer.style.clipPath = 'inset(0 100% 0 0)'
      scanBeam.style.transform = 'translateX(0)'
      lightColumn.style.transform = 'scaleY(0)'
      scanBeam.style.opacity = '1'

      // Force reflow
      void scanBeam.offsetWidth

      // 1. Unfold vertically
      lightColumn.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      lightColumn.style.transform = 'scaleY(1)'

      this.animationTimer = setTimeout(() => {
        // 2. Start moving horizontally
        const containerWidth = container.offsetWidth

        // Set transitions
        revealedLayer.style.transition = `clip-path ${this.scanDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`
        scanBeam.style.transition = `transform ${this.scanDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)`

        // Execute move
        revealedLayer.style.clipPath = 'inset(0 0 0 0)'
        // Move beam across (width + buffer)
        scanBeam.style.transform = `translateX(${containerWidth + 100}px)`

        // Loop if enabled
        if (this.loop) {
          this.loopTimer = setTimeout(() => {
            this.startScan()
          }, this.scanDuration + 2000) // wait for scan to finish + pause
        }

      }, 800)
    }
  }
}
</script>

<style lang="scss" scoped>
.baby-scan-header {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  user-select: none;
}

.scan-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    transform: scale(1.6);
    transform-origin: center;
    pointer-events: none;
    display: block;
    margin: 0;
  }
}

.hidden-layer {
  z-index: 1;
  background: #000;

  img {
    opacity: 0.3;
    filter: grayscale(100%) blur(5px) brightness(0.4);
  }
}

.revealed-layer {
  z-index: 2;
  /* Initial state set in JS, but default here */
  clip-path: inset(0 100% 0 0);
  will-change: clip-path;

  img {
    filter: none;
  }
}

.scan-beam {
  position: absolute;
  top: 0;
  left: -50px; /* Start slightly off-screen */
  width: 100px; /* Beam mechanics width */
  height: 100%;
  z-index: 10;
  pointer-events: none;
  will-change: transform;
}

.light-column {
  width: 12px;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow:
    0 0 15px 2px rgba(255, 255, 255, 0.9),
    0 0 40px 10px rgba(64, 158, 255, 0.4), /* Tinted blue slightly for branded feel */
    -20px 0 60px 20px rgba(64, 158, 255, 0.2);
  border-radius: 2px;
  position: relative;
  left: 44px; /* Center in 100px parent */
  transform: scaleY(0); /* Start folded */
  transform-origin: center;
  
  /* Vertical beam line detail */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 100%;
    background: #fff;
    opacity: 0.8;
  }
}

.header-content {
  position: relative;
  height: 100%;
  z-index: 20; /* Above beam */
}
</style>
