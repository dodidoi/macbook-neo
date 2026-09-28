/**
 * macOS Finder Application Engine for MacBook Neo Simulator
 * Authentic macOS Tahoe / Sonoma Finder with real folders, files, toolbar, and breadcrumbs.
 */
class FinderApp {
  constructor() {
    this.currentFolder = 'desktop';
    this.viewMode = 'icon'; // 'icon' or 'list'
    this.history = ['desktop'];
    this.historyIndex = 0;
    this.searchQuery = '';

    this.fileSystem = {
      desktop: {
        id: 'desktop',
        name: '데스크탑',
        icon: '🖥️',
        path: 'MacBook Neo > Macintosh HD > 사용자 > leeyuseong > 데스크탑',
        items: [
          { id: 'f_proj', name: '나의 프로젝트', type: 'folder', targetFolder: 'projects', size: '--', date: '2026. 9. 28', iconType: 'folder' },
          { id: 'f_shot', name: '스크린샷 2026-09-28.png', type: 'image', path: 'assets/wallpaper_blush_official.jpg', size: '2.4 MB', date: '2026. 9. 28 오후 1:06', iconType: 'image' },
          { id: 'f_rec', name: '화면 기록 5.28.31.mov', type: 'video', size: '14.8 MB', date: '2026. 9. 28 오후 5:28', iconType: 'video' },
          { id: 'f_neo_render', name: '네오 3D 렌더.png', type: 'image', path: 'assets/neo_lid_blush.png', size: '1.8 MB', date: '2026. 9. 28 오전 10:14', iconType: 'image' },
          { id: 'f_guide', name: '리틀 파인더 가이.png', type: 'image', path: 'assets/finder_guy.png', size: '920 KB', date: '2026. 9. 28 오전 9:42', iconType: 'image' },
          { id: 'f_bench', name: 'A18 Pro 벤치마크.txt', type: 'text', size: '48 KB', date: '2026. 9. 28 오후 2:15', iconType: 'text', content: 'Apple A18 Pro 벤치마크 결과 보고서\n------------------------------------\n- Geekbench 6 싱글코어: 3,580 점\n- Geekbench 6 멀티코어: 9,210 점\n- 4K 비디오 렌더링: M2 대비 1.4배 가속\n- 팬리스(Fanless) 무소음 설계\n- 전력 소모: 초저전력 15W TDP 유지' }
        ]
      },
      documents: {
        id: 'documents',
        name: '도큐멘트',
        icon: '📄',
        path: 'MacBook Neo > Macintosh HD > 사용자 > leeyuseong > 도큐멘트',
        items: [
          { id: 'f_work', name: '업무 자료', type: 'folder', targetFolder: 'projects', size: '--', date: '2026. 9. 28', iconType: 'folder' },
          { id: 'doc_pages', name: '맥북네오_특징요약.pages', type: 'app', appTarget: 'pages', size: '420 KB', date: '2026. 9. 28 오전 11:20', iconType: 'pages' },
          { id: 'doc_numbers', name: '2026_예산계획.numbers', type: 'app', appTarget: 'numbers', size: '310 KB', date: '2026. 9. 28 오후 1:45', iconType: 'numbers' },
          { id: 'doc_keynote', name: '제품소개_키노트.key', type: 'app', appTarget: 'keynote', size: '8.5 MB', date: '2026. 9. 28 오전 9:00', iconType: 'keynote' },
          { id: 'doc_guide', name: '맥북_네오_공식가이드.pdf', type: 'text', size: '3.2 MB', date: '2026. 9. 28 오후 3:12', iconType: 'pdf', content: 'MacBook Neo 공식 사용자 가이드북\n------------------------------------\n1. 믿을 수 없는 $599 가격의 가장 생동감 넘치는 Mac\n2. 4가지 시그니처 컬러: Blush, Citrus, Indigo, Silver\n3. 올데이 배터리와 Liquid Retina 디스플레이\n4. 리틀 파인더 가이와 함께하는 직관적인 안내' },
          { id: 'doc_txt', name: 'A18_Pro_시스템사양.txt', type: 'text', size: '12 KB', date: '2026. 9. 28', iconType: 'text', content: 'MacBook Neo 하드웨어 사양 요약\n- 프로세서: Apple A18 Pro (6코어 CPU, 6코어 GPU)\n- 메모리: 8GB 초고속 통합 메모리\n- 스토리지: 256GB 고속 SSD\n- 디스플레이: 13.6형 Liquid Retina\n- 배터리: 최대 18시간 지속 올데이 배터리' }
        ]
      },
      downloads: {
        id: 'downloads',
        name: '다운로드',
        icon: '⬇️',
        path: 'MacBook Neo > Macintosh HD > 사용자 > leeyuseong > 다운로드',
        items: [
          { id: 'dl_dmg', name: 'macOS_Tahoe_Update.dmg', type: 'disk', size: '1.2 GB', date: '2026. 9. 28', iconType: 'dmg' },
          { id: 'dl_wall', name: 'neo_wallpaper_official.jpg', type: 'image', path: 'assets/wallpaper_blush_official.jpg', size: '4.8 MB', date: '2026. 9. 28', iconType: 'image' },
          { id: 'dl_mp3', name: 'lil_finder_guy_lofi.mp3', type: 'audio', size: '6.2 MB', date: '2026. 9. 28', iconType: 'audio' },
          { id: 'dl_font', name: 'SF_Pro_NewFonts.zip', type: 'archive', size: '14.1 MB', date: '2026. 9. 28', iconType: 'zip' }
        ]
      },
      applications: {
        id: 'applications',
        name: '응용 프로그램',
        icon: '💻',
        path: 'MacBook Neo > Macintosh HD > 응용 프로그램',
        items: [
          { id: 'app_finder', name: 'Finder.app', type: 'app', appTarget: 'finder', size: '42 MB', date: '2026. 9. 28', iconType: 'finder' },
          { id: 'app_safari', name: 'Safari.app', type: 'app', appTarget: 'safari', size: '110 MB', date: '2026. 9. 28', iconType: 'safari' },
          { id: 'app_keynote', name: 'Keynote.app', type: 'app', appTarget: 'keynote', size: '480 MB', date: '2026. 9. 28', iconType: 'keynote' },
          { id: 'app_pages', name: 'Pages.app', type: 'app', appTarget: 'pages', size: '390 MB', date: '2026. 9. 28', iconType: 'pages' },
          { id: 'app_numbers', name: 'Numbers.app', type: 'app', appTarget: 'numbers', size: '340 MB', date: '2026. 9. 28', iconType: 'numbers' },
          { id: 'app_photos', name: '사진.app', type: 'app', appTarget: 'photos', size: '85 MB', date: '2026. 9. 28', iconType: 'photos' },
          { id: 'app_notes', name: '메모.app', type: 'app', appTarget: 'notes', size: '35 MB', date: '2026. 9. 28', iconType: 'notes' },
          { id: 'app_music', name: '음악.app', type: 'app', appTarget: 'music', size: '62 MB', date: '2026. 9. 28', iconType: 'music' },
          { id: 'app_calc', name: '계산기.app', type: 'app', appTarget: 'calculator', size: '12 MB', date: '2026. 9. 28', iconType: 'calc' },
          { id: 'app_settings', name: '시스템 설정.app', type: 'app', appTarget: 'settings', size: '54 MB', date: '2026. 9. 28', iconType: 'settings' }
        ]
      },
      pictures: {
        id: 'pictures',
        name: '사진',
        icon: '📸',
        path: 'MacBook Neo > Macintosh HD > 사용자 > leeyuseong > 사진',
        items: [
          { id: 'pic_sunset', name: '타호의 노을빛 산맥.jpg', type: 'image', path: 'assets/photo_sunset.jpg', size: '1.2 MB', date: '2026. 9. 28', iconType: 'image' },
          { id: 'pic_ocean', name: '에메랄드빛 태평양 파도.jpg', type: 'image', path: 'assets/photo_ocean.jpg', size: '1.4 MB', date: '2026. 9. 28', iconType: 'image' },
          { id: 'pic_aurora', name: '신비로운 밤하늘 오로라.jpg', type: 'image', path: 'assets/photo_aurora.jpg', size: '1.1 MB', date: '2026. 9. 28', iconType: 'image' },
          { id: 'pic_botanical', name: '미니멀 보태니컬 햇살.jpg', type: 'image', path: 'assets/photo_botanical.jpg', size: '980 KB', date: '2026. 9. 28', iconType: 'image' },
          { id: 'pic_neo_art', name: '네오 3D 젤리 스피어.jpg', type: 'image', path: 'assets/photo_neo_art.jpg', size: '1.6 MB', date: '2026. 9. 28', iconType: 'image' }
        ]
      },
      projects: {
        id: 'projects',
        name: '나의 프로젝트',
        icon: '📁',
        path: 'MacBook Neo > Macintosh HD > 사용자 > leeyuseong > 나의 프로젝트',
        items: [
          { id: 'prj_web', name: 'MacBook_Neo_시뮬레이터.html', type: 'app', appTarget: 'safari', size: '18 KB', date: '2026. 9. 28', iconType: 'text' },
          { id: 'prj_notes', name: '개발_메모.txt', type: 'text', size: '4 KB', date: '2026. 9. 28', iconType: 'text', content: '맥북 네오 시뮬레이터 개발 일지:\n- 가볍고 매끄러운 macOS 경험 구현\n- 정품 컬러웨이와 완벽한 인터랙션\n- 리틀 파인더 가이의 동적 가이드 시스템 연동 완료' }
        ]
      }
    };
  }

