const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const douyinVH = require('../douyin-vh.user.js');

test('translates an exact UI label while preserving surrounding whitespace', () => {
  assert.equal(douyinVH.translateExact('  推荐  '), '  Đề xuất  ');
});
test('exposes compact search styling', () => {
  assert.equal(douyinVH.searchStyle.text.includes('搜索你感兴趣的内容'), true);
  assert.equal(douyinVH.searchStyle.text.includes('Tìm nội dung bạn quan tâm'), true);
  assert.equal(douyinVH.searchStyle.text.includes('[data-e2e=searchbar-button]'), true);
  assert.equal(douyinVH.searchStyle.text.includes('div:has(> [data-e2e=searchbar-input]) > :not([data-e2e=searchbar-input])'), true);
  assert.equal(douyinVH.searchStyle.text.includes('line-height: 22px'), true);
  assert.equal(douyinVH.searchStyle.text.includes('font-size: 14px'), true);
  assert.equal(douyinVH.searchStyle.text.includes('white-space: nowrap !important'), true);
  assert.equal(douyinVH.searchStyle.text.includes('.xgplayer-setting-title'), true);
  assert.equal(douyinVH.searchStyle.text.includes('min-width: max-content'), true);
  assert.equal(douyinVH.searchStyle.text.includes('[data-douyin-vh-nowrap]'), true);
  assert.equal(douyinVH.searchStyle.text.includes('max-width: none'), true);
  assert.equal(douyinVH.searchStyle.text.includes('[data-douyin-vh-translated]'), true);
  assert.equal(douyinVH.searchStyle.text.includes('[data-douyin-vh-live-translated]'), true);
  assert.equal(douyinVH.searchStyle.text.includes('[data-douyin-vh-live-layer]'), false);
  assert.equal(douyinVH.searchStyle.text.includes('z-index'), false);
  assert.equal(douyinVH.searchStyle.text.includes('clip-path'), false);
  assert.equal(douyinVH.searchStyle.text.includes('pointer-events'), false);
  assert.equal(douyinVH.searchStyle.text.includes('word-break: keep-all'), true);
  assert.equal(douyinVH.searchStyle.text.includes('font-size: 10px'), true);
  assert.equal(douyinVH.searchStyle.text.includes('Segoe UI'), true);
  assert.equal(douyinVH.searchStyle.text.includes('font-kerning: normal'), true);
  assert.equal(douyinVH.searchStyle.text.includes('!important'), true);
});

test('does not expose or inject live player layer overrides', () => {
  assert.equal(douyinVH.liveDouyinStyle, undefined);
  assert.equal(douyinVH.createLiveDouyinController, undefined);
  assert.equal(douyinVH.calculateLivePlayerClipTop, undefined);
  assert.equal(douyinVH.calculateLivePlayerClipRight, undefined);
  assert.equal(douyinVH.calculateLivePlayerClipBottom, undefined);
});

test('marks translated popup-trigger labels so fixed navigation cells do not wrap', () => {
  const popupAttributes = new Map([
    ['data-popupid', 'wallpaper'],
    ['data-e2e', 'douyin-navigation'],
  ]);
  const labelAttributes = new Map();
  const popupTrigger = {
    nodeType: 1,
    tagName: 'DIV',
    parentElement: null,
    getAttribute(name) {
      return popupAttributes.get(name) || null;
    },
    setAttribute(name, value) {
      popupAttributes.set(name, value);
    },
  };
  const labelElement = {
    nodeType: 1,
    tagName: 'DIV',
    parentElement: popupTrigger,
    getAttribute(name) {
      return labelAttributes.get(name) || null;
    },
    setAttribute(name, value) {
      labelAttributes.set(name, value);
    },
    closest(selector) {
      return selector === '[data-popupid]'
        || selector.includes('[data-e2e=douyin-navigation]')
        ? popupTrigger
        : null;
    },
  };
  const textNode = {
    nodeType: 3,
    nodeValue: '壁纸',
    parentElement: labelElement,
  };

  douyinVH.translateTextNode(textNode);

  assert.equal(textNode.nodeValue, 'Hình nền');
  assert.equal(labelAttributes.get('data-douyin-vh-nowrap'), 'true');
  assert.equal(popupAttributes.get('data-douyin-vh-nowrap'), 'true');
});

