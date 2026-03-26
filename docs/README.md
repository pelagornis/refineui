# Prompt Guide — RefineUI Docs index

RefineUI 프로젝트용 **설정, 규칙, CLI** 문서입니다.  
설정: `prompt.config.js` · 규칙 원문: `prompts/*.yml` · 사람이 읽기 쉬운 요약: 이 디렉터리.

---

## Document list

| Document | Audience | Content |
|----------|----------|---------|
| **[packages.md](packages.md)** | All | **packages/ 구조 및 정책** — monorepo 패키지 목록, packages는 그대로 유지. |
| **[CLI.md](CLI.md)** | Users, developers | CLI 실행 방법, `init` / `doctor` 명령, 옵션, 예시, 에러/종료 코드. |
| **[what-install.md](what-install.md)** | Users, maintainers | CLI, config, presets, platforms가 **추가하는 것**과 **나중에 수정할 항목**. |
| **[request-guide.md](request-guide.md)** | Developers | **요청 작성 가이드**: per-preset 팁, guide.template 필드, spec/ticket 작성, 예시. |
| **[system.core.md](system.core.md)** | Developers, reviewers | 핵심 규칙 요약 (역할, 코드 품질, 보안, 에러, 문서, 협업). Source: `prompts/system.core.yml`. |
| **[review.md](review.md)** | Reviewers | 코드 리뷰 범위, 체크리스트, 출력 형식, 결론 규칙. Source: `prompts/review.yml`. |
| **[rules-by-platform.md](rules-by-platform.md)** | Platform developers | 플랫폼별 규칙 요약 (Web/RefineUI 중심). Source: `prompts/rules.by-platform.yml`. |
| **[rules-by-tool.md](rules-by-tool.md)** | Users, maintainers | **AI 도구별 규칙 위치**: Cursor, Claude Code, Codex, Windsurf. 형식 및 제한. |

---

## Suggested reading order

1. **RefineUI 프로젝트 구조**  
   [packages.md](packages.md) — packages/ 구조, packages는 그대로 유지 정책

2. **First-time setup**  
   [CLI.md](CLI.md) → [what-install.md](what-install.md) (sections 1, 2, 6, 7)

3. **When asking the AI to do work**  
   [request-guide.md](request-guide.md) (request principles, per-preset tips, template/spec examples)

4. **Day-to-day development and review**  
   [system.core.md](system.core.md), [review.md](review.md), [rules-by-platform.md](rules-by-platform.md)

5. **Changing config or adding presets/platforms**  
   [what-install.md](what-install.md) (sections 2–6)

6. **Using a specific AI tool (Cursor, Codex, Windsurf, etc.)**  
   [rules-by-tool.md](rules-by-tool.md) (where each tool loads rules and how to align with prompt-guide)

---

## YAML source mapping

| Markdown doc | YAML source | Key used by tools |
|--------------|-------------|-------------------|
| system.core.md | prompts/system.core.yml | `prompt` |
| review.md | prompts/review.yml | `prompt` |
| rules-by-platform.md | prompts/rules.by-platform.yml | `platforms.<name>.prompt` |
| packages.md | — | (정책 문서, YAML 없음) |

Tools read the corresponding key from the YAML and inject it as system role / prompt.  
The Markdown docs are **human-friendly summaries** of the same content.
