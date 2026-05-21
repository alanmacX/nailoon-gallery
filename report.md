# 奶龙素材馆项目详细报告

## 一、项目概述

“奶龙素材馆”是一个以奶龙图片、动图、字母素材和互动测试为核心内容的静态前端网站。项目使用 HTML、CSS 和原生 JavaScript 实现，不依赖后端框架，不需要安装依赖，用户可以直接用浏览器打开 `index.html` 运行。

项目整体围绕“素材浏览、分类筛选、详情查看、拖拽收藏、收藏展示、登录状态、英文组词 Canvas 生成、心理测试交互和视频播放”展开。所有页面共用统一的导航、玻璃拟态卡片、按钮、网格、表单、页脚和响应式布局样式。

## 二、项目文件结构

```text
nailoon-gallery/
├── index.html          首页
├── category.html       分类展示页
├── detail.html         素材详情页
├── collection.html     收藏画廊页
├── word.html           奶龙组词页
├── contact.html        心理测试页
├── smile.html          大笑视频页
├── login.html          登录页
├── css/
│   └── style.css       全站统一样式
├── js/
│   ├── common.js       用户状态、素材加载等公共逻辑
│   ├── favorites.js    拖放收藏等跨页逻辑
│   └── *.js            各 HTML 页面对应的独立脚本
├── README.md           项目说明
├── report.md           项目报告
├── limits.md           作业要求说明
├── LICENSE             许可文件
└── 课程大作业报告.docx  文档版报告
```

## 三、全站公共结构

### 1. HTML 基础结构

每个页面都使用 `<!DOCTYPE html>` 声明文档类型，根元素为 `<html lang="zh-CN">`，表示页面语言为简体中文。

`<head>` 中通常包含以下元素：

- `<meta charset="UTF-8">`：声明页面使用 UTF-8 编码。
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`：适配移动端视口。
- `<title>`：根据页面功能显示不同标题，例如“奶龙素材馆 | 首页”。
- `<link rel="icon">`：加载远程图标 `https://image.hakimi.uno/images/favicon.svg`。
- `<link rel="stylesheet" href="css/style.css">`：引入全站样式文件。

每个页面末尾先引入公共脚本，再引入当前页面专属脚本。例如首页引入 `common.js`、`favorites.js` 和 `index.js`，登录页只引入 `common.js` 和 `login.js`。

### 2. 公共页头 `header.site-header.glass`

除部分内容差异外，所有主要页面都使用相同的页头结构：

- `<header class="site-header glass">`：全站顶部导航容器，使用 `glass` 类实现半透明背景和阴影。
- `<a class="logo" href="index.html">`：网站 Logo 链接，点击返回首页。
- `<span class="logo-mark">N</span>`：Logo 标记，黄色方块中显示字母 N。
- `<span>奶龙素材馆</span>`：网站名称文字。
- `<nav class="nav">`：导航菜单容器。
- `<a href="index.html">首页</a>`：跳转首页。
- `<a href="category.html">分类</a>`：跳转分类展示页。
- `<a href="collection.html">收藏</a>`：跳转收藏页。
- `<a href="word.html">奶龙组词</a>`：跳转组词页。
- `<a href="contact.html">测试</a>`：跳转心理测试页。
- `<a href="smile.html">大笑</a>`：跳转视频页。
- `<a href="login.html">登录</a>`：跳转登录页。
- `<a class="active">`：当前页面对应导航项使用 `active` 类突出显示。
- `<div class="user-pill">你好，<span id="currentUser">游客</span></div>`：显示当前用户昵称，默认是“游客”，登录后从 `localStorage` 读取昵称替换。

### 3. 公共页脚 `footer.site-footer`

首页、分类页、详情页、收藏页和视频页使用页脚：

- `<footer class="site-footer">`：页脚容器。
- `<p>`：显示版权和页面说明。
- 首页额外包含 `<div class="share-links">`，提供到分类、收藏、组词、测试、视频和登录页面的快捷链接。

### 4. 公共样式类

- `.glass`：半透明玻璃拟态背景和阴影。
- `.section-shell`：全站内容宽度容器，最大宽度为 1180px。
- `.page-main`：普通内页主体上边距。
- `.page-head`：页面标题区域。
- `.panel`：内容面板。
- `.form-card`：表单卡片。
- `.btn`：按钮基础样式。
- `.btn.primary`：黄色主按钮。
- `.btn.secondary`：白色次按钮。
- `.btn.third`：第三种按钮样式。
- `.btn.full`：宽度占满父容器的按钮。
- `.card-grid`：三列卡片网格。
- `.feature-card`：素材卡片。
- `.category-grid`：分类页四列网格。
- `.drop-zone`：拖拽收藏区域。
- `.favorite-list`：收藏列表。
- `.error`：表单错误提示。

## 四、首页 `index.html`

### 1. 页面定位

首页是项目入口，承担品牌展示、主要功能入口、素材推荐、拖拽收藏和浮动测试广告功能。

### 2. 页面结构

首页主体结构如下：

```text
body
├── header.site-header.glass
├── main
│   ├── section.hero.section-shell
│   └── section.content-layout.section-shell
├── div#floatAd.float-ad.glass
├── footer.site-footer
├── script js/common.js
├── script js/favorites.js
└── script js/index.js
```

### 3. 头部元素

- `<header class="site-header glass">`：固定顶部导航。
- `<a class="logo" href="index.html" aria-label="奶龙素材馆首页">`：首页 Logo 链接，带无障碍说明。
- `<span class="logo-mark">N</span>`：Logo 图形文字。
- `<span>奶龙素材馆</span>`：站点名称。
- `<nav class="nav">`：主导航。
- `<a class="active" href="index.html">首页</a>`：当前页高亮。
- 其余导航项分别通向分类、收藏、组词、测试、大笑和登录。
- `<div class="user-pill">`：用户昵称展示区域。

