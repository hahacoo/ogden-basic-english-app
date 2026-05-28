# Ogden Basic English 850

一个基于 `Vite + React + TypeScript` 的纯前端英语学习应用，围绕 `C.K. Ogden Basic English 850` 组织内容，当前已经具备：

- 850 官方词表浏览
- 短语学习
- 语法讲解
- 单词学习卡
- 单词专属练习
- 轻量练习模式
- 打卡记录
- 错题本与练习记录本地持久化

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 GitHub Pages

项目已经内置 GitHub Pages 工作流：`.github/workflows/deploy.yml`，并且 `Vite` 使用相对资源路径配置，适合直接发布为静态站点。

1. 在 GitHub 上新建一个仓库，例如 `ogden-basic-english-app`
2. 在项目目录执行以下命令，把本地代码推到 GitHub：

```bash
git remote add origin git@github.com:<你的 GitHub 用户名>/<你的仓库名>.git
git add .
git commit -m "chore: prepare github pages deployment"
git push -u origin main
```

3. 打开 GitHub 仓库页面，进入 `Settings` -> `Pages`
4. 在 `Build and deployment` 中将 `Source` 设为 `GitHub Actions`
5. 回到仓库的 `Actions` 页面，等待 `Deploy to GitHub Pages` 工作流执行完成
6. 部署完成后，访问：

```text
https://<你的 GitHub 用户名>.github.io/<你的仓库名>/
```

如果你后续继续修改内容，只要再次推送到 `main` 分支，GitHub Pages 会自动重新部署。

### 首次部署前检查

- 确认仓库默认分支是 `main`
- 确认本地可以正常执行 `npm run build`
- 如果使用 HTTPS 远程地址，也可以把 `git remote add origin` 换成：

```bash
git remote add origin https://github.com/<你的 GitHub 用户名>/<你的仓库名>.git
```

## 主要目录

- `src/components`：页面组件和学习交互
- `src/data`：词表、短语、语法、学习卡配置
- `src/hooks`：打卡和练习记录持久化
- `src/utils`：内容和练习生成逻辑
- `src/styles`：页面样式

## 待规划能力

### P1

- 错题本一键再练
- 今日学习目标与完成进度
- 单词掌握度标记，例如“不会 / 模糊 / 会了”
- 只练未掌握单词
- 继续精修下一批高频词学习卡

### P2

- 错题本按题型筛选
- 最近练习支持“再做一遍”
- 单词学习目标和练习目标联动
- 按日期、题型、单词维度查看练习统计
- 收藏词、短语、语法并集中复习

### P3

- 更完整的语法体系
- 更大的短语和例句库
- 数据一致性校验脚本
- 内容编辑工具或 schema 校验
- 更完整的 GitHub Pages 发布说明
