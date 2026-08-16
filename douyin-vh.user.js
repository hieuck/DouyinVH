// ==UserScript==
// @name         Douyin Việt Hóa
// @namespace    https://github.com/douyin-vh
// @version      0.9.7
// @description  Việt hóa giao diện web Douyin, không dịch nội dung feed.
// @match        https://www.douyin.com/*
// @updateURL    https://raw.githubusercontent.com/hieuck/DouyinVH/main/douyin-vh.user.js
// @downloadURL  https://raw.githubusercontent.com/hieuck/DouyinVH/main/douyin-vh.user.js
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function bootstrap(root, factory) {
  const api = factory(root);
  const isCommonJsRuntime = typeof module === 'object'
    && module.exports
    && typeof window === 'undefined';
  if (isCommonJsRuntime) {
    module.exports = api;
  } else {
    api.start();
  }
}(typeof window === 'object'
  ? window
  : typeof globalThis === 'object'
    ? globalThis
    : this, function createApi(root) {
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
    '手机随时看更方便': 'Xem tiện hơn trên điện thoại',
    '下载 APP': 'Tải ứng dụng',
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
    '生活vlog': 'Đời sống vlog',
    '体育': 'Thể thao',
    '旅行': 'Du lịch',
    '亲子': 'Gia đình',
    '动物': 'Động vật',
    '三农': 'Nông nghiệp',
    '汽车': 'Ô tô',
    '美妆': 'Làm đẹp',
    '穿搭': 'Thời trang',
    '美妆穿搭': 'Làm đẹp và thời trang',
    '搜索': 'Tìm kiếm',
    '搜索你感兴趣的内容': 'Tìm nội dung bạn quan tâm',
    '充钻石': 'Nạp kim cương',
    '客户端': 'Ứng dụng máy tính',
    '下载电脑客户端': 'Tải ứng dụng máy tính',
    '壁纸': 'Hình nền',
    '通知': 'Thông báo',
    '消息': 'Tin nhắn',
    '互动消息': 'Thông báo tương tác',
    '全部消息': 'Tất cả thông báo',
    '赞了你的评论': 'Đã thích bình luận của bạn',
    '回复了你的评论': 'Đã trả lời bình luận của bạn',
    '暂时没有更多了': 'Không còn thông báo nào',
    '对方回复或关注你之前，只能发送一条文字消息。请礼貌发言，自觉遵守《抖音自律公约》': 'Trước khi đối phương trả lời hoặc theo dõi bạn, bạn chỉ có thể gửi một tin nhắn văn bản. Vui lòng phát biểu lịch sự và tự giác tuân thủ “Quy ước tự quản Douyin”.',
    '投稿': 'Đăng bài',
    '听抖音': 'Nghe Douyin',
    '倍速': 'Tốc độ',
    '倍速播放': 'Tốc độ phát',
    '智能': 'Thông minh',
    '清屏': 'Xóa màn hình',
    '连播': 'Phát liên tục',
    '发送': 'Gửi',
    '下一章': 'Chương tiếp theo',
    '详情': 'Chi tiết',
    'TA的作品': 'Tác phẩm của họ',
    '相关推荐': 'Đề xuất liên quan',
    '章节要点': 'Điểm chính của chương',
    '内容由AI生成': 'Nội dung do AI tạo',
    '点击推荐': 'Nhấn để đề xuất',
    '引言': 'Mở đầu',
    '音乐特点': 'Đặc điểm âm nhạc',
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
    '保存登录信息': 'Lưu thông tin đăng nhập',
    '我的预约': 'Lịch hẹn của tôi',
    '批量管理': 'Quản lý hàng loạt',
    '私密作品': 'Tác phẩm riêng tư',
    '合集': 'Bộ sưu tập',
    '搜索你发布的作品': 'Tìm kiếm tác phẩm bạn đã đăng',
    '日期筛选': 'Lọc theo ngày',
    '该账号还未发布过作品哦～': 'Tài khoản này chưa đăng tác phẩm nào～',
    '关注列表': 'Danh sách đang theo dõi',
    '粉丝列表': 'Danh sách người hâm mộ',
    '消息通知': 'Thông báo tin nhắn',
    '系统通知': 'Thông báo hệ thống',
    '评论和@': 'Bình luận và @',
    '开启读屏标签': 'Bật nhãn đọc màn hình',
    '读屏标签已关闭': 'Nhãn đọc màn hình đã tắt',
    '你的关注': 'Đang theo dõi',
    '共创': 'Đồng sáng tạo',
    '正在直播': 'Đang phát trực tiếp',
    '本场高光': 'Điểm nổi bật',
    '点击或按': 'Nhấp hoặc nhấn',
    '进入直播间': 'Vào phòng livestream',
  });

  const SEARCH_STYLE_ID = 'douyin-vh-search-style';
  const NO_WRAP_ATTRIBUTE = 'data-douyin-vh-nowrap';
  const TRANSLATED_ATTRIBUTE = 'data-douyin-vh-translated';
  const SEARCH_PLACEHOLDER = translations[String.fromCodePoint(
    0x641c,
    0x7d22,
    0x4f60,
    0x611f,
    0x5174,
    0x8da3,
    0x7684,
    0x5185,
    0x5bb9,
  )];
  const SEARCH_STYLE_TEXT = [
    '[data-e2e=searchbar-input],',
    `input[placeholder='__DOUYIN_VH_SEARCH_SOURCE__'],`,
    `input[placeholder='__DOUYIN_VH_SEARCH_TRANSLATED__'],`,
    '[data-e2e=searchbar-button] {',
    '  font-size: 14px !important;',
    '}',
    '',
    '[data-e2e=searchbar-button],',
    '.xgplayer-setting-label,',
    '.xgplayer-setting-title,',
    '.xgplayer-setting-playbackRatio {',
    '  white-space: nowrap !important;',
    '  width: max-content !important;',
    '  min-width: max-content !important;',
    '  flex-shrink: 0 !important;',
    '}',
    '.xgplayer-immersive-switch-setting,',
    '.xgplayer-autoplay-setting,',
    '.xgplayer-immersive-switch-setting .xgplayer-icon,',
    '.xgplayer-autoplay-setting .xgplayer-icon,',
    '.xgplayer-immersive-switch-setting .xgplayer-setting-label,',
    '.xgplayer-autoplay-setting .xgplayer-setting-label {',
    '  width: max-content !important;',
    '  min-width: max-content !important;',
    '  flex-shrink: 0 !important;',
    '}',
    `[${NO_WRAP_ATTRIBUTE}] {`,
    '  white-space: nowrap !important;',
    '  width: max-content !important;',
    '  min-width: max-content !important;',
    '  max-width: none !important;',
    '  flex-shrink: 0 !important;',
     '  word-break: keep-all !important;',
     '}',
     `[${TRANSLATED_ATTRIBUTE}] {`,
     '  font-family: Segoe UI, Tahoma, Arial, sans-serif !important;',
     '  font-kerning: normal !important;',
     '  font-variant-ligatures: normal !important;',
     '  letter-spacing: normal !important;',
     '  word-spacing: normal !important;',
     '}',
   ].join(String.fromCharCode(10))
    .replace('__DOUYIN_VH_SEARCH_SOURCE__', String.fromCodePoint(
      0x641c,
      0x7d22,
      0x4f60,
      0x611f,
      0x5174,
      0x8da3,
      0x7684,
      0x5185,
      0x5bb9,
    ))
    .replace('__DOUYIN_VH_SEARCH_TRANSLATED__', SEARCH_PLACEHOLDER);

  const SAFE_UI_SELECTOR = [
    'header',
    'nav',
    'aside',
    'footer',
    '[role=banner]',
    '[role=navigation]',
    '[role=dialog]',
    '[role=menu]',
    '[role=tooltip]',
    '[data-e2e*=header]',
    '[data-e2e*=sidebar]',
    '[data-e2e*=toolbar]',
    '[data-e2e*=search]',
    '[data-e2e=page-footer]',
    '[data-e2e=douyin-navigation]',
    '[data-e2e=user-info-follow]',
    '[data-e2e^=user-info-]',
    '[data-e2e=user-post-list]',
    '[id*=user-tabbar]',
    '[class*=trust-login-switch]',
    '[class*=user-post-list]',
    '[class*=coopPanel]',
    '[data-e2e=chapter-container]',
    '[class*=chapterContainer]',
    '[class*=chapterVideoCard]',
    '[class*=modalPlayer]',
  ].join(',');

  const PROFILE_USER_INFO_SELECTOR = '[data-e2e=user-info], [class*=user-info]';
  const FOOTER_SELECTOR = 'footer, [data-e2e=page-footer]';
  const FOOTER_PREFIX_TRANSLATIONS = Object.freeze({
    '网络谣言曝光台': translations['网络谣言曝光台'],
    '网上有害信息举报': translations['网上有害信息举报'],
    '违法和不良信息举报': translations['违法和不良信息举报'],
    '算法推荐专项举报': translations['算法推荐专项举报'],
    '体育饭圈专项举报': translations['体育饭圈专项举报'],
  });

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
  const GLOBAL_UI_LABELS = new Set([
    '开启读屏标签',
    '读屏标签已关闭',
    '你的关注',
    '共创',
    '下载电脑客户端',
    '互动消息',
    '全部消息',
    '赞了你的评论',
    '回复了你的评论',
    '暂时没有更多了',
    '对方回复或关注你之前，只能发送一条文字消息。请礼貌发言，自觉遵守《抖音自律公约》',
  ]);
  const PLAYER_UI_SELECTOR = [
    '[class*=modalPlayer]',
    '[class*=basePlayerContainer]',
    '[class*=douyin-player-controls]',
    '[data-e2e=feed-live]',
    '[data-e2e=chapter-container]',
    '[class*=chapterVideoCard]',
  ].join(',');
  const PLAYER_UI_LABELS = new Set([
    '发送',
    '倍速',
    '智能',
    '清屏',
    '连播',
    '听抖音',
    '下一章',
    '点击推荐',
    '消息',
    '点赞',
    '已赞',
    '评论',
    '评论区',
    '收藏',
    '已收藏',
    '分享',
    '详情',
    'TA的作品',
    '相关推荐',
    '本场高光',
    '点击或按',
    '进入直播间',
    '直播中',
    '章节要点',
    '内容由AI生成',
    '引言',
    '音乐特点',
  ]);
  const PLAYER_COUNT_PATTERN = /^(\s*\d[\d.,]*)(万|亿)(\s*)$/u;

  function normalizeText(value) {
    return typeof value === 'string' ? value.replace(/\s+/gu, ' ').trim() : '';
  }

  function isGlobalUiLabel(value) {
    return GLOBAL_UI_LABELS.has(normalizeText(value));
  }

  function translateExact(value) {
    if (typeof value !== 'string') {
      return value;
    }

    const normalized = normalizeText(value);
    if (!normalized || !Object.prototype.hasOwnProperty.call(translations, normalized)) {
      return value;
    }

    return replaceNormalizedText(value, translations[normalized]);
  }

  function translatePlayerCount(value) {
    if (typeof value !== 'string') {
      return value;
    }

    return value.replace(PLAYER_COUNT_PATTERN, (_, number, unit, trailingWhitespace) => (
      `${number} ${unit === '万' ? 'vạn' : 'tỷ'}${trailingWhitespace}`
    ));
  }

  function replaceNormalizedText(value, replacement) {
    const leadingWhitespace = value.match(/^\s*/u)?.[0] || '';
    const trailingWhitespace = value.match(/\s*$/u)?.[0] || '';
    return leadingWhitespace + replacement + trailingWhitespace;
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

  function markNoWrapUiAncestors(element) {
    if (!hasClosest(element, '[data-popupid]')) {
      return;
    }

    let currentElement = element;
    while (currentElement && currentElement.nodeType === 1) {
      if (typeof currentElement.setAttribute === 'function') {
        currentElement.setAttribute(NO_WRAP_ATTRIBUTE, 'true');
      }

      const isPopupTrigger = typeof currentElement.getAttribute === 'function'
        && currentElement.getAttribute('data-popupid') !== null;
      if (isPopupTrigger) {
        break;
      }
      currentElement = currentElement.parentElement;
    }
  }

  function markTranslatedUiElement(element) {
    if (element && element.nodeType === 1 && typeof element.setAttribute === 'function') {
      element.setAttribute(TRANSLATED_ATTRIBUTE, 'true');
    }
  }

  function isProfileGenderElement(element) {
    return Boolean(
      element
      && String(element.tagName || '').toLowerCase() === 'span'
      && element.parentElement
      && typeof element.parentElement.querySelector === 'function'
      && element.parentElement.querySelector('svg')
      && hasClosest(element, PROFILE_USER_INFO_SELECTOR),
    );
  }

  function isProfileDynamicLabel(value, element) {
    const normalized = normalizeText(value);
    if (!hasClosest(element, PROFILE_USER_INFO_SELECTOR)) {
      return false;
    }

    return /^\d[\d,.]*人正在直播$/u.test(normalized)
      || /^抖音号：.+$/u.test(normalized)
      || (normalized === '男' && isProfileGenderElement(element));
  }

  function translateProfileText(value, element) {
    const translatedValue = translateExact(value);
    if (translatedValue !== value) {
      return translatedValue;
    }

    if (!isProfileDynamicLabel(value, element)) {
      return value;
    }

    const normalized = normalizeText(value);
    const liveMatch = normalized.match(/^(\d[\d,.]*)人正在直播$/u);
    if (liveMatch) {
      return replaceNormalizedText(value, `${liveMatch[1]} người đang phát trực tiếp`);
    }

    const accountMatch = normalized.match(/^抖音号：(.+)$/u);
    if (accountMatch) {
      return replaceNormalizedText(value, `Douyin ID: ${accountMatch[1]}`);
    }

    return replaceNormalizedText(value, 'Nam');
  }

  function translateFooterText(value, element) {
    if (typeof value !== 'string' || !hasClosest(element, FOOTER_SELECTOR)) {
      return value;
    }

    let translatedValue = value;
    for (const [source, replacement] of Object.entries(FOOTER_PREFIX_TRANSLATIONS)) {
      translatedValue = translatedValue.replaceAll(source, replacement);
    }
    return translatedValue;
  }

  function translateUiText(value, element) {
    return translateFooterText(translateProfileText(value, element), element);
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
    const translatedValue = translateUiText(currentValue, element);
    if (translatedValue !== currentValue && typeof element.setAttribute === 'function') {
      element.setAttribute(attributeName, translatedValue);
      markTranslatedUiElement(element);
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

    const currentValue = textNode.nodeValue;
    const textNodes = getTextOnlyChildNodes(parentElement);
    const combinedValue = textNodes.length > 0
      ? textNodes.map(node => node.nodeValue || '').join('')
      : currentValue;
    const context = getElementContext(parentElement);
    const isProfileLabel = isProfileDynamicLabel(currentValue, parentElement)
      || isProfileDynamicLabel(combinedValue, parentElement);
    if (
      !isTextNodeAllowed(context)
      && !isGlobalUiLabel(currentValue)
      && !isGlobalUiLabel(combinedValue)
      && !isProfileLabel
    ) {
      return;
    }

    const combinedTranslation = textNodes.length > 0
      ? translateUiText(combinedValue, parentElement)
      : currentValue;
    if (textNodes.length > 0 && combinedTranslation !== combinedValue) {
      if (textNode !== textNodes[0]) {
        return;
      }
      textNodes[0].nodeValue = combinedTranslation;
      for (const remainingNode of textNodes.slice(1)) {
        remainingNode.nodeValue = '';
      }
      markTranslatedUiElement(parentElement);
      markNoWrapUiAncestors(parentElement);
      return;
    }

    const translatedValue = translateUiText(currentValue, parentElement);
    if (translatedValue !== currentValue) {
      textNode.nodeValue = translatedValue;
      markTranslatedUiElement(parentElement);
      markNoWrapUiAncestors(parentElement);
    }
  }

  function getTextOnlyChildNodes(element) {
    if (!element || !element.childNodes) {
      return [];
    }

    const childNodes = Array.from(element.childNodes);
    return childNodes.length > 1 && childNodes.every(node => node.nodeType === 3)
      ? childNodes
      : [];
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

  function translatePlayerLeafText(element) {
    if (!element || element.nodeType !== 1 || isIgnoredElement(element)) {
      return;
    }

    if (Number(element.childElementCount || 0) > 0) {
      return;
    }

    const currentValue = element.textContent;
    const normalizedValue = normalizeText(currentValue);
    if (!PLAYER_UI_LABELS.has(normalizedValue) && !PLAYER_COUNT_PATTERN.test(currentValue)) {
      return;
    }

    const translatedValue = PLAYER_UI_LABELS.has(normalizedValue)
      ? translateExact(currentValue)
      : translatePlayerCount(currentValue);
    if (translatedValue !== currentValue) {
      element.textContent = translatedValue;
      markTranslatedUiElement(element);
    }
  }

  function scanPlayerUi(documentObject) {
    if (!documentObject || typeof documentObject.querySelectorAll !== 'function') {
      return;
    }

    const roots = documentObject.querySelectorAll(PLAYER_UI_SELECTOR);
    for (const rootElement of roots) {
      const elements = [rootElement];
      if (typeof rootElement.querySelectorAll === 'function') {
        elements.push(...rootElement.querySelectorAll('*'));
      }

      for (const element of elements) {
        translatePlayerLeafText(element);
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

  function ensureSearchStyle(documentObject) {
    if (!documentObject || typeof documentObject.createElement !== 'function') {
      return;
    }

    let style = typeof documentObject.getElementById === 'function'
      ? documentObject.getElementById(SEARCH_STYLE_ID)
      : null;
    if (!style) {
      style = documentObject.createElement('style');
      style.id = SEARCH_STYLE_ID;
      const parent = documentObject.head || documentObject.documentElement;
      if (!parent || typeof parent.appendChild !== 'function') {
        return;
      }
      parent.appendChild(style);
    }

    style.textContent = SEARCH_STYLE_TEXT;
  }

  function removeSearchStyle(documentObject) {
    if (!documentObject || typeof documentObject.getElementById !== 'function') {
      return;
    }

    const style = documentObject.getElementById(SEARCH_STYLE_ID);
    if (!style) {
      return;
    }

    if (typeof style.remove === 'function') {
      style.remove();
    } else if (style.parentNode && typeof style.parentNode.removeChild === 'function') {
      style.parentNode.removeChild(style);
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
        scanPlayerUi(documentObject);
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
        ensureSearchStyle(documentObject);
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
        removeSearchStyle(documentObject);
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
    searchStyle: Object.freeze({
      id: SEARCH_STYLE_ID,
      text: SEARCH_STYLE_TEXT,
    }),
    normalizeText,
    isGlobalUiLabel,
    translateExact,
    translatePlayerCount,
    translateProfileText,
    translateFooterText,
    translateTextNode,
    translatePlayerLeafText,
    scanPlayerUi,
    isTextNodeAllowed,
    translateElementAttributes,
    createController,
    start,
    stop,
  });
}));
