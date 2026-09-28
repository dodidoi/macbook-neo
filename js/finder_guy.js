/**
 * Lil' Finder Guy (리틀 파인더 가이) Interactive Guide Engine
 * The cute 3D mascot that guides users throughout the MacBook Neo experience.
 */
class LilFinderGuy {
  constructor() {
    this.container = null;
    this.speechBubble = null;
    this.currentText = "";
    this.typingTimer = null;
    this.idleTimer = null;
    this.isMuted = false;
    this.isCollapsed = false;

    this.tips = [
      "맥북 네오의 알약 캡슐 배경화면을 잘 봐봐! 'm-a-c' 글자가 숨겨져 있어! 발견했어? 🍬",
      "상단 메뉴바 왼쪽 위의  사과 로고를 눌러봐! 맥북 네오의 강력한 A18 Pro 칩 정보를 볼 수 있어!",
      "하단 독(Dock)에서 Finder나 Keynote, Pages, Numbers를 열어 실제 Mac의 앱들을 체험해봐! 💻",
      "오른쪽 위의 제어 센터 아이콘을 눌러봐! 화면 밝기와 볼륨, 다크모드를 바로 바꿀 수 있어!",
      "상단  애플 메뉴나 시스템 설정에서 언제든 맥북 네오의 4가지 컬러 테마를 자유롭게 바꿀 수 있어! 🎨",
      "사진(Photos) 앱을 열어봐! 맥북 네오 라인업과 멋진 랜드스케이프 사진들이 준비되어 있어 📸",
      "음악(Music) 앱에서 네오 전용 사운드를 들으며 편안하게 둘러봐 🎧",
      "바탕화면에 있는 파일들을 더블클릭하면 퀵룩(Quick Look)으로 바로 열어볼 수 있어! 📄"
    ];
    this.tipIndex = 0;
  }

  init() {
    this.container = document.getElementById("finder-guy-widget");
    this.speechBubble = document.getElementById("finder-guy-speech");
    this.avatar = document.getElementById("finder-guy-avatar");

    if (this.avatar) {
      this.avatar.addEventListener("click", () => this.handleAvatarClick());
    }

    // Start proactive idle tips
    this.resetIdleTimer();
  }

  // Show a message with typing animation and cute boop voice
  speak(text, actionButtons = []) {
    if (!this.speechBubble) return;

    if (this.typingTimer) {
      clearInterval(this.typingTimer);
    }

    this.speechBubble.classList.remove("hidden");
    const textEl = this.speechBubble.querySelector(".speech-text");
    const actionsEl = this.speechBubble.querySelector(".speech-actions");

    textEl.innerHTML = "";
    actionsEl.innerHTML = "";

    let charIndex = 0;
    this.currentText = text;

    // Small bounce animation on the character
    if (this.avatar) {
      this.avatar.classList.add("speaking");
      setTimeout(() => this.avatar.classList.remove("speaking"), 600);
    }

    // Typewriter effect
    this.typingTimer = setInterval(() => {
      if (charIndex < text.length) {
        textEl.textContent += text.charAt(charIndex);
        if (charIndex % 3 === 0 && window.neoAudio) {
          window.neoAudio.playLilGuyTalk();
        }
        charIndex++;
      } else {
        clearInterval(this.typingTimer);
        this.typingTimer = null;

        // Render buttons if any
        if (actionButtons && actionButtons.length > 0) {
          actionButtons.forEach(btn => {
            const b = document.createElement("button");
            b.className = "speech-btn " + (btn.primary ? "primary" : "");
            b.innerText = btn.label;
            b.addEventListener("click", (e) => {
              e.stopPropagation();
              if (window.neoAudio) window.neoAudio.playPop();
              btn.onClick();
            });
            actionsEl.appendChild(b);
          });
        }
      }
    }, 28);

    this.resetIdleTimer();
  }

  handleAvatarClick() {
    if (window.neoAudio) window.neoAudio.playPop();
    
    // Play cheerful jump
    if (this.avatar) {
      this.avatar.classList.remove("jump");
      void this.avatar.offsetWidth; // trigger reflow
      this.avatar.classList.add("jump");
    }

    const nextTip = this.tips[this.tipIndex % this.tips.length];
    this.tipIndex++;

    this.speak(`반가워! 나를 눌렀구나! ✨\n${nextTip}`, [
      {
        label: "🎨 컬러 테마 변경",
        primary: true,
        onClick: () => {
          if (window.neoApp) window.neoApp.openColorPicker();
        }
      },
      {
        label: "💻 맥북 네오 스펙",
        primary: false,
        onClick: () => {
          if (window.windowManager) window.windowManager.openWindow('about');
        }
      },
      {
        label: "다음 팁 보기 ➡️",
        primary: false,
        onClick: () => this.handleAvatarClick()
      }
    ]);
  }

  resetIdleTimer() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    // Periodically give friendly tips every 50 seconds
    this.idleTimer = setTimeout(() => {
      const tip = this.tips[Math.floor(Math.random() * this.tips.length)];
      this.speak(`💡 리틀 파인더 가이의 팁:\n${tip}`);
    }, 55000);
  }

  // Quick contextual helper hooks
  onColorChanged(colorName, colorInfo) {
    this.speak(`우와! **${colorInfo.name}** 컬러로 맥북 네오가 변신했어! 💖\n알약 캡슐 배경화면과 전체 시스템 테마가 ${colorInfo.name}에 딱 맞게 정렬되었지?`, [
      {
        label: "다른 앱 둘러보기 ✨",
        primary: true,
        onClick: () => {
          this.speak("하단 독(Dock)에서 사파리나 사진 앱, 계산기를 열어봐!");
        }
      }
    ]);
  }

  onAppOpened(appId) {
    const messages = {
      'safari': "사파리를 열었구나! 맥북 네오 공식 페이지와 스펙 비교표를 준비해뒀어 🌐",
      'settings': "설정 창이야! 여기서 언제든 4가지 컬러를 변경하고 다크모드를 켤 수 있어 ⚙️",
      'photos': "사진첩이야! 4색 맥북 네오의 실물과 내 귀여운 사진들을 모아봤어 📸",
      'music': "음악 앱이야! 재생 버튼을 누르면 칠하고 감성적인 로파이 비트가 흘러나와 🎵",
      'calculator': "정밀 계산기야! 덧셈 뺄셈이나 환율 계산도 척척 해낼 수 있지 🔢",
      'notes': "메모장이야! 맥북 네오로 느낀 점이나 아이디어를 자유롭게 메모해봐 📝",
      'about': "맥북 네오의 심장, Apple A18 Pro 칩셋이야! $599라는 기적 같은 가격에 담긴 놀라운 스펙이지 🍎",
      'files': "파인더 파일 탐색기야! 맥북 네오에 담긴 다양한 문서와 미디어를 열어봐 📂"
    };

    if (messages[appId]) {
      this.speak(messages[appId]);
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    if (this.container) {
      this.container.classList.toggle("collapsed", this.isCollapsed);
    }
  }
}

window.lilFinderGuy = new LilFinderGuy();