test('marks translated safe-ui labels for Vietnamese font rendering', () => {
  const attributes = new Map();
  const navigationRoot = {
    nodeType: 1,
    tagName: 'NAV',
    parentElement: null,
  };
  const labelElement = {
    nodeType: 1,
    tagName: 'SPAN',
    parentElement: navigationRoot,
    getAttribute(name) {
      return attributes.get(name) || null;
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    closest(selector) {
      return selector.includes('[data-e2e=douyin-navigation]') ? navigationRoot : null;
    },
  };
  const textNode = {
    nodeType: 3,
    nodeValue: '朋友',
    parentElement: labelElement,
  };

  douyinVH.translateTextNode(textNode);

  assert.equal(textNode.nodeValue, 'Bạn bè');
  assert.equal(attributes.get('data-douyin-vh-translated'), 'true');
});

test('translates leaf labels rendered inside dynamic video players', () => {
  const leafNodes = ['发送', '倍速', '智能', '清屏', '连播', '听抖音', '下一章', '本场高光', '点击或按', '进入直播间', '视频标题'].map(value => ({
    nodeType: 1,
    tagName: 'SPAN',
    childElementCount: 0,
    textContent: value,
    closest() {
      return null;
    },
  }));
  const playerRoot = {
    nodeType: 1,
    tagName: 'DIV',
    childElementCount: leafNodes.length,
    closest() {
      return null;
    },
    querySelectorAll(selector) {
      if (selector !== '*') {
        assert.match(selector, /basePlayerContainer/u);
      }
      return leafNodes;
    },
  };
  const documentObject = {
    querySelectorAll() {
      return [playerRoot];
    },
  };

  douyinVH.scanPlayerUi(documentObject);

  assert.deepEqual(
    leafNodes.map(node => node.textContent),
    ['Gửi', 'Tốc độ', 'Thông minh', 'Xóa màn hình', 'Phát liên tục', 'Nghe Douyin', 'Chương tiếp theo', 'Điểm nổi bật', 'Nhấp hoặc nhấn', 'Vào phòng livestream', '视频标题'],
  );
});

test('translates player action labels and Chinese count units', () => {
  const leafNodes = ['点赞', '评论', '收藏', '分享', '39.8万', '1.2亿', '3055'].map(value => ({
    nodeType: 1,
    tagName: 'SPAN',
    childElementCount: 0,
    textContent: value,
    closest() {
      return null;
    },
  }));
  const playerRoot = {
    nodeType: 1,
    tagName: 'DIV',
    childElementCount: leafNodes.length,
    closest() {
      return null;
    },
    querySelectorAll(selector) {
      if (selector !== '*') {
        assert.match(selector, /basePlayerContainer/u);
      }
      return leafNodes;
    },
  };
  const documentObject = {
    querySelectorAll() {
      return [playerRoot];
    },
  };

  douyinVH.scanPlayerUi(documentObject);

  assert.deepEqual(
    leafNodes.map(node => node.textContent),
    ['Thích', 'Bình luận', 'Lưu', 'Chia sẻ', '39.8 vạn', '1.2 tỷ', '3055'],
  );
  assert.equal(douyinVH.translatePlayerCount('  39.8万  '), '  39.8 vạn  ');
});

test('translates split livestream entry prompt around the F key hint', () => {
  const attributes = new Map();
  const promptTextNodes = ['点击', '或按', '进入', '直播间'].map(value => ({
    nodeType: 3,
    nodeValue: value,
  }));
  const keyHint = {
    nodeType: 1,
    tagName: 'DIV',
    childElementCount: 0,
    textContent: '',
    parentElement: null,
  };
  const prompt = {
    nodeType: 1,
    tagName: 'DIV',
    childElementCount: 1,
    childNodes: [promptTextNodes[0], promptTextNodes[1], keyHint, promptTextNodes[2], promptTextNodes[3]],
    parentElement: null,
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    closest() {
      return null;
    },
  };
  for (const textNode of promptTextNodes) {
    textNode.parentElement = prompt;
  }
  keyHint.parentElement = prompt;

  const liveRoot = {
    nodeType: 1,
    tagName: 'DIV',
    childElementCount: 1,
    childNodes: [],
    closest() {
      return null;
    },
    querySelectorAll(selector) {
      assert.equal(selector, '*');
      return [prompt];
    },
  };
  const documentObject = {
    querySelectorAll(selector) {
      assert.match(selector, /LivePlayer/u);
      return [liveRoot];
    },
  };

  douyinVH.scanPlayerUi(documentObject);

  assert.deepEqual(
    promptTextNodes.map(textNode => textNode.nodeValue),
    ['Nhấp', ' hoặc nhấn ', ' để vào', ' phòng livestream'],
  );
  assert.equal(attributes.get('data-douyin-vh-translated'), 'true');
});

test('translates livestream gifts, recharge and audience filters without scanning chat content', () => {
  function createLeaf(value) {
    const attributes = new Map();
    return {
      nodeType: 1,
      tagName: 'DIV',
      childElementCount: 0,
      childNodes: [],
      textContent: value,
      parentElement: null,
      getAttribute(name) {
        return attributes.get(name) || null;
      },
      setAttribute(name, nextValue) {
        attributes.set(name, nextValue);
      },
      closest() {
        return null;
      },
      attributes,
    };
  }

  function createContainer(children, initialAttributes = {}) {
    const attributes = new Map(Object.entries(initialAttributes));
    const container = {
      nodeType: 1,
      tagName: 'DIV',
      childElementCount: children.length,
      childNodes: children,
      children,
      parentElement: null,
      getAttribute(name) {
        return attributes.get(name) || null;
      },
      setAttribute(name, nextValue) {
        attributes.set(name, nextValue);
      },
      closest() {
        return null;
      },
      querySelectorAll(selector) {
        assert.equal(selector, '*');
        const descendants = [];
        for (const child of children) {
          descendants.push(child);
          if (typeof child.querySelectorAll === 'function') {
            descendants.push(...child.querySelectorAll('*'));
          }
        }
        return descendants;
      },
      querySelector(selector) {
        if (selector !== '[data-e2e=live-chatting]') {
          return null;
        }
        return [container, ...container.querySelectorAll('*')].find(element => (
          element.getAttribute?.('data-e2e') === 'live-chatting'
        )) || null;
      },
      attributes,
    };
    for (const child of children) {
      child.parentElement = container;
    }
    return container;
  }

  const giftLeaves = [
    '人气票',
    '小心心',
    '星河之钥',
    '大啤酒',
    '棒棒糖',
    '给到夯',
    '玫瑰',
    '天作之合',
    '鲜花',
    '七夕快乐',
    '心疼',
    '2钻',
  ].map(createLeaf);
  const giftsRoot = createContainer(giftLeaves);

  const rechargeRoot = createContainer([createLeaf('充值')]);

  const audienceLabel = createLeaf('在线观众');
  const audienceCount = createLeaf('5');
  const audienceHeader = createContainer([audienceLabel, audienceCount]);
  const audienceFilters = createContainer([
    createLeaf('全部'),
    createLeaf('1000贡献用户(0)'),
    createLeaf('高等级用户'),
  ]);
  const chatRoot = createContainer([], { 'data-e2e': 'live-chatting' });
  const audiencePanel = createContainer([audienceHeader, audienceFilters, chatRoot]);
  const liveSurface = createContainer([giftsRoot, rechargeRoot, audiencePanel]);
  const appRoot = createContainer([liveSurface]);
  const body = {
    nodeType: 1,
    tagName: 'BODY',
    children: [appRoot],
    parentElement: null,
  };
  appRoot.parentElement = body;

  const documentObject = {
    body,
    querySelectorAll(selector) {
      if (selector === '[data-e2e=gifts-container]') {
        return [giftsRoot];
      }
      if (selector === '[data-e2e=recharge-btn]') {
        return [rechargeRoot];
      }
      if (selector === '[data-e2e=live-room-audience]') {
        return [audienceCount];
      }
      return [];
    },
  };

  douyinVH.scanLiveUi(documentObject);

  assert.deepEqual(
    giftLeaves.map(node => node.textContent),
    [
      'Vé phổ biến',
      'Tim nhỏ',
      'Chìa ngân hà',
      'Bia lớn',
      'Kẹo mút',
      'Đủ lực',
      'Hoa hồng',
      'Duyên trời',
      'Hoa tươi',
      'Vui Thất Tịch',
      'Thương quá',
      '2 kim cương',
    ],
  );
  assert.equal(rechargeRoot.children[0].textContent, 'Nạp tiền');
  assert.equal(audienceLabel.textContent, 'Người xem trực tuyến');
  assert.deepEqual(
    audienceFilters.children.map(node => node.textContent),
    ['Tất cả', 'Đóng góp 1000 (0)', 'Cấp cao'],
  );
});


test('translates live homepage labels without translating room or username content', () => {
  function createLeaf(value) {
    const attributes = new Map();
    return {
      nodeType: 1,
      tagName: 'DIV',
      childElementCount: 0,
      childNodes: [],
      textContent: value,
      parentElement: null,
      getAttribute(name) {
        return attributes.get(name) || null;
      },
      setAttribute(name, nextValue) {
        attributes.set(name, nextValue);
      },
      closest() {
        return null;
      },
      attributes,
    };
  }

  function createContainer(children, dataE2e = null) {
    const attributes = new Map(dataE2e ? [['data-e2e', dataE2e]] : []);
    const container = {
      nodeType: 1,
      tagName: 'DIV',
      childElementCount: children.length,
      childNodes: children,
      children,
      parentElement: null,
      getAttribute(name) {
        return attributes.get(name) || null;
      },
      setAttribute(name, nextValue) {
        attributes.set(name, nextValue);
      },
      closest() {
        return null;
      },
      querySelectorAll(selector) {
        assert.equal(selector, '*');
        const descendants = [];
        for (const child of children) {
          descendants.push(child);
          if (typeof child.querySelectorAll === 'function') {
            descendants.push(...child.querySelectorAll('*'));
          }
        }
        return descendants;
      },
      attributes,
    };
    for (const child of children) {
      child.parentElement = container;
    }
    return container;
  }

  const categoryRoot = createContainer([
    createLeaf('聊天'),
    createLeaf('舞蹈'),
    createLeaf('文化'),
    createLeaf('运动'),
  ], 'categoryTabs-container');
  const followingRoot = createContainer([createLeaf('我的关注')], 'category-tabslist');
  const liveHomeRoot = createContainer([
    createLeaf('更多直播'),
    createLeaf('全部'),
    createLeaf('音乐'),
    createLeaf('主播'),
    createLeaf('暂时离开'),
    createLeaf('Room title'),
  ]);
  const documentObject = {
    querySelectorAll(selector) {
      if (selector === '[data-e2e=categoryTabs-container]') {
        return [categoryRoot];
      }
      if (selector === '[data-e2e=category-tabslist]') {
        return [followingRoot];
      }
      if (selector === '#_douyin_live_scroll_container_') {
        return [liveHomeRoot];
      }
      return [];
    },
  };

  douyinVH.scanLiveUi(documentObject);

  assert.deepEqual(
    categoryRoot.children.map(node => node.textContent),
    ['Trò chuyện', 'Múa', 'Văn hóa', 'Thể thao'],
  );
  assert.equal(followingRoot.children[0].textContent, 'Đang theo dõi');
  assert.deepEqual(
    liveHomeRoot.children.map(node => node.textContent),
    ['Thêm livestream', 'Tất cả', 'Âm nhạc', 'Chủ phòng', 'Tạm thời rời đi', 'Room title'],
  );
});


test('translates series navigation and card metadata without translating titles', () => {
  function createLeaf(value) {
    const attributes = new Map();
    return {
      nodeType: 1,
      tagName: 'DIV',
      childElementCount: 0,
      childNodes: [],
      textContent: value,
      parentElement: null,
      getAttribute(name) {
        return attributes.get(name) || null;
      },
      setAttribute(name, nextValue) {
        attributes.set(name, nextValue);
      },
      closest() {
        return null;
      },
      attributes,
    };
  }

  function createContainer(children) {
    const container = {
      nodeType: 1,
      tagName: 'DIV',
      childElementCount: children.length,
      childNodes: children,
      children,
      parentElement: null,
      getAttribute() {
        return null;
      },
      setAttribute() {},
      closest() {
        return null;
      },
      querySelectorAll(selector) {
        assert.equal(selector, '*');
        const descendants = [];
        for (const child of children) {
          descendants.push(child);
          if (typeof child.querySelectorAll === 'function') {
            descendants.push(...child.querySelectorAll('*'));
          }
        }
        return descendants;
      },
    };
    for (const child of children) {
      child.parentElement = container;
    }
    return container;
  }

  const navigationRoot = createContainer([
    createLeaf('推荐'),
    createLeaf('热榜'),
    createLeaf('榜单'),
    createLeaf('爱情'),
    createLeaf('剧情'),
    createLeaf('逆袭'),
    createLeaf('反转'),
    createLeaf('亲情'),
    createLeaf('恩怨'),
    createLeaf('玄幻'),
    createLeaf('奇幻'),
    createLeaf('古装'),
    createLeaf('悬疑'),
    createLeaf('友情'),
    createLeaf('喜剧'),
    createLeaf('犯罪'),
    createLeaf('惊悚'),
    createLeaf('青春'),
    createLeaf('科幻'),
    createLeaf('仙侠'),
    createLeaf('其他'),
  ]);
  const title = createLeaf('五十岁隐藏身份，我遇见真爱');
  const exactTitle = createLeaf('爱情');
  const viewCount = createLeaf('14.8亿');
  const metadata = createLeaf('恩怨斗争·69集');
  const cardRoot = createContainer([viewCount, title, exactTitle, metadata]);
  const documentObject = {
    querySelectorAll(selector) {
      if (selector === 'main *') {
        return [navigationRoot];
      }
      if (selector === '[data-e2e=scroll-list]') {
        return [cardRoot];
      }
      return [];
    },
  };

  douyinVH.scanSeriesUi(documentObject);

  assert.deepEqual(
    navigationRoot.children.map(node => node.textContent),
    [
      'Đề xuất',
      'Bảng xếp hạng hot',
      'Bảng xếp hạng',
      'Tình yêu',
      'Chính kịch',
      'Nghịch tập',
      'Lật ngược',
      'Tình thân',
      'Ân oán',
      'Huyền huyễn',
      'Kỳ ảo',
      'Cổ trang',
      'Trinh thám',
      'Tình bạn',
      'Hài kịch',
      'Tội phạm',
      'Giật gân',
      'Thanh xuân',
      'Khoa học viễn tưởng',
      'Tiên hiệp',
      'Khác',
    ],
  );
  assert.equal(viewCount.textContent, '14.8 tỷ');
  assert.equal(metadata.textContent, 'Ân oán đấu tranh · 69 tập');
  assert.equal(title.textContent, '五十岁隐藏身份，我遇见真爱');
  assert.equal(exactTitle.textContent, '爱情');
});

test('adds and removes compact search styling with the controller lifecycle', () => {
  const styles = new Map();
  const head = {
    appendChild(style) {
      style.parentNode = this;
      styles.set(style.id, style);
    },
    removeChild(style) {
      styles.delete(style.id);
      style.parentNode = null;
    },
  };
  const documentObject = {
    documentElement: {
      nodeType: 1,
      tagName: 'HTML',
      querySelectorAll() {
        return [];
      },
    },
    head,
    getElementById(id) {
      return styles.get(id) || null;
    },
    createElement(tagName) {
      return {
        tagName: tagName.toUpperCase(),
        setAttribute() {},
        remove() {
          head.removeChild(this);
        },
      };
    },
    createTreeWalker() {
      return { nextNode: () => null };
    },
  };

  const controller = douyinVH.createController({ document: documentObject });
  controller.start();

  assert.equal(styles.size, 1);
  assert.equal(styles.get(douyinVH.searchStyle.id).textContent, douyinVH.searchStyle.text);

  controller.stop();

  assert.equal(styles.size, 0);
});

test('does not translate unknown or embedded user content', () => {
  assert.equal(douyinVH.translateExact('推荐这条视频'), '推荐这条视频');
  assert.equal(douyinVH.translateExact('nini摇'), 'nini摇');
});

test('allows interactive controls inside a player but blocks ordinary feed content', () => {
  assert.equal(douyinVH.isTextNodeAllowed({
    isContentArea: true,
    isInteractive: true,
    isSafeUiArea: false,
  }), true);
  assert.equal(douyinVH.isTextNodeAllowed({
    isContentArea: true,
    isInteractive: false,
    isSafeUiArea: false,
  }), false);
});

test('exposes translations observed in the Douyin shell', () => {
  assert.equal(douyinVH.translations['搜索'], 'Tìm kiếm');
  assert.equal(douyinVH.translations['搜索你感兴趣的内容'], 'Tìm nội dung bạn quan tâm');
  assert.equal(douyinVH.translations['清屏'], 'Xóa màn hình');
  assert.equal(douyinVH.translations['连播'], 'Phát liên tục');
});

test('translates system labels in the chapter video modal', () => {
  const expectedTranslations = {
    '手机随时看更方便': 'Xem tiện hơn trên điện thoại',
    '下载 APP': 'Tải ứng dụng',
    '下一章': 'Chương tiếp theo',
    '详情': 'Chi tiết',
    'TA的作品': 'Tác phẩm của họ',
    '相关推荐': 'Đề xuất liên quan',
    '章节要点': 'Điểm chính của chương',
    '内容由AI生成': 'Nội dung do AI tạo',
    '点击推荐': 'Nhấn để đề xuất',
    '引言': 'Mở đầu',
    '音乐特点': 'Đặc điểm âm nhạc',
  };

  for (const [source, expected] of Object.entries(expectedTranslations)) {
    assert.equal(douyinVH.translateExact(source), expected, source);
  }

  assert.equal(
    douyinVH.translateExact('第2章：蜜璃的特殊体质'),
    '第2章：蜜璃的特殊体质',
  );
});

test('translates UI attributes on descendant controls', () => {
  const attributes = { placeholder: '搜索' };
  const input = {
    nodeType: 1,
    tagName: 'INPUT',
    closest(selector) {
      if (selector.includes('contenteditable')) {
        return null;
      }
      return selector.includes('input') || selector.includes('nav') ? this : null;
    },
    getAttribute(name) {
      return attributes[name] || null;
    },
    setAttribute(name, value) {
      attributes[name] = value;
    },
    querySelectorAll() {
      return [];
    },
  };

  douyinVH.translateElementAttributes(input);

  assert.equal(attributes.placeholder, 'Tìm kiếm');
});

test('translates the recommendation topic tabs and accessibility labels', () => {
  const expectedTranslations = {
    '全部': 'Tất cả',
    '公开课': 'Khóa học mở',
    '游戏': 'Trò chơi',
    '二次元': 'Anime',
    '音乐': 'Âm nhạc',
    '影视': 'Phim ảnh',
    '美食': 'Ẩm thực',
    '知识': 'Kiến thức',
    '生活': 'Đời sống',
    '体育': 'Thể thao',
    '旅行': 'Du lịch',
    '亲子': 'Gia đình',
    '动物': 'Động vật',
    '三农': 'Nông nghiệp',
    '汽车': 'Ô tô',
    '美妆': 'Làm đẹp',
    '穿搭': 'Thời trang',
    '开启读屏标签': 'Bật nhãn đọc màn hình',
    '读屏标签已关闭': 'Nhãn đọc màn hình đã tắt',
  };

  for (const [source, expected] of Object.entries(expectedTranslations)) {
    assert.equal(douyinVH.translateExact(source), expected, source);
  }
});

test('translates combined topic tabs and exact system badges outside standard UI regions', () => {
  assert.equal(douyinVH.translateExact('生活vlog'), 'Đời sống vlog');
  assert.equal(douyinVH.translateExact('美妆穿搭'), 'Làm đẹp và thời trang');
  assert.equal(douyinVH.translateExact('你的关注'), 'Đang theo dõi');
  assert.equal(douyinVH.translateExact('共创'), 'Đồng sáng tạo');
  assert.equal(douyinVH.isGlobalUiLabel('读屏标签已关闭'), true);
  assert.equal(douyinVH.isGlobalUiLabel('caption của người dùng'), false);
});

test('translates the remaining profile and footer labels', () => {
  const expectedTranslations = {
    '下载抖音精选': 'Tải Douyin Nổi bật',
    '网络谣言曝光台': 'Trung tâm vạch trần tin đồn mạng',
    '网上有害信息举报': 'Báo cáo thông tin có hại trên mạng',
    '违法和不良信息举报': 'Báo cáo thông tin vi phạm và không lành mạnh',
    '算法推荐专项举报': 'Báo cáo chuyên đề về đề xuất thuật toán',
    '体育饭圈专项举报': 'Báo cáo chuyên đề về fandom thể thao',
    '广告投放': 'Đặt quảng cáo',
    '用户服务协议': 'Thỏa thuận dịch vụ người dùng',
    '账号找回': 'Khôi phục tài khoản',
    '联系我们': 'Liên hệ với chúng tôi',
    '加入我们': 'Tham gia cùng chúng tôi',
    '营业执照': 'Giấy phép kinh doanh',
    '友情链接': 'Liên kết hữu ích',
    '站点地图': 'Sơ đồ trang web',
    '下载抖音': 'Tải Douyin',
    '抖音电商': 'Thương mại điện tử Douyin',
    '保存登录信息': 'Lưu thông tin đăng nhập',
    '我的预约': 'Lịch hẹn của tôi',
    '批量管理': 'Quản lý hàng loạt',
    '私密作品': 'Tác phẩm riêng tư',
    '合集': 'Bộ sưu tập',
    '短剧': 'Phim ngắn',
    '搜索你发布的作品': 'Tìm kiếm tác phẩm bạn đã đăng',
    '日期筛选': 'Lọc theo ngày',
    '该账号还未发布过作品哦～': 'Tài khoản này chưa đăng tác phẩm nào～',
  };

  for (const [source, expected] of Object.entries(expectedTranslations)) {
    assert.equal(douyinVH.translateExact(source), expected, source);
  }
});

test('translates profile-only dynamic labels and leaves feed-like text unchanged', () => {
  const profileElement = {
    closest(selector) {
      return selector.includes('user-info') ? this : null;
    },
  };
  const genderElement = {
    tagName: 'SPAN',
    closest(selector) {
      return selector.includes('user-info') ? this : null;
    },
    parentElement: {
      querySelector(selector) {
        return selector === 'svg' ? this : null;
      },
    },
  };

  assert.equal(
    douyinVH.translateProfileText('  6人正在直播  ', profileElement),
    '  6 người đang phát trực tiếp  ',
  );
  assert.equal(
    douyinVH.translateProfileText('抖音号：1844133415', profileElement),
    'Douyin ID: 1844133415',
  );
  assert.equal(douyinVH.translateProfileText('男', genderElement), 'Nam');
  assert.equal(
    douyinVH.translateProfileText('热门：6人正在直播', profileElement),
    '热门：6人正在直播',
  );
  assert.equal(
    douyinVH.translateProfileText('6人正在直播', { closest: () => null }),
    '6人正在直播',
  );
});

test('translates a text node in a footer without throwing', () => {
  const textNode = {
    nodeType: 3,
    nodeValue: '广告投放',
    parentElement: {
      tagName: 'DIV',
      closest(selector) {
        return selector.includes('footer') ? this : null;
      },
    },
  };

  douyinVH.translateTextNode(textNode);

  assert.equal(textNode.nodeValue, 'Đặt quảng cáo');
});

test('translates footer report prefixes without changing contact details', () => {
  const footerElement = {
    closest(selector) {
      return selector.includes('footer') ? this : null;
    },
  };
  const footerText = '｜ 违法和不良信息举报：400-140-2108 feedback@douyin.com ｜ 算法推荐专项举报：sfjubao@bytedance.com | 体育饭圈专项举报：tyfq@bytedance.com';

  assert.equal(
    douyinVH.translateFooterText(footerText, footerElement),
    '｜ Báo cáo thông tin vi phạm và không lành mạnh：400-140-2108 feedback@douyin.com ｜ Báo cáo chuyên đề về đề xuất thuật toán：sfjubao@bytedance.com | Báo cáo chuyên đề về fandom thể thao：tyfq@bytedance.com',
  );
});

test('translates profile labels split across adjacent text nodes', () => {
  const profileElement = {
    tagName: 'DIV',
    closest(selector) {
      return selector.includes('user-info') ? this : null;
    },
  };
  const textNodes = [
    { nodeType: 3, nodeValue: '抖音号：', parentElement: profileElement },
    { nodeType: 3, nodeValue: '1844133415', parentElement: profileElement },
  ];
  profileElement.childNodes = textNodes;

  douyinVH.translateTextNode(textNodes[0]);

  assert.equal(textNodes[0].nodeValue, 'Douyin ID: 1844133415');
  assert.equal(textNodes[1].nodeValue, '');
});

test('translates profile empty states and navigation labels in their safe regions', () => {
  const emptyStateNode = {
    nodeType: 3,
    nodeValue: '暂无内容',
    parentElement: {
      tagName: 'P',
      closest(selector) {
        return selector.includes('user-post-list') ? this : null;
      },
    },
  };
  const navigationNode = {
    nodeType: 3,
    nodeValue: '下载抖音精选',
    parentElement: {
      tagName: 'DIV',
      closest(selector) {
        return selector.includes('douyin-navigation') ? this : null;
      },
    },
  };

  douyinVH.translateTextNode(emptyStateNode);
  douyinVH.translateTextNode(navigationNode);

  assert.equal(emptyStateNode.nodeValue, 'Chưa có nội dung');
  assert.equal(navigationNode.nodeValue, 'Tải Douyin Nổi bật');
});

test('translates account and creator popup labels without translating video titles', () => {
  const expectedTranslations = {
    '我的喜欢': 'Đã thích',
    '我的收藏': 'Đã lưu',
    '我的作品': 'Tác phẩm của tôi',
    '我的订单': 'Đơn hàng của tôi',
    '30天内': 'Trong 30 ngày',
    '发布视频/图文': 'Đăng video / bài viết',
    '视频管理': 'Quản lý video',
    '作品数据': 'Dữ liệu tác phẩm',
    '开直播': 'Bắt đầu phát trực tiếp',
    '直播数据': 'Dữ liệu livestream',
    '创作者学习中心': 'Trung tâm học tập dành cho nhà sáng tạo',
    '创作者中心': 'Trung tâm nhà sáng tạo',
    '剪映专业版': 'CapCut Pro',
    'AI音乐创作': 'Sáng tác nhạc bằng AI',
  };

  for (const [source, expected] of Object.entries(expectedTranslations)) {
    assert.equal(douyinVH.translateExact(source), expected, source);
  }

  assert.equal(
    douyinVH.translateExact('44分钟经典草原歌曲合集。#草原歌曲'),
    '44分钟经典草原歌曲合集。#草原歌曲',
  );
});

test('translates lower settings and support popup labels', () => {
  const expectedTranslations = {
    '默认首页设置': 'Cài đặt trang chủ mặc định',
    '启动时，默认进入：': 'Khi khởi động, mặc định vào:',
    '推荐频道': 'Kênh Đề xuất',
    '精选频道': 'Kênh Nổi bật',
    '关注频道': 'Kênh Theo dõi',
    '深浅模式': 'Chế độ sáng/tối',
    '通用设置': 'Cài đặt chung',
    '隐私设置': 'Cài đặt quyền riêng tư',
    '通知设置': 'Cài đặt thông báo',
    'AI设置': 'Cài đặt AI',
    '键盘快捷键': 'Phím tắt',
    '常见问题': 'Câu hỏi thường gặp',
    '我的客服': 'Dịch vụ khách hàng',
  };

  for (const [source, expected] of Object.entries(expectedTranslations)) {
    assert.equal(douyinVH.translateExact(source), expected, source);
  }
});

test('translates upper-right application and notification popup labels', () => {
  const expectedTranslations = {
    '下载电脑客户端': 'Tải ứng dụng máy tính',
    '互动消息': 'Thông báo tương tác',
    '全部消息': 'Tất cả thông báo',
    '赞了你的评论': 'Đã thích bình luận của bạn',
    '回复了你的评论': 'Đã trả lời bình luận của bạn',
    '暂时没有更多了': 'Không còn thông báo nào',
    '对方回复或关注你之前，只能发送一条文字消息。请礼貌发言，自觉遵守《抖音自律公约》': 'Trước khi đối phương trả lời hoặc theo dõi bạn, bạn chỉ có thể gửi một tin nhắn văn bản. Vui lòng phát biểu lịch sự và tự giác tuân thủ “Quy ước tự quản Douyin”.',
  };

  for (const [source, expected] of Object.entries(expectedTranslations)) {
    assert.equal(douyinVH.translateExact(source), expected, source);
  }

  const popupTextNodes = Object.keys(expectedTranslations).map(source => ({
    nodeType: 3,
    nodeValue: source,
    parentElement: {
      tagName: 'DIV',
      closest() {
        return null;
      },
    },
  }));

  for (const textNode of popupTextNodes) {
    douyinVH.translateTextNode(textNode);
  }

  assert.deepEqual(
    popupTextNodes.map(textNode => textNode.nodeValue),
    Object.values(expectedTranslations),
  );
});

test('translates the final about and creator-services popup', () => {
  const expectedTranslations = {
    '关于抖音': 'Về Douyin',
    '官方网站': 'Trang web chính thức',
    '关于我们': 'Về chúng tôi',
    '规则中心': 'Trung tâm quy tắc',
    '创作服务': 'Dịch vụ sáng tạo',
    '身份认证': 'Xác minh danh tính',
    'MCN入驻': 'Đăng ký MCN',
    '社会机构入驻': 'Đăng ký tổ chức xã hội',
    '安全与信任中心': 'Trung tâm an toàn và tin cậy',
    '抖音直播伴侣': 'Trợ lý livestream Douyin',
    '生活服务': 'Dịch vụ đời sống',
    '开放平台': 'Nền tảng mở',
  };

  for (const [source, expected] of Object.entries(expectedTranslations)) {
    assert.equal(douyinVH.translateExact(source), expected, source);
  }
});

test('starts in a browser page even when a CommonJS-like module global exists', () => {
  const source = fs.readFileSync(require.resolve('../douyin-vh.user.js'), 'utf8');
  const documentElement = {
    nodeType: 1,
    tagName: 'HTML',
    closest() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };
  const page = {
    document: {
      documentElement,
      createTreeWalker() {
        return { nextNode: () => null };
      },
    },
    module: { exports: { sentinel: true } },
  };
  page.window = page;
  page.globalThis = page;

  vm.runInNewContext(source, page);

  assert.equal(page.__douyinVHController.started, true);
  assert.deepEqual(page.module.exports, { sentinel: true });
});

test('uses window as the browser root when globalThis is an isolated realm', () => {
  const source = fs.readFileSync(require.resolve('../douyin-vh.user.js'), 'utf8');
  const documentElement = {
    nodeType: 1,
    tagName: 'HTML',
    closest() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };
  const windowObject = {
    document: {
      documentElement,
      createTreeWalker() {
        return { nextNode: () => null };
      },
    },
  };
  windowObject.window = windowObject;
  const realm = {
    window: windowObject,
    module: { exports: { sentinel: true } },
  };
  realm.globalThis = realm;

  vm.runInNewContext(source, realm);

  assert.equal(windowObject.__douyinVHController.started, true);
});
