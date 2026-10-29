# konkuk-icteam-plan

정보운영팀 기획 레포. 기획서·API 명세의 원본이고, 파이프라인 스킬(`plugins/pipeline`)을 배포하는 플러그인 마켓플레이스다. 전체 설명은 [`README.md`](README.md).

## 레포 위치

이 레포와 나란히 `../konkuk-icteam-fe`(프론트), `../icteam-server`(Spring 서버)가 있다. 없으면 사용자에게 어디 있는지 묻는다.

## 규칙

- 이 레포의 사용자는 대부분 **개발을 모르는 기획 담당**이다. 답변과 문서에 코드 용어를 쓰지 않는다. 꼭 필요하면 한 번 풀어 쓴다 (예: "API(화면이 서버에 데이터를 달라고 하는 약속)")
- 프로젝트 폴더는 `projects/<영문-kebab-case>/`. 안에 `spec.md`(기획서), `api.md`(API 명세)를 둔다
- `spec.md`의 frontmatter `stage`는 `plan` → `design` → `api` → `server` → `connect` → `deploy` → `done` 순서로만 바뀐다. 스킬이 단계를 마치면 갱신한다
- 스킬 수정은 `plugins/pipeline/skills/<스킬>/SKILL.md`. 스킬을 추가·변경하면 `plugin.json`의 `version`을 올리고 `README.md`의 진행 순서 표를 고친다
- 커밋 메시지·브랜치명은 프론트 레포의 `../konkuk-icteam-fe/docs/git-conventions.md`를 따른다
