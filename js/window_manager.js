/**
 * MacBook Neo Window Manager
 * Handles window creation, dragging, focus, minimize, maximize, and app lifecycle.
 */
class WindowManager {
  constructor() {
    this.windows = {};
    this.activeWindow = null;
    this.highestZ = 3000;
    this.container = null;
  }

  init() {
    this.container = document.getElementById("desktop-windows-container");
  }

  registerWindow(id, title, contentHtml, options = {}) {
    const defaultOptions = {
      width: 580,
      height: 420,
      x: 290 + Object.keys(this.windows).length * 20,
      y: 40 + Object.keys(this.windows).length * 18,
      minWidth: 320,
      minHeight: 240,
      className: '',
      onOpen: null,
      onClose: null
    };

    const config = Object.assign({}, defaultOptions, options);
    this.windows[id] = {
      id,
      title,
      contentHtml,
      config,
      el: null,
      isOpen: false,
      isMaximized: false,
      prevBounds: null
    };
  }

  openWindow(id) {
    let win = this.windows[id];
    if (!win) return;

    if (!win.el) {
      this.createWindowElement(win);
    }

    win.el.style.display = "flex";
    win.isOpen = true;
    this.bringToFront(win);

    // Call opening hook
    if (win.config.onOpen) {
      win.config.onOpen(win);
    }

    // Trigger Finder Guy contextual speech
    if (window.lilFinderGuy) {
      window.lilFinderGuy.onAppOpened(id);
    }

    if (window.neoAudio) {
      window.neoAudio.playPop();
    }

    this.updateDockIndicators();
  }

  closeWindow(id) {
    const win = this.windows[id];
    if (!win || !win.el) return;

    win.el.style.display = "none";
    win.isOpen = false;

    if (win.config.onClose) {
      win.config.onClose(win);
    }

    if (window.neoAudio) {
      window.neoAudio.playPop();
    }

    this.updateDockIndicators();
  }

  bringToFront(win) {
    this.highestZ += 2;
    if (win.el) {
      win.el.style.zIndex = this.highestZ;
      document.querySelectorAll(".neo-window").forEach(w => w.classList.remove("active"));
      win.el.classList.add("active");
    }
    this.activeWindow = win;
  }

  toggleMaximize(win) {
    if (!win.el) return;
    if (win.isMaximized) {
      // Restore
      win.el.style.left = win.prevBounds.left;
      win.el.style.top = win.prevBounds.top;
      win.el.style.width = win.prevBounds.width;
      win.el.style.height = win.prevBounds.height;
      win.el.classList.remove("maximized");
      win.isMaximized = false;
    } else {
      // Maximize
      win.prevBounds = {
        left: win.el.style.left,
        top: win.el.style.top,
        width: win.el.style.width,
        height: win.el.style.height
      };
      win.el.style.left = "12px";
      win.el.style.top = "38px";
      win.el.style.width = "calc(100% - 24px)";
      win.el.style.height = "calc(100% - 110px)";
      win.el.classList.add("maximized");
      win.isMaximized = true;
    }
    if (window.neoAudio) window.neoAudio.playPop();
  }

  createWindowElement(win) {
    const el = document.createElement("div");
    el.className = `neo-window ${win.config.className || ''}`;
    el.id = `window-${win.id}`;
    el.style.width = `${win.config.width}px`;
    el.style.height = `${win.config.height}px`;
    el.style.left = `${win.config.x}px`;
    el.style.top = `${win.config.y}px`;

    el.innerHTML = `
      <div class="window-titlebar">
        <div class="window-controls">
          <button class="win-btn close" title="닫기"></button>
          <button class="win-btn minimize" title="최소화"></button>
          <button class="win-btn maximize" title="확대/축소"></button>
        </div>
        <div class="window-title">${win.title}</div>
        <div class="window-spacer"></div>
      </div>
      <div class="window-body">
        ${win.contentHtml}
      </div>
    `;

    // Hook buttons
    el.querySelector(".win-btn.close").addEventListener("click", () => this.closeWindow(win.id));
    el.querySelector(".win-btn.minimize").addEventListener("click", () => this.closeWindow(win.id));
    el.querySelector(".win-btn.maximize").addEventListener("click", () => this.toggleMaximize(win));

    // Focus on click
    el.addEventListener("mousedown", () => this.bringToFront(win));

    // Enable dragging
    const titlebar = el.querySelector(".window-titlebar");
    this.makeDraggable(el, titlebar, win);

    this.container.appendChild(el);
    win.el = el;
  }

  makeDraggable(el, handle, win) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let origX = 0, origY = 0;

    handle.addEventListener("mousedown", (e) => {
      if (e.target.closest(".window-controls")) return;
      if (win.isMaximized) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = el.offsetLeft;
      origY = el.offsetTop;

      this.bringToFront(win);

      const onMouseMove = (moveEvt) => {
        if (!isDragging) return;
        const dx = moveEvt.clientX - startX;
        const dy = moveEvt.clientY - startY;

        let newX = origX + dx;
        let newY = origY + dy;

        // Boundaries
        newY = Math.max(30, newY); // don't go above top menu bar
        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
  }

  updateDockIndicators() {
    Object.keys(this.windows).forEach(id => {
      const dot = document.querySelector(`.dock-item[data-app="${id}"] .dock-dot`);
      if (dot) {
        dot.style.opacity = this.windows[id].isOpen ? "1" : "0";
      }
    });
  }
}

window.windowManager = new WindowManager();