### 4. Hero 首屏区域

`<section class="hero section-shell">` 是首页的首屏展示区，使用 CSS Grid 分为左右两列。

左侧 `<div class="hero-copy">` 包含：

- `<h1>奶龙素材馆</h1>`：首页主标题。
- `<div class="hero-actions">`：主操作按钮组。
- `<a class="btn primary" href="category.html">开始逛逛</a>`：进入分类页。
- `<a class="btn secondary" href="contact.html">测测你是哪只奶龙</a>`：进入心理测试页。
- `<a class="btn third" href="word.html">孩子们拼写很有趣</a>`：进入组词页。

右侧 `<div class="hero-visual collage-slider">` 是动图拼贴轮播区，包含三张轮播卡片：

- `<div class="collage-card active" data-slide="0">`：第一张轮播卡，默认激活。
- `<div class="collage-card" data-slide="1">`：第二张轮播卡。
- `<div class="collage-card" data-slide="2">`：第三张轮播卡。
- 每个卡片内部都有 `<div class="collage-spin">`，用于轻微旋转动画。
- 每个卡片包含 `<img>`，初始图片分别为 `gif1.jpg`、`gif2.jpg`、`gif3.jpg`。

脚本中的 `initSlider()` 会在素材加载完成后，从 `gifs` 分类随机抽取三张图片，替换这三张轮播图，并每 3 秒切换一次 `.active` 状态。

### 5. 分类推荐区域

`<section class="content-layout section-shell">` 是首页下方内容区，分为主内容和侧栏。

左侧 `<div class="main-column">` 包含一个推荐面板：

- `<section class="panel glass">`：推荐内容容器。
- `<div class="section-title">`：标题容器。
- `<h2>分类推荐</h2>`：区域标题。
- `<div class="card-grid">`：三列卡片网格。

网格中有三张 `<article class="feature-card gallery-card">` 推荐卡片：

1. 奶龙素材卡片：
   - `draggable="true"`：允许拖拽。
   - `data-title="奶龙素材 03"`：收藏时使用的标题。
   - `data-category="nai"`：素材分类。
   - `data-file="图片00004.jpg"`：素材文件名。
   - `<img>`：展示奶类素材图片。
   - `<h3>奶</h3>`：卡片标题。

2. 动态表情卡片：
   - `data-category="gifs"`：动图分类。
   - `data-file="gif00001.jpg"`：动图文件名。
   - `<img>`：展示动态表情素材。
   - `<h3>动态表情</h3>`：卡片标题。

3. 奶龙字母卡片：
   - `data-category="letters"`：字母素材分类。
   - `data-file="OK.jpg"`：字母文件名。
   - `<img>`：展示字母素材图片。
   - `<h3>奶龙字母</h3>`：卡片标题。

这些卡片由 `initDragAndDrop()` 绑定拖拽事件，拖到收藏篮后会调用 `addFavorite()` 保存到 `localStorage`。

### 6. 收藏侧栏

右侧 `<aside class="side-column">` 包含收藏篮：

- `<section class="panel drop-panel glass">`：收藏面板。
- `<h2>拖到收藏篮</h2>`：面板标题。
- `<div id="dropZone" class="drop-zone">把喜欢的卡片放到这里</div>`：拖拽投放区域。
- `<button id="clearFavorites" class="btn secondary clear-favorites">一键清空</button>`：清空收藏。
- `<ul id="favoriteList" class="favorite-list"></ul>`：收藏条目列表。

拖拽流程：

1. 用户拖动 `.feature-card`。
2. `ondragstart` 将 `title`、`category`、`file` 写入 `dataTransfer`。
3. 拖到 `#dropZone` 时触发 `ondrop`。
4. `addFavorite(category, file, title)` 写入 `localStorage.nailongFavorites`。
5. `renderFavoriteList()` 刷新收藏列表。

### 7. 浮动广告

首页额外包含：

- `<div id="floatAd" class="float-ad glass">`：右下角浮动广告。
- `<button id="closeFloatAd" class="float-ad-close">&times;</button>`：关闭按钮。
- `<a href="contact.html">`：点击进入测试页。
- `<img>`：广告图片。
- `<span>测测你是哪只奶龙 →</span>`：广告文字。

`initFloatAd()` 为广告绑定关闭功能，并使用 `setInterval()` 让广告上下缓慢浮动。

## 五、分类展示页 `category.html`

### 1. 页面定位

分类页用于按分类浏览全部远程素材，支持分类筛选、分页展示、点击进入详情、双击收藏和拖拽收藏。

### 2. 页面结构

```text
body
├── header.site-header.glass
├── main.section-shell.page-main
│   ├── section.page-head
│   └── section.category-layout
├── footer.site-footer
├── script js/common.js
├── script js/favorites.js
└── script js/category.js
```

### 3. 页面头部

- 导航中的“分类”链接带 `class="active"`。
- 用户信息仍由 `#currentUser` 显示。

### 4. 标题和分类按钮区域

`<section class="page-head">` 包含：

- `<h1>奶龙素材分类</h1>`：页面标题。
- `<div id="categoryTabs" class="category-tabs" aria-label="分类筛选"></div>`：分类按钮容器。

`#categoryTabs` 初始为空，由 `initCategoryPage()` 动态填充：

- 第一个按钮是“全部”，对应 `data-category="all"`。
- 后续按钮来自 `materialGroups`。
- 分类包括 `nai`、`naiguo`、`naiqi`、`gifs`、`letters`、`stickers`。
- 点击按钮后更新 `curCategory`，重置 `curPage = 1`，重新调用 `renderCategoryItems()`。

