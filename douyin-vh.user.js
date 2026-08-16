// ==UserScript==
// @name         Douyin Việt Hóa
// @namespace    https://github.com/douyin-vh
// @version      0.2.1
// @description  Việt hóa giao diện web Douyin, không dịch nội dung feed.
// @match        https://www.douyin.com/*
// @updateURL    https://github.com/hieuck/DouyinVH/raw/refs/heads/main/douyin-vh.user.js
// @downloadURL  https://github.com/hieuck/DouyinVH/raw/refs/heads/main/douyin-vh.user.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function bootstrap(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    api.start();
  }
}(typeof globalThis === 'object' ? globalThis : this, function createApi(root) {
  'use strict';

  const translations = Object.freeze({
    '精选': 'Nổi bật',
    '推荐': 'Đề xuất',
    'AI抖音': 'Douyin AI',
    '关注': 'Theo dõi',
    '朋友': 'Bạn bè',
    '我的': 'Của tôi',
    '直播': 'Trực tiếp',
    '放映厅': 'Phòng chiếu',
    '短剧': 'Phim ngắn',
    '小游戏': 'Trò chơi nhỏ',
    '全部': 'Tất cả',
    '公开课': 'Khóa học mở',
    '游戏': 'Trò chơi',
    '二次元': 'Anime',
    '音乐': 'Âm nhạc',
    '影视': 'Phim ảnh',
    '美食': 'Ẩm thực',
    '知识': 'Kiến thức',
    '小剧场': 'Sân khấu nhỏ',
    '生活': 'Đời sống',
    '体育': 'Thể thao',
    '旅行': 'Du lịch',
    '亲子': 'Gia đình',
    '动物': 'Động vật',
    '三农': 'Nông nghiệp',
    '汽车': 'Ô tô',
    '美妆': 'Làm đẹp',
    '穿搭': 'Thời trang',
    '搜索': 'Tìm kiếm',
    '充钻石': 'Nạp kim cương',
    '客户端': 'Ứng dụng máy tính',
    '壁纸': 'Hình nền',
    '通知': 'Thông báo',
    '消息': 'Tin nhắn',
    '投稿': 'Đăng bài',
    '听抖音': 'Nghe Douyin',
    '倍速': 'Tốc độ',
    '倍速播放': 'Tốc độ phát',
    '智能': 'Thông minh',
    '清屏': 'Xóa màn hình',
    '连播': 'Phát liên tục',
    '发送': 'Gửi',
    '点赞': 'Thích',
    '已赞': 'Đã thích',
    '评论': 'Bình luận',
    '评论区': 'Khu vực bình luận',
    '收藏': 'Lưu',
    '已收藏': 'Đã lưu',
    '分享': 'Chia sẻ',
    '下载': 'Tải xuống',
    '复制链接': 'Sao chép liên kết',
    '举报': 'Báo cáo',
    '不感兴趣': 'Không quan tâm',
    '已关注': 'Đã theo dõi',
    '取消关注': 'Bỏ theo dõi',
    '登录': 'Đăng nhập',
    '注册': 'Đăng ký',
    '登录/注册': 'Đăng nhập / Đăng ký',
    '退出登录': 'Đăng xuất',
    '设置': 'Cài đặt',
    '反馈': 'Phản hồi',
    '帮助与反馈': 'Trợ giúp và phản hồi',
    '返回': 'Quay lại',
    '下一条': 'Video tiếp theo',
    '上一条': 'Video trước',
    '暂停': 'Tạm dừng',
    '播放': 'Phát',
    '静音': 'Tắt tiếng',
    '取消静音': 'Bật tiếng',
    '全屏': 'Toàn màn hình',
    '退出全屏': 'Thoát toàn màn hình',
    '自动播放': 'Tự động phát',
    '写评论': 'Viết bình luận',
    '发布': 'Đăng',
    '展开': 'Mở rộng',
    '收起': 'Thu gọn',
    '更多': 'Thêm',
    '加载中': 'Đang tải',
    '暂无内容': 'Chưa có nội dung',
    '网络错误': 'Lỗi mạng',
    '刷新': 'Làm mới',
    '确认': 'Xác nhận',
    '取消': 'Hủy',
    '确定': 'Đồng ý',
    '知道了': 'Đã hiểu',
    '关闭': 'Đóng',
    '开启': 'Bật',
    '保存': 'Lưu',
    '删除': 'Xóa',
    '编辑': 'Chỉnh sửa',
    '热搜': 'Tìm kiếm phổ biến',
    '热门': 'Phổ biến',
    '直播中': 'Đang phát trực tiếp',
    '查看全部': 'Xem tất cả',
    '私信': 'Tin nhắn riêng',
    '粉丝': 'Người hâm mộ',
    '获赞': 'Lượt thích nhận được',
    '作品': 'Tác phẩm',
    '喜欢': 'Đã thích',
    '历史记录': 'Lịch sử',
    '观看历史': 'Lịch sử xem',
    '稍后再看': 'Xem sau',
    '请登录': 'Vui lòng đăng nhập',
    '扫码登录': 'Đăng nhập bằng mã QR',
    '验证码登录': 'Đăng nhập bằng mã xác minh',
    '账号登录': 'Đăng nhập bằng tài khoản',
    '手机号': 'Số điện thoại',
    '密码': 'Mật khẩu',
    '获取验证码': 'Lấy mã xác minh',
    '同意': 'Đồng ý',
    '用户协议': 'Thỏa thuận người dùng',
    '隐私政策': 'Chính sách quyền riêng tư',
    '我知道了': 'Tôi đã hiểu',
    '切换账号': 'Chuyển tài khoản',
    '创作者服务中心': 'Trung tâm dịch vụ nhà sáng tạo',
    '个人主页': 'Trang cá nhân',
    '关注列表': 'Danh sách đang theo dõi',
    '粉丝列表': 'Danh sách người hâm mộ',
    '消息通知': 'Thông báo tin nhắn',
    '系统通知': 'Thông báo hệ thống',
    '评论和@': 'Bình luận và @',
    '开启读屏标签': 'Bật nhãn đọc màn hình',
    '读屏标签已关闭': 'Nhãn đọc màn hình đã tắt',
  });

  const SAFE_UI_SELECTOR = [
    'header',
    'nav',
    'aside',
    '[role=banner]',
    '[role=navigation]',
    '[role=dialog]',
    '[role=menu]',
    '[role=tooltip]',
    '[data-e2e*=header]',
    '[data-e2e*=sidebar]',
    '[data-e2e*=toolbar]',
    '[data-e2e*=search]',
  ].join(',');

  const INTERACTIVE_SELECTOR = [
    'button',
    'a',
    'input',
    'textarea',
    'select',
    '[role=button]',
    '[role=link]',
    '[role=menuitem]',
    '[role=tab]',
    '[role=option]',
  ].join(',');

  const CONTENT_SELECTOR = [
    'article',
    '[data-e2e*=feed]',
    '[data-e2e*=comment]',
    '[data-e2e*=caption]',
    '[data-e2e*=desc]',
    '[data-e2e*=author]',
    '[data-e2e*=username]',
    '[contenteditable=true]',
  ].join(',');

  const IGNORED_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg']);
  const UI_ATTRIBUTES = Object.freeze(['title', 'aria-label', 'placeholder']);

  function normalizeText(value) {
    return typeof value === 'string' ? value.replace(/\s+/gu, ' ').trim() : '';
  }

  function translateExact(value) {
    if (typeof value !== 'string') {
      return value;
    }

    const normalized = normalizeText(value);
    if (!normalized || !Object.prototype.hasOwnProperty.call(translations, normalized)) {
      return value;
    }

    const leadingWhitespace = value.match(/^\s*/u)?.[0] || '';
    const trailingWhitespace = value.match(/\s*$/u)?.[0] || '';
    return leadingWhitespace + translations[normalized] + trailingWhitespace;
  }

  function isTextNodeAllowed({
    isContentArea = false,
    isInteractive = false,
    isSafeUiArea = false,
  } = {}) {
    if (isContentArea) {
      return isInteractive;
    }
    return isSafeUiArea || isInteractive;
  }

  function hasClosest(element, selector) {
    return Boolean(element && typeof element.closest === 'function' && element.closest(selector));
  }

  function isIgnoredElement(element) {
    const tagName = String(element?.tagName || '').toLowerCase();
    return IGNORED_TAGS.has(tagName) || hasClosest(element, '[contenteditable=true]');
  }

  function getElementContext(element) {
    return {
      isContentArea: hasClosest(element, CONTENT_SELECTOR),
      isInteractive: hasClosest(element, INTERACTIVE_SELECTOR),
      isSafeUiArea: hasClosest(element, SAFE_UI_SELECTOR),
    };
  }

  function translateAttribute(element, attributeName) {
    if (!element || isIgnoredElement(element) || typeof element.getAttribute !== 'function') {
      return;
    }

    const context = getElementContext(element);
    if (!isTextNodeAllowed(context)) {
      return;
    }

    const currentValue = element.getAttribute(attributeName);
    const translatedValue = translateExact(currentValue);
    if (translatedValue !== currentValue && typeof element.setAttribute === 'function') {
      element.setAttribute(attributeName, translatedValue);
    }
  }

  function translateTextNode(textNode) {
    if (!textNode || textNode.nodeType !== 3) {
      return;
    }

    const parentElement = textNode.parentElement;
    if (!parentElement || isIgnoredElement(parentElement)) {
      return;
    }

    if (!isTextNodeAllowed(getElementContext(parentElement))) {
      return;
    }

    const currentValue = textNode.nodeValue;
    const translatedValue = translateExact(currentValue);
    if (translatedValue !== currentValue) {
      textNode.nodeValue = translatedValue;
    }
  }

  function translateElementAttributes(element) {
    if (!element || element.nodeType !== 1 || isIgnoredElement(element)) {
      return;
    }

    const elements = [element];
    if (typeof element.querySelectorAll === 'function') {
      elements.push(...element.querySelectorAll('*'));
    }

    for (const currentElement of elements) {
      if (isIgnoredElement(currentElement)) {
        continue;
      }
      for (const attributeName of UI_ATTRIBUTES) {
        translateAttribute(currentElement, attributeName);
      }
    }
  }

  function getTextNodeFilter(documentObject) {
    return documentObject?.defaultView?.NodeFilter?.SHOW_TEXT
      || root?.NodeFilter?.SHOW_TEXT
      || 4;
  }

  function translateElement(element, documentObject) {
    if (!element || element.nodeType !== 1 || isIgnoredElement(element)) {
      return;
    }

    translateElementAttributes(element);

    if (!documentObject || typeof documentObject.createTreeWalker !== 'function') {
      return;
    }

    const walker = documentObject.createTreeWalker(element, getTextNodeFilter(documentObject));
    let textNode = walker.nextNode();
    while (textNode) {
      translateTextNode(textNode);
      textNode = walker.nextNode();
    }
  }

  function scanNode(node, documentObject) {
    if (!node) {
      return;
    }

    if (node.nodeType === 1) {
      translateElement(node, documentObject);
    } else if (node.nodeType === 3) {
      translateTextNode(node);
    }
  }

  function createController(options = {}) {
    const documentObject = options.document || root?.document;
    const MutationObserverConstructor = options.MutationObserver || root?.MutationObserver;
    const schedule = typeof options.setTimeout === 'function'
      ? options.setTimeout
      : typeof root?.setTimeout === 'function'
        ? root.setTimeout.bind(root)
        : callback => callback();
    const cancel = typeof options.clearTimeout === 'function'
      ? options.clearTimeout
      : typeof root?.clearTimeout === 'function'
        ? root.clearTimeout.bind(root)
        : () => {};

    let observer = null;
    let timer = null;
    let started = false;

    function scan() {
      if (documentObject?.documentElement) {
        scanNode(documentObject.documentElement, documentObject);
      }
    }

    function queueScan() {
      if (timer !== null) {
        return;
      }
      timer = schedule(() => {
        timer = null;
        scan();
      }, 0);
    }

    const controller = {
      start() {
        if (started || !documentObject?.documentElement) {
          return controller;
        }

        started = true;
        scan();

        if (typeof MutationObserverConstructor === 'function') {
          observer = new MutationObserverConstructor(records => {
            if (records.some(record => (
              record.type === 'childList'
              || record.type === 'characterData'
              || record.type === 'attributes'
            ))) {
              queueScan();
            }
          });
          observer.observe(documentObject.documentElement, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: [...UI_ATTRIBUTES],
          });
        }

        return controller;
      },

      stop() {
        observer?.disconnect();
        observer = null;
        if (timer !== null) {
          cancel(timer);
          timer = null;
        }
        started = false;
        return controller;
      },

      scan,

      get started() {
        return started;
      },
    };

    return controller;
  }

  function start(options = {}) {
    if (root?.__douyinVHController) {
      return root.__douyinVHController;
    }

    const controller = createController({
      ...options,
      document: options.document || root?.document,
      MutationObserver: options.MutationObserver || root?.MutationObserver,
    });
    root.__douyinVHController = controller.start();
    return root.__douyinVHController;
  }

  function stop() {
    const controller = root?.__douyinVHController;
    if (controller) {
      controller.stop();
      delete root.__douyinVHController;
    }
  }

  return Object.freeze({
    translations,
    normalizeText,
    translateExact,
    isTextNodeAllowed,
    translateElementAttributes,
    createController,
    start,
    stop,
  });
}));
