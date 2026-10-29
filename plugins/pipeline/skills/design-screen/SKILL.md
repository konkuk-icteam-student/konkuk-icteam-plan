---
name: design-screen
description: 기획 레포의 spec.md를 읽고, 프론트 레포(konkuk-icteam-fe)에서 디자인 시스템 컴포넌트만 조합해 실제로 돌아가는 화면과 목업 데이터를 만든 뒤 브라우저 스크린샷으로 확인받는다. "화면 만들어줘", "디자인 해줘", "기획서대로 화면 그려줘", "spec 보고 페이지 만들어줘"라고 할 때 쓴다. 파이프라인의 2단계이고, 앞은 plan, 다음은 api-spec이다.
argument-hint: <프로젝트 폴더 이름>
---

# 화면 만들기 (2단계)

`spec.md`의 화면 목록을 **디자인 시스템 컴포넌트를 조합한 실제 Next.js 화면**으로 만든다. 서버는 아직 없으므로, 서버가 보낼 모양 그대로의 목업 JSON으로 화면이 움직이게 한다. 이때 만든 데이터 타입과 목업이 다음 단계(API 명세)의 재료가 된다.

사용자는 기획 담당일 수 있다. 진행 상황과 질문은 화면 기준의 쉬운 말로 하고("홈 화면 위쪽에 오늘 근무 카드를 놨어요"), 코드 설명은 묻지 않으면 하지 않는다.

## 기준 문서

작업 전에 모두 읽는다. 경로는 프론트 레포 기준이다.

| 문서                                                | 무엇을 정하나                                |
| --------------------------------------------------- | -------------------------------------------- |
| `../konkuk-icteam-plan/projects/<프로젝트>/spec.md` | 무엇을 만드나 (화면 목록, 화면 상세, 데이터) |
| `packages/design-system/CATALOG.md`                 | 어떤 컴포넌트·토큰으로 만드나                |
| `docs/conventions.md`                               | 코드 스타일, 컴포넌트 배치, 날짜 타입 규칙   |
| `docs/git-conventions.md`                           | 브랜치·커밋 형식                             |
| `apps/commute/src/app/(student)/_apis/common.ts`    | 데이터 계층 규칙의 기준 구현                 |

## 진행

### 0. 준비

1. 지금 폴더가 프론트 레포(`konkuk-icteam-fe`, `packages/design-system`이 있음)인지 확인한다. 기획 레포는 옆 폴더 `../konkuk-icteam-plan`이다. 위치가 다르면 사용자에게 묻는다
2. 인자로 받은 프로젝트의 `spec.md`를 읽는다. 인자가 없으면 `projects/` 목록을 보여주고 고르게 한다
3. `stage`가 `plan`이 아니고 `design` 이후면, 이미 화면이 있다는 뜻이다. 새로 만들지 말고 **바뀐 부분만** 고칠지 확인한다
4. `열린 질문`에 화면 모양을 바꿀 질문이 남아 있으면 먼저 사용자에게 묻고 `spec.md`에 반영한다
5. 현재 git 브랜치를 본다. `develop`이나 `main`이면 작업 브랜치부터 만든다: 이슈가 있으면 `/start-work <이슈번호>`, 없으면 이슈를 만들지(사용자 확인 후 `gh issue create`) 물어본다

### 1. 앱과 경로 정하기