### 5. 图片展示区域

`<section class="category-layout">` 使用两列布局，左侧是素材网格，右侧是收藏篮。

左侧结构：

- `<div id="categoryGrid" class="card-grid category-grid"></div>`：素材卡片网格。
- `<div id="pagination" class="pagination" aria-label="分页导航"></div>`：分页按钮容器。

`renderCategoryItems()` 会完成以下工作：

1. 遍历 `materialGroups`。
2. 根据 `curCategory` 筛选分类。
3. 把每个文件转换为素材对象：
   - `category`：分类标识。
   - `file`：文件名。
   - `title`：显示标题。
   - `image`：完整图片地址。
4. 根据 `pageSize = 12` 切分当前页。
5. 生成 `<article class="feature-card gallery-card">`。
6. 每张卡片包含：
   - `draggable="true"`：可拖拽。
   - `data-title`：标题。
   - `data-category`：分类。
   - `data-file`：文件名。
   - `tabindex="0"`：支持键盘聚焦。
   - `<img src="...">`：素材图。
   - `<h3>`：素材标题。

CSS 中 `.category-grid` 设置为 `repeat(4, minmax(0, 1fr))`，每页 `pageSize = 12`，因此桌面端正好显示 3 行 4 列。

### 6. 分页区域

`#pagination` 由脚本动态生成：

- `&laquo;`：上一页按钮。
- 数字按钮：第 1 页、第 2 页等。
- `&raquo;`：下一页按钮。
- 当前页按钮添加 `class="active"`。
- 首页时上一页按钮 `disabled`。
- 末页时下一页按钮 `disabled`。
- 点击分页按钮后更新 `curPage` 并重新渲染网格。

### 7. 右侧收藏篮

右侧 `<aside class="panel drop-panel">` 包含：

- `<h2>我的收藏篮</h2>`。
- `<div id="dropZone" class="drop-zone">拖到这里收藏</div>`。
- `<button id="clearFavorites" class="btn secondary clear-favorites">一键清空</button>`。
- `<ul id="favoriteList" class="favorite-list"></ul>`。

功能与首页收藏篮一致。

### 8. 卡片交互

分类页卡片支持三种交互：

- 单击卡片：跳转到 `detail.html?category=分类&file=文件名`。
- 双击卡片：添加到收藏篮。
- 按下 Enter：触发点击，进入详情页。

## 六、素材详情页 `detail.html`

### 1. 页面定位

详情页用于展示单张素材的大图、所属分类、文件名、分类总数、Canvas 信息卡和同分类推荐。

### 2. 页面结构

```text
body
├── header.site-header.glass
├── main.section-shell.page-main
│   └── div#detailWrap.detail-page
├── footer.site-footer
├── script js/common.js
├── script js/favorites.js
└── script js/detail.js
```

### 3. 静态元素

- 导航中“详情”带 `class="active"`。
- `<div id="detailWrap" class="detail-page"></div>` 是详情页唯一的静态内容容器。
- 页脚文字为“© 2026 奶龙素材馆 | 素材详情”。

### 4. 动态渲染逻辑

详情页由 `initDetailPage()` 动态生成内容：

1. 读取 URL 参数：
   - `category`：分类标识。
   - `file`：文件名。
2. 如果参数缺失，`#detailWrap` 显示空状态提示。
3. 从 `materialGroups` 查找对应分类。
4. 如果分类不存在，显示“找不到这个分类”。
5. 拼出当前图片地址 `group.folder + file`。
6. 计算标题：
   - 字母分类使用文件名去后缀。
   - 其他分类使用分类前缀和序号。

### 5. 详情卡片元素

脚本生成的详情卡片结构：

- `<div class="detail-card glass">`：详情主卡片。
- `<div class="detail-image-wrap">`：左侧大图容器。
- `<img id="detailMainImg">`：素材大图。
- `<div class="detail-content">`：右侧文字和操作区。
- `<h1>`：素材标题。
- `<ul class="detail-list">`：信息列表。
- `<li>分类：...</li>`：分类名称。
- `<li>文件名：...</li>`：文件名。
- `<li>该分类共 ... 张素材</li>`：分类总数。
- `<canvas id="detailCanvas" width="320" height="160"></canvas>`：Canvas 信息卡。
- `<button id="detailFavBtn" class="btn primary">收藏这张</button>`：收藏按钮。
- `<a class="btn secondary" href="category.html?cat=...">返回分类</a>`：返回分类按钮。

### 6. 详情页 Canvas

`#detailCanvas` 使用 `getContext("2d")` 绘制：

- 黄色背景。
- 素材标题。
- “分类：分类名 | 共 N 张”。
- “奶龙素材馆”。

这个 Canvas 满足项目中图形绘制元素要求。

### 7. 同分类推荐

详情页下方会生成：

- `<section class="panel glass">`：推荐区域。
- `<h2>同分类推荐</h2>`。
- `<div class="card-grid">`：三列推荐网格。
- 最多 3 张 `<article class="feature-card">` 推荐卡片。
- 每张推荐卡片包含 `<img>` 和 `<h3>`。
- 点击推荐卡片跳转到对应素材详情页。

## 七、收藏画廊页 `collection.html`

### 1. 页面定位

收藏页用于展示用户在首页或分类页收藏过的素材，视觉形式为“冰箱贴”画廊，并支持拖动调整收藏卡片位置。

### 2. 页面结构

```text
body
├── header.site-header.glass
├── main.section-shell.page-main
│   ├── section.page-head
│   └── section#collectionGrid.fridge-board
├── footer.site-footer
├── script js/common.js
└── script js/collection.js
```

### 3. 页面头部

