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

처음이거나 다음에 뭘 할지 모르겠으면 **`/pipeline:kickoff`** 만 치면 됩니다. 지금 단계를 보여주고 다음 스킬을 시작해 줍니다.

### 기획 (기획 담당, `konkuk-icteam-plan`에서)

| 단계          | 스킬                  | 하는 일                                                 | 결과                                  |
| ------------- | --------------------- | ------------------------------------------------------- | ------------------------------------- |
| ① 기획서      | `/pipeline:plan`      | 질문에 답하면 기획서가 만들어져요                       | `projects/<프로젝트>/spec.md`         |
| ② 현장 인터뷰 | `/pipeline:interview` | 관리자·근로학생에게 물어볼 질문지와 답 정리 (필요할 때) | `projects/<프로젝트>/interviews/*.md` |
| ③ 범위        | `/pipeline:scope`     | 이번 학기에 만들 것과 미룰 것 나누기                    | `spec.md`의 `범위`                    |
| ④ 기능 명세   | `/pipeline:stories`   | 기능마다 "이게 되면 완성" 정하기, GitHub 이슈 등록      | `projects/<프로젝트>/stories.md`      |
| ⑤ 빈틈 점검   | `/pipeline:red-team`  | 놓친 예외 상황을 찾아 메우기                            | `projects/<프로젝트>/red-team.md`     |

모든 기획 스킬은 같은 질문 규칙([`plugins/pipeline/references/asking.md`](plugins/pipeline/references/asking.md))을 따릅니다. 왜 묻는지 먼저 말하고, 선택지마다 고르면 어떻게 되는지 알려주고, "잘 모르겠어요"를 언제나 고를 수 있어요.

### 개발

| 단계     | 스킬                      | 누가      | 어디서             | 결과                                   |
| -------- | ------------------------- | --------- | ------------------ | -------------------------------------- |
| 화면     | `/pipeline:design-screen` | 기획·개발 | `konkuk-icteam-fe` | 화면 + 목업 데이터, 스크린샷           |
| API 명세 | `/pipeline:api-spec`      | 기획·개발 | `konkuk-icteam-fe` | `projects/<프로젝트>/api.md` (준비 중) |
| 서버     | `/pipeline:build-server`  | 개발      | `icteam-server`    | Spring API (준비 중)                   |
| 연동     | `/pipeline:connect-api`   | 개발      | `konkuk-icteam-fe` | 목업 → 실제 서버 요청 (준비 중)        |
| 배포     | `/pipeline:deploy`        | 개발      | 각 레포            | 배포 (준비 중)                         |

각 프로젝트가 어디까지 왔는지는 `spec.md` 맨 위의 `stage` 값과 맨 아래 **진행 상황** 체크리스트에 적힙니다.

## 머지는 개발자만 (프론트·서버 레포)

프론트·서버 레포에서 Claude는 커밋·푸시하고 PR을 만드는 데까지만 합니다. **PR 머지·승인·자동 머지는 막혀 있습니다.** 브랜치 푸시는 `develop`·`main`도 할 수 있어요. 플러그인에 들어 있는 훅([`plugins/pipeline/hooks/`](plugins/pipeline/hooks/))이 이런 명령을 실행 전에 막아요. 머지는 개발자가 리뷰한 뒤 GitHub에서 직접 합니다.

이 기획 레포는 코드가 없어서 제한이 없습니다. 기획 담당이 바로 머지해도 되고, Claude에게 머지를 맡겨도 돼요.

## 폴더

```
.claude-plugin/marketplace.json   플러그인 목록
plugins/pipeline/skills/          스킬 (단계마다 폴더 하나)
plugins/pipeline/references/      여러 스킬이 같이 쓰는 규칙 (질문하는 법)
plugins/pipeline/hooks/           머지 차단 훅
projects/<프로젝트>/              프로젝트마다 폴더 하나 (영문 kebab-case, 예: commute)
```