  getFolder(folderId) {
    return this.fileSystem[folderId] || this.fileSystem.desktop;
  }

  navigateTo(folderId) {
    if (!this.fileSystem[folderId]) return;
    this.currentFolder = folderId;
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(folderId);
    this.historyIndex = this.history.length - 1;
    this.render();
    if (window.neoAudio) window.neoAudio.playPop();
  }

  navigateBack() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentFolder = this.history[this.historyIndex];
      this.render();
      if (window.neoAudio) window.neoAudio.playPop();
    }
  }

  navigateForward() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.currentFolder = this.history[this.historyIndex];
      this.render();
      if (window.neoAudio) window.neoAudio.playPop();
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
    this.render();
  }

  handleItemClick(item) {
    if (item.type === 'folder' && item.targetFolder) {
      this.navigateTo(item.targetFolder);
      return;
    }
    if (item.type === 'app' && item.appTarget) {
      if (window.windowManager) window.windowManager.openWindow(item.appTarget);
      return;
    }
    if (item.type === 'image' && item.path) {
      if (window.neoApp) window.neoApp.viewFullImage(item.path, item.name);
      return;
    }
    if (item.type === 'text') {
      this.openTextPreview(item.name, item.content || '');
      return;
    }
    if (item.type === 'audio') {
      if (window.neoApp) window.neoApp.toggleMusic();
      return;
    }
    if (window.lilFinderGuy) {
      window.lilFinderGuy.speak(`'${item.name}' 파일이야! ${item.size} 크기의 ${this.getKindLabel(item.iconType)} 형식이야.`);
    }
  }

  openTextPreview(title, content) {
    const html = `
      <div style="padding: 20px; font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; background: #fff; height: 100%; overflow-y: auto; color: #1e293b;">
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 14px; font-weight: 700; font-family: sans-serif; font-size: 14px;">📄 ${title}</div>
        <div>${content}</div>
      </div>
    `;
    if (window.windowManager) {
      window.windowManager.registerWindow('quick-text', title, html, { width: 480, height: 340, x: 310, y: 50 });
      window.windowManager.openWindow('quick-text');
    }
  }

  getKindLabel(iconType) {
    switch (iconType) {
      case 'folder': return '폴더';
      case 'image': return '이미지';
      case 'video': return '동영상';
      case 'text': return '텍스트 문서';
      case 'pdf': return 'PDF 도큐멘트';
      case 'pages': return 'Pages 도큐멘트';
      case 'keynote': return 'Keynote 프레젠테이션';
      case 'numbers': return 'Numbers 스프레드시트';
      case 'dmg': return '디스크 이미지';
      case 'zip': return 'ZIP 아카이브';
      case 'audio': return '오디오 파일';
      default: return '응용 프로그램';
    }
  }

  render() {
    const container = document.getElementById("finder-app-root");
    if (!container) return;

    const folder = this.getFolder(this.currentFolder);
    const canBack = this.historyIndex > 0;
    const canForward = this.historyIndex < this.history.length - 1;

    let items = folder.items;
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      items = items.filter(it => it.name.toLowerCase().includes(q));
    }

    container.innerHTML = `
      <div class="finder-window-inner">
        <!-- Top Toolbar -->
        <div class="finder-toolbar">
          <div class="finder-nav-arrows">
            <button class="nav-arrow-btn ${canBack ? '' : 'disabled'}" onclick="window.finderApp.navigateBack()" title="뒤로">◀</button>
            <button class="nav-arrow-btn ${canForward ? '' : 'disabled'}" onclick="window.finderApp.navigateForward()" title="앞으로">▶</button>
          </div>
          <div class="finder-title-label">
            <span>${folder.icon} ${folder.name}</span>
          </div>
          <div class="finder-view-segmented">
            <button class="seg-btn ${this.viewMode === 'icon' ? 'active' : ''}" onclick="window.finderApp.setViewMode('icon')" title="아이콘 보기">⊞ 아이콘</button>
            <button class="seg-btn ${this.viewMode === 'list' ? 'active' : ''}" onclick="window.finderApp.setViewMode('list')" title="목록 보기">☰ 목록</button>
          </div>
          <div class="finder-search-wrap">
            <span class="f-search-icon">🔍</span>
            <input type="text" class="f-search-input" placeholder="검색" value="${this.searchQuery}" oninput="window.finderApp.searchQuery = this.value; window.finderApp.render();" />
          </div>
        </div>

        <!-- Body: Sidebar + Main Content -->
        <div class="finder-body">
          <!-- Sidebar -->
          <div class="finder-sidebar">
            <div class="finder-group-title">즐겨찾기</div>
            <div class="f-nav-item ${this.currentFolder === 'desktop' ? 'active' : ''}" onclick="window.finderApp.navigateTo('desktop')">
              <span class="f-nav-icon">🖥️</span> 데스크탑
            </div>
            <div class="f-nav-item ${this.currentFolder === 'documents' ? 'active' : ''}" onclick="window.finderApp.navigateTo('documents')">
              <span class="f-nav-icon">📄</span> 도큐멘트
            </div>
            <div class="f-nav-item ${this.currentFolder === 'downloads' ? 'active' : ''}" onclick="window.finderApp.navigateTo('downloads')">
              <span class="f-nav-icon">⬇️</span> 다운로드
            </div>
            <div class="f-nav-item ${this.currentFolder === 'applications' ? 'active' : ''}" onclick="window.finderApp.navigateTo('applications')">
              <span class="f-nav-icon">💻</span> 응용 프로그램
            </div>
            <div class="f-nav-item ${this.currentFolder === 'pictures' ? 'active' : ''}" onclick="window.finderApp.navigateTo('pictures')">
              <span class="f-nav-icon">📸</span> 사진
            </div>

            <div class="finder-group-title" style="margin-top: 14px;">위치</div>
            <div class="f-nav-item" onclick="window.windowManager.openWindow('about')">
              <span class="f-nav-icon">🍎</span> MacBook Neo
            </div>

            <div class="finder-group-title" style="margin-top: 14px;">태그</div>
            <div class="f-nav-item">
              <span class="f-tag-dot" style="background:#ef4444;"></span> 중요
            </div>
            <div class="f-nav-item">
              <span class="f-tag-dot" style="background:#3b82f6;"></span> 업무
            </div>
            <div class="f-nav-item">
              <span class="f-tag-dot" style="background:#22c55e;"></span> 완료
            </div>
          </div>

          <!-- Main File Canvas -->
          <div class="finder-main-canvas">
            ${this.renderMainContent(items)}
          </div>
        </div>

        <!-- Path Bar / Status Bar -->
        <div class="finder-pathbar">
          <div class="path-crumbs">${folder.path}</div>
          <div class="item-count">${items.length}개 항목, 218.4GB 사용 가능</div>
        </div>
      </div>
    `;
  }

  renderMainContent(items) {
    if (items.length === 0) {
      return `
        <div class="finder-empty-state">
          <div style="font-size: 38px; margin-bottom: 8px;">📂</div>
          <div style="font-size: 13px; color: #64748b;">항목이 없습니다</div>
        </div>
      `;
    }

    if (this.viewMode === 'icon') {
      return `
        <div class="finder-icon-grid">
          ${items.map(it => `
            <div class="finder-icon-card" ondblclick="window.finderApp.handleItemClick(${JSON.stringify(it).replace(/"/g, '&quot;')})" onclick="this.classList.toggle('selected')">
              <div class="icon-graphic">${this.getItemGraphic(it)}</div>
              <div class="icon-title">${it.name}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // List view table
      return `
        <div class="finder-list-table">
          <div class="list-header-row">
            <div class="col col-name">이름</div>
            <div class="col col-date">수정한 날짜</div>
            <div class="col col-size">크기</div>
            <div class="col col-kind">종류</div>
          </div>
          <div class="list-body-rows">
            ${items.map((it, idx) => `
              <div class="list-row ${idx % 2 === 1 ? 'alt' : ''}" ondblclick="window.finderApp.handleItemClick(${JSON.stringify(it).replace(/"/g, '&quot;')})">
                <div class="col col-name">
                  <span class="list-icon">${this.getItemSmallIcon(it)}</span>
                  <span class="list-text">${it.name}</span>
                </div>
                <div class="col col-date">${it.date}</div>
                <div class="col col-size">${it.size}</div>
                <div class="col col-kind">${this.getKindLabel(it.iconType)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  getItemGraphic(item) {
    if (item.type === 'folder') {
      return `
        <svg class="folder-svg" viewBox="0 0 64 64" width="56" height="56">
          <path d="M 6 16 C 6 12 10 10 14 10 L 26 10 L 32 16 L 50 16 C 54 16 58 20 58 24 L 58 48 C 58 52 54 56 50 56 L 14 56 C 10 56 6 52 6 48 Z" fill="#38bdf8"/>
          <path d="M 6 22 L 58 22 L 58 48 C 58 52 54 56 50 56 L 14 56 C 10 56 6 52 6 48 Z" fill="#0284c7"/>
          <rect x="18" y="30" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/>
        </svg>
      `;
    }
    if (item.type === 'app') {
      const iconMap = {
        safari: 'assets/icons/safari.svg',
        keynote: 'assets/icons/keynote.svg',
        pages: 'assets/icons/pages.svg',
        numbers: 'assets/icons/numbers.svg',
        photos: 'assets/icons/photos.svg',
        notes: 'assets/icons/notes.svg',
        music: 'assets/icons/music.svg',
        calculator: 'assets/icons/calculator.svg',
        settings: 'assets/icons/settings.svg',
        finder: 'assets/icons/finder.svg'
      };
      const src = iconMap[item.appTarget] || 'assets/icons/macbook_neo.svg';
      return `<img src="${src}" class="app-icon-img" alt="${item.name}" />`;
    }
    if (item.type === 'image') {
      if (item.path) {
        return `<img src="${item.path}" class="file-thumb-img" alt="${item.name}" />`;
      }
      return `<span style="font-size: 38px;">🖼️</span>`;
    }
    if (item.type === 'video') return `<span style="font-size: 38px;">🎬</span>`;
    if (item.iconType === 'pages') return `<img src="assets/icons/pages.svg" class="app-icon-img" alt="Pages" />`;
    if (item.iconType === 'numbers') return `<img src="assets/icons/numbers.svg" class="app-icon-img" alt="Numbers" />`;
    if (item.iconType === 'keynote') return `<img src="assets/icons/keynote.svg" class="app-icon-img" alt="Keynote" />`;
    if (item.iconType === 'dmg') return `<span style="font-size: 38px;">💿</span>`;
    if (item.iconType === 'zip') return `<span style="font-size: 38px;">🗜️</span>`;
    if (item.iconType === 'pdf') return `<span style="font-size: 38px;">📕</span>`;
    return `<span style="font-size: 38px;">📄</span>`;
  }

  getItemSmallIcon(item) {
    if (item.type === 'folder') return '📁';
    if (item.type === 'image') return '🖼️';
    if (item.type === 'video') return '🎬';
    if (item.iconType === 'pages') return '📑';
    if (item.iconType === 'numbers') return '📊';
    if (item.iconType === 'keynote') return '📽️';
    if (item.iconType === 'pdf') return '📕';
    if (item.iconType === 'dmg') return '💿';
    if (item.iconType === 'zip') return '🗜️';
    return '📄';
  }
}

window.finderApp = new FinderApp();