该页导航包含：

- 首页。
- 分类。
- 详情。
- 收藏。
- 奶龙组词。
- 测试。
- 大笑。
- 登录。

其中“收藏”链接带 `class="active"`。

### 4. 页面标题区域

`<section class="page-head">` 包含：

- `<h1>我的收藏画廊</h1>`：页面标题。
- `<a class="btn primary" href="category.html">去分类页收藏</a>`：引导用户返回分类页添加收藏。

### 5. 收藏展示容器

`<section id="collectionGrid" class="fridge-board"></section>` 是收藏展示区域。

`initCollectionPage()` 会读取：

- `localStorage.nailongFavorites`：收藏素材列表。
- `localStorage.nailongNotePositions`：每张冰箱贴的位置和旋转角度。

如果没有收藏：

- 容器内渲染 `<p class="empty-note">冰箱门还空着。回到分类页，把喜欢的素材拖进收藏篮。</p>`。

如果有收藏：

- 每条收藏渲染为 `<article class="fridge-note">`。
- `data-key` 保存唯一键，例如 `category|file`。
- `data-rotate` 保存旋转角度。
- `style` 中写入 `left`、`top` 和 `transform: rotate(...)`。
- 内部包含 `<img>` 和 `<h3>`。

### 6. 拖动逻辑

每个 `.fridge-note` 绑定 `onmousedown`：

1. 记录鼠标在卡片内的偏移。
2. 鼠标移动时更新 `left` 和 `top`。
3. 限制卡片不能拖出 `fridge-board`。
4. 松开鼠标后恢复旋转角度。
5. 把位置写入 `localStorage.nailongNotePositions`。

## 八、奶龙组词页 `word.html`

### 1. 页面定位

组词页让用户输入英文单词，系统把每个字母转换成奶龙字母图片，并用 Canvas 拼成一张可下载图片。

### 2. 页面结构

```text
body
├── header.site-header.glass
├── main.section-shell.page-main.word-layout
│   ├── section.form-card.glass
│   └── section.panel.word-preview
├── script js/common.js
└── script js/word.js
```

### 3. 输入表单区域

`<section class="form-card glass">` 包含：

- `<h1>奶龙组词</h1>`：页面标题。
- `<form id="wordForm" novalidate>`：输入表单，关闭浏览器默认校验。
- `<label for="wordInput">输入英文</label>`：输入框标签。
- `<input id="wordInput" name="wordInput" type="text" maxlength="15" placeholder="例如 NAILONG">`：英文输入框。
- `<span class="error" id="wordInputError"></span>`：错误提示。
- `<button class="btn primary full" type="submit">生成图片</button>`：提交按钮。

### 4. Canvas 预览区域

`<section class="panel word-preview">` 包含：

- `<canvas id="wordCanvas" width="760" height="176">您的浏览器不支持 Canvas。</canvas>`：组词图片画布。
- `<a id="downloadWord" class="btn secondary" href="#">下载图片</a>`：下载按钮。

### 5. 表单验证逻辑

`initWordForm()` 处理提交事件：

- 输入为空：显示“请输入 1-15 个英文字母。”
- 超过 15 个字符：显示“最多输入 15 个字母。”
- 包含非英文字母：显示“只能输入英文字母，不能输入中文、数字或符号。”
- 验证通过：调用 `drawWordImage(val)`。

### 6. Canvas 绘制逻辑

`drawWordImage(word)` 的流程：

1. 把输入转换为大写。
2. 如果输入是 `OK`，直接加载 `OK.jpg`。
3. 其他情况按字符拆分，加载 `/images/奶龙字母/A.jpg` 这种路径。
4. 等所有图片加载完成。
5. 设置画布宽度为 `字母数量 × 120`。
6. 设置画布高度为 `120`。
7. 使用 `ctx.drawImage()` 按顺序绘制每个字母图片。
8. 使用 `canvas.toDataURL("image/png")` 生成下载地址。
9. 修改下载按钮为主按钮样式，并设置 `download` 文件名。

## 九、心理测试页 `contact.html`

### 1. 页面定位

心理测试页是一个带微恐交互效果的 10 题问卷。页面包含开始提示、答题卡片、解锁输入和测试结果四个状态。

### 2. 页面结构

```text
body.simple-page
├── header.site-header.glass
├── div#quizIntro.quiz-intro
├── div#quizBox.quiz-box
├── div#quizUnlock.quiz-unlock
├── div#quizResult.quiz-result
├── script js/common.js
└── script js/contact.js
```

### 3. 开始提示区

`<div id="quizIntro" class="quiz-intro">` 默认显示，包含：

- `<div class="form-card glass">`：居中的提示卡片。
- `<h1>奶龙心理研究所</h1>`：测试标题。
- `<p>本问卷共 10 题，请根据直觉作答。</p>`：说明文字。
- `<p class="quiz-warn">提示：包含微恐交互效果，介意请返回。</p>`：警告提示。
- `<button id="quizStartBtn" class="btn primary full">开始作答</button>`：开始按钮。

点击开始按钮后：

- `#quizIntro` 设置为隐藏。
- `#quizBox` 设置为 `display: grid`。
- `quizCurrent = 0`。
- 调用 `renderQuiz()` 渲染第一题。

### 4. 答题区域

`<div id="quizBox" class="quiz-box" style="display:none;">` 初始隐藏，包含：

- `<div class="form-card glass quiz-card">`：答题卡片。
- `<div id="quizProgress" class="quiz-progress">第 1 题 / 共 10 题</div>`：题目进度。
- `<div id="quizQuestion" class="quiz-question"></div>`：题干容器。
- `<div id="quizOptions" class="quiz-options"></div>`：选项容器。
- `<div class="quiz-btns">`：上一题/下一题按钮组。
- `<button id="quizPrev" class="btn secondary">上一题</button>`。
- `<button id="quizNext" class="btn primary">下一题</button>`。

