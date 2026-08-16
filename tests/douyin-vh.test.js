const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const douyinVH = require('../douyin-vh.user.js');

test('translates an exact UI label while preserving surrounding whitespace', () => {
  assert.equal(douyinVH.translateExact('  推荐  '), '  Đề xuất  ');
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
  assert.equal(douyinVH.translations['清屏'], 'Xóa màn hình');
  assert.equal(douyinVH.translations['连播'], 'Phát liên tục');
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