1. spec의 `app`이 비어 있으면 정한다. 기존 앱(`apps/commute`, `apps/worklog`)의 기능 추가인지, 새 앱인지 사용자에게 확인한다
2. 새 앱이면 [새 앱 만들기](#새-앱-만들기)대로 만든다
3. 화면 목록의 화면마다 경로를 정해 표로 보여주고 확인받는다. 역할이 나뉘면 출근부처럼 라우트 그룹으로 나눈다

   | ID   | 화면      | 경로              | 파일                                |
   | ---- | --------- | ----------------- | ----------------------------------- |
   | S-01 | 홈        | `/`               | `src/app/(student)/(home)/page.tsx` |
   | S-05 | 학생 목록 | `/admin/students` | `src/app/(admin)/students/page.tsx` |

4. 기기를 확인한다. 모바일 화면은 출근부 근로학생 화면(`apps/commute/src/app/(student)`), PC 관리자 화면은 출근부 관리자 화면(`apps/commute/src/app/(admin)`)의 레이아웃·여백을 기준으로 맞춘다

### 2. 데이터 먼저

화면보다 데이터 모양을 먼저 만든다. 화면은 이 함수만 부른다.

1. spec의 `데이터` 표에서 리소스를 나눈다. **리소스 하나 = 파일 하나** (`_apis/<리소스>.ts`)
2. 라우트 그룹마다 `_apis/common.ts`를 둔다. 출근부의 `common.ts`(`ApiJson`, `toApiDate`, `parseApiDate` 등)를 그대로 가져와 시작한다
3. 함수마다 위에 **메서드와 경로**를 주석으로 적는다. 경로 규칙은 출근부와 같다 (본인 기준은 `/me`, 관리자는 `/admin`, 복수형 kebab-case)

   ```ts
   /**
    * GET /me/rentals?status=
    * 내가 빌린 장비 목록
    */
   export const getMyRentals = ({
     status,
   }: GetMyRentalsRequest): GetMyRentalsResponse =>
     getMyRentalsMock(status).map(toRental);
   ```

4. 요청·응답 타입은 `<함수이름(대문자 시작)>Request` / `Response`. 날짜는 `Date`, 시각만 있으면 `'HH:mm'` 문자열 (`docs/conventions.md`의 API 날짜 규칙)
5. 목업은 `_apis/mock/<리소스>.ts`에 **서버가 보낼 JSON 모양 그대로**(날짜는 문자열) 둔다. 변환은 `_apis/<리소스>.ts`에서 한 번만 한다
6. 목업 데이터는 그럴듯하게 만든다: 실제 같은 한국 이름·날짜, 목록은 5~10개, 그리고 **빈 상태·긴 글자·상태별 한 개씩**이 화면에서 보이도록 섞는다
7. 저장·변경 함수(POST/PUT/PATCH/DELETE)는 목업 안의 메모리 값을 바꿔서, 화면에서 눌러보면 결과가 반영되게 한다 (새로 고침하면 처음으로 돌아가도 된다)

### 3. 화면 조합

화면 하나씩 만든다. 하나를 끝내고 확인받은 뒤 다음으로 간다.

1. spec의 `화면 상세`에서 "보이는 것"을 위에서 아래 순서로 섹션으로 나눈다. 섹션마다 `_components/<섹션>/` 아래 컴포넌트 하나 (배치 기준은 `docs/conventions.md`)
2. 섹션 안의 요소는 `CATALOG.md`의 "상황별로 고르기" 표에서 고른다. **이 규칙을 지킨다:**
   - 카탈로그에 있는 것은 반드시 그 컴포넌트를 쓴다. 비슷한 버튼·칩·팝업을 직접 만들지 않는다
   - 카탈로그에 없는 것(카드, 표, 리스트 등)은 앱의 `_components`에 만들되, 색·글자·간격은 카탈로그의 **토큰만** 쓴다. 임의 색(`#hex`)·임의 글자 크기 금지. 간격은 rem(`1rem = 10px`)
   - 같은 앱의 `src/shared/ui`나 출근부에 이미 비슷한 것이 있으면 그걸 본떠 맞춘다
   - 디자인 시스템에 추가해야 할 것 같으면 직접 추가하지 말고, 마지막 보고에 "디자인 시스템 후보"로 적는다
3. `할 수 있는 것`의 버튼·입력은 실제로 동작하게 만든다: 누르면 목업 함수 호출 → 화면 갱신. 되돌릴 수 없는 동작은 `ConfirmModal`, 결과 안내는 `ResultModal`
4. `비어 있을 때`, `안 될 때`도 화면에 만든다. 목업에 그 경우를 볼 수 있는 데이터를 넣는다
5. 문구는 spec의 말투를 따른다. 화면 날짜 표기는 `MM.DD` 규칙(`docs/conventions.md`)

### 4. 눈으로 확인

화면을 하나 만들 때마다:

1. `.claude/launch.json`에 앱 dev 서버 설정이 없으면 추가하고(포트는 기존 앱과 겹치지 않게), `preview_start`로 띄운다
2. 해당 경로로 이동해 콘솔 오류가 없는지 본다
3. 기기에 맞춰 창 크기를 바꾸고(모바일은 `resize_window` preset `mobile`) 스크린샷을 찍어 사용자에게 보여준다. 버튼을 눌러 동작도 한 번씩 확인한다
4. "이 화면 괜찮나요? 바꾸고 싶은 곳이 있으면 화면 어디를 어떻게 바꿀지 말해주세요"라고 묻는다. 피드백을 반영하고 다시 스크린샷으로 확인받는다
5. 피드백이 기획 자체를 바꾸면(화면 추가, 규칙 변경 등) `spec.md`도 같이 고친다

### 5. 마무리

1. 앱 기준으로 검사가 모두 통과해야 한다. 실패하면 고친다
   ```bash
   pnpm --filter <앱> lint
   pnpm --filter <앱> exec tsc --noEmit
   ```
2. `spec.md`를 갱신한다: frontmatter `app`, `stage: design`, `updated`, 진행 상황의 `화면`에 체크. 화면 목록 표에 경로 열이 없으면 추가한다
3. 사용자에게 보고한다:
   - 만든 화면과 경로, 최종 스크린샷
   - 목업으로 대신하고 있는 데이터(리소스 목록)
   - 디자인 시스템 후보 (있으면)
   - 다음 단계: `/pipeline:api-spec <프로젝트>` — 지금 만든 데이터 모양을 API 명세로 옮긴다
4. 커밋할지 묻는다. 원하면 `docs/git-conventions.md` 형식으로 커밋한다. PR은 개발자가 `/ship`으로 올린다

## 새 앱 만들기

`apps/commute`를 기준으로 최소한만 만든다. 폴더 이름 = `package.json`의 `name` = spec의 `app`.

1. 복사할 설정 파일: `package.json`(name, 의존성은 `next`·`react`·`react-dom`·디자인 시스템과 공통 설정 패키지만), `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`(출근부의 `PARKED_ADMIN_FILES` 같은 예외 목록은 빼고 `nextConfig`만), `vitest.config.mts`
2. `src/app/layout.tsx`(`lang='ko'`, 서비스 이름과 설명은 spec에서), `src/app/globals.css`(Pretendard import + `@import '@konkuk-icteam-fe/tailwind-config';`)
3. 루트에서 `pnpm install`
4. `.claude/launch.json`에 dev 서버 설정 추가
5. 루트 `CLAUDE.md`의 패키지 구성에 새 앱을 한 줄 추가

## 하지 않는 것

- 실제 서버 요청(fetch, axios)을 넣지 않는다. 그건 5단계(`connect-api`)에서 `_apis` 함수 안만 바꾼다
- 로그인·권한 처리를 만들지 않는다. 역할별 화면은 라우트 그룹으로 나눠 두기만 한다
- 디자인 시스템 패키지(`packages/design-system`)를 고치지 않는다. 필요하면 보고만 한다