`renderQuiz()` 每次根据 `quizCurrent` 渲染：

- 当前题进度。
- 当前题题干。
- 四个 `.quiz-opt` 选项。
- 已选选项添加 `.picked`。
- 第一题禁用上一题按钮。
- 第 10 题把“下一题”按钮改成“提交问卷”。

### 5. 问卷数据

`quizQuestions` 是一个数组，共 10 个对象。每个对象包含：

- `q`：题干。
- `opt`：四个选项。

问卷主题包括首次看到奶龙的感觉、深夜刷手机、眼睛跟随手指、房间角落、奶龙出现时反应、是否听到叫声、笑容感受、回头确认、等待的人、是否愿意被记住。

### 6. 选项交互

`quizPick()` 处理选项点击：

- 读取当前选项的 `data-idx`。
- 保存到 `quizAnswers[quizCurrent]`。
- 清除其他选项的 `.picked`。
- 给当前选项添加 `.picked`。

特殊题目效果：

- 第 3 题：选择后调用 `quizTypeOnBlack()`，出现黑屏打字效果，之后自动跳到第 4 题。
- 第 4 题：停留 2 秒后调用 `quizOptionGlitch()`，选项文字短暂变成“奶龙在你身后”。
- 第 7 题：选择后调用 `quizRedFlood()`，页面变红并出现漂浮文字。
- 第 8 题：选择后调用 `quizPeepEffect()`，出现灰色遮罩和漂浮文字。
- 第 10 题：选择后把其他选项改成“你没得选”，并添加 `.locked`。

### 7. 特效 DOM 元素

脚本动态生成以下特效元素：

- `.scare-mask.black`：全屏黑色遮罩。
- `.scare-typing`：遮罩中的打字文字。
- `.scare-float`：漂浮文字。
- `.scare-gray`：灰色遮罩。
- `.scare-flood`：结束时满屏“奶龙”文字。

CSS 中这些特效使用高 `z-index`，确保覆盖答题按钮和页面内容。

### 8. 解锁输入区

`<div id="quizUnlock" class="quiz-unlock" style="display:none;">` 初始隐藏，包含：

- `<h2>问卷已完成</h2>`。
- `<p>输入指定文字查看你的奶龙</p>`。
- `<form id="unlockForm" novalidate>`。
- `<input id="unlockInput" type="text" placeholder="请输入：奶龙我爱你">`。
- `<span id="unlockError" class="error"></span>`。
- `<button class="btn primary full">解锁</button>`。

验证逻辑：

- 输入必须等于“奶龙我爱你”。
- 输入错误时显示错误提示，并调用 `quizBlackFlash("它在看着你", 1500)`。
- 输入正确时隐藏解锁区，调用 `quizShowResult()`。

### 9. 结果展示区

`<div id="quizResult" class="quiz-result" style="display:none;">` 初始隐藏，包含：

- `<h2 id="quizResultTitle">正在生成...</h2>`：结果标题。
- `<img id="quizResultImg">`：随机生成的奶龙结果图片。
- `<a class="btn primary" href="contact.html">再测一次</a>`：重新测试按钮。

`quizShowResult()` 从前三个图片分类中随机抽一张图，并根据登录昵称生成结果文字。

## 十、大笑视频页 `smile.html`

### 1. 页面定位

视频页用于展示奶龙相关视频，满足页面中视频元素的要求。

### 2. 页面结构

```text
body
├── header.site-header.glass
├── main.section-shell.page-main.smile-main
│   ├── section.page-head
│   ├── button#smilePlayButton
│   └── section.video-panel
├── footer.site-footer
├── script js/common.js
└── script js/smile.js
```

### 3. 页面元素

- `<section class="page-head">`：标题区。
- `<h1>奶蛙大笑</h1>`：页面标题。
- `<button id="smilePlayButton" class="btn primary smile-play">打开声音播放</button>`：播放控制按钮。
- `<section class="video-panel">`：视频容器。
- `<video id="smileVideo" class="theme-video" autoplay muted loop playsinline>`：视频播放器。
- `<source src="https://image.hakimi.uno/images/smile.mov">`：视频资源。
- 视频标签内部有浏览器不支持时的提示文字。

### 4. 视频逻辑

`initSmileVideo()` 执行：

- 获取 `#smileVideo` 和 `#smilePlayButton`。
- 页面加载后尝试静音自动播放。
- 如果播放失败，按钮文字改为“点击播放”。
- 点击按钮后取消静音，设置音量为 1，并播放视频。
- 播放后按钮文字改为“正在大笑”。

## 十一、登录页 `login.html`

### 1. 页面定位

登录页用于输入昵称和密码。项目不连接后端，只把昵称保存到浏览器本地，用于全站导航栏展示当前用户。

### 2. 页面结构

```text
body.simple-page
├── header.site-header.glass
├── main.form-wrap
│   └── section.form-card.glass
├── script js/common.js
└── script js/login.js
```

### 3. 表单元素

`<section class="form-card glass">` 包含：

- `<h1>输入昵称进入素材馆。</h1>`：页面标题。
- `<form id="loginForm" novalidate>`：登录表单。
- `<label for="username">昵称</label>`：昵称标签。
- `<input id="username" name="username" type="text" placeholder="请输入 2-12 位昵称">`：昵称输入框。
- `<span id="usernameError" class="error"></span>`：昵称错误提示。
- `<label for="password">密码</label>`：密码标签。
- `<input id="password" name="password" type="password" placeholder="请输入至少 6 位密码">`：密码输入框。
- `<span id="passwordError" class="error"></span>`：密码错误提示。
- `<button class="btn primary full" type="submit">进入素材馆</button>`：提交按钮。
- `<p class="form-note">昵称会保存在本地浏览器中，并显示在导航栏。</p>`：说明文字。

