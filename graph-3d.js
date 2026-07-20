/**
 * graph-3d.js — 3D force-directed graph renderer.
 *
 * Renders an interactive 3D node-link graph on a <canvas> with:
 *   - Force-directed layout (repulsion + spring + gravity + damping)
 *   - Perspective projection with orbit rotation
 *   - Mouse drag to rotate, scroll to zoom
 *   - Click to inspect node info
 *   - Labels rendered as positioned HTML overlays
 *   - Glow / depth effects for visual depth
 *   - Color-coded nodes by category
 *
 * No external dependencies — pure Canvas 2D + requestAnimationFrame.
 * Works from file:// and http://.
 *
 * Usage:
 *   const viz = new Graph3D(canvasEl, { nodes, edges });
 *   viz.start();
 *   viz.stop();
 *   viz.setInteraction(true/false);
 */

(function (global) {
  'use strict';

  /**
   * Simple 3D vector math (inline, no allocation per frame).
   */
  function vec3(x, y, z) { return { x: x || 0, y: y || 0, z: z || 0 }; }
  function vec3Sub(a, b) { return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }; }
  function vec3Len(v) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
  function vec3Scale(v, s) { v.x *= s; v.y *= s; v.z *= s; return v; }

  /**
   * 3D rotation (Euler angles)
   */
  function rotateX(vec, angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const y = vec.y * c - vec.z * s;
    const z = vec.y * s + vec.z * c;
    vec.y = y; vec.z = z;
    return vec;
  }
  function rotateY(vec, angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const x = vec.x * c + vec.z * s;
    const z = -vec.x * s + vec.z * c;
    vec.x = x; vec.z = z;
    return vec;
  }

  /**
   * Helper: clamp
   */
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // ──── Constructor ────
  function Graph3D(canvas, options) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Graph3D requires a <canvas> element');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Clamp to DPR for crisp rendering
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = 0;
    this.height = 0;

    // Data
    this.nodes = (options && options.nodes) || [];
    this.edges = (options && options.edges) || [];

    // Physics state per node (added during init)
    this._vel = [];
    this._3dPos = [];

    // Derived
    this._nodeMap = {};     // id → index lookup
    this._adjacent = {};    // id → Set of neighbor ids

    // Camera / orbit
    this.rotX = -0.25;      // radians (elevation)
    this.rotY = 0;          // radians (yaw)
    this.zoom = 1.2;
    this._targetRotX = this.rotX;
    this._targetRotY = this.rotY;
    this._targetZoom = this.zoom;

    // Interaction
    this._isDragging = false;
    this._dragStartX = 0;
    this._dragStartY = 0;
    this._dragStartRotX = 0;
    this._dragStartRotY = 0;
    this._hoveredNodeIdx = -1;
    this._selectedNodeIdx = -1;
    this.interactionEnabled = true;

    // Animation
    this._running = false;
    this._frameId = null;
    this._lastTime = 0;
    this._settleTimer = 0;
    this._isSettled = false;

    // Info panel element
    this.infoPanel = null;

    // On-click callback
    this.onNodeClick = null;

    // Colors
    this.nodeRadius = 8;
    this.labelFont = '12px "Nunito Sans", system-ui, sans-serif';
    this.labelColor = '#ffffff';
    this.edgeColor = 'rgba(255,255,255,0.08)';
    this.edgeWidth = 1.2;

    // Background
    this.bgColor = 'transparent';

    // Callbacks
    this._onResize = this._handleResize.bind(this);

    // Init
    this._initGraph();
    this._resize();
    window.addEventListener('resize', this._onResize);
  }

  // ──── Prototype ────
  Graph3D.prototype = {
    constructor: Graph3D,

    // ──────── Initialization ────────
    _initGraph: function () {
      const n = this.nodes.length;

      // Build node index
      this._nodeMap = {};
      this.nodes.forEach(function (node, i) {
        if (node.id) this._nodeMap[node.id] = i;
      }, this);

      // Build adjacency
      this._adjacent = {};
      this.nodes.forEach(function (node) {
        this._adjacent[node.id] = new Set();
      }, this);
      this.edges.forEach(function (edge) {
        var s = this._nodeMap[edge.source];
        var t = this._nodeMap[edge.target];
        if (s !== undefined && t !== undefined) {
          this._adjacent[edge.source].add(edge.target);
          this._adjacent[edge.target].add(edge.source);
        }
      }, this);

      // Init 3D positions on a sphere (better initial layout)
      this._3dPos = new Array(n);
      this._vel = new Array(n);
      for (var i = 0; i < n; i++) {
        // Distribute on sphere using golden angle
        var theta = 2.39996 * i; // golden angle
        var phi = Math.acos(1 - 2 * (i + 0.5) / n);
        var r = 2.5 + Math.random() * 1.5;
        this._3dPos[i] = vec3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
        this._vel[i] = vec3(0, 0, 0);
      }
    },

    _resize: function () {
      var rect = this.canvas.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    },

    _handleResize: function () {
      this._resize();
    },

    // ──────── Lifecycle ────────
    start: function () {
      if (this._running) return;
      this._running = true;
      this._lastTime = performance.now();
      this._loop();
    },

    stop: function () {
      this._running = false;
      if (this._frameId) {
        cancelAnimationFrame(this._frameId);
        this._frameId = null;
      }
    },

    destroy: function () {
      this.stop();
      window.removeEventListener('resize', this._onResize);
      this._removeEventListeners();
      if (this.infoPanel) {
        this.infoPanel.remove();
        this.infoPanel = null;
      }
    },

    // ──────── Main Loop ────────
    _loop: function () {
      if (!this._running) return;
      var now = performance.now();
      var dt = Math.min((now - this._lastTime) / 1000, 0.05);
      this._lastTime = now;

      this._physicsTick(dt);
      this._render();

      this._frameId = requestAnimationFrame(this._loop.bind(this));
    },

    // ──────── Physics ────────
    _physicsTick: function (dt) {
      var n = this.nodes.length;
      var pos = this._3dPos;
      var vel = this._vel;
      var nodes = this.nodes;

      // Forces
      var repulsion = 18.0;
      var springK = 0.06;
      var gravity = 0.008;
      var damping = 0.92;
      var maxSpeed = 8.0;
      var minDist = 0.3;

      if (this._isSettled && this._settleTimer > 2.0) {
        // Gentle drift to keep alive
        for (var si = 0; si < n; si++) {
          vel[si].x *= 0.98;
          vel[si].y *= 0.98;
          vel[si].z *= 0.98;
          if (Math.abs(vel[si].x) < 0.0001 &&
              Math.abs(vel[si].y) < 0.0001 &&
              Math.abs(vel[si].z) < 0.0001) {
            // Add tiny random perturbation
            vel[si].x += (Math.random() - 0.5) * 0.002;
            vel[si].y += (Math.random() - 0.5) * 0.002;
          }
        }
        this._settleTimer += dt;
        return;
      }

      var totalKinetic = 0;

      // Repulsion (Coulomb: all pairs)
      for (var i = 0; i < n; i++) {
        for (var j = i + 1; j < n; j++) {
          var diff = vec3Sub(pos[i], pos[j]);
          var distSq = diff.x * diff.x + diff.y * diff.y + diff.z * diff.z;
          var dist = Math.sqrt(distSq) + minDist;
          var force = repulsion / (distSq + 0.1);
          var f = force / dist;
          vel[i].x += diff.x * f * dt;
          vel[i].y += diff.y * f * dt;
          vel[i].z += diff.z * f * dt;
          vel[j].x -= diff.x * f * dt;
          vel[j].y -= diff.y * f * dt;
          vel[j].z -= diff.z * f * dt;
        }
      }

      // Spring (edges: Hooke's law, rest length ~3)
      for (var ei = 0; ei < this.edges.length; ei++) {
        var edge = this.edges[ei];
        var si = this._nodeMap[edge.source];
        var ti = this._nodeMap[edge.target];
        if (si === undefined || ti === undefined) continue;
        var diff2 = vec3Sub(pos[si], pos[ti]);
        var dist2 = vec3Len(diff2);
        if (dist2 < 0.01) continue;
        var restLen = 3.0;
        var displacement = dist2 - restLen;
        var force2 = springK * displacement / dist2;
        vel[si].x -= diff2.x * force2 * dt;
        vel[si].y -= diff2.y * force2 * dt;
        vel[si].z -= diff2.z * force2 * dt;
        vel[ti].x += diff2.x * force2 * dt;
        vel[ti].y += diff2.y * force2 * dt;
        vel[ti].z += diff2.z * force2 * dt;
      }

      // Gravity (toward center)
      for (var gi = 0; gi < n; gi++) {
        vel[gi].x -= pos[gi].x * gravity * dt;
        vel[gi].y -= pos[gi].y * gravity * dt;
        vel[gi].z -= pos[gi].z * gravity * dt;
      }

      // Apply damping + integrate
      for (var ki = 0; ki < n; ki++) {
        vel[ki].x *= damping;
        vel[ki].y *= damping;
        vel[ki].z *= damping;

        // Clamp speed
        var spd = vec3Len(vel[ki]);
        if (spd > maxSpeed) {
          vec3Scale(vel[ki], maxSpeed / spd);
        }

        pos[ki].x += vel[ki].x * dt;
        pos[ki].y += vel[ki].y * dt;
        pos[ki].z += vel[ki].z * dt;

        totalKinetic += spd * spd;
      }

      // Check settled
      if (totalKinetic < 0.001 && this._settleTimer > 3.0) {
        this._isSettled = true;
      }
      this._settleTimer += dt * (totalKinetic < 0.01 ? 1 : -0.3);
      this._settleTimer = clamp(this._settleTimer, 0, 5);
    },

    // ──────── Rendering ────────
    _render: function () {
      var ctx = this.ctx;
      var w = this.width;
      var h = this.height;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Smooth camera transitions
      this.rotX += (this._targetRotX - this.rotX) * 0.08;
      this.rotY += (this._targetRotY - this.rotY) * 0.08;
      this.zoom += (this._targetZoom - this.zoom) * 0.1;

      var n = this.nodes.length;
      var pos = this._3dPos;
      var nodes = this.nodes;

      // Project all nodes to screen space, sort by Z for depth ordering
      var projected = [];
      var focal = 480 * this.zoom;

      for (var i = 0; i < n; i++) {
        var p = { x: pos[i].x, y: pos[i].y, z: pos[i].z };

        // Apply camera rotation
        rotateX(p, this.rotX);
        rotateY(p, this.rotY);

        // Perspective projection
        var zInv = focal / (focal + p.z + 4);
        var sx = p.x * zInv;
        var sy = -p.y * zInv;  // flip Y for screen coords

        projected.push({
          idx: i,
          sx: sx * w * 0.4 + w * 0.5,
          sy: sy * w * 0.4 + h * 0.5,
          z: p.z,
          depth: p.z + 4,      // for size/opacity calc
          zInv: zInv
        });
      }

      // Sort back-to-front (painter's algorithm)
      projected.sort(function (a, b) { return b.depth - a.depth; });

      // ──── Draw edges ────
      ctx.lineWidth = this.edgeWidth;
      for (var ei = 0; ei < this.edges.length; ei++) {
        var edge = this.edges[ei];
        var si = this._nodeMap[edge.source];
        var ti = this._nodeMap[edge.target];
        if (si === undefined || ti === undefined) continue;

        // We need the projected coords — find them from projected array
        var p1 = null, p2 = null;
        for (var pi = 0; pi < projected.length; pi++) {
          if (projected[pi].idx === si) p1 = projected[pi];
          if (projected[pi].idx === ti) p2 = projected[pi];
        }
        if (!p1 || !p2) continue;

        var alpha = clamp((p1.depth + p2.depth) / 12, 0.05, 0.5);
        var wAlpha = edge.weight ? edge.weight * 1.5 : 1;
        ctx.strokeStyle = 'rgba(255,255,255,' + (alpha * wAlpha) + ')';
        ctx.lineWidth = this.edgeWidth * (0.5 + alpha);
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();
      }

      // ──── Draw nodes ────
      for (var ni = 0; ni < projected.length; ni++) {
        var pp = projected[ni];
        var node = nodes[pp.idx];
        var depthFactor = clamp(pp.depth / 6, 0.3, 1.0);
        var r = this.nodeRadius * (0.5 + 0.5 * depthFactor);

        var color = node.color || '#58cc02';
        var isSelected = pp.idx === this._selectedNodeIdx;
        var isHovered = pp.idx === this._hoveredNodeIdx;

        // Outer glow (hover/selected)
        if (isSelected || isHovered) {
          ctx.shadowColor = color;
          ctx.shadowBlur = isSelected ? 30 : 20;
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(pp.sx, pp.sy, r, 0, Math.PI * 2);

        // Gradient for 3D look
        var grad = ctx.createRadialGradient(
          pp.sx - r * 0.3, pp.sy - r * 0.3, 0,
          pp.sx, pp.sy, r
        );
        grad.addColorStop(0, this._lightenColor(color, 40));
        grad.addColorStop(1, color);
        ctx.fillStyle = grad;
        ctx.fill();

        // White inner highlight
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(pp.sx - r * 0.15, pp.sy - r * 0.15, r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();

        // Border ring for hover/selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (isHovered) {
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, r + 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.shadowBlur = 0;

        // Emoji (if node has emoji property)
        if (node.emoji && depthFactor > 0.5) {
          ctx.font = (r * 1.2) + 'px system-ui';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.emoji, pp.sx, pp.sy + 1);
        }

        // Label
        if (node.label && depthFactor > 0.4) {
          var fontSize = Math.max(10, r * 1.2);
          ctx.font = 'bold ' + fontSize + 'px "Nunito Sans", system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          // Background pill for readability
          var textWidth = ctx.measureText(node.label).width;
          var pad = 6;
          var bx = pp.sx - textWidth / 2 - pad;
          var by = pp.sy + r + 4;
          var bw = textWidth + pad * 2;
          var bh = fontSize + pad * 2;

          ctx.fillStyle = 'rgba(0,0,0,0.65)';
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 4);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.fillText(node.label, pp.sx, by + pad);
        }
      }
    },

    // ──────── Color Helper ────────
    _lightenColor: function (hex, percent) {
      var num = parseInt(hex.replace('#', ''), 16);
      var r = Math.min(255, (num >> 16) + percent);
      var g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
      var b = Math.min(255, (num & 0x0000FF) + percent);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    },

    // ──────── Events ────────
    _addEventListeners: function () {
      this._onPointerDown = this._handlePointerDown.bind(this);
      this._onPointerMove = this._handlePointerMove.bind(this);
      this._onPointerUp = this._handlePointerUp.bind(this);
      this._onWheel = this._handleWheel.bind(this);

      this.canvas.addEventListener('pointerdown', this._onPointerDown);
      this.canvas.addEventListener('pointermove', this._onPointerMove);
      this.canvas.addEventListener('pointerup', this._onPointerUp);
      this.canvas.addEventListener('pointerleave', this._onPointerUp);
      this.canvas.addEventListener('wheel', this._onWheel, { passive: false });
    },

    _removeEventListeners: function () {
      if (this._onPointerDown) {
        this.canvas.removeEventListener('pointerdown', this._onPointerDown);
        this.canvas.removeEventListener('pointermove', this._onPointerMove);
        this.canvas.removeEventListener('pointerup', this._onPointerUp);
        this.canvas.removeEventListener('pointerleave', this._onPointerUp);
        this.canvas.removeEventListener('wheel', this._onWheel);
      }
    },

    setInteraction: function (enabled) {
      this.interactionEnabled = enabled;
      if (enabled) {
        this._addEventListeners();
      } else {
        this._removeEventListeners();
      }
    },

    _handlePointerDown: function (e) {
      if (!this.interactionEnabled) return;
      this._isDragging = true;
      this._dragStartX = e.clientX;
      this._dragStartY = e.clientY;
      this._dragStartRotX = this._targetRotX;
      this._dragStartRotY = this._targetRotY;
      this.canvas.setPointerCapture(e.pointerId);
    },

    _handlePointerMove: function (e) {
      if (!this.interactionEnabled) return;

      if (this._isDragging) {
        var dx = (e.clientX - this._dragStartX) * 0.008;
        var dy = (e.clientY - this._dragStartY) * 0.008;
        this._targetRotY = this._dragStartRotY + dx;
        this._targetRotX = clamp(this._dragStartRotX + dy, -1.2, 1.2);
        return;
      }

      // Hover detection
      this._hoveredNodeIdx = this._hitTest(e);
      this.canvas.style.cursor = this._hoveredNodeIdx >= 0 ? 'pointer' : 'default';
    },

    _handlePointerUp: function (e) {
      if (!this.interactionEnabled) return;

      // Detect click (no significant drag)
      if (this._isDragging) {
        var dx = Math.abs(e.clientX - this._dragStartX);
        var dy = Math.abs(e.clientY - this._dragStartY);
        if (dx < 5 && dy < 5) {
          var idx = this._hitTest(e);
          if (idx >= 0) {
            this._selectedNodeIdx = idx;
            this._showNodeInfo(idx);
            if (this.onNodeClick) this.onNodeClick(this.nodes[idx]);
          } else {
            this._selectedNodeIdx = -1;
            this._hideNodeInfo();
          }
        }
      }

      this._isDragging = false;
      try { this.canvas.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    },

    _handleWheel: function (e) {
      if (!this.interactionEnabled) return;
      e.preventDefault();
      var delta = e.deltaY > 0 ? -0.1 : 0.1;
      this._targetZoom = clamp(this._targetZoom + delta, 0.3, 3.0);
    },

    _hitTest: function (e) {
      var rect = this.canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;

      // Re-project all nodes
      var bestIdx = -1;
      var bestDist = 20; // hit radius
      var w = this.width;
      var h = this.height;
      var focal = 480 * this.zoom;

      for (var i = 0; i < this.nodes.length; i++) {
        var p = { x: this._3dPos[i].x, y: this._3dPos[i].y, z: this._3dPos[i].z };
        rotateX(p, this.rotX);
        rotateY(p, this.rotY);
        var zInv = focal / (focal + p.z + 4);
        var sx = p.x * zInv * w * 0.4 + w * 0.5;
        var sy = -p.y * zInv * w * 0.4 + h * 0.5;

        var depthFactor = clamp((p.z + 4) / 6, 0.3, 1.0);
        var r = this.nodeRadius * (0.5 + 0.5 * depthFactor) + 4; // extra padding

        var dx = mx - sx;
        var dy = my - sy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < r && dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }
      return bestIdx;
    },

    // ──────── Info Panel ────────
    _showNodeInfo: function (idx) {
      var node = this.nodes[idx];
      if (!node) return;
      if (!this.infoPanel) {
        this.infoPanel = document.createElement('div');
        this.infoPanel.className = 'graph3d-info-panel';
        this.infoPanel.style.cssText =
          'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);' +
          'background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);' +
          'color:#fff;padding:16px 24px;border-radius:16px;' +
          'font-family:"Nunito Sans",system-ui,sans-serif;' +
          'max-width:400px;text-align:center;z-index:9999;' +
          'border:1px solid rgba(255,255,255,0.1);' +
          'box-shadow:0 8px 32px rgba(0,0,0,0.4);' +
          'animation:graphFadeIn 0.3s ease;';
        document.body.appendChild(this.infoPanel);
      }

      var color = node.color || '#58cc02';
      var infoHtml = '<div style="font-size:16px;font-weight:700;margin-bottom:4px;">';
      if (node.emoji) infoHtml += node.emoji + ' ';
      infoHtml += node.label + '</div>';
      if (node.description) {
        infoHtml += '<div style="font-size:13px;opacity:0.8;line-height:1.4;">' +
          node.description + '</div>';
      }
      infoHtml += '<div style="font-size:11px;margin-top:6px;opacity:0.5;">Category: ' +
        (node.category || 'general') + ' &nbsp;·&nbsp; Tap to close</div>';
      this.infoPanel.innerHTML = infoHtml;
      this.infoPanel.style.display = 'block';
      this.infoPanel.onclick = function () { this._hideNodeInfo(); }.bind(this);
    },

    _hideNodeInfo: function () {
      if (this.infoPanel) {
        this.infoPanel.style.display = 'none';
      }
    },

    // ──────── Data Update ────────
    setData: function (nodes, edges) {
      this.nodes = nodes || [];
      this.edges = edges || [];
      this._initGraph();
      this._isSettled = false;
      this._settleTimer = 0;
      this._selectedNodeIdx = -1;
      this._hoveredNodeIdx = -1;
      this._hideNodeInfo();
    }
  };

  // ──── roundRect polyfill for Canvas ────
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (r > w / 2) r = w / 2;
      if (r > h / 2) r = h / 2;
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      this.quadraticCurveTo(x, y, x + r, y);
      return this;
    };
  }

  // Inject keyframe animation
  (function () {
    var style = document.createElement('style');
    style.textContent =
      '@keyframes graphFadeIn {' +
      'from{opacity:0;transform:translateX(-50%) translateY(10px)}' +
      'to{opacity:1;transform:translateX(-50%) translateY(0)}' +
      '}';
    document.head.appendChild(style);
  })();

  // Export
  global.Graph3D = Graph3D;

})(window);
