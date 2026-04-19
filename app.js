(function () {
  const STORAGE_KEY = "mike_blog_posts";
  const AVATAR_KEY = "mike_blog_avatar";
  const LANGUAGE_KEY = "mike_blog_language";
  const PROFILE_NOTE_KEY = "mike_blog_profile_notes";
  const AUTH_KEY = "mike_blog_auth";
  const HIDDEN_SAMPLE_KEY = "mike_blog_hidden_samples";
  const DEFAULT_COORDS = {
    latitude: 31.2304,
    longitude: 121.4737,
  };
  const AVATAR_PRESETS = [
    { id: "bug-purple", kind: "bug", labelZh: "紫色小虫", labelEn: "Purple Bug", toneZh: "默认像素", toneEn: "pixel classic", colors: ["#6f42f6", "#cda8ff", "#ffffff"] },
    { id: "penguin-yellow", kind: "penguin", labelZh: "黄肚小企鹅", labelEn: "Yellow Penguin", toneZh: "暖乎乎", toneEn: "warm vibe", colors: ["#3f2b63", "#ffd44d", "#ff9b3d"] },
    { id: "bird-orange", kind: "bird", labelZh: "橙色小鸟", labelEn: "Orange Bird", toneZh: "有点得意", toneEn: "cheeky", colors: ["#ff8a34", "#ffd39b", "#fff7ef"] },
    { id: "penguin-purple", kind: "penguin", labelZh: "紫围巾企鹅", labelEn: "Purple Scarf Penguin", toneZh: "像 QQ 头像", toneEn: "QQ energy", colors: ["#4e4d7a", "#b48cff", "#ffe27a"] },
    { id: "bug-yellow", kind: "bug", labelZh: "柠檬小虫", labelEn: "Lemon Bug", toneZh: "亮亮的", toneEn: "bright", colors: ["#ffdf57", "#fff2ae", "#6c5411"] },
    { id: "bird-mint", kind: "bird", labelZh: "薄荷小鸟", labelEn: "Mint Bird", toneZh: "轻快一点", toneEn: "fresh", colors: ["#7ad9b7", "#daf8ec", "#356d67"] },
  ];
  const AUTO_THEMES = {
    growth: {
      zh: "个人成长",
      en: "Personal Growth",
      kickerZh: "你在慢慢长大",
      kickerEn: "You are stretching inward",
      keywords: ["成长", "复盘", "反思", "习惯", "学习", "改变", "情绪", "自律", "状态", "improve", "habit", "learn", "growth", "reflect"],
    },
    daily: {
      zh: "生活流水",
      en: "Daily Stream",
      kickerZh: "生活正在留下纹理",
      kickerEn: "Daily life is leaving texture",
      keywords: ["今天", "日常", "早餐", "午饭", "散步", "回家", "地铁", "晚上", "周末", "today", "daily", "walk", "breakfast", "weekend", "home"],
    },
    business: {
      zh: "商业想法",
      en: "Business Ideas",
      kickerZh: "你的脑子在偷偷做生意",
      kickerEn: "Your brain is quietly making deals",
      keywords: ["商业", "产品", "用户", "市场", "增长", "变现", "创业", "项目", "品牌", "business", "product", "market", "startup", "pricing", "strategy"],
    },
    funny: {
      zh: "搞笑时刻",
      en: "Funny Moments",
      kickerZh: "你今天也有一点喜剧天赋",
      kickerEn: "There is comedy in your day too",
      keywords: ["好笑", "离谱", "尴尬", "哈哈", "笑死", "沙雕", "乌龙", "搞笑", "funny", "awkward", "ridiculous", "lol", "joke"],
    },
  };

  const PAGE_META = {
    home: {
      zh: {
        title: "Mike | 个人空间",
        description: "Mike 的个人博客，记录工作、生活与缓慢沉淀的想法。",
      },
      en: {
        title: "Mike | Personal Space",
        description: "Mike's personal blog for work notes, life updates, and slower reflections.",
      },
    },
    compose: {
      zh: {
        title: "Mike | 写作台",
        description: "在本地写作并发布博客内容。",
      },
      en: {
        title: "Mike | Writing Studio",
        description: "Write and publish blog posts locally.",
      },
    },
    post: {
      zh: {
        title: "Mike | 文章",
        description: "阅读已发布的本地文章。",
      },
      en: {
        title: "Mike | Post",
        description: "Read a locally published post.",
      },
    },
    login: {
      zh: {
        title: "Mike | 登录",
        description: "登录后进入你的个人空间。",
      },
      en: {
        title: "Mike | Sign In",
        description: "Sign in before entering your personal space.",
      },
    },
  };

  const I18N = {
    zh: {
      changeAvatar: "更换头像",
      publishAction: "发布",
      homeAction: "首页",
      introText: "一个把想法留下来的地方，不让它们被更快的平台轻易冲走。",
      spaceKicker: "我的空间",
      spaceTitle: "欢迎回来，这里是你的想法栖息地。",
      spaceStatPosts: "已收下的念头",
      spaceStatTheme: "最近偏向",
      spaceStatLatest: "最新一条",
      thoughtBoardKicker: "想法归档",
      thoughtBoardTitle: "这些念头最近都落到了哪里",
      thoughtBoardNote: "发布后会自动归类，帮你看见自己最近在想什么。",
      spaceEmptySummary: "这里还很空，但也很好。等你写下第一条想法，这个空间就会开始长出自己的性格。",
      spaceFilledSummary: "最近你更常在想「{theme}」。这些碎片没有散掉，它们正在慢慢拼成属于你的轨迹。",
      clusterEmpty: "这边还没收进新的念头。",
      clusterCountSingle: "{count} 条",
      clusterCountMany: "{count} 条",
      defaultThemeLabel: "还在酝酿中",
      deletePost: "删除",
      deleteConfirm: "确认删除这条已发布内容吗？",
      logoutAction: "退出",
      avatarPickerKicker: "头像推荐",
      avatarPickerTitle: "挑一个像 QQ 时代那样的头像",
      loginKicker: "Purple Room",
      loginTitle: "最后，走进属于你自己的房间。",
      loginCopy: "记录想法、收纳碎念、上传语音、慢慢长成只属于你的空间。",
      loginBadgeOne: "微信登录",
      loginBadgeTwo: "邮箱注册",
      loginBadgeThree: "手机号验证码",
      loginCardKicker: "进入空间",
      loginWechat: "微信",
      loginEmail: "邮箱",
      loginPhone: "手机号",
      loginWechatHint: "先用节俭版本地模拟微信登录，后面接正式微信开放平台。",
      loginNickname: "昵称",
      loginNicknamePlaceholder: "比如 Mike",
      loginWechatAction: "使用微信进入",
      loginEmailLabel: "邮箱",
      loginEmailPlaceholder: "you@example.com",
      loginPasswordLabel: "密码",
      loginPasswordPlaceholder: "至少 6 位",
      loginEmailAction: "邮箱登录 / 注册",
      loginPhoneLabel: "手机号",
      loginPhonePlaceholder: "请输入手机号",
      loginCodeLabel: "验证码",
      loginCodePlaceholder: "6 位验证码",
      loginSendCode: "发送验证码",
      loginPhoneAction: "手机号进入",
      loginCodeSent: "验证码已发送。本地演示版默认可输入任意 6 位数字。",
      loginSuccess: "登录成功，正在进入你的空间。",
      loginRequired: "请先登录，再进入你的个人空间。",
      postsKicker: "文章",
      recentPosts: "最新内容",
      postsImmediateNote: "在这个浏览器发布的内容会立即显示在这里。",
      writingStudio: "写作台",
      writingNote: "右边起草，点击发布后，左边会立刻出现新的内容卡片。",
      moodKicker: "今日信号",
      moodSuggestionLabel: "今日小提示",
      homeMoodSunny: "适合把脑袋打开一点，写点轻快的句子。",
      homeMoodCloudy: "天色温吞，适合慢慢整理想法，不必着急漂亮。",
      homeMoodRainy: "雨天适合躲进文字里，写一些柔软但准确的内容。",
      homeMoodStorm: "外面闹一点也没关系，页面里还是可以安静下来。",
      homeMoodSnow: "冷一点的天气，适合写热乎一点的句子。",
      homeSuggestionOne: "先写一句，再决定要不要写一整段。",
      homeSuggestionTwo: "想到什么就记什么，别先审判它。",
      homeSuggestionThree: "今天可以写短一点，但要真一点。",
      homeSuggestionFour: "把一句废话改成一句像你的话。",
      composePageTitle: "写作并发布一篇内容",
      composePageNote: "这个编辑器会把文章保存在当前浏览器里，并立即同步到首页。",
      fieldTitle: "标题",
      fieldTitlePlaceholder: "写一个值得留下的标题",
      fieldCategory: "分类",
      fieldCategoryPlaceholder: "工作记录",
      fieldDate: "日期",
      fieldSummary: "摘要",
      fieldSummaryPlaceholder: "为首页卡片写一段简短摘要",
      fieldBody: "正文",
      fieldBodyPlaceholder: "在这里写作。段落之间留一空行。",
      clearAction: "清空",
      footerNote: "先写下你真正想说的话，声音会慢慢长出来。",
      siteFooter: "© 2026 Mike。为安静写作而建。",
      profileNoteDefault: "记录工作、生活和慢一点的想法。",
      profileNotePlaceholder: "输入你想显示在头像下方的空间描述",
      backHome: "← 返回首页",
      calendarKicker: "万年历",
      calendarTitle: "今日黄历卡片",
      calendarDateLabel: "日期",
      calendarWeatherLabel: "天气",
      calendarYiLabel: "今日宜",
      calendarJiLabel: "今日忌",
      loading: "加载中...",
      postLoading: "文章加载中",
      postNotFoundMeta: "未找到文章",
      postNotFoundTitle: "这个浏览器里没有这篇文章。",
      postNotFoundBody: "已发布文章保存在浏览器本地存储里。如果你是在其他浏览器或设备打开页面，这篇文章不会出现。",
      validationMessage: "请先完整填写所有字段再发布。",
      publishMessage: `已发布。<a href="{url}">查看文章</a>，或继续在这里写下一篇。`,
      weatherLoading: "正在获取天气",
      weatherUnavailable: "天气暂时不可用",
      fallbackLocation: "上海",
      nearbyLocation: "当前位置附近",
      defaultLocation: "默认城市",
      calendarLocationFallback: "位置未授权，已切换为默认城市天气。",
      sampleMetaOne: "2026.04.19 · 工作记录",
      sampleTitleOne: "在复杂工作里，真正有价值的不是无所不知，而是持续把事情推进",
      sampleExcerptOne: "一篇关于困难工作中真正重要之事的反思：清晰度、取舍、节奏，以及执行。",
      sampleMetaTwo: "2026.04.18 · 自我成长",
      sampleTitleTwo: "为什么我想要一个个人博客，而不是只在社交平台写作",
      sampleExcerptTwo: "不是为了打造个人品牌，而是保留一个让写作保持私人、可检索、也更安静的地方。",
      weatherCodes: {
        0: "晴朗",
        1: "大致晴朗",
        2: "局部多云",
        3: "阴天",
        45: "有雾",
        48: "雾凇",
        51: "毛毛雨",
        53: "小雨",
        55: "较强毛毛雨",
        61: "小雨",
        63: "中雨",
        65: "大雨",
        71: "小雪",
        73: "中雪",
        75: "大雪",
        80: "阵雨",
        81: "较强阵雨",
        82: "强阵雨",
        95: "雷暴",
      },
      yiList: ["开工", "写作", "散步", "整理房间", "见朋友", "复盘", "阅读", "更新计划", "喝热茶", "拍照"],
      jiList: ["拖延", "熬夜", "冲动消费", "纠结小事", "空腹喝咖啡", "久坐不动", "过度刷屏", "临时改计划", "情绪内耗", "囤积待办"],
    },
    en: {
      changeAvatar: "Change Avatar",
      publishAction: "Publish",
      homeAction: "Home",
      introText: "A place to keep thoughts from being washed away by faster platforms.",
      spaceKicker: "My Space",
      spaceTitle: "Welcome back. This is where your thoughts get to stay.",
      spaceStatPosts: "Captured thoughts",
      spaceStatTheme: "Recent direction",
      spaceStatLatest: "Latest note",
      thoughtBoardKicker: "Thought Archive",
      thoughtBoardTitle: "Where your recent thoughts have been landing",
      thoughtBoardNote: "New posts are grouped automatically so you can see what your mind returns to.",
      spaceEmptySummary: "This place is still quiet, which is fine. Once you write the first note, the room will start to form a personality of its own.",
      spaceFilledSummary: "Lately you keep returning to \"{theme}\". The fragments are not drifting away; they are slowly forming your own pattern.",
      clusterEmpty: "Nothing has landed here yet.",
      clusterCountSingle: "{count} note",
      clusterCountMany: "{count} notes",
      defaultThemeLabel: "Still forming",
      deletePost: "Delete",
      deleteConfirm: "Delete this published post?",
      logoutAction: "Logout",
      avatarPickerKicker: "Avatar Picks",
      avatarPickerTitle: "Pick something with old-school QQ energy",
      loginKicker: "Purple Room",
      loginTitle: "In the end, you step into a room that is entirely your own.",
      loginCopy: "Capture thoughts, store fragments, upload voice notes, and slowly grow a space that only belongs to you.",
      loginBadgeOne: "WeChat",
      loginBadgeTwo: "Email",
      loginBadgeThree: "SMS Code",
      loginCardKicker: "Enter",
      loginWechat: "WeChat",
      loginEmail: "Email",
      loginPhone: "Phone",
      loginWechatHint: "This frugal version simulates WeChat login locally for now. Formal integration can come later.",
      loginNickname: "Nickname",
      loginNicknamePlaceholder: "For example Mike",
      loginWechatAction: "Continue with WeChat",
      loginEmailLabel: "Email",
      loginEmailPlaceholder: "you@example.com",
      loginPasswordLabel: "Password",
      loginPasswordPlaceholder: "At least 6 characters",
      loginEmailAction: "Email Sign In / Register",
      loginPhoneLabel: "Phone",
      loginPhonePlaceholder: "Enter your phone number",
      loginCodeLabel: "Code",
      loginCodePlaceholder: "6-digit code",
      loginSendCode: "Send Code",
      loginPhoneAction: "Continue with Phone",
      loginCodeSent: "Code sent. In this local demo, any 6 digits will work.",
      loginSuccess: "Signed in. Entering your space now.",
      loginRequired: "Sign in before entering your personal space.",
      postsKicker: "Posts",
      recentPosts: "Recent Posts",
      postsImmediateNote: "Posts published in this browser appear here immediately.",
      writingStudio: "Writing Studio",
      writingNote: "Draft on the right. Publish once, and the new post appears on the left immediately.",
      moodKicker: "Today's Signal",
      moodSuggestionLabel: "Tiny Prompt",
      homeMoodSunny: "Good weather for opening your head a little and writing lighter lines.",
      homeMoodCloudy: "Soft skies are good for sorting thoughts slowly without forcing polish.",
      homeMoodRainy: "Rain is good for hiding inside language and writing something gentle but precise.",
      homeMoodStorm: "Even if it is noisy outside, the page can still stay calm.",
      homeMoodSnow: "Cold weather works well with warmer sentences.",
      homeSuggestionOne: "Write one sentence first, then decide if it deserves a paragraph.",
      homeSuggestionTwo: "Capture the thought before you judge it.",
      homeSuggestionThree: "Today can be short, but it should feel true.",
      homeSuggestionFour: "Turn one vague sentence into one sentence that sounds like you.",
      composePageTitle: "Write and publish a post",
      composePageNote: "This editor stores posts in your browser and syncs them to the homepage right away.",
      fieldTitle: "Title",
      fieldTitlePlaceholder: "Write a title worth keeping",
      fieldCategory: "Category",
      fieldCategoryPlaceholder: "Work Notes",
      fieldDate: "Date",
      fieldSummary: "Summary",
      fieldSummaryPlaceholder: "Write a short summary for the homepage card",
      fieldBody: "Body",
      fieldBodyPlaceholder: "Write here. Leave one empty line between paragraphs.",
      clearAction: "Clear",
      footerNote: "Write what feels true first. A voice grows over time.",
      siteFooter: "© 2026 Mike. Built for quiet writing.",
      profileNoteDefault: "Notes on work, life, and slower thoughts.",
      profileNotePlaceholder: "Write the line you want to show under the avatar",
      backHome: "← Back to home",
      calendarKicker: "Almanac",
      calendarTitle: "Today's Panel",
      calendarDateLabel: "Date",
      calendarWeatherLabel: "Weather",
      calendarYiLabel: "Good For",
      calendarJiLabel: "Avoid",
      loading: "Loading...",
      postLoading: "Loading post",
      postNotFoundMeta: "Post Not Found",
      postNotFoundTitle: "This post is not available in this browser.",
      postNotFoundBody: "Published posts are stored in local browser storage. If you opened this page in another browser or device, the post will not appear.",
      validationMessage: "Complete every field before publishing.",
      publishMessage: `Published. <a href="{url}">Open the post</a>, or keep writing here.`,
      weatherLoading: "Fetching weather",
      weatherUnavailable: "Weather unavailable",
      fallbackLocation: "Shanghai",
      nearbyLocation: "Nearby weather",
      defaultLocation: "Default city",
      calendarLocationFallback: "Location not allowed, showing the default city.",
      sampleMetaOne: "2026.04.19 · Work Notes",
      sampleTitleOne: "In complex work, real value comes less from knowing everything and more from moving things forward",
      sampleExcerptOne: "A reflection on what matters in difficult work: clarity, trade-offs, pacing, and execution.",
      sampleMetaTwo: "2026.04.18 · Personal Growth",
      sampleTitleTwo: "Why I wanted a personal blog instead of writing only on social platforms",
      sampleExcerptTwo: "Not to build a personal brand, but to keep a place where writing stays personal, searchable, and calm.",
      weatherCodes: {
        0: "Clear",
        1: "Mostly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime fog",
        51: "Drizzle",
        53: "Light drizzle",
        55: "Dense drizzle",
        61: "Light rain",
        63: "Rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Heavy showers",
        82: "Violent showers",
        95: "Thunderstorm",
      },
      yiList: ["starting work", "writing", "taking a walk", "tidying up", "meeting friends", "reviewing notes", "reading", "updating plans", "drinking tea", "taking photos"],
      jiList: ["procrastinating", "staying up late", "impulse buying", "overthinking details", "coffee on an empty stomach", "sitting too long", "doomscrolling", "last-minute changes", "mental overconsumption", "hoarding tasks"],
    },
  };

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function readPosts() {
    return readJson(STORAGE_KEY, []);
  }

  function writePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function readAvatar() {
    return localStorage.getItem(AVATAR_KEY) || "";
  }

  function writeAvatar(dataUrl) {
    localStorage.setItem(AVATAR_KEY, dataUrl);
  }

  function readLanguage() {
    const language = localStorage.getItem(LANGUAGE_KEY);
    return language === "en" ? "en" : "zh";
  }

  function writeLanguage(language) {
    localStorage.setItem(LANGUAGE_KEY, language);
  }

  function readProfileNotes() {
    const notes = readJson(PROFILE_NOTE_KEY, {});
    return typeof notes === "object" && notes ? notes : {};
  }

  function writeProfileNotes(notes) {
    localStorage.setItem(PROFILE_NOTE_KEY, JSON.stringify(notes));
  }

  function readAuth() {
    return readJson(AUTH_KEY, { loggedIn: false, nickname: "" });
  }

  function writeAuth(payload) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
  }

  function readHiddenSamples() {
    return readJson(HIDDEN_SAMPLE_KEY, []);
  }

  function writeHiddenSamples(list) {
    localStorage.setItem(HIDDEN_SAMPLE_KEY, JSON.stringify(list));
  }

  function escapeSvg(value) {
    return encodeURIComponent(value)
      .replace(/%0A/g, "")
      .replace(/%20/g, " ");
  }

  function svgDataUrl(markup) {
    return `data:image/svg+xml;charset=UTF-8,${escapeSvg(markup)}`;
  }

  function renderPresetAvatarSvg(preset) {
    const [primary, secondary, accent] = preset.colors;

    if (preset.kind === "penguin") {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
          <rect width="64" height="64" rx="14" fill="#f6f1ff"/>
          <rect x="18" y="10" width="28" height="40" fill="${primary}"/>
          <rect x="22" y="14" width="20" height="8" fill="#ffffff"/>
          <rect x="22" y="24" width="20" height="18" fill="${secondary}"/>
          <rect x="26" y="18" width="4" height="4" fill="#171321"/>
          <rect x="34" y="18" width="4" height="4" fill="#171321"/>
          <rect x="30" y="24" width="4" height="4" fill="${accent}"/>
          <rect x="14" y="20" width="4" height="16" fill="${primary}"/>
          <rect x="46" y="20" width="4" height="16" fill="${primary}"/>
          <rect x="22" y="50" width="8" height="4" fill="${accent}"/>
          <rect x="34" y="50" width="8" height="4" fill="${accent}"/>
        </svg>
      `;
    }

    if (preset.kind === "bird") {
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
          <rect width="64" height="64" rx="14" fill="#fff7f0"/>
          <rect x="16" y="18" width="28" height="24" fill="${primary}"/>
          <rect x="22" y="12" width="20" height="12" fill="${primary}"/>
          <rect x="22" y="24" width="18" height="12" fill="${secondary}"/>
          <rect x="24" y="18" width="4" height="4" fill="#171321"/>
          <rect x="34" y="18" width="4" height="4" fill="#171321"/>
          <rect x="42" y="24" width="8" height="6" fill="${accent}"/>
          <rect x="20" y="42" width="6" height="8" fill="${accent}"/>
          <rect x="34" y="42" width="6" height="8" fill="${accent}"/>
        </svg>
      `;
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">
        <rect width="64" height="64" rx="14" fill="#f6f1ff"/>
        <rect x="18" y="12" width="28" height="28" fill="${primary}"/>
        <rect x="14" y="18" width="4" height="8" fill="${secondary}"/>
        <rect x="46" y="18" width="4" height="8" fill="${secondary}"/>
        <rect x="22" y="16" width="20" height="8" fill="${secondary}"/>
        <rect x="24" y="26" width="4" height="4" fill="#171321"/>
        <rect x="36" y="26" width="4" height="4" fill="#171321"/>
        <rect x="28" y="34" width="8" height="4" fill="${accent}"/>
        <rect x="22" y="44" width="6" height="6" fill="${primary}"/>
        <rect x="36" y="44" width="6" height="6" fill="${primary}"/>
      </svg>
    `;
  }

  function presetAvatarSrc(preset) {
    return svgDataUrl(renderPresetAvatarSvg(preset));
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function currentLanguage() {
    return readLanguage();
  }

  function t(key) {
    const language = currentLanguage();
    return I18N[language][key];
  }

  function formatDate(dateValue) {
    return dateValue.replaceAll("-", ".");
  }

  function getLocalDateInputValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function createCard(post) {
    const card = document.createElement("article");
    card.className = "post-card dynamic-post-card";
    card.dataset.slug = post.slug;
    card.innerHTML = `
      <button class="post-card-delete js-delete-post" type="button" data-slug="${escapeHtml(post.slug)}">${escapeHtml(t("deletePost"))}</button>
      <p class="post-meta">${escapeHtml(formatDate(post.date))} · ${escapeHtml(post.category)}</p>
      <h3><a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3>
      <p>${escapeHtml(post.excerpt)}</p>
    `;
    return card;
  }

  function ensureAuthGate() {
    const pageKey = document.body.dataset.pageKey;
    const auth = readAuth();
    const isLoggedIn = Boolean(auth && auth.loggedIn);

    if (pageKey === "login") {
      if (isLoggedIn) {
        window.location.replace("index.html");
        return true;
      }
      return false;
    }

    if (!isLoggedIn) {
      const redirect = encodeURIComponent(`${window.location.pathname.split("/").pop()}${window.location.search}${window.location.hash}`);
      window.location.replace(`login.html?redirect=${redirect}`);
      return true;
    }

    return false;
  }

  function renderStaticSamples() {
    const hidden = new Set(readHiddenSamples());
    document.querySelectorAll("[data-sample-slug]").forEach((card) => {
      const slug = card.dataset.sampleSlug || "";
      card.hidden = hidden.has(slug);
    });
  }

  function applyIdentity() {
    const auth = readAuth();
    const nickname = String(auth.nickname || "Mike").trim() || "Mike";
    document.querySelectorAll(".profile-name").forEach((node) => {
      node.textContent = nickname;
    });
  }

  function getThemeLabel(themeKey) {
    const theme = AUTO_THEMES[themeKey];
    if (!theme) return t("defaultThemeLabel");
    return currentLanguage() === "zh" ? theme.zh : theme.en;
  }

  function getThemeKicker(themeKey) {
    const theme = AUTO_THEMES[themeKey];
    if (!theme) return t("defaultThemeLabel");
    return currentLanguage() === "zh" ? theme.kickerZh : theme.kickerEn;
  }

  function classifyPost(post) {
    const content = `${post.title} ${post.category} ${post.excerpt} ${post.body}`.toLowerCase();
    let bestTheme = "growth";
    let bestScore = -1;

    Object.entries(AUTO_THEMES).forEach(([themeKey, theme]) => {
      const score = theme.keywords.reduce((sum, keyword) => {
        return sum + (content.includes(keyword.toLowerCase()) ? 1 : 0);
      }, 0);

      if (score > bestScore) {
        bestTheme = themeKey;
        bestScore = score;
      }
    });

    return bestTheme;
  }

  function withAutoTheme(post) {
    return {
      ...post,
      autoTheme: post.autoTheme || classifyPost(post),
    };
  }

  function renderHomePosts() {
    const grid = document.querySelector("#post-grid");
    if (!grid) return;

    grid.querySelectorAll(".dynamic-post-card").forEach((card) => {
      card.remove();
    });

    const posts = readPosts().map(withAutoTheme);
    posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((post) => {
        grid.prepend(createCard(post));
      });
  }

  function clusterPosts(posts) {
    return Object.keys(AUTO_THEMES).map((themeKey) => {
      return {
        themeKey,
        items: posts.filter((post) => (post.autoTheme || classifyPost(post)) === themeKey),
      };
    });
  }

  function countLabel(count) {
    const key = currentLanguage() === "en" && count === 1 ? "clusterCountSingle" : "clusterCountMany";
    return t(key).replace("{count}", String(count));
  }

  function createClusterCard(themeKey, items) {
    const card = document.createElement("article");
    card.className = "thought-cluster";
    const preview = items[0] ? items[0].excerpt : t("clusterEmpty");
    card.innerHTML = `
      <p class="section-kicker">${escapeHtml(getThemeKicker(themeKey))}</p>
      <h3 class="thought-cluster-title">${escapeHtml(getThemeLabel(themeKey))}</h3>
      <span class="thought-cluster-count">${escapeHtml(countLabel(items.length))}</span>
      <p class="thought-cluster-preview">${escapeHtml(preview)}</p>
    `;
    return card;
  }

  function renderThoughtClusters(postsInput) {
    const container = document.querySelector("#thought-clusters");
    if (!container) return;

    const posts = (postsInput || readPosts()).map(withAutoTheme);
    container.innerHTML = "";
    clusterPosts(posts).forEach(({ themeKey, items }) => {
      container.appendChild(createClusterCard(themeKey, items));
    });
  }

  function renderSpaceSummary(postsInput) {
    const countNode = document.querySelector("#space-post-count");
    const themeNode = document.querySelector("#space-main-theme");
    const latestNode = document.querySelector("#space-latest-date");
    const summaryNode = document.querySelector("#space-summary-copy");
    if (!countNode || !themeNode || !latestNode || !summaryNode) return;

    const posts = (postsInput || readPosts()).map(withAutoTheme);
    countNode.textContent = String(posts.length);

    if (!posts.length) {
      themeNode.textContent = t("defaultThemeLabel");
      latestNode.textContent = "--";
      summaryNode.textContent = t("spaceEmptySummary");
      return;
    }

    const sortedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    const clusters = clusterPosts(posts).sort((a, b) => b.items.length - a.items.length);
    const mainTheme = clusters[0] && clusters[0].items.length ? clusters[0].themeKey : "growth";

    themeNode.textContent = getThemeLabel(mainTheme);
    latestNode.textContent = formatDate(sortedPosts[0].date);
    summaryNode.textContent = t("spaceFilledSummary").replace("{theme}", getThemeLabel(mainTheme));
  }

  function deletePostBySlug(slug) {
    if (!slug) return;
    const currentPosts = readPosts().map(withAutoTheme);
    const nextPosts = currentPosts.filter((post) => post.slug !== slug);
    if (nextPosts.length === currentPosts.length) return;

    writePosts(nextPosts);

    const card = document.querySelector(`.post-card[data-slug="${CSS.escape(slug)}"]`);
    if (card) {
      card.remove();
    }

    renderThoughtClusters(nextPosts);
    renderSpaceSummary(nextPosts);

    const currentSlug = new URLSearchParams(window.location.search).get("slug");
    if (currentSlug === slug && document.body.dataset.pageKey === "post") {
      window.location.href = "index.html";
    }
  }

  function deleteSampleBySlug(sampleSlug) {
    if (!sampleSlug) return;

    const hidden = readHiddenSamples();
    if (!hidden.includes(sampleSlug)) {
      hidden.push(sampleSlug);
      writeHiddenSamples(hidden);
    }

    const card = document.querySelector(`[data-sample-slug="${sampleSlug}"]`);
    if (card) {
      card.remove();
    }
  }

  function initPostDeletion() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".js-delete-post");
      if (!button) return;

      const slug = button.dataset.slug || "";
      const sampleSlug = button.dataset.sampleSlug || "";
      if (!slug && !sampleSlug) return;

      if (!window.confirm(t("deleteConfirm"))) return;
      if (slug) {
        deletePostBySlug(slug);
      } else {
        deleteSampleBySlug(sampleSlug);
      }
    });
  }

  function applyAvatar() {
    const avatar = readAvatar();
    const hasAvatar = Boolean(avatar);

    document.querySelectorAll(".avatar-shell").forEach((shell) => {
      shell.classList.toggle("has-custom-avatar", hasAvatar);
    });

    if (!hasAvatar) return;

    document.querySelectorAll(".js-avatar").forEach((img) => {
      img.src = avatar;
    });
  }

  function initAvatarUpload() {
    const input = document.querySelector("#avatar-input");
    if (!input) return;

    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        if (!result) return;
        writeAvatar(result);
        applyAvatar();
      };
      reader.readAsDataURL(file);
    });
  }

  function initAvatarPicker() {
    const overlay = document.querySelector(".js-avatar-picker");
    const grid = document.querySelector(".js-avatar-presets");
    const closeButton = document.querySelector(".js-avatar-picker-close");
    const triggers = document.querySelectorAll(".js-avatar-trigger");
    if (!overlay || !grid || !triggers.length) return;

    grid.innerHTML = "";
    AVATAR_PRESETS.forEach((preset) => {
      const button = document.createElement("button");
      button.className = "avatar-option";
      button.type = "button";
      button.dataset.avatarId = preset.id;
      button.innerHTML = `
        <span class="avatar-option-preview" style="background-image:url('${presetAvatarSrc(preset)}')"></span>
        <strong class="avatar-option-name">${escapeHtml(currentLanguage() === "zh" ? preset.labelZh : preset.labelEn)}</strong>
        <span class="avatar-option-tag">${escapeHtml(currentLanguage() === "zh" ? preset.toneZh : preset.toneEn)}</span>
      `;
      button.addEventListener("click", () => {
        writeAvatar(presetAvatarSrc(preset));
        applyAvatar();
        overlay.hidden = true;
      });
      grid.appendChild(button);
    });

    function openPicker() {
      overlay.hidden = false;
    }

    function closePicker() {
      overlay.hidden = true;
    }

    triggers.forEach((trigger) => {
      if (trigger.dataset.avatarBound === "true") return;
      trigger.dataset.avatarBound = "true";
      trigger.addEventListener("click", openPicker);
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPicker();
        }
      });
    });

    if (closeButton.dataset.avatarBound !== "true") {
      closeButton.dataset.avatarBound = "true";
      closeButton.addEventListener("click", closePicker);
    }

    if (overlay.dataset.avatarBound !== "true") {
      overlay.dataset.avatarBound = "true";
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          closePicker();
        }
      });
    }

    if (document.body.dataset.avatarEscBound !== "true") {
      document.body.dataset.avatarEscBound = "true";
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closePicker();
        }
      });
    }
  }

  function initLogout() {
    document.querySelectorAll(".js-logout").forEach((button) => {
      button.addEventListener("click", () => {
        clearAuth();
        window.location.href = "login.html";
      });
    });
  }

  function initLoginPage() {
    if (document.body.dataset.pageKey !== "login") return;

    const tabs = document.querySelectorAll(".js-auth-tab");
    const forms = document.querySelectorAll(".js-auth-form");
    const message = document.querySelector(".js-login-message");
    const redirect = new URLSearchParams(window.location.search).get("redirect") || "index.html";

    function setMode(mode) {
      tabs.forEach((tab) => {
        tab.classList.toggle("is-active", tab.dataset.mode === mode);
      });
      forms.forEach((form) => {
        form.classList.toggle("is-hidden", form.dataset.mode !== mode);
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setMode(tab.dataset.mode || "wechat");
      });
    });

    document.querySelectorAll(".js-send-code").forEach((button) => {
      button.addEventListener("click", () => {
        if (message) {
          message.textContent = t("loginCodeSent");
        }
      });
    });

    forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const nickname = String(formData.get("nickname") || formData.get("email") || formData.get("phone") || "Mike").trim();
        writeAuth({
          loggedIn: true,
          nickname,
          mode: form.dataset.mode || "wechat",
        });
        if (message) {
          message.textContent = t("loginSuccess");
        }
        window.setTimeout(() => {
          window.location.href = redirect;
        }, 300);
      });
    });
  }

  function getProfileNote(language) {
    const notes = readProfileNotes();
    const custom = notes[language];
    return (custom && custom.trim()) || I18N[language].profileNoteDefault;
  }

  function applyProfileNotes() {
    const language = currentLanguage();
    const notes = readProfileNotes();
    const customValue = (notes[language] || "").trim();
    const displayValue = customValue || I18N[language].profileNoteDefault;

    document.querySelectorAll(".js-profile-note-display").forEach((node) => {
      node.textContent = displayValue;
    });

    document.querySelectorAll(".js-profile-note-input").forEach((input) => {
      input.value = customValue;
      input.placeholder = I18N[language].profileNotePlaceholder;
    });
  }

  function initProfileNoteEditor() {
    const wrappers = Array.from(document.querySelectorAll(".js-profile-note-inline"));
    if (!wrappers.length) return;

    function saveValue(rawValue) {
      const language = currentLanguage();
      const notes = readProfileNotes();
      const nextValue = rawValue.trim();

      if (nextValue) {
        notes[language] = nextValue;
      } else {
        delete notes[language];
      }

      writeProfileNotes(notes);
      applyProfileNotes();
    }

    function closeEditing(wrapper) {
      wrapper.classList.remove("is-editing");
    }

    function openEditing(wrapper, input) {
      wrapper.classList.add("is-editing");
      input.focus();
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }

    wrappers.forEach((wrapper) => {
      const display = wrapper.querySelector(".js-profile-note-display");
      const input = wrapper.querySelector(".js-profile-note-input");
      if (!display || !input) return;

      let lastSavedValue = "";

      function syncLastSavedValue() {
        const language = currentLanguage();
        const notes = readProfileNotes();
        lastSavedValue = (notes[language] || "").trim();
      }

      function saveFromInput() {
        const currentValue = input.value.trim();
        if (currentValue === lastSavedValue) return;
        saveValue(input.value);
        syncLastSavedValue();
      }

      syncLastSavedValue();

      display.addEventListener("click", () => {
        syncLastSavedValue();
        input.value = lastSavedValue;
        openEditing(wrapper, input);
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          saveFromInput();
          closeEditing(wrapper);
          return;
        }

        if (event.key === "Escape") {
          input.value = lastSavedValue;
          closeEditing(wrapper);
        }
      });

      input.addEventListener("input", () => {
        saveFromInput();
      });

      input.addEventListener("blur", () => {
        saveFromInput();
        closeEditing(wrapper);
      });
    });
  }

  function updatePageMeta() {
    const pageKey = document.body.dataset.pageKey;
    const pageMeta = PAGE_META[pageKey];
    if (!pageMeta) return;

    const language = currentLanguage();
    const meta = pageMeta[language];
    if (!meta) return;

    const titleNode = document.querySelector("#dynamic-title");
    if (pageKey === "post" && titleNode && titleNode.dataset.loadedTitle) {
      document.title = `Mike | ${titleNode.dataset.loadedTitle}`;
    } else {
      document.title = meta.title;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", meta.description);
    }
  }

  function applyTranslations() {
    const language = currentLanguage();

    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      const value = I18N[language][key];
      if (typeof value === "string") {
        node.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.dataset.i18nPlaceholder;
      const value = I18N[language][key];
      if (typeof value === "string") {
        node.setAttribute("placeholder", value);
      }
    });

    document.querySelectorAll(".js-lang-toggle").forEach((button) => {
      button.textContent = language === "zh" ? "EN" : "中文";
    });

    applyProfileNotes();
    updatePageMeta();
  }

  function initLanguageToggle() {
    const toggles = document.querySelectorAll(".js-lang-toggle");
    if (!toggles.length) return;

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const nextLanguage = currentLanguage() === "zh" ? "en" : "zh";
        writeLanguage(nextLanguage);
        applyTranslations();
        initAvatarPicker();
        renderHomePosts();
        renderThoughtClusters();
        renderSpaceSummary();
        renderDynamicPost();
        renderCalendar();
      });
    });
  }

  function renderDynamicPost() {
    const titleNode = document.querySelector("#dynamic-title");
    const metaNode = document.querySelector("#dynamic-meta");
    const bodyNode = document.querySelector("#dynamic-body");
    if (!titleNode || !metaNode || !bodyNode) return;

    const slug = new URLSearchParams(window.location.search).get("slug");
    const post = readPosts().find((item) => item.slug === slug);

    if (!post) {
      metaNode.textContent = t("postNotFoundMeta");
      titleNode.textContent = t("postNotFoundTitle");
      delete titleNode.dataset.loadedTitle;
      bodyNode.innerHTML = `<p>${escapeHtml(t("postNotFoundBody"))}</p>`;
      updatePageMeta();
      return;
    }

    document.title = `Mike | ${post.title}`;
    titleNode.dataset.loadedTitle = post.title;
    metaNode.textContent = `${formatDate(post.date)} · ${post.category}`;
    titleNode.textContent = post.title;

    const blocks = post.body
      .split(/\n\s*\n/)
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((chunk) => `<p>${escapeHtml(chunk).replace(/\n/g, "<br>")}</p>`)
      .join("");

    bodyNode.innerHTML = blocks;
  }

  function initComposer() {
    const form = document.querySelector("#post-form");
    if (!form) return;

    const dateInput = document.querySelector("#post-date");
    const message = document.querySelector("#publish-message");
    const clearButton = document.querySelector("#clear-form");

    if (dateInput && !dateInput.value) {
      dateInput.value = getLocalDateInputValue();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const title = String(formData.get("title") || "").trim();
      const category = String(formData.get("category") || "").trim();
      const date = String(formData.get("date") || "").trim();
      const excerpt = String(formData.get("excerpt") || "").trim();
      const body = String(formData.get("body") || "").trim();

      if (!title || !category || !date || !excerpt || !body) {
        message.textContent = t("validationMessage");
        return;
      }

      const posts = readPosts();
      const baseSlug = slugify(title) || `post-${Date.now()}`;
      let slug = baseSlug;
      let suffix = 1;

      while (posts.some((item) => item.slug === slug)) {
        suffix += 1;
        slug = `${baseSlug}-${suffix}`;
      }

      const newPost = withAutoTheme({ title, category, date, excerpt, body, slug });
      posts.push(newPost);
      writePosts(posts);

      const homeGrid = document.querySelector("#post-grid");
      if (homeGrid) {
        homeGrid.prepend(createCard(newPost));
      }
      renderThoughtClusters(posts);
      renderSpaceSummary(posts);

      message.innerHTML = t("publishMessage").replace("{url}", `post.html?slug=${encodeURIComponent(slug)}`);
      form.reset();
      dateInput.value = getLocalDateInputValue();
    });

    clearButton.addEventListener("click", () => {
      form.reset();
      dateInput.value = getLocalDateInputValue();
      message.textContent = "";
    });
  }

  function formatCalendarDate(date) {
    const language = currentLanguage();
    return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  }

  function pickFortuneItems(source, seed, count) {
    const picked = [];
    let offset = 0;

    while (picked.length < count && offset < source.length * 2) {
      const item = source[(seed + offset * 3) % source.length];
      if (!picked.includes(item)) {
        picked.push(item);
      }
      offset += 1;
    }

    return picked;
  }

  function renderFortune(date) {
    const yiNode = document.querySelector("#calendar-yi");
    const jiNode = document.querySelector("#calendar-ji");
    if (!yiNode || !jiNode) return;

    const language = currentLanguage();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const seed = year * 10000 + month * 100 + day;
    const separator = language === "zh" ? "、" : " / ";

    yiNode.textContent = pickFortuneItems(I18N[language].yiList, seed, 3).join(separator);
    jiNode.textContent = pickFortuneItems(I18N[language].jiList, seed + 7, 3).join(separator);
  }

  function weatherLabel(code) {
    const codes = I18N[currentLanguage()].weatherCodes;
    return codes[code] || t("weatherUnavailable");
  }

  function homeMoodByCode(code) {
    if (code >= 95) return t("homeMoodStorm");
    if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return t("homeMoodRainy");
    if (code >= 71 && code <= 75) return t("homeMoodSnow");
    if (code >= 1 && code <= 3) return t("homeMoodCloudy");
    return t("homeMoodSunny");
  }

  function renderHomePanelFallback() {
    const dateNode = document.querySelector("#home-date");
    const weatherNode = document.querySelector("#home-weather");
    const copyNode = document.querySelector("#home-mood-copy");
    const suggestionNode = document.querySelector("#home-suggestion");
    if (!dateNode || !weatherNode || !copyNode || !suggestionNode) return;

    const today = new Date();
    const suggestions = [
      t("homeSuggestionOne"),
      t("homeSuggestionTwo"),
      t("homeSuggestionThree"),
      t("homeSuggestionFour"),
    ];
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    dateNode.textContent = formatCalendarDate(today);
    weatherNode.textContent = t("weatherLoading");
    copyNode.textContent = t("homeMoodCloudy");
    suggestionNode.textContent = suggestions[seed % suggestions.length];
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation unavailable"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 600000,
      });
    });
  }

  async function fetchWeatherData(latitude, longitude) {
    const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
    endpoint.searchParams.set("latitude", String(latitude));
    endpoint.searchParams.set("longitude", String(longitude));
    endpoint.searchParams.set("current", "temperature_2m,weather_code");
    endpoint.searchParams.set("timezone", "auto");

    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    return response.json();
  }

  async function renderCalendar() {
    renderHomePanelFallback();

    const dateNode = document.querySelector("#calendar-date");
    const weatherNode = document.querySelector("#calendar-weather");
    const locationNode = document.querySelector("#calendar-location");
    const today = new Date();
    const homeDateNode = document.querySelector("#home-date");
    const homeWeatherNode = document.querySelector("#home-weather");
    const homeCopyNode = document.querySelector("#home-mood-copy");
    const homeSuggestionNode = document.querySelector("#home-suggestion");
    const hasCalendarPanel = Boolean(dateNode && weatherNode && locationNode);
    const suggestions = [
      t("homeSuggestionOne"),
      t("homeSuggestionTwo"),
      t("homeSuggestionThree"),
      t("homeSuggestionFour"),
    ];
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    if (homeDateNode) {
      homeDateNode.textContent = formatCalendarDate(today);
    }
    if (homeSuggestionNode) {
      homeSuggestionNode.textContent = suggestions[seed % suggestions.length];
    }

    if (hasCalendarPanel) {
      dateNode.textContent = formatCalendarDate(today);
      renderFortune(today);
      weatherNode.textContent = t("weatherLoading");
      locationNode.textContent = t("loading");
    }

    try {
      let latitude = DEFAULT_COORDS.latitude;
      let longitude = DEFAULT_COORDS.longitude;
      let locationLabel = t("fallbackLocation");

      try {
        const position = await getCurrentPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        locationLabel = t("nearbyLocation");
      } catch {
        locationLabel = `${t("fallbackLocation")} · ${t("defaultLocation")}`;
      }

      const weather = await fetchWeatherData(latitude, longitude);
      const current = weather && weather.current;
      if (!current) {
        throw new Error("Missing current weather");
      }

      const weatherText = `${weatherLabel(current.weather_code)} ${Math.round(current.temperature_2m)}°C`;

      if (homeWeatherNode) {
        homeWeatherNode.textContent = weatherText;
      }
      if (homeCopyNode) {
        homeCopyNode.textContent = homeMoodByCode(current.weather_code);
      }
      if (hasCalendarPanel) {
        weatherNode.textContent = weatherText;
        locationNode.textContent = locationLabel;
      }
    } catch {
      if (homeWeatherNode) {
        homeWeatherNode.textContent = t("weatherUnavailable");
      }
      if (homeCopyNode) {
        homeCopyNode.textContent = t("homeMoodCloudy");
      }
      if (hasCalendarPanel) {
        weatherNode.textContent = t("weatherUnavailable");
        locationNode.textContent = t("calendarLocationFallback");
      }
    }
  }

  if (ensureAuthGate()) return;

  applyTranslations();
  initLanguageToggle();

  if (document.body.dataset.pageKey === "login") {
    initLoginPage();
    return;
  }

  applyIdentity();
  applyAvatar();
  initAvatarUpload();
  initAvatarPicker();
  initLogout();
  initProfileNoteEditor();
  initPostDeletion();
  renderStaticSamples();
  renderHomePosts();
  renderThoughtClusters();
  renderSpaceSummary();
  renderDynamicPost();
  initComposer();
  renderCalendar();
})();