### 4. 验证逻辑

`initLoginForm()` 处理登录表单：

- 昵称长度必须在 2 到 12 位之间。
- 密码长度至少 6 位。
- 错误信息通过 `setError(id, msg)` 写入对应 `<span>`。
- 验证通过后把昵称保存到 `localStorage.nailongUser`。
- 调用 `showCurrentUser()` 更新导航栏。
- 弹出登录成功提示。
- 跳转到 `index.html`。

## 十二、JavaScript 数据与功能梳理

### 1. 全局数据

拆分后的脚本中主要数据如下：

- `BASE_URL`：远程图床基础地址，值为 `https://image.hakimi.uno`。
- `materialGroups`：所有分类素材列表，页面加载后通过远程请求填充。
- `materialConfig`：素材分类配置数组。
- `curCategory`：分类页当前分类，位于 `category.js`。
- `curPage`：分类页当前页，位于 `category.js`。
- `pageSize`：分类页每页数量，位于 `category.js`，当前为 12。

### 2. 素材分类配置

`materialConfig` 包含六类素材：

| category | 中文名 | 标题前缀 | 路径 |
| --- | --- | --- | --- |
| `nai` | 奶 | 奶龙素材 | `/images/photos/奶/` |
| `naiguo` | 奶果 | 奶果素材 | `/images/photos/奶果/` |
| `naiqi` | 奶气 | 奶气素材 | `/images/photos/奶气/` |
| `gifs` | 动态表情 | 动态表情 | `/images/gifs/` |
| `letters` | 奶龙字母 | 字母素材 | `/images/奶龙字母/` |
| `stickers` | 表情包 | 表情包 | `/images/表情包/` |

### 3. 页面初始化流程

页面加载时执行：

1. `DOMContentLoaded` 触发。
2. 调用 `fetchAllMaterials()`。
3. `fetchAllMaterials()` 逐个请求远程分类路径。
4. 过滤文件类型，只保留图片文件。
5. 生成 `materialGroups`。
6. 当前页面脚本执行自己的初始化函数。

拆分后的页面绑定关系：

- `index.js`：首页轮播、首页收藏拖放、浮动广告。
- `category.js`：分类筛选、分页、素材卡片渲染。
- `detail.js`：详情内容、同类推荐、详情页收藏。
- `collection.js`：收藏画廊与冰箱贴拖动。
- `word.js`：奶龙字母组词和 Canvas 下载。
- `contact.js`：心理测试流程与结果生成。
- `smile.js`：大笑视频播放控制。
- `login.js`：登录表单验证。

公共能力由 `common.js` 和 `favorites.js` 提供，各 HTML 页面只绑定自己需要的脚本。

### 4. 本地存储

项目使用三个 `localStorage` 键：

- `nailongUser`：保存登录昵称。
- `nailongFavorites`：保存收藏列表。
- `nailongNotePositions`：保存收藏页冰箱贴位置。

收藏对象结构：

```js
{
  key: "category|file",
  category: "分类",
  file: "文件名",
  title: "标题",
  image: "完整图片地址"
}
```

位置对象结构：

```js
{
  "category|file": {
    left: 34,
    top: 38,
    rotate: -4
  }
}
```

### 5. 拖放收藏功能

相关函数：

- `initDragAndDrop()`：绑定拖拽、投放和清空按钮。
- `addFavorite(category, file, title)`：添加收藏。
- `renderFavoriteList()`：渲染收藏篮列表。

功能特点：

- 首页和分类页卡片都可拖拽。
- 收藏篮支持拖入添加。
- 重复收藏会被跳过。
- 收藏列表中每条都有删除按钮。
- 删除收藏时同步删除该素材在收藏页的位置记录。

### 6. 详情页功能

相关函数：

- `initDetailPage()`。

功能特点：

- 使用 URLSearchParams 读取页面参数。
- 动态渲染详情页。
- 支持收藏当前图片。
- 支持返回分类页。
- 支持同分类推荐。
- 使用 Canvas 绘制详情信息卡。

### 7. 测试页功能

相关函数：

- `initPersonalityForm()`。
- `renderQuiz()`。
- `quizPick()`。
- `quizLock()`。
- `quizUnlock()`。
- `quizCleanEffects()`。
- `quizDelayEffect()`。
- `quizOptionGlitch()`。
- `quizTypeOnBlack()`。
- `quizBlackFlash()`。
- `quizSpawnFloats()`。
- `quizRedFlood()`。
- `quizPeepEffect()`。
- `quizFinish()`。
- `quizShowResult()`。

功能特点：

- 10 道题逐题展示。
- 支持上一题和下一题。
- 支持选中状态。
- 支持多种动画特效。
- 结束后需要输入指定文字解锁结果。
- 结果图片从素材分类中随机抽取。

### 8. 组词功能

相关函数：

- `initWordForm()`。
- `drawWordImage(word)`。

功能特点：

- 输入校验严格限制为 1 到 15 个英文字母。
- 按字母加载远程图片。
- 用 Canvas 横向拼接。
- 生成 PNG 下载链接。

### 9. 视频功能

相关函数：

- `initSmileVideo()`。

功能特点：

- 默认静音自动播放。
- 用户点击按钮后打开声音。
- 兼容浏览器自动播放限制。

### 10. 浮动广告功能

相关函数：

- `initFloatAd()`。

功能特点：

- 首页右下角显示测试入口。
- 可点击关闭。
- 使用定时器上下浮动。

