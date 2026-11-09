import type { Dictionary } from "./en";

export const zh: Dictionary = {
  meta: {
    title: "Nusa Rentcar — 雅加达租车服务",
    description:
      "在雅加达租用干净、新款的车辆，卢比标价透明。可选择 Regular、Premium 或 VIP 套餐——自驾或配备专业司机。",
  },
  nav: {
    home: "首页",
    package: "套餐",
    listCar: "车型列表",
    contact: "联系我们",
    about: "关于我们",
    bookNow: "立即预订",
    packagesLabel: "租车套餐",
    compareAll: "比较所有套餐",
    from: "起价",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    language: "语言",
  },
  footer: {
    brandLine: "雅加达 · 创立于 2018",
    description:
      "自 2018 年起在雅加达提供简单透明的租车服务。卢比标价清晰，车队由我们自行保养，客服随时接听电话。",
    explore: "浏览",
    packages: "套餐",
    contact: "联系方式",
    addressLine1: "Jl. Panglima Polim Raya No. 24",
    addressLine2: "Kebayoran Baru, 雅加达南部 12160",
    phone: "(021) 7208 8456",
    email: "halo@nusarentcar.id",
    hours: "营业时间 08.00 – 21.00 WIB · 道路救援 24/7",
    rights: "版权所有。",
    photoCredit:
      "车辆照片由 Wikimedia Commons 贡献者提供（CC BY-SA）。车队与价格为示例数据。",
  },
  home: {
    hero: {
      label: "租车服务 · 雅加达",
      titleLine1: "需要用车时，车就在身边。",
      titleLine2: "价格清清楚楚。",
      description:
        "新款车型、诚实的卢比标价，以及覆盖各种出行的三种套餐——从日常用车到配司机的商务活动。押金无意外，条款无陷阱。",
      primaryCta: "浏览车型",
      secondaryCta: "查看套餐",
      note: "每日 Rp 275.000 起 · 10 公里内免费送车",
      imageCaption: "2023 款 三菱 Xpander Ultimate",
    },
    stats: [
      { value: "120+", label: "车队规模" },
      { value: "24/7", label: "道路救援" },
      { value: "15 分钟", label: "平均确认时间" },
      { value: "4.8/5", label: "客户评分" },
    ],
    fleet: {
      label: "车队",
      title: "客户预订最多的车型",
      viewAll: "查看全部 10 款车",
    },
    packages: {
      label: "套餐",
      title: "三种租车方式，同一种诚实价格。",
      description:
        "每个套餐均包含保险和 24/7 道路救援。选择最适合您行程的服务等级。",
      seeDetails: "查看 {name} 详情",
    },
    steps: {
      label: "服务流程",
      title: "四步完成预订",
      items: [
        {
          title: "选择车型与套餐",
          description: "浏览车队，比较卢比价格，选择 Regular、Premium 或 VIP。",
        },
        {
          title: "发送预订",
          description:
            "告诉我们日期、上车地点及其他需求。我们会在 15 分钟内确认车辆情况。",
        },
        {
          title: "验证并付款",
          description:
            "提供驾照和身份证件。可选择转账、刷卡或交车时现金支付。",
        },
        {
          title: "出发上路",
          description: "我们把车——或您的司机——送到门口，车辆已检查并加满油。",
        },
      ],
    },
    reviews: {
      label: "客户评价",
      title: "客户怎么说",
      rating: "1,240 次租车，平均评分 4.8",
      items: [
        {
          quote:
            "为全家去 Puncak 旅行租了一辆 Avanza。车辆非常干净，价格与报价完全一致，交车只用了五分钟。",
          name: "Rizky Pratama",
          role: "家庭出游，Depok",
        },
        {
          quote:
            "我们每周都用 Premium 套餐接待客户。司机准时且熟悉城市，为团队省了不少事。",
          name: "Anindya Sari",
          role: "运营，南雅加达",
        },
        {
          quote:
            "妹妹婚礼用的 Alphard 保养得无可挑剔，协调员处理了每一次时间变更，我们完全不用操心。",
          name: "Budi Hartono",
          role: "婚礼，万隆",
        },
      ],
    },
    cta: {
      title: "这周需要用车吗？",
      description:
      "发送预订请求，我们会在 15 分钟内确认车辆情况。或直接致电——总会有人接听。",
      bookNow: "立即预订",
    },
  },
  common: {
    all: "全部",
    popular: "热门",
    book: "预订",
    seats: "座",
    manual: "手动",
    automatic: "自动",
    petrol: "汽油",
    hybrid: "混合动力",
    electric: "电动",
    perDay: "/ 天",
    from: "起价",
    emptyCategory: "该类别目前暂无车辆。",
    categories: {
      City: "小型车",
      MPV: "MPV",
      SUV: "SUV",
      Luxury: "豪华车",
    },
  },
  cars: {
    label: "车型列表",
    title: "全部车队车辆",
    description:
      "所有价格按 24 小时租期计算，包含基本保险、交车时满油以及 24/7 道路救援。按类别筛选，找到最合适的车。",
  },
  packages: {
    label: "套餐",
    title: "选择的不只是车，更是服务等级。",
    description:
      "Regular 让您自己驾驶，Premium 配备司机，VIP 为您打理全程。以下为每日价格，包含所列全部服务——交车时绝无加价。",
    mostBooked: "最受欢迎",
    seePackage: "查看 {name}",
    compareLabel: "逐项对比",
    compareTitle: "套餐比较",
    matrixFeature: "服务项目",
    matrix: [
      {
        feature: "租期",
        regular: "24 小时",
        premium: "12 小时 + 司机",
        vip: "14 小时 + 司机",
      },
      { feature: "自驾", regular: true, premium: false, vip: false },
      { feature: "专业司机", regular: false, premium: true, vip: true },
      {
        feature: "燃油",
        regular: "满油取还",
        premium: "市区行程",
        vip: "全部行程",
      },
      { feature: "过路费与停车费", regular: false, premium: true, vip: true },
      {
        feature: "保险",
        regular: "基本",
        premium: "全面",
        vip: "零免赔",
      },
      {
        feature: "免费送车",
        regular: "10 公里内",
        premium: "大雅加达地区",
        vip: "大雅加达地区",
      },
      {
        feature: "机场接送",
        regular: false,
        premium: "可加购",
        vip: true,
      },
      {
        feature: "专属协调员",
        regular: false,
        premium: false,
        vip: true,
      },
      {
        feature: "24/7 道路救援",
        regular: true,
        premium: true,
        vip: true,
      },
    ],
    bookPackage: "预订套餐",
    browseFirst: "先看车型",
  },
  packageContent: {
    regular: {
      tagline: "自驾出行，价格直观",
      description:
        "适合想自己开车的日常租车。干净的城市车与 MPV，日租价格透明，绝无隐藏费用。",
      includes: [
        "24 小时租期",
        "市区不限里程",
        "基本保险（全险）",
        "10 公里内免费送车",
        "交车前常规清洗",
        "24/7 道路救援",
      ],
      extras: [
        "儿童座椅 — Rp 75.000 / 次",
        "额外司机 — Rp 50.000 / 天",
        "出城许可 — Rp 150.000",
      ],
      suitableFor: "日常用车、周末出游、小型家庭出行",
    },
    premium: {
      tagline: "含司机，省心出行",
      description:
        "放松坐好，把方向盘交给专业司机。新款 MPV 与 SUV，市区行程含油，可送达大雅加达任意地点。",
      includes: [
        "专业司机（12 小时 / 天）",
        "市区行程燃油",
        "大雅加达地区免费送车",
        "全面保险",
        "过路费与停车费全包",
        "免费瓶装水",
        "24/7 行程支持热线",
      ],
      extras: [
        "司机加班 — Rp 75.000 / 小时",
        "出城行程 — Rp 400.000 起",
        "机场举牌接机 — Rp 150.000",
      ],
      suitableFor: "商务出行、客户拜访、家庭出游、机场接送",
    },
    vip: {
      tagline: "旗舰车型，礼宾服务",
      description:
        "全方位礼遇：旗舰 SUV 与豪华 MPV、经过甄选的行政司机，以及全程待命的专属协调员。",
      includes: [
        "行政司机（14 小时 / 天）",
        "旗舰车队 — Fortuner、Alphard 及同级车型",
        "燃油、过路费、停车费全包",
        "机场接送（举牌服务）",
        "专属行程协调员",
        "车内 Wi-Fi 与手机充电",
        "优先更换备用车",
        "全额保险，零免赔",
      ],
      extras: [
        "跨城套餐 — 按路线报价",
        "活动 / 婚礼装饰 — Rp 500.000 起",
        "额外安保 — 可应要求安排",
      ],
      suitableFor: "高管出行、婚礼、VIP 客人、多日商务行程",
    },
  },
  packageDetail: {
    breadcrumbPackage: "套餐",
    packageWord: "套餐",
    goodFor: "适合：",
    book: "预订 {name}",
    compare: "比较套餐",
    pictured: "图中车型：",
    carsCount: "本套餐共 {n} 款车",
    includedLabel: "包含项目",
    everythingIn: "{name} 套餐包含",
    extrasLabel: "可选加购",
    addToTrip: "添加到行程",
    longStay: {
      title: "长租优惠",
      description:
        "租期 7 天及以上，日租价格立减 10%。整月租用可省 20%。优惠将自动计入您的报价。",
    },
    availableLabel: "可选车型",
    carsInTitle: "{name} 套餐车型",
    fullFleet: "全部车队",
    faq: {
      label: "常见问题",
      title: "预订须知",
      lead: "仍有疑问？请致电",
      tail: "，我们为您详细说明。",
      items: [
        {
          question: "租车需要哪些证件？",
          answer:
            "有效的 KTP 或护照、驾照（SIM A），以及用于押金冻结的信用卡或押金。外国游客可使用国际驾照（IDP）。",
        },
        {
          question: "日租价格包含燃油吗？",
          answer:
            "Regular 租车交车时满油，还车时也请加满。Premium 与 VIP 套餐已包含市区行程燃油。",
        },
        {
          question: "可以把车开出市区吗？",
          answer:
            "可以。Regular 需办理出城许可（Rp 150.000）。Premium 与 VIP 的出城行程按路线报价——请告知目的地。",
        },
        {
          question: "车辆途中故障怎么办？",
          answer:
            "请拨打我们 24/7 热线。我们立即派出道路救援，若现场无法修复，将免费提供替换车辆。",
        },
      ],
    },
    cta: {
      title: "准备好选择 {name} 套餐了吗？",
      button: "提交预订请求",
    },
  },
  about: {
    label: "关于我们",
    title: "一家依然会接电话的租车公司。",
    description:
      "Nusa Rentcar 成立于 2018 年，起步于 Kebayoran Baru 的六辆车和一间维修车间。如今我们运营 120 辆车服务全雅加达，但做事的方式从未改变：车辆保养诚实，价格清晰可读，认真对待每一笔预订。",
    talkToUs: "与我们聊聊",
    imageCaption: "每 5,000 公里在自有车间保养",
    story: {
      label: "我们的故事",
      title: "由回头客成就",
      paragraphs: [
        "最初几年，我们一直在弄清租车行业真正的问题：还车时满是污渍、押金被扣数周、报价在柜台莫名增加。于是我们先从流程改起——交车拍照、押金当日退还、一份书面报价绝无附加费用。",
        "口碑逐渐传开。今天有一半的订单来自曾经租过的老客户，还有几家 2019 年起合作至今的企业客户。我们计划稳步增长，并自行保养每一辆车，把这个记录保持下去。",
        "无论您是开 Avanza 去海边，还是乘 Alphard 出席婚礼，得到的车况一样、价格一样透明、联系电话也始终一样。",
      ],
    },
    values: {
      label: "我们的准则",
      title: "三条绝不妥协的原则",
      items: [
        {
          title: "车辆由我们自行保养",
          description:
            "每辆车每 5,000 公里在自有车间保养，并在每次交车前检查。不合格的车绝不驶出车库。",
        },
        {
          title: "价格绝无意外",
          description:
            "报价即实付金额。保险、清洗、送车已包含在内——不会事后加收。",
        },
        {
          title: "随时有人接听",
          description:
            "真人客服、真实营业时间。热线 24/7 接听，道路救援 45 分钟内抵达雅加达大部分地区。",
        },
      ],
    },
    cta: {
      title: "亲眼看看我们的车队",
      browseCars: "浏览车型",
      visit: "到访我们的办公室",
    },
  },
  contact: {
    label: "联系我们",
    title: "告诉我们您要去哪里。",
    description:
      "发送预订请求，我们会在营业时间 15 分钟内确认车辆情况。关于价格、证件或路线的疑问也欢迎咨询。",
    form: {
      title: "预订请求",
      description: "填写必填项有助于我们更快确认车辆。",
      fields: {
        name: "姓名",
        phone: "电话 / WhatsApp",
        package: "套餐",
        driver: "司机",
        car: "车型",
        pickupDate: "取车日期",
        returnDate: "还车日期",
        location: "取车地点",
        notes: "备注（选填）",
      },
      placeholders: {
        name: "张伟",
        phone: "+62 812 0000 0000",
        package: "选择套餐",
        driver: "请选择",
        car: "选择车型",
        carFirst: "请先选择套餐",
        location: "例如：苏加诺-哈达机场 T3 航站楼",
        notes: "车型偏好、还车地点、其他需求…",
      },
      packages: {
        regular: "Regular — 自驾",
        premium: "Premium — 含司机",
        vip: "VIP — 旗舰车型与礼宾服务",
      },
      driverOptions: {
        withDriver: "配司机",
        noDriver: "不配司机",
      },
      estimate: {
        title: "预估价格",
        day: "天",
        days: "天",
        note: "预估按所选车型的日租价格计算。最终价格由我们的团队确认——套餐选择、司机选项和长租优惠可能会影响总价。",
      },
      submit: "发送预订请求",
      note: "提交请求无需付款。确认后我们为您保留车辆 2 小时。",
      success: {
        title: "预订请求已收到",
        description:
          "我们会在营业时间 15 分钟内确认车辆情况。紧急需求请致电 (021) 7208 8456。",
        again: "再发一条请求",
      },
    },
    otherWays: "其他联系方式",
    channels: [
      {
        label: "电话",
        value: "(021) 7208 8456",
        detail: "营业时间 08.00 – 21.00 WIB",
      },
      {
        label: "WhatsApp",
        value: "+62 812 8845 6620",
        detail: "回复最快，通常 10 分钟以内",
      },
      {
        label: "电子邮箱",
        value: "halo@nusarentcar.id",
        detail: "报价与企业账户",
      },
      {
        label: "道路救援",
        value: "每天 24 小时",
        detail: "租期内车辆故障请拨打",
      },
    ],
    office: {
      label: "办公室",
      line1: "Jl. Panglima Polim Raya No. 24",
      line2: "Kebayoran Baru, 雅加达南部 12160",
      note: "每天营业 08.00 – 21.00 WIB。大楼后方设有停车场。",
    },
  },
};
