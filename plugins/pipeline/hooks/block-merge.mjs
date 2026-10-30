#!/usr/bin/env node
/*
 * 머지는 개발자가 GitHub에서 직접 한다. Claude가 PR 머지·승인·자동 머지를 하려고 하면 실행 전에 막는다.
 * 브랜치 푸시(develop·main 포함)는 막지 않고, 기획 레포처럼 코드가 없는 레포에서는 아무것도 막지 않는다.
 * Claude Code PreToolUse 훅: 표준 입력으로 도구 호출 JSON을 받고, 막을 때는 이유를 stderr에 쓰고 2로 끝낸다.
 */
import { execSync } from 'node:child_process';

// 머지를 막지 않는 레포 (origin 주소에 이 이름이 들어 있으면 통과)
const MERGE_ALLOWED_REPOS = ['konkuk-icteam-plan'];

const BLOCK_MESSAGE =
  '머지는 개발자만 GitHub에서 직접 합니다. Claude는 PR을 만들고 리뷰를 요청하는 데까지만 합니다. ' +
  'PR 머지·승인·자동 머지 설정은 하지 마세요. 사용자에게 개발자 리뷰를 요청하라고 안내하세요.';

const readStdin = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);

  return Buffer.concat(chunks).toString('utf8');
};

const BLOCKED_COMMAND_PATTERNS = [
  // PR 머지, 자동 머지 켜기
  /\bgh\s+pr\s+merge\b/,
  /\bgh\s+api\b.*\/pulls\/\d+\/merge\b/,
  /\bgh\s+api\b.*enablePullRequestAutoMerge/,
  // PR 승인 (승인은 개발자 리뷰어의 몫)
  /\bgh\s+pr\s+review\b.*(--approve|-a\b)/,
];

const getOriginUrl = (cwd) => {
  try {
    return execSync('git remote get-url origin', { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

const input = JSON.parse(await readStdin());
const toolName = input.tool_name ?? '';

const originUrl = getOriginUrl(input.cwd);
if (MERGE_ALLOWED_REPOS.some((repo) => originUrl.includes(repo))) process.exit(0);

// 앱의 자동 머지 도구
if (/auto_merge|merge_pr/i.test(toolName)) {
  process.stderr.write(BLOCK_MESSAGE);
  process.exit(2);
}

if (toolName === 'Bash') {
  const command = input.tool_input?.command ?? '';

  if (BLOCKED_COMMAND_PATTERNS.some((pattern) => pattern.test(command))) {
    process.stderr.write(BLOCK_MESSAGE);
    process.exit(2);
  }
}

process.exit(0);