## 十三、CSS 样式结构

### 1. 全局变量与基础样式

`:root` 定义颜色和效果变量：

- `--text`：主文字颜色。
- `--muted`：次级文字颜色。
- `--line`：边框颜色。
- `--paper`：纸张背景。
- `--white`：白色。
- `--bg`：页面底色。
- `--yellow`：主黄色。
- `--coral`：珊瑚色。
- `--green`：绿色。
- `--sky`：天蓝色。
- `--shadow`：统一阴影。

基础样式：

- `* { box-sizing: border-box; }`：统一盒模型。
- `html { scroll-behavior: smooth; }`：平滑滚动。
- `body`：设置字体、背景渐变、行高和最小高度。
- `a`：去掉默认下划线。
- `img, video, canvas`：限制最大宽度并块级显示。
- `button, input, select, textarea`：继承字体。

### 2. 导航样式

- `.site-header`：粘性头部、圆角、半透明背景、模糊和阴影。
- `.logo`：Logo 横向排列。
- `.logo-mark`：黄色 Logo 方块。
- `.nav`：导航链接弹性布局。
- `.nav a`：导航链接间距和字号。
- `.nav a.active`：当前页面高亮。
- `.user-pill`：用户昵称胶囊。

### 3. 首页样式

- `.hero`：两列首屏布局。
- `.hero h1`：大标题。
- `.hero-actions`：按钮组。
- `.collage-slider`：轮播容器。
- `.collage-card`：轮播图片卡片。
- `.collage-spin`：持续轻微摇动动画。
- `@keyframes magnetSpin`：定义拼贴图片旋转和位移动画。

### 4. 卡片与网格样式

- `.content-layout`：首页主体两列布局。
- `.category-layout`：分类页两列布局。
- `.main-column`：主列垂直排列。
- `.side-column`：侧栏并设置粘性定位。
- `.panel`：通用内容面板。
- `.card-grid`：三列网格。
- `.category-grid`：四列网格。
- `.feature-card`：素材卡片。
- `.feature-card:hover`：悬停时上移并加深阴影。
- `.feature-card img`：图片保持 1:1 比例并裁切填充。

### 5. 收藏样式

- `.drop-zone`：虚线拖拽区域。
- `.drop-zone.over`：拖拽进入时变色。
- `.favorite-list`：收藏列表。
- `.favorite-list li`：收藏条目。
- `.favorite-list button`：删除按钮。
- `.fridge-board`：收藏页冰箱板背景。
- `.fridge-note`：收藏冰箱贴。
- `.fridge-note::before`：顶部图钉装饰。
- `.fridge-note.dragging`：拖动状态样式。

### 6. 表单样式

- `.form-wrap`：登录页居中容器。
- `.form-card`：表单卡片。
- `form`：表单纵向排列。
- `label`：标签加粗。
- `input, select, textarea`：统一输入框样式。
- `input:focus`：聚焦高亮。
- `.error`：错误信息红色显示。
- `.form-note`：表单说明文字。

### 7. 组词与详情样式

- `.word-layout`：组词页左右布局。
- `.word-preview`：Canvas 预览区。
- `.word-preview canvas`：Canvas 边框和背景。
- `.detail-page`：详情页容器。
- `.detail-card`：详情页左右布局。
- `.detail-image-wrap img`：详情大图。
- `.detail-content`：详情文字区。
- `.detail-list`：详情信息列表。
- `#detailCanvas`：详情页 Canvas 样式。

### 8. 测试页样式

- `.quiz-intro`：开始提示布局。
- `.quiz-box`：答题区布局。
- `.quiz-unlock`：解锁区布局。
- `.quiz-result`：结果区布局。
- `.quiz-card`：答题卡片。
- `.quiz-warn`：警告文字。
- `.quiz-progress`：进度文字。
- `.quiz-question`：题目文字。
- `.quiz-options`：选项列表。
- `.quiz-opt`：选项按钮。
- `.quiz-opt.picked`：已选状态。
- `.quiz-opt.locked`：锁定状态。
- `.quiz-btns`：上一题/下一题按钮组。
- `.scare-mask`：全屏遮罩。
- `.scare-typing`：打字文字。
- `.scare-float`：漂浮文字。
- `.scare-gray`：灰色遮罩。
- `.scare-flood`：结束填字特效。
- `@keyframes floatLife`：漂浮文字生命周期。

### 9. 视频与浮动广告样式

- `.smile-main`：视频页居中布局。
- `.video-panel`：视频容器。
- `.theme-video`：视频播放器样式。
- `.smile-play`：播放按钮宽度。
- `.float-ad`：右下角浮动广告。
- `.float-ad-close`：关闭按钮。
- `.float-ad a`：广告链接布局。
- `.float-ad img`：广告图片样式。

### 10. 响应式样式

`@media (max-width: 920px)`：

- 头部改为纵向排列。
- 首页、分类页、详情页、组词页等多列布局改为单列。
- 普通卡片网格和分类网格改为两列。
- 侧栏取消粘性定位。

`@media (max-width: 620px)`：

- 大标题缩小。
- 卡片网格改为单列。
- 页面容器宽度收紧。
- 导航按钮内边距缩小。
- 浮动广告变为底部横条，并隐藏图片。

## 十四、页面之间的跳转关系

### 1. 导航跳转

每个页面都通过顶部导航互相连接：

- 首页：`index.html`
- 分类：`category.html`
- 收藏：`collection.html`
- 组词：`word.html`
- 测试：`contact.html`
- 大笑：`smile.html`
- 登录：`login.html`
- 详情页由分类页或推荐卡片带参数跳转。

### 2. 分类页到详情页

分类页卡片点击后跳转：

