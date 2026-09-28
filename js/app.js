/**
 * MacBook Neo Simulator Main Logic
 * Theme manager, dock animations, widgets, and app registrations.
 */

const NEO_THEMES = {
  blush: {
    id: 'blush',
    name: 'Blush (블러쉬)',
    englishName: 'Blush',
    subtitle: '화사하고 사랑스러운 파스텔 핑크 & 마젠타',
    colorHex: '#f43f5e',
    accentColor: '#fb7185',
    chassisColor: '#f1cfd8',
    keyboardDeck: '#f8dbe3',
    wallpaper: 'assets/wallpaper_blush_official.jpg',
    wallpaperClean: 'assets/wallpaper_blush_official.jpg',
    previewImg: 'assets/neo_laptop_blush.png',
    glowColor: 'rgba(244, 63, 94, 0.4)'
  },
  silver: {
    id: 'silver',
    name: 'Silver (실버 / 라벤더)',
    englishName: 'Silver',
    subtitle: '모던한 알루미늄에 은은한 라벤더 바이올렛 틴트',
    colorHex: '#8b5cf6',
    accentColor: '#a78bfa',
    chassisColor: '#d6d8e2',
    keyboardDeck: '#e4e6f0',
    wallpaper: 'assets/wallpaper_silver_official.jpg',
    wallpaperClean: 'assets/wallpaper_silver_official.jpg',
    previewImg: 'assets/neo_laptop_silver.png',
    glowColor: 'rgba(139, 92, 246, 0.4)'
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo (인디고)',
    englishName: 'Indigo',
    subtitle: '깊고 세련된 미드나잇 인디고 블루 & 네온 사이언',
    colorHex: '#2563eb',
    accentColor: '#38bdf8',
    chassisColor: '#28364f',
    keyboardDeck: '#1e293b',
    wallpaper: 'assets/wallpaper_indigo_official.jpg',
    wallpaperClean: 'assets/wallpaper_indigo_official.jpg',
    previewImg: 'assets/neo_laptop_indigo.png',
    glowColor: 'rgba(37, 99, 235, 0.45)'
  },
  citrus: {
    id: 'citrus',
    name: 'Citrus (시트러스)',
    englishName: 'Citrus',
    subtitle: '상큼하고 경쾌한 라임 그린 & 옐로우 골드',
    colorHex: '#84cc16',
    accentColor: '#eab308',
    chassisColor: '#d2e8b0',
    keyboardDeck: '#e1f4c5',
    wallpaper: 'assets/wallpaper_citrus_official.jpg',
    wallpaperClean: 'assets/wallpaper_citrus_official.jpg',
    previewImg: 'assets/neo_laptop_citrus.png',
    glowColor: 'rgba(132, 204, 22, 0.4)'
  }
};

class MacBookNeoApp {
  constructor() {
    this.currentTheme = 'blush';
    this.useCleanWallpaper = false;
    this.isLaptopFrameMode = true;
    this.isDarkMode = false;
    this.isSpotlightOpen = false;
    this.isControlCenterOpen = false;
    this.initKeynote();
  }

  init() {
    this.bindDOM();
    this.registerApplications();
    this.setupDockMagnification();
    this.setupClock();
    this.setupDesktopIcons();
    this.setupKeyboardShortcuts();

    // Initialize Lil' Finder Guy
    if (window.lilFinderGuy) {
      window.lilFinderGuy.init();
    }

    // Initialize window manager
    if (window.windowManager) {
      window.windowManager.init();
    }

    // Apply default theme variables
    this.applyTheme('blush', false);
  }

