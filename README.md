# konkuk-icteam-plan

건국대학교 정보운영팀의 **기획 레포**입니다. 매 학기 만드는 프로젝트의 기획서와 API 명세를 모아두고, 기획부터 배포까지 Claude Code로 진행하는 스킬(`pipeline` 플러그인)을 담고 있습니다.

기획·디자인을 전문으로 하지 않아도 됩니다. 스킬이 질문을 하나씩 던지고, 답하면 기획서와 화면이 만들어집니다.

## 레포 3개

세 레포를 **같은 폴더 안에 나란히** clone합니다. 스킬이 이 위치를 기준으로 서로를 찾습니다.

```
icteam/                  ← 아무 이름이나 괜찮은 상위 폴더
├── konkuk-icteam-plan/     이 레포: 기획서, API 명세, 스킬
├── konkuk-icteam-fe/    프론트엔드 (Next.js 모노레포, 디자인 시스템)
└── icteam-server/       서버 (Spring)
```

| 레포                 | 원본으로 갖는 것                                               |
| -------------------- | -------------------------------------------------------------- |
| `konkuk-icteam-plan` | 기획서 `projects/<프로젝트>/spec.md`, API 명세 `api.md`        |
| `konkuk-icteam-fe`   | 화면 코드, 디자인 시스템 (`packages/design-system/CATALOG.md`) |
| `icteam-server`      | 서버 코드                                                      |

API 명세(`api.md`)는 프론트와 서버가 지키는 **약속**입니다. 둘 중 한쪽이 바뀌면 이 레포의 명세부터 고칩니다.

## 처음 한 번: 플러그인 설치

Claude Code(데스크톱 앱 또는 터미널)에서:

```
/plugin marketplace add konkuk-icteam-student/konkuk-icteam-plan
/plugin install pipeline@icteam
```

GitHub에 올리기 전이라면 로컬 폴더로도 됩니다: `/plugin marketplace add ../konkuk-icteam-plan`

## 진행 순서

| 단계 | 스킬                      | 누가      | 어디서 열고 하나     | 결과                                   |
| ---- | ------------------------- | --------- | -------------------- | -------------------------------------- |
| 1    | `/pipeline:plan`          | 기획 담당 | `konkuk-icteam-plan` | `projects/<프로젝트>/spec.md`          |
| 2    | `/pipeline:design-screen` | 기획 담당 | `konkuk-icteam-fe`   | 화면 + 목업 데이터, 스크린샷           |
| 3    | `/pipeline:api-spec`      | 기획·개발 | `konkuk-icteam-fe`   | `projects/<프로젝트>/api.md` (준비 중) |
| 4    | `/pipeline:build-server`  | 개발      | `icteam-server`      | Spring API (준비 중)                   |
| 5    | `/pipeline:connect-api`   | 개발      | `konkuk-icteam-fe`   | 목업 → 실제 서버 요청 (준비 중)        |
| 6    | `/pipeline:deploy`        | 개발      | 각 레포              | 배포 (준비 중)                         |

각 프로젝트가 어디까지 왔는지는 `spec.md` 맨 위의 `stage` 값과 맨 아래 **진행 상황** 체크리스트에 적힙니다.

## 폴더

```
.claude-plugin/marketplace.json   플러그인 목록
plugins/pipeline/skills/          스킬 (단계마다 폴더 하나)
projects/<프로젝트>/              프로젝트마다 폴더 하나 (영문 kebab-case, 예: commute)
```