```text
detail.html?category=分类标识&file=文件名
```

详情页根据这两个参数从 `materialGroups` 中查找素材并渲染。

### 3. 详情页到分类页

详情页提供“返回分类”按钮，链接为：

```text
category.html?cat=分类标识
```

当前脚本主要依赖分类按钮切换，返回链接保留分类参数用于语义表达。

### 4. 收藏相关跳转

- 首页推荐卡片可以拖入收藏篮。
- 分类页卡片可以拖入收藏篮。
- 收藏页通过“去分类页收藏”按钮跳回分类页。

## 十五、项目特色功能

### 1. 动态素材加载

项目不是完全写死图片列表，而是在页面加载后请求远程图床目录，动态获取每个分类下的图片文件。这样分类页和详情页可以随着素材目录变化而更新。

### 2. 分类分页浏览

分类页支持：

- 全部素材浏览。
- 按分类筛选。
- 四列网格展示。
- 每页 12 张。
- 分页导航。
- 点击查看详情。
- 双击收藏。
- 拖拽收藏。

### 3. 拖拽收藏系统

项目使用 HTML5 Drag and Drop API：

- `draggable="true"` 开启拖拽。
- `dataTransfer.setData()` 传递素材信息。
- `dropZone.ondrop` 接收素材。
- `localStorage` 持久保存收藏。
- 收藏页使用拖动逻辑保存卡片位置。

### 4. Canvas 应用

项目中有两个 Canvas 应用：

1. 组词页 `#wordCanvas`：把字母图片拼成一张图片并支持下载。
2. 详情页 `#detailCanvas`：绘制素材标题、分类和站点信息。

### 5. 微恐测试交互

心理测试页包含多个特殊效果：

- 黑屏打字。
- 选项文字闪变。
- 红屏漂浮文字。
- 灰层漂浮文字。
- 结尾满屏填字。
- 解锁口令。
- 随机结果图片。

### 6. 视频播放

视频页使用 HTML5 `<video>` 标签：

- 自动播放。
- 静音。
- 循环。
- 行内播放。
- 用户点击后打开声音。

### 7. 登录状态

登录页使用本地存储保存昵称，所有页面通过 `showCurrentUser()` 显示当前用户。虽然没有后端认证，但完整体现了前端状态管理。

## 十六、评分点对应说明

### 1. 网页完整性

项目包含：

- 首页 `index.html`。
- 登录页 `login.html`。
- 分类展示页 `category.html`。
- 详情展示页 `detail.html`。
- 收藏页 `collection.html`。
- 组词页 `word.html`。
- 心理测试页 `contact.html`。
- 视频页 `smile.html`。

页面类型完整，导航互通。

### 2. 主页面完整性

首页包含：

- Logo。
- 导航栏。
- 用户状态。
- Hero 主视觉。
- 动图轮播。
- 主要操作按钮。
- 分类推荐。
- 侧栏收藏篮。
- 浮动广告。
- 页脚。

### 3. 元素多样性

项目使用了多种 HTML 元素：

- 标题：`h1`、`h2`、`h3`。
- 段落：`p`。
- 链接：`a`。
- 图片：`img`。
- 视频：`video`、`source`。
- 表单：`form`、`label`、`input`、`button`。
- 列表：`ul`、`li`。
- Canvas：`canvas`。
- 语义容器：`header`、`main`、`section`、`aside`、`footer`、`article`、`nav`。

### 4. 数据验证

登录页验证：

- 昵称 2 到 12 位。
- 密码至少 6 位。

组词页验证：

- 输入不能为空。
- 最多 15 个字母。
- 只能输入英文字母。

测试页验证：

- 解锁口令必须等于“奶龙我爱你”。

### 5. 图片切换

首页轮播由 `initSlider()` 实现：

- 从动图分类随机选择 3 张图片。
- 每 3 秒切换 `.active` 卡片。
- CSS 通过不同 `z-index`、旋转和缩放展示拼贴效果。

### 6. 图形绘制

Canvas 使用包括：

- `wordCanvas`：绘制字母图片拼图。
- `detailCanvas`：绘制素材信息卡。

### 7. 浮动效果

首页浮动广告通过 `initFloatAd()` 实现：

- 固定在右下角。
- 可关闭。
- 定时上下漂浮。

心理测试页也包含动态漂浮文字 `.scare-float`。

### 8. 拖放功能

首页和分类页都支持将 `.feature-card` 拖到 `#dropZone` 收藏。

收藏页支持拖动 `.fridge-note` 改变收藏素材位置。

### 9. 分页导航

分类页支持分页：

- `pageSize = 12`。
- 桌面端每页 3 行 4 列。
- 上一页、下一页和数字页码按钮。

## 十七、运行方式

项目是静态网页，可直接运行：

1. 打开项目文件夹。
2. 双击 `index.html`。
3. 浏览器会加载 CSS、JS 和远程图片资源。
4. 确保网络可访问 `https://image.hakimi.uno`，否则远程素材无法加载。

也可以从任意页面开始访问，但推荐从 `index.html` 进入。

## 十八、总结

本项目围绕奶龙素材主题完成了一个功能完整的静态网站。页面结构上覆盖首页、分类、详情、收藏、组词、测试、视频和登录等常见页面；交互上包含动态加载、分页、图片切换、拖拽收藏、Canvas 绘图、视频播放、表单验证、本地存储和动画特效；样式上使用统一的玻璃拟态卡片、响应式网格、按钮系统和移动端适配。

整体实现体现了 HTML 语义结构、CSS 视觉布局、JavaScript DOM 操作、浏览器 API、本地存储和 Canvas 绘图的综合应用，符合前端课程大作业对页面完整性、元素多样性、交互功能和视觉表现的要求。
