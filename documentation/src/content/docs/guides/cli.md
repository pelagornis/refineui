---
title: CLI
description: Prompt Guide CLI — prompt.config.js 및 prompts 동기화
---

# CLI (Prompt Guide)

이 저장소는 **[Prompt Guide](https://github.com/pelagornis/prompt-guide)** 설정(`prompt.config.js`, `prompts/`)을 사용해 AI·에디터용 규칙을 한곳에서 관리합니다. **RefineUI 컴포넌트 문서와는 별개**이며, 팀에서 프롬프트 규칙을 설치·검사할 때 씁니다.

## 언제 쓰나

- 새 프로젝트에 `prompt.config.js` / `prompts/` 템플릿을 넣을 때
- `prompt-guide doctor`로 설정이 깨졌는지 확인할 때

## 설치·실행

### 전역 설치

```bash
npm install -g @pelagornis/prompt-guide
prompt-guide init
prompt-guide doctor --fix
```

### npx (권장, 일회성)

```bash
npx @pelagornis/prompt-guide init
npx @pelagornis/prompt-guide init --platform=web
npx @pelagornis/prompt-guide doctor --fix
```

## 주요 명령

| 명령 | 설명 |
|------|------|
| `init` | 대화형 초기화 — `prompt.config.js`, `prompts/` 생성 |
| `doctor` | 설정 검사 |
| `doctor --fix` | 자동으로 고칠 수 있는 항목 수정 |

## RefineUI 저장소에서

루트에 이미 `prompt.config.js`와 `prompts/`가 있으면 **반복해서 init 할 필요는 없습니다.** 내용을 바꾼 뒤에는 다음 에디터/채팅 세션부터 반영됩니다.

UI 라이브러리 **빌드·배포**는 `pnpm build`를 사용하세요. Prompt Guide CLI와 혼동하지 마세요.
