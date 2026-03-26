---
title: CLI
description: Prompt Guide CLI 사용법
---

# CLI 사용법

Prompt Guide CLI는 `prompt.config.js`를 생성하고 `prompts/`, `docs/`를 프로젝트에 복사합니다.

## 실행 방법

### 전역 설치

```bash
npm install -g @pelagornis/prompt-guide
prompt-guide init
prompt-guide doctor --fix
```

### npx (일회성)

```bash
npx @pelagornis/prompt-guide init
npx @pelagornis/prompt-guide init --platform=ios
npx @pelagornis/prompt-guide doctor --fix
```

## 명령어

| 명령 | 설명 |
|------|------|
| `init` | 프로젝트 초기화 (대화형) |
| `doctor` | 설정 검사 및 수정 |
| `doctor --fix` | 자동 수정 적용 |