  bindDOM() {
    // Apple Logo Menu Button - Directly opens About This Mac without obstructive popup
    const appleMenuBtn = document.getElementById("apple-menu-btn");
    if (appleMenuBtn) {
      appleMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.windowManager.openWindow('about');
        if (window.neoAudio) window.neoAudio.playPop();
      });
    }

    // Control Center
    const ccBtn = document.getElementById("control-center-btn");
    const ccPanel = document.getElementById("control-center-panel");
    if (ccBtn && ccPanel) {
      ccBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.isControlCenterOpen = !this.isControlCenterOpen;
        ccPanel.classList.toggle("hidden", !this.isControlCenterOpen);
        if (window.neoAudio) window.neoAudio.playPop();
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest("#control-center-panel") && !e.target.closest("#control-center-btn")) {
          this.isControlCenterOpen = false;
          ccPanel.classList.add("hidden");
        }
      });
    }

    // Spotlight
    const spotBtn = document.getElementById("spotlight-btn");
    const spotPanel = document.getElementById("spotlight-modal");
    if (spotBtn && spotPanel) {
      spotBtn.addEventListener("click", () => this.toggleSpotlight());
      const spotInput = document.getElementById("spotlight-input");
      if (spotInput) {
        spotInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            this.handleSpotlightSearch(spotInput.value);
          } else if (e.key === "Escape") {
            this.toggleSpotlight(false);
          }
        });
      }
    }

    // View Mode Toggle handled via onclick="window.neoApp.toggleFrameMode()" in HTML

    // Wallpaper Switcher (Quick palette button)
    const quickThemeBtn = document.getElementById("quick-theme-btn");
    if (quickThemeBtn) {
      quickThemeBtn.addEventListener("click", () => this.openColorPicker());
    }

    // Setup modal action buttons
    document.querySelectorAll(".color-option-card").forEach(card => {
      card.addEventListener("click", () => {
        const themeId = card.getAttribute("data-theme");
        this.selectColorInModal(themeId);
      });
    });

    const startBtn = document.getElementById("start-simulator-btn");
    if (startBtn) {
      startBtn.addEventListener("click", () => this.startSimulator());
    }
  }

  selectColorInModal(themeId) {
    document.querySelectorAll(".color-option-card").forEach(c => {
      c.classList.toggle("selected", c.getAttribute("data-theme") === themeId);
    });
    this.currentTheme = themeId;
    const theme = NEO_THEMES[themeId];
    if (theme) {
      document.documentElement.style.setProperty("--theme-primary", theme.colorHex);
      document.documentElement.style.setProperty("--theme-accent", theme.accentColor);
      document.documentElement.style.setProperty("--theme-chassis", theme.chassisColor);
      document.documentElement.style.setProperty("--theme-deck", theme.keyboardDeck);
      document.documentElement.style.setProperty("--theme-glow", theme.glowColor);
    }
    if (window.neoAudio) window.neoAudio.playPop();
  }

  startSimulator() {
    const setupModal = document.getElementById("neo-setup-modal");
    if (setupModal) {
      setupModal.classList.add("fade-out");
      setTimeout(() => setupModal.style.display = "none", 500);
    }

    // Play startup chime
    if (window.neoAudio) {
      window.neoAudio.playStartupChime();
    }

    // Apply chosen theme
    this.applyTheme(this.currentTheme, true);

    // Initial greeting from Lil' Finder Guy
    setTimeout(() => {
      if (window.lilFinderGuy) {
        const theme = NEO_THEMES[this.currentTheme];
        window.lilFinderGuy.speak(
          `안녕! 나는 맥북 네오의 마스코트, 리틀 파인더 가이야! ✨\n네가 고른 [${theme.name}] 컬러의 맥북 네오로 시작되었어!\n아래 독(Dock)이나 메뉴바를 눌러보며 자유롭게 체험해봐!`,
          [
            {
              label: "맥북 네오 알아보기 💻",
              primary: true,
              onClick: () => window.windowManager.openWindow('safari')
            },
            {
              label: "스펙 확인하기 🍎",
              primary: false,
              onClick: () => window.windowManager.openWindow('about')
            }
          ]
        );
      }
    }, 1200);
  }

  applyTheme(themeId, notifyGuide = true) {
    const theme = NEO_THEMES[themeId] || NEO_THEMES.blush;
    this.currentTheme = themeId;

    document.documentElement.style.setProperty("--theme-accent", theme.accentColor);
    document.documentElement.style.setProperty("--theme-primary", theme.colorHex);
    document.documentElement.style.setProperty("--theme-chassis", theme.chassisColor);
    document.documentElement.style.setProperty("--theme-deck", theme.keyboardDeck);
    document.documentElement.style.setProperty("--theme-glow", theme.glowColor);

    // Update top bar badge
    const badge = document.getElementById("current-color-badge");
    if (badge) {
      badge.textContent = theme.englishName;
      badge.style.background = theme.colorHex;
    }

    // Update wallpaper background
    const bgUrl = this.useCleanWallpaper ? theme.wallpaperClean : theme.wallpaper;
    const desktopBg = document.getElementById("macbook-screen");
    if (desktopBg) {
      desktopBg.style.backgroundImage = `url('${bgUrl}')`;
    }

    // Update active state in Settings if open
    document.querySelectorAll(".settings-color-chip").forEach(chip => {
      const isSelected = chip.getAttribute("data-theme") === themeId;
      chip.classList.toggle("active", isSelected);
      const checkEl = chip.querySelector(".chip-check");
      if (checkEl) {
        checkEl.style.display = isSelected ? "flex" : "none";
      }
    });

    if (notifyGuide && window.lilFinderGuy) {
      window.lilFinderGuy.onColorChanged(themeId, theme);
    }
  }

  openColorPicker() {
    if (window.windowManager) {
      window.windowManager.openWindow('settings');
    }
  }

  toggleSpotlight(show) {
    const spot = document.getElementById("spotlight-modal");
    if (!spot) return;
    this.isSpotlightOpen = typeof show === 'boolean' ? show : !this.isSpotlightOpen;
    spot.classList.toggle("hidden", !this.isSpotlightOpen);
    if (this.isSpotlightOpen) {
      const input = document.getElementById("spotlight-input");
      if (input) {
        input.value = "";
        input.focus();
      }
      if (window.neoAudio) window.neoAudio.playPop();
    }
  }

  handleSpotlightSearch(query) {
    if (!query) return;
    const q = query.toLowerCase().trim();
    this.toggleSpotlight(false);

    if (q.includes("사파리") || q.includes("safari") || q.includes("인터넷") || q.includes("웹")) {
      window.windowManager.openWindow('safari');
    } else if (q.includes("설정") || q.includes("settings") || q.includes("환경설정") || q.includes("컬러") || q.includes("색")) {
      window.windowManager.openWindow('settings');
    } else if (q.includes("사진") || q.includes("photo") || q.includes("갤러리")) {
      window.windowManager.openWindow('photos');
    } else if (q.includes("키노트") || q.includes("keynote") || q.includes("발표") || q.includes("슬라이드")) {
      window.windowManager.openWindow('keynote');
    } else if (q.includes("페이지스") || q.includes("pages") || q.includes("문서") || q.includes("기획")) {
      window.windowManager.openWindow('pages');
    } else if (q.includes("넘버스") || q.includes("numbers") || q.includes("스프레드시트") || q.includes("엑셀")) {
      window.windowManager.openWindow('numbers');
    } else if (q.includes("음악") || q.includes("music") || q.includes("노래") || q.includes("bgm")) {
      window.windowManager.openWindow('music');
    } else if (q.includes("계산") || q.includes("calc")) {
      window.windowManager.openWindow('calculator');
    } else if (q.includes("메모") || q.includes("note")) {
      window.windowManager.openWindow('notes');
    } else if (q.includes("파인더") || q.includes("finder") || q.includes("파일") || q.includes("폴더")) {
      window.windowManager.openWindow('finder');
    } else if (q.includes("스펙") || q.includes("mac") || q.includes("a18")) {
      window.windowManager.openWindow('about');
    } else {
      // General question to Lil Finder Guy
      if (window.lilFinderGuy) {
        window.lilFinderGuy.speak(`'${query}'에 대해 검색했구나!\n맥북 네오의 사파리(Safari) 브라우저에서 더 자세한 정보를 찾아볼까?`, [
          {
            label: "Safari 열기 🌐",
            primary: true,
            onClick: () => window.windowManager.openWindow('safari')
          }
        ]);
      }
    }
  }

  setupClock() {
    const timeEl = document.getElementById("menubar-time");
    const updateTime = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const dayName = days[now.getDay()];

      let hours = now.getHours();
      const ampm = hours >= 12 ? "오후" : "오전";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");

      if (timeEl) {
        timeEl.textContent = `${month}월 ${date}일 (${dayName}) ${ampm} ${hours}:${minutes}`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  setupDockMagnification() {
    const dock = document.getElementById("dock");
    if (!dock) return;

    const items = dock.querySelectorAll(".dock-item");

    items.forEach(item => {
      item.addEventListener("mouseenter", () => {
        if (window.neoAudio) window.neoAudio.playHover();
      });

      item.addEventListener("click", () => {
        const appId = item.getAttribute("data-app");
        if (appId) {
          if (appId === "trash") {
            this.handleTrashClick();
          } else {
            window.windowManager.openWindow(appId);
          }
        }
      });
    });
  }

  setupDesktopIcons() {
    document.querySelectorAll(".desktop-file-icon").forEach(icon => {
      icon.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".desktop-file-icon").forEach(i => i.classList.remove("selected"));
        icon.classList.add("selected");
        if (window.neoAudio) window.neoAudio.playPop();
      });

      icon.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        const title = icon.getAttribute("data-title") || "파일 미리보기";
        const type = icon.getAttribute("data-type");

        if (window.neoAudio) window.neoAudio.playPop();

        if (type === "photo") {
          window.neoApp.viewFullImage('assets/neo_lid_blush.png', '맥북 네오 4컬러 실물 3D 렌더');
        } else if (type === "guide-photo") {
          window.neoApp.viewFullImage('assets/finder_guy.png', '리틀 파인더 가이 공식 3D 렌더');
        } else if (type === "screenshot") {
          window.neoApp.openScreenshotPreview();
        } else if (type === "video") {
          window.neoApp.openQuickTimeVideo();
        } else if (type === "benchmark") {
          window.neoApp.openBenchmarkReport();
        } else if (type === "pages") {
          window.windowManager.openWindow('pages');
        } else {
          window.finderApp.openTextPreview(title, "MacBook Neo 사용자 보관 파일입니다.");
        }
      });
    });

    document.getElementById("desktop-area")?.addEventListener("click", (e) => {
      if (!e.target.closest(".desktop-file-icon")) {
        document.querySelectorAll(".desktop-file-icon").forEach(i => i.classList.remove("selected"));
      }
    });

    // Make Desktop Widgets interactive
    const weatherWidget = document.getElementById("widget-weather");
    if (weatherWidget) {
      weatherWidget.addEventListener("click", () => {
        if (window.lilFinderGuy) {
          window.lilFinderGuy.speak("오늘 서울의 날씨는 24° 대체로 맑음이야! ☀️\n맥북 네오를 카페 야외 테라스에 들고 나가서 작업하기 딱 좋은 날씨지?");
        }
      });
    }

    const calendarWidget = document.getElementById("widget-calendar");
    if (calendarWidget) {
      calendarWidget.addEventListener("click", () => {
        if (window.lilFinderGuy) {
          window.lilFinderGuy.speak("오늘 일정: '맥북 네오 시뮬레이터 신나게 체험하기'가 등록되어 있어! 📅");
        }
      });
    }

    // Setup Random Photo Widget (Copyright-free aesthetic landscapes & art)
    this.randomPhotos = [
      { url: 'assets/photo_sunset.jpg', title: '타호의 노을빛 산맥' },
      { url: 'assets/photo_ocean.jpg', title: '에메랄드빛 태평양 파도' },
      { url: 'assets/photo_aurora.jpg', title: '신비로운 밤하늘 오로라' },
      { url: 'assets/photo_botanical.jpg', title: '미니멀 보태니컬 햇살' },
      { url: 'assets/photo_neo_art.jpg', title: '네오 3D 젤리 스피어 아트' }
    ];
    this.currentPhotoIdx = Math.floor(Math.random() * this.randomPhotos.length);
    this.updatePhotoWidget(false);

    // Auto rotate every 18 seconds
    setInterval(() => this.nextRandomPhoto(false), 18000);

    const photoWidget = document.getElementById("widget-photo");
    if (photoWidget) {
      photoWidget.addEventListener("click", () => {
        this.nextRandomPhoto(true);
      });
    }
  }

  nextRandomPhoto(byUser = true) {
    this.currentPhotoIdx = (this.currentPhotoIdx + 1) % this.randomPhotos.length;
    this.updatePhotoWidget(byUser);
  }

  updatePhotoWidget(byUser = false) {
    const photo = this.randomPhotos[this.currentPhotoIdx];
    const img = document.getElementById("widget-photo-img");
    if (img) {
      img.style.opacity = "0.2";
      img.style.transform = "scale(0.96)";
      setTimeout(() => {
        img.src = photo.url;
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
      }, 180);
    }
    if (byUser) {
      if (window.neoAudio) window.neoAudio.playPop();
      if (window.lilFinderGuy) {
        window.lilFinderGuy.speak(`포토 위젯 사진을 [${photo.title}]으로 변경했어! 📸✨\n클릭할 때마다 감성적인 풍경 사진들이 랜덤으로 바뀐단다!`, [
          {
            label: "사진 앱에서 전체보기 🖼️",
            primary: true,
            onClick: () => window.windowManager.openWindow('photos')
          },
          {
            label: "다른 사진 보기 ➡️",
            primary: false,
            onClick: () => this.nextRandomPhoto(true)
          }
        ]);
      }
    }
  }

  openScreenshotPreview() {
    const theme = NEO_THEMES[this.currentTheme] || NEO_THEMES.blush;
    const html = `
      <div style="height:100%; display:flex; flex-direction:column; background:#1e293b;">
        <div style="padding:8px 12px; background:rgba(0,0,0,0.4); display:flex; justify-content:space-between; align-items:center; color:#e2e8f0; font-size:12px;">
          <span>📸 스크린샷 2026-09-28 1.06.28.png (2560 × 1600)</span>
          <span style="color:#94a3b8;">미리보기 (Preview)</span>
        </div>
        <div style="flex:1; display:flex; justify-content:center; align-items:center; padding:12px; overflow:hidden;">
          <img src="${theme.wallpaper}" alt="Screenshot" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:6px; box-shadow:0 8px 24px rgba(0,0,0,0.5);" />
        </div>
      </div>
    `;
    window.windowManager.registerWindow("preview-shot", "스크린샷 미리보기", html, { width: 620, height: 410, x: 290, y: 22 });
    window.windowManager.openWindow("preview-shot");
  }

  openQuickTimeVideo() {
    const html = `
      <div style="height:100%; display:flex; flex-direction:column; background:#000; color:#fff;">
        <div style="flex:1; position:relative; display:flex; justify-content:center; align-items:center; overflow:hidden;">
          <img src="assets/photo_neo_art.jpg" alt="Video frame" style="max-width:100%; max-height:100%; object-fit:contain; opacity:0.85;" />
          <div style="position:absolute; width:60px; height:60px; border-radius:50%; background:rgba(255,255,255,0.25); backdrop-filter:blur(10px); display:flex; justify-content:center; align-items:center; cursor:pointer; font-size:22px; transition:transform 0.2s;" onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform='scale(1)'" onclick="alert('화면 기록 재생 중: MacBook Neo 3D Sphere 렌더링 애니메이션')">▶</div>
        </div>
        <div style="padding:10px 16px; background:#111827; display:flex; align-items:center; gap:12px; font-size:12px;">
          <button style="background:none; border:none; color:#fff; font-size:16px; cursor:pointer;">▶</button>
          <span style="color:#94a3b8; font-family:monospace;">00:05</span>
          <div style="flex:1; height:4px; background:#374151; border-radius:2px; position:relative; cursor:pointer;">
            <div style="width:25%; height:100%; background:var(--theme-primary, #3b82f6); border-radius:2px;"></div>
          </div>
          <span style="color:#94a3b8; font-family:monospace;">00:20</span>
          <span>🔊</span>
        </div>
      </div>
    `;
    window.windowManager.registerWindow("quicktime", "QuickTime Player - 화면 기록", html, { width: 520, height: 360, x: 310, y: 30 });
    window.windowManager.openWindow("quicktime");
  }

  openBenchmarkReport() {
    const html = `
      <div style="height:100%; display:flex; flex-direction:column; background:#fff; color:#1e293b; font-family:-apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="padding:10px 16px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; font-size:12px;">
          <strong>📄 A18 Pro 벤치마크 보고서.txt</strong>
          <span style="color:#64748b;">텍스트 편집기 • 2026. 9. 28</span>
        </div>
        <div style="flex:1; padding:20px; overflow-y:auto; font-size:13px; line-height:1.7;">
          <h2 style="font-size:16px; font-weight:700; margin-bottom:12px; color:#0f172a;">Apple A18 Pro 칩 성능 측정 결과</h2>
          <table style="width:100%; border-collapse:collapse; margin-bottom:16px; font-size:12px;">
            <tr style="background:#f1f5f9; border-bottom:1px solid #cbd5e1;">
              <th style="padding:6px 10px; text-align:left;">벤치마크 항목</th>
              <th style="padding:6px 10px; text-align:right;">MacBook Neo (A18 Pro)</th>
              <th style="padding:6px 10px; text-align:right;">비교 (M2 엔트리)</th>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:6px 10px;">Geekbench 6 싱글코어</td>
              <td style="padding:6px 10px; text-align:right; font-weight:700; color:#2563eb;">3,580 점</td>
              <td style="padding:6px 10px; text-align:right; color:#64748b;">2,590 점 (+38%)</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:6px 10px;">Geekbench 6 멀티코어</td>
              <td style="padding:6px 10px; text-align:right; font-weight:700; color:#2563eb;">9,210 점</td>
              <td style="padding:6px 10px; text-align:right; color:#64748b;">9,700 점 (-5%)</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:6px 10px;">4K 비디오 렌더링 시간</td>
              <td style="padding:6px 10px; text-align:right; font-weight:700; color:#16a34a;">1분 24초</td>
              <td style="padding:6px 10px; text-align:right; color:#64748b;">1분 58초 (1.4배 가속)</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:6px 10px;">풀로드 시 섀시 최고 온도</td>
              <td style="padding:6px 10px; text-align:right; font-weight:700; color:#16a34a;">37.4 ℃ (미온)</td>
              <td style="padding:6px 10px; text-align:right; color:#64748b;">42.8 ℃</td>
            </tr>
          </table>
          <p style="color:#475569; font-size:12px;"><strong>총평:</strong> A18 Pro는 웹 브라우징, 코딩, 문서 작업, 4K 동영상 재생 및 가벼운 사진 편집에서 플래그십 수준의 민첩성을 발휘하며 완전 무소음 팬리스로 장시간 쾌적함을 유지합니다.</p>
        </div>
      </div>
    `;
    window.windowManager.registerWindow("benchmark", "A18 Pro 벤치마크 보고서", html, { width: 520, height: 380, x: 300, y: 25 });
    window.windowManager.openWindow("benchmark");
  }

  initKeynote() {
    this.keynoteSlides = [
      {
        badge: "NEW GENERATION MAC",
        title: "MacBook Neo",
        subtitle: "모두를 위한 가장 활기찬 $599 Mac의 탄생",
        points: ["Apple A18 Pro 차세대 실리콘 탑재", "놀라운 초경량 알루미늄 바디 & 팬리스 무소음", "Blush, Citrus, Indigo, Silver 4종 시그니처 컬러"]
      },
      {
        badge: "PERFORMANCE & EFFICIENCY",
        title: "Apple A18 Pro SoC",
        subtitle: "동급 최고의 속도와 압도적인 에너지 효율",
        points: ["6코어 CPU & 5코어 GPU 하드웨어 가속", "최대 18시간 지속되는 올데이 배터리", "쿨링 팬이 필요 없는 완전 무소음 아키텍처"]
      },
      {
        badge: "CMF DESIGN & IDENTITY",
        title: "4가지 시그니처 컬러",
        subtitle: "개성을 표현하는 가장 생동감 넘치는 색채",
        points: ["외장 컬러와 완벽한 조화를 이루는 키보드 덱", "전용 3D 캡슐 'MAC' 월페이퍼 디자인", "리틀 파인더 가이의 직관적인 온보딩 가이드"]
      }
    ];
    this.currentKeynoteIndex = 0;
  }

  selectKeynoteSlide(index) {
    if (index >= 0 && index < this.keynoteSlides.length) {
      this.currentKeynoteIndex = index;
      this.renderKeynoteSlide();
      if (window.neoAudio) window.neoAudio.playPop();
    }
  }

  addKeynoteSlide() {
    const num = this.keynoteSlides.length + 1;
    this.keynoteSlides.push({
      badge: "NEW SLIDE",
      title: `새 슬라이드 ${num}`,
      subtitle: "발표 내용을 입력하세요",
      points: ["자유롭게 아이디어를 표현하세요", "Keynote 프레젠테이션 엔진"]
    });
    this.currentKeynoteIndex = this.keynoteSlides.length - 1;
    this.renderKeynoteSlide();
    if (window.neoAudio) window.neoAudio.playPop();
  }

  playKeynoteSlide() {
    if (window.lilFinderGuy) {
      window.lilFinderGuy.speak("Keynote 슬라이드쇼 재생을 시작했어! 📽️✨\n'MacBook Neo: 모두를 위한 $599의 혁신' 프레젠테이션이야!");
    }
    if (window.neoAudio) window.neoAudio.playPop();
  }

  renderKeynoteSlide() {
    const slide = this.keynoteSlides[this.currentKeynoteIndex];
    const canvas = document.getElementById("keynote-active-slide");
    if (canvas && slide) {
      canvas.innerHTML = `
        <div style="font-size: 11px; font-weight: 800; letter-spacing: 1px; color: var(--theme-accent, #38bdf8); margin-bottom: 8px;">
          ${slide.badge}
        </div>
        <h1 style="font-size: 26px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.5px; color: #fff;">
          ${slide.title}
        </h1>
        <p style="font-size: 13px; color: #94a3b8; margin-bottom: 20px;">
          ${slide.subtitle}
        </p>
        <ul style="padding-left: 20px; line-height: 1.8; font-size: 13px; color: #cbd5e1;">
          ${slide.points.map(p => `<li>${p}</li>`).join('')}
        </ul>
      `;
    }

    const strip = document.getElementById("keynote-slide-strip");
    if (strip) {
      strip.innerHTML = this.keynoteSlides.map((s, idx) => `
        <div class="slide-thumb-card ${idx === this.currentKeynoteIndex ? 'active' : ''}" onclick="window.neoApp.selectKeynoteSlide(${idx})">
          <strong style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:110px;">${idx + 1}. ${s.title}</strong>
          <span style="color:#64748b; font-size:9px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:110px;">${s.subtitle}</span>
        </div>
      `).join('');
    }
  }

  addNumbersRow() {
    const tbody = document.querySelector("#numbers-main-table tbody");
    if (tbody) {
      const rowCount = tbody.querySelectorAll("tr").length + 1;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="text-align: center; color: #64748b;">${rowCount}</td>
        <td><input type="text" value="MacBook Neo Plus" /></td>
        <td><input type="text" value="스페셜 에디션" /></td>
        <td><input type="text" value="Apple A18 Pro" /></td>
        <td><input type="text" value="512GB SSD" /></td>
        <td><input type="text" value="$649" style="font-weight:700; color:#16a34a;" /></td>
        <td><input type="text" value="₩990,000" /></td>
      `;
      tbody.appendChild(tr);
      if (window.neoAudio) window.neoAudio.playPop();
    }
  }

  handleTrashClick() {
    if (window.neoAudio) window.neoAudio.playPop();
    if (window.lilFinderGuy) {
      window.lilFinderGuy.speak("휴지통이 깨끗하게 비워져 있어! 🗑️✨ 맥북 네오의 저장공간이 넉넉해!");
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Cmd + Space or Ctrl + Space for Spotlight
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        this.toggleSpotlight();
      }
    });
  }

  registerApplications() {
    // 1. About This Mac
    const aboutHtml = `
      <div class="about-mac-view">
        <div class="about-hero-img">
          <img src="assets/neo_laptop_blush.png" id="about-laptop-img" alt="MacBook Neo" />
        </div>
        <div class="about-details">
          <h2>MacBook Neo</h2>
          <div class="about-sub">13형, 2026년형</div>
          <div class="spec-row"><span class="label">칩</span><span class="value">Apple A18 Pro (6코어 CPU, 5코어 GPU)</span></div>
          <div class="spec-row"><span class="label">메모리</span><span class="value">8GB 통합 메모리</span></div>
          <div class="spec-row"><span class="label">디스플레이</span><span class="value">13.0인치 Liquid Retina (2408 × 1506)</span></div>
          <div class="spec-row"><span class="label">저장 장치</span><span class="value">256GB 고속 SSD</span></div>
          <div class="spec-row"><span class="label">출시 가격</span><span class="value highlight">$599 (모두를 위한 혁신적 가격)</span></div>
          <div class="spec-row"><span class="label">운영체제</span><span class="value">macOS Tahoe 26.4</span></div>
          <div class="about-actions">
            <button class="neo-btn" onclick="window.windowManager.openWindow('safari')">상세 스펙 보기</button>
            <button class="neo-btn primary" onclick="window.neoApp.openColorPicker()">컬러 변경하기</button>
          </div>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('about', '이 Mac에 관하여', aboutHtml, {
      width: 500,
      height: 340,
      x: 295,
      y: 45,
      onOpen: () => {
        const img = document.getElementById("about-laptop-img");
        if (img) img.src = NEO_THEMES[this.currentTheme].previewImg;
      }
    });

    // 2. Settings (Full System Configuration)
    const settingsHtml = `
      <div class="settings-app-view">
        <div class="settings-sidebar">
          <div class="settings-tab active" data-tab="appearance">🎨 컬러 & 외형</div>
          <div class="settings-tab" data-tab="viewmode">🖥️ 체험 뷰 모드</div>
          <div class="settings-tab" data-tab="sound">🔊 사운드 & 효과음</div>
          <div class="settings-tab" data-tab="guide">🤖 리틀 파인더 가이</div>
          <div class="settings-tab" data-tab="about">ℹ️ 시스템 정보</div>
        </div>
        <div class="settings-content" id="settings-scroll-area">
          <div id="section-appearance">
            <h3>맥북 네오 시그니처 컬러</h3>
            <p class="desc">원하는 맥북 네오의 컬러를 클릭하면 전체 시스템 테마와 3D 캡슐 월페이퍼가 즉시 변경됩니다.</p>
            
            <div class="color-chips-grid">
              <div class="settings-color-chip" data-theme="blush">
                <div class="chip-circle" style="background: #f43f5e;"></div>
                <div class="chip-info">
                  <strong>Blush</strong>
                  <span>사랑스러운 베리 핑크</span>
                </div>
                <div class="chip-check">✓</div>
              </div>
              <div class="settings-color-chip" data-theme="silver">
                <div class="chip-circle" style="background: #8b5cf6;"></div>
                <div class="chip-info">
                  <strong>Silver</strong>
                  <span>은은한 라벤더 실버</span>
                </div>
                <div class="chip-check">✓</div>
              </div>
              <div class="settings-color-chip" data-theme="indigo">
                <div class="chip-circle" style="background: #2563eb;"></div>
                <div class="chip-info">
                  <strong>Indigo</strong>
                  <span>깊고 세련된 인디고 블루</span>
                </div>
                <div class="chip-check">✓</div>
              </div>
              <div class="settings-color-chip" data-theme="citrus">
                <div class="chip-circle" style="background: #84cc16;"></div>
                <div class="chip-info">
                  <strong>Citrus</strong>
                  <span>상큼하고 경쾌한 라임</span>
                </div>
                <div class="chip-check">✓</div>
              </div>
            </div>

            <div class="settings-divider"></div>

            <h3>다크 모드</h3>
            <div class="toggle-row" id="row-dark-mode">
              <div>
                <strong>다크 모드 적용</strong>
                <div style="font-size: 11px; color: #64748b; margin-top:2px;">메뉴바와 시스템 창을 어두운 테마로 전환합니다</div>
              </div>
              <input type="checkbox" id="dark-mode-toggle" class="apple-switch" />
            </div>
          </div>

          <div class="settings-divider"></div>

          <div id="section-viewmode">
            <h3>체험 뷰 모드</h3>
            <p class="desc">실제 노트북을 책상에 둔 것처럼 보거나, 화면을 가득 채운 전체화면으로 볼 수 있습니다.</p>
            <div class="view-mode-buttons">
              <button class="neo-btn" id="btn-mode-frame">💻 맥북 실물 하드웨어 프레임</button>
              <button class="neo-btn" id="btn-mode-full">⛶ 전체 화면 모니터 뷰</button>
            </div>
          </div>

          <div class="settings-divider"></div>

          <div id="section-sound">
            <h3>효과음 및 사운드</h3>
            <div class="toggle-row" id="row-sound-effect">
              <div>
                <strong>시스템 효과음 켜기</strong>
                <div style="font-size: 11px; color: #64748b; margin-top:2px;">클릭음 · 차임 · Lil' Finder Guy 효과음을 재생합니다</div>
              </div>
              <input type="checkbox" id="sound-effect-toggle" class="apple-switch" checked />
            </div>
          </div>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('settings', '시스템 설정', settingsHtml, {
      width: 580,
      height: 430,
      x: 290,
      y: 35,
      onOpen: (win) => this.syncSettingsUI(win.el)
    });

    // 3. Safari
    const safariHtml = `
      <div class="safari-app-view">
        <div class="safari-toolbar">
          <div class="nav-buttons">
            <button>◀</button>
            <button>▶</button>
          </div>
          <div class="address-bar">
            <span>🔒 apple.com/kr/macbook-neo</span>
          </div>
          <button class="share-btn">⎋</button>
        </div>
        <div class="safari-webpage">
          <div class="safari-hero">
            <div class="badge">완전히 새로운 Mac의 시작</div>
            <h1>MacBook Neo</h1>
            <p class="tagline">믿을 수 없는 $599. 모두를 위한 가장 생동감 넘치는 맥북.</p>
            <div class="hero-actions">
              <button class="safari-btn primary" onclick="window.neoApp.openColorPicker()">지금 컬러 고르기</button>
              <button class="safari-btn" onclick="window.windowManager.openWindow('photos')">실물 갤러리 감상</button>
            </div>
          </div>

          <div class="safari-section">
            <h2>💡 왜 맥북 네오인가요?</h2>
            <div class="feature-grid">
              <div class="feature-card">
                <div class="f-icon">⚡</div>
                <h4>Apple A18 Pro 칩</h4>
                <p>맥북 최초의 A-시리즈 실리콘 탑재! 일상적인 작업, 웹서핑, 4K 스트리밍을 놀랍도록 쾌적하고 차갑게 소화합니다.</p>
              </div>
              <div class="feature-card">
                <div class="f-icon">🎨</div>
                <h4>4가지 네오 컬러웨이</h4>
                <p>Blush, Indigo, Silver, Citrus. 알루미늄 외장과 일체감 있는 키보드 덱, 전용 3D 'MAC' 월페이퍼까지 완벽한 조화.</p>
              </div>
              <div class="feature-card">
                <div class="f-icon">🔋</div>
                <h4>올데이 배터리 & 팬리스</h4>
                <p>소음 없는 무소음 팬리스 설계와 하루 종일 지속되는 경이로운 전력 효율성.</p>
              </div>
              <div class="feature-card">
                <div class="f-icon">🤖</div>
                <h4>리틀 파인더 가이 (Lil' Finder Guy)</h4>
                <p>모든 맥북 네오 사용자를 위한 친절하고 귀여운 AI 가이드 마스코트 기본 탑재!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('safari', 'Safari - MacBook Neo', safariHtml, {
      width: 680,
      height: 380,
      x: 285,
      y: 22
    });

    // 4. Photos (Copyright-Free Aesthetic Landscapes & MacBook Neo Collection)
    const photosHtml = `
      <div class="photos-app-view">
        <div class="photos-sidebar">
          <div class="photo-cat active">🌄 감성 랜드스케이프</div>
          <div class="photo-cat">💻 맥북 네오 라인업</div>
          <div class="photo-cat">✨ 리틀 파인더 가이</div>
        </div>
        <div class="photos-grid">
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/photo_sunset.jpg', '타호의 노을빛 산맥')">
            <img src="assets/photo_sunset.jpg" alt="Sunset" />
            <span>타호의 노을빛 산맥</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/photo_ocean.jpg', '에메랄드빛 태평양 파도')">
            <img src="assets/photo_ocean.jpg" alt="Ocean" />
            <span>에메랄드빛 태평양 파도</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/photo_aurora.jpg', '신비로운 밤하늘 오로라')">
            <img src="assets/photo_aurora.jpg" alt="Aurora" />
            <span>신비로운 밤하늘 오로라</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/photo_botanical.jpg', '미니멀 보태니컬 햇살')">
            <img src="assets/photo_botanical.jpg" alt="Botanical" />
            <span>미니멀 보태니컬 햇살</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/photo_neo_art.jpg', '네오 3D 젤리 스피어')">
            <img src="assets/photo_neo_art.jpg" alt="Neo Art" />
            <span>네오 3D 젤리 스피어</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/finder_guy.png', '리틀 파인더 가이 공식 3D 렌더')">
            <img src="assets/finder_guy.png" alt="Finder Guy" />
            <span>리틀 파인더 가이 (Lil' Finder Guy)</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/neo_laptop_blush.png', '맥북 네오 3D 렌더')">
            <img src="assets/neo_laptop_blush.png" alt="Neo Render" />
            <span>맥북 네오 3D 렌더</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/neo_laptop_blush.png', 'Blush 실물 3D 렌더')">
            <img src="assets/neo_laptop_blush.png" alt="Blush" />
            <span>Blush 핑크 렌더</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/neo_laptop_silver.png', 'Silver 실물 3D 렌더')">
            <img src="assets/neo_laptop_silver.png" alt="Silver" />
            <span>Silver 라벤더 렌더</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/neo_laptop_indigo.png', 'Indigo 실물 3D 렌더')">
            <img src="assets/neo_laptop_indigo.png" alt="Indigo" />
            <span>Indigo 블루 렌더</span>
          </div>
          <div class="photo-item" onclick="window.neoApp.viewFullImage('assets/neo_laptop_citrus.png', 'Citrus 실물 3D 렌더')">
            <img src="assets/neo_laptop_citrus.png" alt="Citrus" />
            <span>Citrus 라임 렌더</span>
          </div>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('photos', '사진', photosHtml, { width: 680, height: 460 });

    // 5. Music
    const musicHtml = `
      <div class="music-app-view">
        <div class="album-art-wrap">
          <div class="album-glow"></div>
          <img src="assets/finder_guy.png" alt="Lil Finder Guy Beats" class="music-avatar" />
        </div>
        <div class="music-info">
          <h3>Lil' Finder Guy's Lofi Chill</h3>
          <p>Apple Neo Chill Synth • Web Audio Edition</p>
        </div>
        <div class="visualizer-bars">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="music-controls">
          <button class="music-btn play-toggle" id="music-play-btn" onclick="window.neoApp.toggleMusic()">▶ 재생</button>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('music', '음악', musicHtml, { width: 440, height: 400 });

    // 6. Calculator
    const calcHtml = `
      <div class="calc-view">
        <div class="calc-screen" id="calc-display">0</div>
        <div class="calc-buttons">
          <button class="c-btn op" onclick="window.neoApp.calcAction('clear')">AC</button>
          <button class="c-btn op" onclick="window.neoApp.calcAction('+/-')">±</button>
          <button class="c-btn op" onclick="window.neoApp.calcAction('%')">%</button>
          <button class="c-btn fn" onclick="window.neoApp.calcAction('/')">÷</button>

          <button class="c-btn num" onclick="window.neoApp.calcAction('7')">7</button>
          <button class="c-btn num" onclick="window.neoApp.calcAction('8')">8</button>
          <button class="c-btn num" onclick="window.neoApp.calcAction('9')">9</button>
          <button class="c-btn fn" onclick="window.neoApp.calcAction('*')">×</button>

          <button class="c-btn num" onclick="window.neoApp.calcAction('4')">4</button>
          <button class="c-btn num" onclick="window.neoApp.calcAction('5')">5</button>
          <button class="c-btn num" onclick="window.neoApp.calcAction('6')">6</button>
          <button class="c-btn fn" onclick="window.neoApp.calcAction('-')">−</button>

          <button class="c-btn num" onclick="window.neoApp.calcAction('1')">1</button>
          <button class="c-btn num" onclick="window.neoApp.calcAction('2')">2</button>
          <button class="c-btn num" onclick="window.neoApp.calcAction('3')">3</button>
          <button class="c-btn fn" onclick="window.neoApp.calcAction('+')">+</button>

          <button class="c-btn num zero" onclick="window.neoApp.calcAction('0')">0</button>
          <button class="c-btn num" onclick="window.neoApp.calcAction('.')">.</button>
          <button class="c-btn fn" onclick="window.neoApp.calcAction('=')">=</button>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('calculator', '계산기', calcHtml, { width: 280, height: 380 });

    // 7. Notes
    const notesHtml = `
      <div class="notes-app-view">
        <div class="notes-sidebar">
          <div class="note-item active">
            <strong>맥북 네오 체험기</strong>
            <span>첫인상: 색감이 너무 예쁘다...</span>
          </div>
          <div class="note-item">
            <strong>리틀 파인더 가이의 팁</strong>
            <span>알약 월페이퍼에 MAC 숨겨짐</span>
          </div>
        </div>
        <div class="notes-editor">
          <input type="text" class="notes-title-input" value="맥북 네오 체험기" />
          <textarea class="notes-body-input" placeholder="여기에 맥북 네오를 체험하며 느낀 생각을 적어보세요...">
맥북 네오 시뮬레이터를 사용해보는 중!
- 내가 고른 컬러: Blush / Indigo / Silver / Citrus
- A18 Pro 칩 기반의 초경량 가성비 Mac
- 리틀 파인더 가이가 실시간으로 팁을 알려줘서 귀엽고 유용함!
          </textarea>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('notes', '메모', notesHtml, { width: 560, height: 400 });

    // 8. Finder
    const finderHtml = `<div id="finder-app-root"></div>`;
    window.windowManager.registerWindow('finder', 'Finder', finderHtml, {
      width: 660,
      height: 410,
      x: 285,
      y: 22,
      onOpen: () => {
        if (window.finderApp) {
          window.finderApp.render();
        }
      }
    });

    // 9. Keynote
    const keynoteHtml = `
      <div class="iwork-app-view">
        <div class="iwork-toolbar">
          <button class="iwork-tool-btn primary" onclick="window.neoApp.playKeynoteSlide()">▶ 재생</button>
          <button class="iwork-tool-btn" onclick="window.neoApp.addKeynoteSlide()">+ 슬라이드 추가</button>
          <div style="flex:1;"></div>
          <button class="iwork-tool-btn" onclick="alert('iCloud에 프레젠테이션이 동기화되었습니다.')">☁️ 공유</button>
        </div>
        <div class="keynote-body">
          <div class="keynote-slide-strip" id="keynote-slide-strip"></div>
          <div class="keynote-canvas-area">
            <div class="keynote-main-slide" id="keynote-active-slide"></div>
          </div>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('keynote', 'Keynote - MacBook Neo 발표', keynoteHtml, {
      width: 660,
      height: 410,
      x: 285,
      y: 22,
      onOpen: () => this.renderKeynoteSlide()
    });

    // 10. Pages
    const pagesHtml = `
      <div class="iwork-app-view">
        <div class="iwork-toolbar">
          <button class="iwork-tool-btn" onclick="document.execCommand('bold',false,null)"><strong>B</strong></button>
          <button class="iwork-tool-btn" onclick="document.execCommand('italic',false,null)"><em>I</em></button>
          <button class="iwork-tool-btn" onclick="document.execCommand('underline',false,null)"><u>U</u></button>
          <div style="width:1px; height:18px; background:#cbd5e1; margin:0 4px;"></div>
          <select style="font-size:12px; border-radius:4px; border:1px solid #cbd5e1; padding:2px 6px;">
            <option>본문 (SF Pro)</option>
            <option>제목 1</option>
            <option>제목 2</option>
          </select>
          <div style="flex:1;"></div>
          <button class="iwork-tool-btn primary" onclick="alert('도큐멘트가 안전하게 저장되었습니다.')">저장</button>
        </div>
        <div class="pages-canvas-area">
          <div class="pages-paper" contenteditable="true" spellcheck="false">
            <h1 style="font-size: 20px; font-weight: 800; margin-bottom: 6px; color: #0f172a;">MacBook Neo 제품 기획서</h1>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
              작성일: 2026. 9. 28 | 작성자: Apple Product Marketing | 상태: 최종 승인
            </div>
            <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">1. 기획 의도 및 배경</h3>
            <p style="margin-bottom: 12px; line-height: 1.6; color:#334155;">
              MacBook Neo는 가격 문턱을 획기적으로 낮춘 $599 엔트리 랩탑입니다. 경쾌하고 활기찬 디자인을 기반으로 학생, 창작자, 첫 Mac 구매자에게 가장 매력적인 첫인상을 선사합니다.
            </p>
            <h3 style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">2. 핵심 사양 및 특징</h3>
            <ul style="padding-left: 20px; line-height: 1.6; margin-bottom: 14px; color:#334155;">
              <li><strong>A18 Pro SoC:</strong> 강력한 성능과 극강의 전력 효율로 팬 없는 무소음 환경 구현</li>
              <li><strong>시그니처 컬러 CMF:</strong> Blush, Citrus, Indigo, Silver 4종 알루미늄 피니시</li>
              <li><strong>올데이 18시간 배터리:</strong> 하루 종일 충전 걱정 없는 긴 사용 시간</li>
              <li><strong>인터랙티브 가이드:</strong> 초보자도 쉽게 적응할 수 있는 '리틀 파인더 가이' 내장</li>
            </ul>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">※ 직접 본문을 클릭하여 텍스트를 수정하거나 타이핑할 수 있습니다.</p>
          </div>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('pages', 'Pages - 맥북 네오 제품 기획서', pagesHtml, {
      width: 620,
      height: 410,
      x: 290,
      y: 22
    });

    // 11. Numbers
    const numbersHtml = `
      <div class="iwork-app-view">
        <div class="iwork-toolbar">
          <button class="iwork-tool-btn primary" onclick="window.neoApp.addNumbersRow()">+ 행 추가</button>
          <button class="iwork-tool-btn" onclick="alert('스프레드시트 차트가 생성되었습니다.')">📊 차트 생성</button>
          <div style="flex:1;"></div>
          <span style="font-size:12px; color:#475569; font-weight:600;">합계 수식: =SUM(E2:E5)</span>
        </div>
        <div class="numbers-canvas-area">
          <table class="numbers-grid-table" id="numbers-main-table">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">#</th>
                <th>모델명</th>
                <th>컬러</th>
                <th>프로세서</th>
                <th>스토리지</th>
                <th>미국 출고가</th>
                <th>국내 예상가</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center; color: #64748b;">1</td>
                <td><input type="text" value="MacBook Neo 13" /></td>
                <td><input type="text" value="Blush (핑크)" /></td>
                <td><input type="text" value="Apple A18 Pro" /></td>
                <td><input type="text" value="256GB SSD" /></td>
                <td><input type="text" value="$599" style="font-weight:700; color:#16a34a;" /></td>
                <td><input type="text" value="₩890,000" /></td>
              </tr>
              <tr>
                <td style="text-align: center; color: #64748b;">2</td>
                <td><input type="text" value="MacBook Neo 13" /></td>
                <td><input type="text" value="Citrus (라임)" /></td>
                <td><input type="text" value="Apple A18 Pro" /></td>
                <td><input type="text" value="256GB SSD" /></td>
                <td><input type="text" value="$599" style="font-weight:700; color:#16a34a;" /></td>
                <td><input type="text" value="₩890,000" /></td>
              </tr>
              <tr>
                <td style="text-align: center; color: #64748b;">3</td>
                <td><input type="text" value="MacBook Neo 13" /></td>
                <td><input type="text" value="Indigo (블루)" /></td>
                <td><input type="text" value="Apple A18 Pro" /></td>
                <td><input type="text" value="512GB SSD" /></td>
                <td><input type="text" value="$699" style="font-weight:700; color:#16a34a;" /></td>
                <td><input type="text" value="₩1,050,000" /></td>
              </tr>
              <tr>
                <td style="text-align: center; color: #64748b;">4</td>
                <td><input type="text" value="MacBook Neo 13" /></td>
                <td><input type="text" value="Silver (실버)" /></td>
                <td><input type="text" value="Apple A18 Pro" /></td>
                <td><input type="text" value="256GB SSD" /></td>
                <td><input type="text" value="$599" style="font-weight:700; color:#16a34a;" /></td>
                <td><input type="text" value="₩890,000" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
    window.windowManager.registerWindow('numbers', 'Numbers - 라인업 비교 및 가격표', numbersHtml, {
      width: 640,
      height: 390,
      x: 290,
      y: 22
    });
  }

  toggleCleanWallpaper(isClean) {
    this.useCleanWallpaper = isClean;
    this.applyTheme(this.currentTheme, false);
    if (window.neoAudio) window.neoAudio.playPop();
  }

  setFrameMode(isFrame) {
    this.isLaptopFrameMode = isFrame;
    document.body.classList.toggle("fullscreen-mode", !isFrame);
    const appleToggle = document.getElementById("apple-toggle-viewmode");
    if (appleToggle) {
      appleToggle.innerText = isFrame ? "⛶ 전체 화면 모드로 전환" : "💻 맥북 프레임 모드로 전환";
    }
    const viewBtn = document.getElementById("view-mode-toggle");
    if (viewBtn) {
      viewBtn.innerHTML = isFrame ? "⛶ 전체 화면 모드" : "💻 맥북 프레임 모드";
    }
    if (window.neoAudio) window.neoAudio.playPop();
  }

  toggleFrameMode() {
    this.setFrameMode(!this.isLaptopFrameMode);
    // Update button label
    const btn = document.getElementById('ext-view-mode-btn');
    if (btn) {
      btn.textContent = this.isLaptopFrameMode ? '⛶ 전체화면으로' : '💻 프레임으로';
    }
    const settingsWin = window.windowManager.windows['settings'];
    if (settingsWin && settingsWin.el && settingsWin.isOpen) {
      this.syncSettingsUI(settingsWin.el);
    }
  }

  toggleWidgets() {
    const col = document.getElementById("desktop-widgets-column");
    if (col) {
      const isHidden = col.classList.toggle("hidden");
      if (window.neoAudio) window.neoAudio.playPop();
      if (window.lilFinderGuy) {
        window.lilFinderGuy.speak(
          isHidden ? "바탕화면 캘린더와 위젯을 숨겼어! 화면이 넓고 깔끔해졌지? ✨" : "바탕화면 캘린더와 위젯을 다시 표시했어! 📅"
        );
      }
    }
  }

  syncSettingsUI(container) {
    if (!container) return;

    // 1. Color Chips - reliable direct click binding
    container.querySelectorAll(".settings-color-chip").forEach(chip => {
      const themeId = chip.getAttribute("data-theme");
      const isSelected = this.currentTheme === themeId;
      chip.classList.toggle("active", isSelected);

      const checkEl = chip.querySelector(".chip-check");
      if (checkEl) {
        checkEl.style.display = isSelected ? "flex" : "none";
      }

      chip.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.applyTheme(themeId, true);
        this.syncSettingsUI(container);
      };
    });

    // 2. View Mode Buttons
    const btnFrame = container.querySelector("#btn-mode-frame");
    const btnFull = container.querySelector("#btn-mode-full");
    if (btnFrame && btnFull) {
      btnFrame.classList.toggle("primary", this.isLaptopFrameMode);
      btnFull.classList.toggle("primary", !this.isLaptopFrameMode);

      btnFrame.onclick = (e) => {
        e.preventDefault();
        this.setFrameMode(true);
        this.syncSettingsUI(container);
      };
      btnFull.onclick = (e) => {
        e.preventDefault();
        this.setFrameMode(false);
        this.syncSettingsUI(container);
      };
    }

    // 3. Dark Mode Toggle
    const darkToggle = container.querySelector("#dark-mode-toggle");
    const darkRow = container.querySelector("#row-dark-mode");
    if (darkToggle) {
      darkToggle.checked = this.isDarkMode;
      darkToggle.onclick = (e) => {
        e.stopPropagation();
        this.toggleDarkMode(darkToggle.checked);
      };
      if (darkRow) {
        darkRow.onclick = (e) => {
          if (e.target !== darkToggle) {
            darkToggle.checked = !darkToggle.checked;
            this.toggleDarkMode(darkToggle.checked);
          }
        };
      }
    }

    // 4. Sound Effect Toggle
    const soundToggle = container.querySelector("#sound-effect-toggle");
    const soundRow = container.querySelector("#row-sound-effect");
    if (soundToggle) {
      soundToggle.checked = !window.neoAudio.isMuted;
      soundToggle.onclick = (e) => {
        e.stopPropagation();
        window.neoAudio.isMuted = !soundToggle.checked;
        if (!window.neoAudio.isMuted) window.neoAudio.playPop();
      };
      if (soundRow) {
        soundRow.onclick = (e) => {
          if (e.target !== soundToggle) {
            soundToggle.checked = !soundToggle.checked;
            window.neoAudio.isMuted = !soundToggle.checked;
            if (!window.neoAudio.isMuted) window.neoAudio.playPop();
          }
        };
      }
    }

    // 5. Sidebar Tabs
    container.querySelectorAll(".settings-tab").forEach(tab => {
      tab.onclick = (e) => {
        const target = tab.getAttribute("data-tab");
        if (target === "about") {
          window.windowManager.openWindow('about');
        } else if (target === "guide") {
          window.lilFinderGuy.handleAvatarClick();
        } else {
          container.querySelectorAll(".settings-tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const targetSec = container.querySelector(`#section-${target}`);
          if (targetSec) {
            targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        if (window.neoAudio) window.neoAudio.playPop();
      };
    });
  }

  toggleDarkMode(isDark) {
    this.isDarkMode = isDark;
    document.body.classList.toggle("dark-mode", isDark);
    if (window.neoAudio) window.neoAudio.playPop();
  }

  viewFullImage(src, title) {
    const html = `
      <div style="display:flex; justify-content:center; align-items:center; height:100%; padding:10px; background:#000;">
        <img src="${src}" alt="${title}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:8px;" />
      </div>
    `;
    window.windowManager.registerWindow("image-viewer", title, html, { width: 650, height: 480 });
    window.windowManager.openWindow("image-viewer");
  }

  toggleMusic() {
    const isPlaying = window.neoAudio.toggleBgm();
    const btn = document.getElementById("music-play-btn");
    const visualizer = document.querySelector(".visualizer-bars");

    if (btn) {
      btn.innerText = isPlaying ? "⏸ 일시정지" : "▶ 재생";
      btn.classList.toggle("playing", isPlaying);
    }
    if (visualizer) {
      visualizer.classList.toggle("active", isPlaying);
    }
  }

  // Simple Calculator Logic
  calcAction(action) {
    const screen = document.getElementById("calc-display");
    if (!screen) return;
    if (window.neoAudio) window.neoAudio.playPop();

    if (!this.calcState) {
      this.calcState = { current: "0", prev: null, op: null, resetNext: false };
    }
    const s = this.calcState;

    if (!isNaN(action)) {
      if (s.current === "0" || s.resetNext) {
        s.current = action;
        s.resetNext = false;
      } else {
        s.current += action;
      }
    } else if (action === ".") {
      if (!s.current.includes(".")) s.current += ".";
    } else if (action === "clear") {
      s.current = "0";
      s.prev = null;
      s.op = null;
    } else if (action === "+/-") {
      s.current = String(parseFloat(s.current) * -1);
    } else if (action === "%") {
      s.current = String(parseFloat(s.current) / 100);
    } else if (["+", "-", "*", "/"].includes(action)) {
      s.prev = parseFloat(s.current);
      s.op = action;
      s.resetNext = true;
    } else if (action === "=") {
      if (s.op && s.prev !== null) {
        const cur = parseFloat(s.current);
        let res = 0;
        if (s.op === "+") res = s.prev + cur;
        if (s.op === "-") res = s.prev - cur;
        if (s.op === "*") res = s.prev * cur;
        if (s.op === "/") res = cur !== 0 ? s.prev / cur : "Error";
        s.current = String(res);
        s.op = null;
        s.prev = null;
        s.resetNext = true;
      }
    }

    screen.textContent = s.current;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.neoApp = new MacBookNeoApp();
  window.neoApp.init();
});
