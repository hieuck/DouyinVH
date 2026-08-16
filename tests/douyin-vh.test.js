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
  assert.equal(douyinVH.searchStyle.text.includes('font-size: 14px'), true);
  assert.equal(douyinVH.searchStyle.text.includes('!important'), true);
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
