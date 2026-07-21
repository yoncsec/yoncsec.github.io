# Hexo 博客部署指南

## 项目信息

- **框架**：Hexo + Fluid 主题
- **托管**：GitHub Pages（零成本）
- **加密**：hexo-blog-encrypt（可选）

## 本地预览

```bash
cd "C:\Users\dell\WorkBuddy\hexo播客"
npx hexo server
# 访问 http://localhost:4000
```

## 写新文章

```bash
npx hexo new "文章标题"
# 文件生成在 source/_posts/文章标题.md
```

## 部署到 GitHub Pages（一次性配置）

### 第 1 步：创建 GitHub 仓库

1. 登录 GitHub，新建仓库
2. 仓库名必须为 `username.github.io`（username 替换为你的 GitHub 用户名）
3. 必须选择 **Public**（公开）

### 第 2 步：配置 SSH 密钥

```bash
# 生成 SSH 密钥（一路回车即可）
ssh-keygen -t ed25519

# 查看公钥内容，复制全部
cat ~/.ssh/id_ed25519.pub
```

将公钥添加到 GitHub 仓库：Settings → Deploy keys → 添加

### 第 3 步：修改 _config.yml 中的 deploy 配置

打开 `_config.yml`，找到 `deploy` 部分，将 `username` 替换为你的 GitHub 用户名：

```yaml
deploy:
  type: git
  repo: git@github.com:username/username.github.io.git
  branch: main
  message: "Site updated"
```

同时修改 `url` 字段：

```yaml
url: https://username.github.io
```

### 第 4 步：设置 Git 用户信息

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的邮箱@example.com"
```

### 第 5 步：一键部署

```bash
npx hexo clean && npx hexo g && npx hexo d
```

### 第 6 步：开启 GitHub Pages

仓库 Settings → Pages → Source 选择 `main` 分支 → Save

等待几分钟后访问 `https://username.github.io` 即可看到你的博客！

## 文章加密

在文章 Front-matter 中添加 `password` 字段即可加密：

```yaml
---
title: 某靶机 WP
date: 2026-01-13 11:20:00
tags: [Windows, AD]
categories: HackTheBox
password: 你的密码
abstract: 有东西被加密了, 请输入密码查看.
message: 请输入密码查看文章内容.
wrong_pass_message: 抱歉, 这个密码看着不太对, 请再试试.
---
```

## 修改站点信息

编辑 `_config.yml` 中的 `Site` 部分：

```yaml
title: My Blog           # 博客标题
author: Your Name        # 作者名
description: '网站描述'
```

编辑 `_config.fluid.yml` 可自定义主题外观（导航栏、颜色、Banner 等）。

## 目录结构

```
hexo播客/
├── _config.yml              # Hexo 主配置文件
├── _config.fluid.yml         # Fluid 主题配置覆盖
├── package.json             # 项目依赖
├── source/
│   ├── _posts/              # 文章目录
│   │   ├── 零成本搭建个人博客网站.md
│   │   └── 加密文章示例-靶机WP演示.md
│   ├── about/               # 关于页
│   ├── tags/                # 标签页
│   ├── categories/          # 分类页
│   └── img/                 # 图片资源
├── themes/                  # 主题目录（通过 npm 安装则在 node_modules）
└── public/                  # 生成的静态网站（hexo g 后出现）
```

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `npx hexo new "标题"` | 创建新文章 |
| `npx hexo server` | 启动本地预览 |
| `npx hexo clean` | 清理生成文件 |
| `npx hexo g` | 生成静态文件 |
| `npx hexo d` | 部署到 GitHub |
| `npx hexo g && npx hexo d` | 生成并部署 |
