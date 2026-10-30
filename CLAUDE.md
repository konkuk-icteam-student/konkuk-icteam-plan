# konkuk-icteam-plan

정보운영팀 기획 레포. 기획서·API 명세의 원본이고, 파이프라인 스킬(`plugins/pipeline`)을 배포하는 플러그인 마켓플레이스다. 전체 설명은 [`README.md`](README.md).

## 레포 위치

이 레포와 나란히 `../konkuk-icteam-fe`(프론트), `../icteam-server`(Spring 서버)가 있다. 없으면 사용자에게 어디 있는지 묻는다.

## 규칙

- 이 레포의 사용자는 대부분 **개발을 모르는 기획 담당**이다. 무엇을 묻든 [`plugins/pipeline/references/asking.md`](plugins/pipeline/references/asking.md)의 질문 규칙을 따른다. 코드 용어를 쓰지 않고, 꼭 필요하면 한 번 풀어 쓴다 (예: "API(화면이 서버에 데이터를 달라고 하는 약속)")
- 무엇부터 할지 모르는 사용자에게는 `/pipeline:kickoff`를 안내한다
- 프로젝트 폴더는 `projects/<영문-kebab-case>/`. 안에 `spec.md`(기획서), `stories.md`(기능 명세), `interviews/`(인터뷰), `red-team.md`(빈틈 점검 기록), `api.md`(API 명세)를 둔다
- `spec.md`의 frontmatter `stage`는 `plan` → `design` → `api` → `server` → `connect` → `deploy` → `done` 순서로만 바뀐다. 스킬이 단계를 마치면 갱신한다
- 스킬 수정은 `plugins/pipeline/skills/<스킬>/SKILL.md`. 스킬을 추가·변경하면 `plugin.json`의 `version`을 올리고 `README.md`의 진행 순서 표와 [`docs/guide.md`](docs/guide.md)(사용 가이드)를 함께 고친다
- 기획 단계(`stage: plan`, ①기획서~⑤빈틈 점검)에서는 단계마다 커밋만 하고 **PR은 만들지 않는다.** ⑤ `red-team`이 끝나 기획이 완성되면 그때 한 번 PR을 만든다
- 커밋 메시지·브랜치명은 프론트 레포의 `../konkuk-icteam-fe/docs/git-conventions.md`를 따른다
- **이 기획 레포는 머지 제한이 없다.** 프론트·서버 레포에서는 Claude가 PR 머지·승인·자동 머지를 하지 않는다(개발자만 머지). `plugins/pipeline/hooks/block-merge.mjs`가 막고, 이 레포에서는 통과시킨다
