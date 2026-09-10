# 오뿌 — Codex 작업 인계

## 첫 작업 지시
이 문서의 요구사항과 부록의 최신 시안 코드를 읽고, 오뿌를 실제 기록이 유지되는 앱으로 발전시켜라. 우선 기존 저장소의 구조와 지침을 확인하고 그 기술에 맞춰 구현하라. 빈 저장소라면 모바일 우선 웹 앱으로 시작하라. 디자인과 날짜 클릭 → 향수 선택 → 저장 흐름을 유지하라. 계획 설명만 하고 끝내지 말고 구현하고 필요한 검증을 수행하라. 유료 서비스 가입, 공개 배포, 앱스토어 등록은 이 인계만으로 실행하지 않는다.

## 목적과 확정 요구사항
- 앱 이름: 오뿌. 매일 어떤 향수를 썼는지 달력에 기록하는 개인용 앱.
- 사용자 인지 부담과 입력·탐색 횟수를 최소화한다. 깨끗한 디자인과 필요한 기능만 유지한다.
- 메뉴는 달력, 향수장, 통계 세 개. 별도의 기록 탭이나 검색 탭을 만들지 않는다.
- 날짜를 누르면 달력 위에 향수 선택 창이 즉시 열린다. 달력 아래 멀리 떨어진 입력폼으로 이동시키지 않는다.
- 최근 쓴 향수가 먼저 보이고 이미 기록한 날짜는 기존 선택을 유지한다.
- 하루 여러 향수를 선택하여 한 번에 기록한다. 같은 향수 재사용 횟수도 선택적으로 남길 수 있다.
- 날짜 칸에 향수 이름을 직접 표시한다. 색 점만 표시하지 않는다. 여러 향수의 이름이 함께 보인다.
- 플로럴, 바닐라, 우디, 시트러스, 머스크 등 대표 테마를 분류하고 색으로 구분한다. 달력·향수장·통계에서 동일한 색을 사용한다.
- 대표 테마는 향수 정보에서 수정한다. 기록할 때마다 분류를 요구하지 않는다.
- 메모와 추가 사용 횟수는 기본적으로 접어 두고 필요할 때만 펼친다.
- 향수장에서는 목록 검색으로 향수를 담는다. 일상 기록에서 이름을 매번 타이핑하지 않는다.
- 기록 수정·삭제와 되돌리기를 제공한다. 저장된 내용을 단순히 다시 저장했을 때 중복 기록이 생기면 안 된다.
- 향수장에서 제거해도 과거 사용 기록은 보존한다.
- 월별·계절별 사용 순위와 테마 비중을 제공한다. 기록 변경을 즉시 반영한다.
- 기록한 날짜 수와 사용 횟수를 구분한다. 향수 두 개를 하루에 썼다면 1일, 2회이다. 같은 향수 재사용도 횟수에 반영한다.
- 계절 기준: 봄 3–5월, 여름 6–8월, 가을 9–11월, 겨울 12–다음 해 2월. 겨울 범위의 연도를 명확히 표시한다.

## 아직 구현되지 않은 것과 다음 단계
부록은 대화 속에서 동작하는 시안이다. 실제 앱이나 출시된 서비스가 아니다.
- 기록과 향수장은 현재 메모리 상태뿐이며 새로 열면 초기화된다.
- 예시 향수 7개와 합성 사용 이력이 들어 있다. 실제 사용자 기록이나 검증된 전체 향수 데이터가 아니다.
- 시안의 오늘은 2026-09-10으로 고정되어 있다. 실제 앱에서는 사용자 기기의 로컬 날짜를 사용한다.
- 외부 사이트 연동, 자동 데이터 수집, 로그인, 클라우드 동기화, 앱스토어 등록은 구현되지 않았다.
- 시안은 HTML fragment다. 독립 실행용 문서 껍데기와 실행 환경이 없으며 Lucide 아이콘은 대화 환경의 전역 객체에 의존한다. 실제 프로젝트에서는 아이콘 의존성을 명시하거나 기존 아이콘 시스템을 사용한다.
- 브라우저에서의 별도 자동 검증은 수행하지 않았다. 시안이 검증된 제품이라고 간주하지 않는다.

우선 구현할 사항:
1. 시안을 독립 실행 가능한 프로젝트로 옮긴다. 원본 디자인을 참고하되 유지보수 가능한 구조로 정리한다.
2. 기기에 기록·향수장·테마가 유지되도록 로컬 저장을 구현한다. 기본 서비스에 서버나 유료 API를 요구하지 않는다.
3. JSON 파일 내보내기/가져오기로 수동 백업을 제공한다. 가져오기 전에 형식과 버전을 검증하고 기존 데이터를 설명 없이 덮어쓰지 않는다.
4. 실제 사용자 모드는 빈 기록으로 시작한다. 데모 이력을 사용자 데이터에 자동으로 섞지 않는다.
5. 선택 상태 보존, 여러 향수 기록, 중복 방지, 삭제 복원, 새로고침 후 유지, 월·계절 경계, 모바일 화면을 중심으로 검증한다.

## 향수 목록과 비용 원칙
- 여러 공개 자료의 기본 사실을 독립적으로 확인해 자체 목록을 정리하고, 이후 신제품을 추가하는 방향이다.
- 공개 접근 가능성과 상업적 재사용 허용은 별개다. 여러 사이트 자료를 섞는다고 이용 조건이 사라진다고 가정하지 않는다.
- Fragrantica, 나무위키, 브랜드 사이트에 대한 자동 수집 권한이나 API 사용권을 확보한 상태가 아니다. 연결된 것처럼 표시하지 않는다.
- 실제 데이터 수집 전 출처별 이용 조건을 확인한다. 설명문·리뷰·사진·평점·기존 데이터베이스를 무단 복제하지 않는다.
- 사실 필드의 출처 URL, 확인일, 재사용 근거를 관리한다. 자체 테마 분류는 자체 분류라고 구분한다. 신제품 후보는 확인 후 추가한다.
- 비용을 최소화한다. 유료 데이터 API, LLM API, 회원가입/서버를 기본 구성으로 넣지 않는다.
- 개발·검수·수정 외주 예산은 잡지 않는다. Codex가 구현을 돕되 실기기 확인·계정 소유자 조작·출시 심사를 완료했다고 주장하지 않는다.

## 현재 범위 밖
- 나의비서 나비의 기존 기록을 가져올 수 있는지 논의했지만 사용자는 지금 할 일이 아니라고 했다.
- 나비와의 지속 동기화는 필요 없다. 실제 가져오기 기능이나 나비 연동을 이번 작업에 추가하지 않는다.
- 외부 시스템 캘린더와의 양방향 동기화 방식은 확정되지 않았다. 현재 우선순위는 앱 안의 달력 기록이다.
- 소셜 피드, 커뮤니티, 쇼핑 추천, 알림, 구독 결제, AI 추천 기능은 요청되지 않았다.

## 디자인 기준
아이보리 계열의 차분한 바탕, 어두운 녹색 주요 동작, 향 테마에만 사용하는 절제된 색상. 밝은/어두운 화면 모두 읽기 쉬워야 한다. 모바일 320px 이상에서 이름과 버튼이 겹치지 않아야 한다. 색과 함께 이름을 표시한다. 실제 앱의 모달은 작은 화면에서 선택과 저장이 가까이 있도록 설계하고 키보드·스크린리더 접근성을 유지한다.

## 부록 — 최신 시안 원본
아래 코드는 원본 보존용이다. 프로젝트의 `design/oppu-calm.fragment.html`로 추출하여 참고할 수 있다. 이 대화의 다른 파일이나 과거 대화 내용에 접근할 수 있다고 가정하지 말고 이 문서를 기준으로 작업하라.

```html
<div id="oppu-calm">
<style>
#oppu-calm {
  --op-paper:light-dark(#fbfaf7,#1c1e1c); --op-surface:light-dark(#ffffff,#252824);
  --op-ink:light-dark(#2a362f,#e9eee8); --op-muted:light-dark(#717770,#a5afa4);
  --op-line:light-dark(#e7e9e2,#3a4038); --op-soft:light-dark(#f0f2eb,#30382e);
  --op-accent:light-dark(#344b3e,#ccdcc7); --op-on-accent:light-dark(#ffffff,#233020);
  --op-shadow:light-dark(#283d2a0c,#00000025); --op-dim:light-dark(#23302b65,#080e09a8);
  font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;
  font-size:14px; line-height:1.5; color:var(--op-ink); position:relative; padding:8px 0;
  -webkit-tap-highlight-color:transparent;
}
#oppu-calm *,#oppu-calm *::before,#oppu-calm *::after { box-sizing:border-box; }
#oppu-calm [hidden] { display:none!important; }
#oppu-calm .op-floral { --op-tone:light-dark(#ad6281,#d19aaa); --op-tint:light-dark(#f5e8ed,#49343b); --op-tone-ink:light-dark(#7d435d,#f0bfd1); }
#oppu-calm .op-vanilla { --op-tone:light-dark(#b59549,#d2b268); --op-tint:light-dark(#f5edda,#48412d); --op-tone-ink:light-dark(#7b622b,#e7cf94); }
#oppu-calm .op-woody { --op-tone:light-dark(#778c73,#a1b498); --op-tint:light-dark(#e8eee3,#344230); --op-tone-ink:light-dark(#4f6448,#c5d9bb); }
#oppu-calm .op-citrus { --op-tone:light-dark(#be8256,#d5a477); --op-tint:light-dark(#f8eadf,#4d3829); --op-tone-ink:light-dark(#88582f,#f0c299); }
#oppu-calm .op-musk { --op-tone:light-dark(#8a86aa,#b2afd1); --op-tint:light-dark(#eceaf4,#3c394d); --op-tone-ink:light-dark(#656083,#d1cbed); }
#oppu-calm button,#oppu-calm input,#oppu-calm textarea,#oppu-calm select { font:inherit; color:inherit; }
#oppu-calm button { cursor:pointer; touch-action:manipulation; }
#oppu-calm button:disabled { cursor:default; opacity:.48; }
#oppu-calm button,#oppu-calm input,#oppu-calm textarea,#oppu-calm select { margin:0; }
#oppu-calm button { border:0; background:transparent; border-radius:10px; }
#oppu-calm h2,#oppu-calm h3,#oppu-calm p { margin:0; }
#oppu-calm h2,#oppu-calm h3,#oppu-calm strong { font-weight:500; }
#oppu-calm svg { flex-shrink:0; }
#oppu-calm .op-window { position:relative; max-width:440px; margin:0 auto; background:var(--op-paper); border:1px solid var(--op-line); border-radius:26px; box-shadow:0 12px 40px var(--op-shadow); }
#oppu-calm .op-header { padding:25px 24px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
#oppu-calm .op-wordmark { font-size:25px; font-weight:500; letter-spacing:-1.7px; display:flex; align-items:center; gap:5px; }
#oppu-calm .op-logo-dot { width:6px; height:6px; border-radius:50%; background:var(--op-accent); align-self:flex-end; margin-bottom:11px; }
#oppu-calm .op-tagline { color:var(--op-muted); font-size:11px; letter-spacing:.6px; margin-top:2px; }
#oppu-calm .op-demo { font-size:11px; letter-spacing:1px; color:var(--op-muted); border:1px solid var(--op-line); padding:4px 9px; border-radius:6px; }
#oppu-calm .op-main { min-height:566px; padding:0 22px 26px; }
#oppu-calm .op-heading { display:flex; align-items:center; justify-content:space-between; gap:8px; margin:5px 0 20px; }
#oppu-calm .op-heading h2 { font-size:23px; letter-spacing:-.8px; }
#oppu-calm .op-subtle { color:var(--op-muted); }
#oppu-calm .op-small { font-size:12px; }
#oppu-calm .op-icon-button { display:inline-flex; align-items:center; justify-content:center; padding:0; width:44px; min-width:44px; min-height:44px; color:var(--op-ink); }
#oppu-calm .op-icon-button:hover { background:var(--op-soft); }
#oppu-calm .op-text-button { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:44px; padding:8px 12px; font-size:13px; }
#oppu-calm .op-text-button:hover { background:var(--op-soft); }
#oppu-calm .op-today-button { background:var(--op-soft); min-height:32px; border-radius:7px; margin-right:2px; font-size:12px; padding:5px 10px; }
#oppu-calm .op-month { margin:0 0 14px; display:flex; justify-content:space-between; align-items:center; gap:3px; }
#oppu-calm .op-month-title { font-size:23px; letter-spacing:-.7px; white-space:nowrap; }
#oppu-calm .op-year { color:var(--op-muted); font-size:12px; letter-spacing:.8px; margin-bottom:3px; }
#oppu-calm .op-month-actions { display:flex; align-items:center; gap:0; }
#oppu-calm .op-calendar { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); margin:0 -12px; }
#oppu-calm .op-weekday { padding:5px 0 11px; text-align:center; color:var(--op-muted); font-size:11px; }
#oppu-calm .op-sunday { color:light-dark(#a26563,#d59b95); }
#oppu-calm .op-day { position:relative; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; width:100%; min-width:0; min-height:83px; padding:7px 2px 9px; border-radius:0; border-top:1px solid var(--op-line); gap:5px; }
#oppu-calm .op-day:hover { background:var(--op-soft); }
#oppu-calm .op-day-number { display:flex; align-items:center; justify-content:center; font-size:12px; width:26px; height:26px; border-radius:50%; }
#oppu-calm .op-day-today { background:light-dark(#f1f4ed,#2b3328); }
#oppu-calm .op-day-today .op-day-number { background:var(--op-accent); color:var(--op-on-accent); }
#oppu-calm .op-day-records { display:flex; flex-direction:column; width:100%; gap:3px; }
#oppu-calm .op-day-chip { display:block; background:var(--op-tint); color:var(--op-tone-ink); border-radius:4px; padding:3px 2px; font-size:11px; line-height:1.35; letter-spacing:-.45px; overflow-wrap:anywhere; width:100%; text-align:center; }
#oppu-calm .op-day-hint { font-size:11px; color:var(--op-accent); }
#oppu-calm .op-day-blank { min-height:83px; border-top:1px solid var(--op-line); }
#oppu-calm .op-legend { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:8px 13px; padding:18px 0 0; border-top:1px solid var(--op-line); margin:0 -10px; }
#oppu-calm .op-legend-item { display:inline-flex; align-items:center; gap:4px; color:var(--op-muted); font-size:11px; }
#oppu-calm .op-dot { flex-shrink:0; width:7px; height:7px; border-radius:50%; background:var(--op-tone); display:inline-block; }
#oppu-calm .op-help { text-align:center; color:var(--op-muted); font-size:12px; padding-top:18px; }
#oppu-calm .op-nav { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); padding:8px 14px 15px; border-top:1px solid var(--op-line); background:var(--op-surface); border-radius:0 0 26px 26px; }
#oppu-calm .op-nav-button { color:var(--op-muted); min-height:58px; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:5px; font-size:11px; letter-spacing:.1px; }
#oppu-calm .op-nav-button svg { width:21px; height:21px; stroke-width:1.6; }
#oppu-calm .op-nav-button[aria-current="page"] { color:var(--op-accent); background:var(--op-soft); }
#oppu-calm .op-shelf-count { color:var(--op-muted); margin-left:7px; font-size:16px; }
#oppu-calm .op-filter-list { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:21px; }
#oppu-calm .op-filter { padding:6px 10px; min-height:36px; font-size:12px; border-radius:9px; color:var(--op-muted); }
#oppu-calm .op-filter[aria-pressed="true"] { color:var(--op-on-accent); background:var(--op-accent); }
#oppu-calm .op-shelf-row { width:100%; text-align:left; display:flex; gap:13px; align-items:center; padding:17px 0; border-bottom:1px solid var(--op-line); border-radius:0; }
#oppu-calm .op-shelf-row:hover { background:var(--op-soft); }
#oppu-calm .op-bottle { display:flex; align-items:center; justify-content:center; width:44px; min-width:44px; height:54px; border-radius:9px; background:var(--op-tint); color:var(--op-tone-ink); }
#oppu-calm .op-bottle svg { width:23px; height:23px; stroke-width:1.3; }
#oppu-calm .op-info { min-width:0; flex:1; }
#oppu-calm .op-perfume-name { display:block; font-size:15px; letter-spacing:-.4px; word-break:keep-all; overflow-wrap:anywhere; }
#oppu-calm .op-brand { display:block; color:var(--op-muted); font-size:11px; margin-top:3px; }
#oppu-calm .op-theme-label { display:inline-flex; align-items:center; gap:5px; color:var(--op-tone-ink); font-size:11px; white-space:nowrap; }
#oppu-calm .op-shelf-row .op-theme-label { background:var(--op-tint); padding:4px 7px; border-radius:6px; }
#oppu-calm .op-segmented { display:flex; padding:4px; gap:4px; background:var(--op-soft); border-radius:11px; margin:0 0 23px; }
#oppu-calm .op-segmented button { flex:1; min-height:37px; font-size:13px; color:var(--op-muted); border-radius:8px; }
#oppu-calm .op-segmented button[aria-pressed="true"] { background:var(--op-surface); color:var(--op-ink); box-shadow:0 2px 6px var(--op-shadow); }
#oppu-calm .op-stats-period { display:flex; align-items:center; justify-content:space-between; gap:4px; text-align:center; margin:0 -9px; }
#oppu-calm .op-period-title { font-size:19px; letter-spacing:-.7px; }
#oppu-calm .op-date-range { font-size:11px; color:var(--op-muted); margin-top:4px; }
#oppu-calm .op-totals { color:var(--op-muted); text-align:center; padding:15px 0 27px; font-size:12px; }
#oppu-calm .op-totals strong { color:var(--op-ink); }
#oppu-calm .op-stat-section + .op-stat-section { margin-top:31px; padding-top:23px; border-top:1px solid var(--op-line); }
#oppu-calm .op-section-heading { display:flex; align-items:baseline; justify-content:space-between; gap:8px; margin-bottom:16px; }
#oppu-calm .op-section-heading h3 { font-size:14px; }
#oppu-calm .op-ranking { display:flex; flex-direction:column; gap:18px; }
#oppu-calm .op-rank-row { display:grid; grid-template-columns:19px minmax(0,1fr) auto; align-items:baseline; gap:8px; }
#oppu-calm .op-rank-number { color:var(--op-muted); font-size:12px; font-variant-numeric:tabular-nums; }
#oppu-calm .op-rank-name { font-size:13px; overflow-wrap:anywhere; }
#oppu-calm .op-rank-count { font-size:12px; font-variant-numeric:tabular-nums; white-space:nowrap; }
#oppu-calm .op-track { height:5px; background:var(--op-soft); margin-top:8px; border-radius:3px; overflow:hidden; }
#oppu-calm .op-track-fill { height:100%; border-radius:3px; background:var(--op-tone); }
#oppu-calm .op-theme-stack { display:flex; height:12px; gap:3px; border-radius:5px; overflow:hidden; margin-bottom:17px; }
#oppu-calm .op-theme-segment { background:var(--op-tone); }
#oppu-calm .op-theme-values { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px 22px; }
#oppu-calm .op-theme-value { display:flex; align-items:center; justify-content:space-between; gap:6px; font-size:12px; }
#oppu-calm .op-theme-value-label { display:flex; align-items:center; gap:7px; }
#oppu-calm .op-stat-note { font-size:11px; color:var(--op-muted); margin-top:26px; }
#oppu-calm .op-empty { text-align:center; padding:50px 15px; color:var(--op-muted); }
#oppu-calm .op-empty p { margin:8px 0; }
#oppu-calm .op-dialog { position:absolute; top:36px; right:12px; bottom:auto; left:12px; margin:0 auto; max-width:412px; width:calc(100% - 24px); max-height:none; overflow:visible; padding:0; border:1px solid var(--op-line); border-radius:23px; background:var(--op-surface); color:var(--op-ink); box-shadow:0 20px 80px light-dark(#17211e35,#00000085); }
#oppu-calm .op-dialog::backdrop { background:var(--op-dim); }
#oppu-calm .op-dialog-header { padding:22px 20px 16px; display:flex; align-items:center; justify-content:space-between; gap:8px; }
#oppu-calm .op-dialog-kicker { font-size:11px; color:var(--op-muted); margin-bottom:4px; }
#oppu-calm .op-dialog-title { font-size:21px; letter-spacing:-.65px; }
#oppu-calm .op-dialog-body { padding:0 20px 10px; }
#oppu-calm .op-search { position:relative; display:flex; align-items:center; gap:9px; padding:0 12px; background:var(--op-soft); border-radius:10px; min-height:44px; }
#oppu-calm .op-search > svg { color:var(--op-muted); }
#oppu-calm .op-search input { background:transparent; border:0; width:100%; min-width:0; font-size:16px; padding:10px 0; border-radius:2px; }
#oppu-calm .op-search input::placeholder { color:var(--op-muted); font-size:13px; }
#oppu-calm .op-choice-heading { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:14px; min-height:32px; font-size:11px; color:var(--op-muted); }
#oppu-calm .op-choice-heading button { font-size:11px; padding:6px 0 6px 10px; min-height:36px; color:var(--op-ink); }
#oppu-calm .op-choices { display:flex; flex-direction:column; }
#oppu-calm .op-choice { display:flex; align-items:center; gap:11px; min-height:61px; padding:8px 3px; border-bottom:1px solid var(--op-line); cursor:pointer; }
#oppu-calm .op-choice .op-choice-swatch { width:5px; height:29px; border-radius:3px; background:var(--op-tone); flex-shrink:0; }
#oppu-calm .op-choice input { width:21px; height:21px; min-width:21px; accent-color:var(--op-accent); cursor:pointer; }
#oppu-calm .op-choice:has(input:checked) .op-perfume-name { color:var(--op-accent); }
#oppu-calm .op-choice input:disabled { cursor:default; }
#oppu-calm .op-choice .op-brand { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
#oppu-calm .op-choice .op-theme-label { font-size:11px; }
#oppu-calm .op-extra { margin-top:8px; }
#oppu-calm .op-extra summary { cursor:pointer; color:var(--op-muted); font-size:12px; min-height:44px; padding:12px 0; }
#oppu-calm .op-extra-inner { padding:0 0 10px; }
#oppu-calm .op-extra label,#oppu-calm .op-field-label { font-size:12px; display:block; margin:7px 0; }
#oppu-calm .op-memo { background:var(--op-paper); border:1px solid var(--op-line); padding:11px; min-height:76px; width:100%; resize:vertical; border-radius:10px; font-size:16px; }
#oppu-calm .op-memo::placeholder { font-size:13px; color:var(--op-muted); }
#oppu-calm .op-use-count { margin-top:12px; }
#oppu-calm .op-use-row { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:6px; }
#oppu-calm .op-use-row-name { font-size:12px; min-width:0; overflow-wrap:anywhere; }
#oppu-calm .op-stepper { display:flex; align-items:center; flex-shrink:0; }
#oppu-calm .op-stepper button { width:44px; height:44px; font-size:20px; }
#oppu-calm .op-stepper output { font-size:12px; min-width:27px; text-align:center; font-variant-numeric:tabular-nums; }
#oppu-calm .op-dialog-footer { padding:13px 20px 19px; border-top:1px solid var(--op-line); }
#oppu-calm .op-primary { display:flex; justify-content:center; align-items:center; gap:7px; width:100%; min-height:48px; background:var(--op-accent); color:var(--op-on-accent); border-radius:12px; padding:12px; font-size:14px; }
#oppu-calm .op-primary:disabled { opacity:1; color:var(--op-muted); background:var(--op-soft); }
#oppu-calm .op-save-caption { color:var(--op-muted); font-size:11px; text-align:center; margin-bottom:9px; }
#oppu-calm .op-detail-brand { color:var(--op-muted); font-size:11px; letter-spacing:1px; margin-bottom:6px; }
#oppu-calm .op-detail-name { font-size:26px; letter-spacing:-1px; overflow-wrap:anywhere; }
#oppu-calm .op-detail-en { color:var(--op-muted); font-size:12px; margin-top:5px; }
#oppu-calm .op-detail-bottle { width:72px; height:84px; border-radius:14px; margin:2px 0 20px; }
#oppu-calm .op-detail-bottle svg { width:33px; height:33px; }
#oppu-calm .op-detail-field { margin-top:25px; }
#oppu-calm .op-select { width:100%; background:var(--op-paper); border:1px solid var(--op-line); min-height:45px; border-radius:10px; padding:9px 10px; font-size:16px; }
#oppu-calm .op-remove { width:100%; min-height:44px; color:var(--op-muted); margin-top:7px; font-size:12px; }
#oppu-calm .op-toast { position:absolute; left:14px; right:14px; bottom:93px; z-index:5; display:flex; align-items:center; gap:9px; justify-content:space-between; background:var(--op-accent); color:var(--op-on-accent); padding:7px 10px 7px 15px; border-radius:12px; box-shadow:0 5px 20px var(--op-shadow); font-size:12px; }
#oppu-calm .op-toast button { color:inherit; padding:7px; min-height:38px; white-space:nowrap; font-size:12px; text-decoration:underline; text-underline-offset:3px; }
#oppu-calm .op-reader { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
@media(max-width:380px) {
  #oppu-calm .op-header { padding:22px 17px 18px; }
  #oppu-calm .op-main { padding:0 16px 23px; }
  #oppu-calm .op-month-title { font-size:22px; }
  #oppu-calm .op-legend { gap:9px; }
  #oppu-calm .op-filter { padding:6px 8px; }
  #oppu-calm .op-dialog-body { padding-right:15px; padding-left:15px; }
  #oppu-calm .op-dialog-header { padding:19px 15px 13px; }
  #oppu-calm .op-dialog-footer { padding-right:15px; padding-left:15px; }
  #oppu-calm .op-perfume-name { font-size:14px; }
}
@media(pointer:coarse) { #oppu-calm .op-today-button,#oppu-calm .op-filter,#oppu-calm .op-choice-heading button { min-height:44px; } }
</style>
<div class="op-window">
  <header class="op-header">
    <div><div class="op-wordmark">오뿌<span class="op-logo-dot" aria-hidden="true"></span></div><p class="op-tagline">오늘 뿌린 향수</p></div>
    <span class="op-demo">시안</span>
  </header>
  <main class="op-main" id="op-calm-screen"></main>
  <nav class="op-nav" aria-label="주 메뉴">
    <button type="button" class="op-nav-button" data-nav="calendar" aria-current="page"><i data-lucide="calendar-days" aria-hidden="true"></i><span>달력</span></button>
    <button type="button" class="op-nav-button" data-nav="shelf"><i data-lucide="spray-can" aria-hidden="true"></i><span>향수장</span></button>
    <button type="button" class="op-nav-button" data-nav="stats"><i data-lucide="chart-no-axes-column-increasing" aria-hidden="true"></i><span>통계</span></button>
  </nav>
  <div class="op-toast" hidden><span id="op-calm-toast-message"></span><button type="button" data-undo>되돌리기</button></div>
</div>
<div class="op-reader" id="op-calm-live" aria-live="polite" aria-atomic="true"></div>
<dialog class="op-dialog" aria-labelledby="op-calm-dialog-title"></dialog>
<script>
(() => {
  const root = document.getElementById('oppu-calm');
  const screen = root.querySelector('#op-calm-screen');
  const dialog = root.querySelector('.op-dialog');
  const live = root.querySelector('#op-calm-live');
  const today = new Date(2026, 8, 10);
  const themes = {floral:'플로럴',vanilla:'바닐라',woody:'우디',citrus:'시트러스',musk:'머스크'};
  const perfumes = [
    {id:1,brand:'딥티크',brandEn:'DIPTYQUE',name:'오르페옹',en:'Orphéon',theme:'woody'},
    {id:2,brand:'르 라보',brandEn:'LE LABO',name:'상탈 33',en:'Santal 33',theme:'woody'},
    {id:3,brand:'바이레도',brandEn:'BYREDO',name:'블랑쉬',en:'Blanche',theme:'musk'},
    {id:4,brand:'조 말론',brandEn:'JO MALONE',name:'우드 세이지 앤 씨 솔트',en:'Wood Sage & Sea Salt',theme:'woody'},
    {id:5,brand:'딥티크',brandEn:'DIPTYQUE',name:'도 손',en:'Do Son',theme:'floral'},
    {id:6,brand:'톰 포드',brandEn:'TOM FORD',name:'네롤리 포르토피노',en:'Neroli Portofino',theme:'citrus'},
    {id:7,brand:'딥티크',brandEn:'DIPTYQUE',name:'오 듀엘',en:'Eau Duelle',theme:'vanilla'}
  ];
  const perfume = id => perfumes.find(p => p.id === Number(id));
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\s]/g,'');
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const themeLabel = p => `<span class="op-theme-label op-${p.theme}"><span class="op-dot" aria-hidden="true"></span>${themes[p.theme]}</span>`;
  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const fromKey = key => {const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d);};
  const monthStart = date => new Date(date.getFullYear(),date.getMonth(),1);
  const seasonStart = date => {const month = date.getMonth(); return month<2 ? new Date(date.getFullYear()-1,11,1) : new Date(date.getFullYear(),2+Math.floor((month-2)/3)*3,1);};
  const clone = value => JSON.parse(JSON.stringify(value));
  let shelf = [1,3,5,6,7];
  let records = {};
  let tab = 'calendar', visibleMonth = monthStart(today), statsAnchor = monthStart(today), statsMode = 'month', shelfTheme = 'all';
  let modalState = null, lastTrigger = null, undoAction = null, hasSaved = false;
  // Example history only. No external database or saved user records are accessed.
  for(let m=0;m<8;m++) {
    const pool = m<2 ? [7,7,1,3] : m<5 ? [5,5,3,1] : [6,6,3,5];
    for(let d=1;d<=27;d+=2) {
      const id = pool[(d+m)%pool.length];
      records[dateKey(new Date(2026,m,d))] = {items:[{id,count:1}],memo:''};
      if(d%7===0) { const extra=pool[(d+m+1)%pool.length]; if(extra!==id) records[dateKey(new Date(2026,m,d))].items.push({id:extra,count:1}); }
    }
  }
  records['2025-12-14']={items:[{id:7,count:1}],memo:'포근한 겨울 향'};
  const september = {1:[1],2:[3],3:[1,7],5:[5],7:[1,7],8:[3],9:[1]};
  Object.entries(september).forEach(([d,ids]) => {records[dateKey(new Date(2026,8,Number(d)))]= {items:ids.map(id=>({id,count:1})),memo:Number(d)===7?'아침에는 오르페옹, 저녁에는 오 듀엘':''};});
  function icons() { if(typeof lucide !== 'undefined') lucide.createIcons({attrs:{width:18,height:18}}); }
  function announce(text) { live.textContent=text; }
  function fitDialog() { root.style.minHeight=dialog.open ? `${Math.max(root.querySelector('.op-window').offsetHeight+16,dialog.offsetHeight+70)}px` : ''; }
  new ResizeObserver(fitDialog).observe(dialog);
  function notify(text,undo) {
    undoAction=undo;
    const toast=root.querySelector('.op-toast');
    root.querySelector('#op-calm-toast-message').textContent=text;
    toast.hidden=false;
    announce(text);
  }
  function hideToast() { root.querySelector('.op-toast').hidden=true; undoAction=null; }
  function nav(next) {
    hideToast();
    if(next==='stats' && tab!=='stats') statsAnchor=monthStart(visibleMonth);
    tab=next;
    render();
  }
  function calendarView() {
    const year=visibleMonth.getFullYear(),month=visibleMonth.getMonth();
    const first=new Date(year,month,1).getDay(),days=new Date(year,month+1,0).getDate();
    const cells=Math.ceil((first+days)/7)*7;
    return `<div class="op-month"><div><p class="op-year">${year}</p><h2 class="op-month-title">${month+1}월의 향기</h2></div><div class="op-month-actions"><button type="button" class="op-today-button" data-today>오늘</button><button type="button" class="op-icon-button" data-month="-1" aria-label="이전 달">${icon('chevron-left')}</button><button type="button" class="op-icon-button" data-month="1" aria-label="다음 달">${icon('chevron-right')}</button></div></div>
      <div class="op-calendar" aria-label="${year}년 ${month+1}월 향수 달력">${['일','월','화','수','목','금','토'].map((d,i)=>`<span class="op-weekday ${i===0?'op-sunday':''}">${d}</span>`).join('')}${Array.from({length:cells},(_,i)=>{
        const d=i-first+1;
        if(d<1||d>days) return '<span class="op-day-blank" aria-hidden="true"></span>';
        const key=dateKey(new Date(year,month,d)),isToday=key===dateKey(today),entry=records[key],items=entry?.items||[];
        const description=items.map(item=>`${perfume(item.id).name} ${item.count}회`).join(', ');
        return `<button type="button" class="op-day ${isToday?'op-day-today':''}" data-date="${key}" ${isToday?'aria-current="date"':''} aria-label="${month+1}월 ${d}일${isToday?' 오늘':''}, ${esc(description||'기록 없음')}, 향수 선택"><span class="op-day-number ${i%7===0&&!isToday?'op-sunday':''}">${d}</span><span class="op-day-records">${items.map(item=>{const p=perfume(item.id);return `<span class="op-day-chip op-${p.theme}">${p.name}${item.count>1?` · ${item.count}회`:''}</span>`;}).join('')}</span>${isToday&&!items.length?'<span class="op-day-hint">기록하기</span>':''}</button>`;
      }).join('')}</div>
      <div class="op-legend" aria-label="향 테마 색상">${Object.entries(themes).map(([key,label])=>`<span class="op-legend-item op-${key}"><span class="op-dot" aria-hidden="true"></span>${label}</span>`).join('')}</div>
      <p class="op-help">${hasSaved?'오늘의 향이 하루하루 모여요.':'날짜를 눌러 오늘의 향을 남겨보세요.'}</p>`;
  }
  function shelfView() {
    const list=shelf.map(perfume).filter(p=>shelfTheme==='all'||p.theme===shelfTheme);
    const availableThemes=Object.keys(themes).filter(t=>shelf.some(id=>perfume(id).theme===t));
    return `<div class="op-heading"><h2>향수장<span class="op-shelf-count">${shelf.length}</span></h2><button type="button" class="op-text-button" data-catalog>${icon('plus')} 추가</button></div>
      <div class="op-filter-list" aria-label="향 테마로 보기"><button type="button" class="op-filter" data-filter="all" aria-pressed="${shelfTheme==='all'}">전체</button>${availableThemes.map(t=>`<button type="button" class="op-filter" data-filter="${t}" aria-pressed="${shelfTheme===t}">${themes[t]}</button>`).join('')}</div>
      ${list.length?list.map(p=>`<button type="button" class="op-shelf-row" data-detail="${p.id}" aria-label="${p.brand} ${p.name}, ${themes[p.theme]}, 상세 보기"><span class="op-bottle op-${p.theme}" aria-hidden="true">${icon('spray-can')}</span><span class="op-info"><span class="op-perfume-name">${p.name}</span><span class="op-brand">${p.brand}</span></span>${themeLabel(p)}</button>`).join(''):'<div class="op-empty"><p>향수장을 채워볼까요?</p><button type="button" class="op-text-button" data-catalog>향수 찾아 담기</button></div>'}`;
  }
  function period() {
    const start=statsMode==='month'?monthStart(statsAnchor):seasonStart(statsAnchor);
    const end=new Date(start.getFullYear(),start.getMonth()+(statsMode==='month'?1:3),1);
    const title=statsMode==='month'?`${start.getFullYear()}년 ${start.getMonth()+1}월`:`${start.getFullYear()}년 ${{2:'봄',5:'여름',8:'가을',11:'겨울'}[start.getMonth()]}`;
    const last=new Date(end.getFullYear(),end.getMonth(),0);
    const range=statsMode==='month'?'':`${start.getFullYear()}.${String(start.getMonth()+1).padStart(2,'0')} — ${last.getFullYear()}.${String(last.getMonth()+1).padStart(2,'0')}`;
    return {start,end,title,range};
  }
  function statsView() {
    const {start,end,title,range}=period();
    const days=Object.entries(records).filter(([key,entry])=>entry.items.length&&fromKey(key)>=start&&fromKey(key)<end);
    const counts={},themeCounts={};
    days.forEach(([,entry])=>entry.items.forEach(({id,count})=>{counts[id]=(counts[id]||0)+count;const t=perfume(id).theme;themeCounts[t]=(themeCounts[t]||0)+count;}));
    const ranking=Object.entries(counts).sort((a,b)=>b[1]-a[1]||Number(a[0])-Number(b[0]));
    const total=ranking.reduce((sum,[,n])=>sum+n,0),max=ranking[0]?.[1]||1;
    const themeRanking=Object.entries(themeCounts).sort((a,b)=>b[1]-a[1]);
    return `<div class="op-heading"><h2>통계</h2></div><div class="op-segmented" aria-label="통계 기간"><button type="button" data-mode="month" aria-pressed="${statsMode==='month'}">월별</button><button type="button" data-mode="season" aria-pressed="${statsMode==='season'}">계절별</button></div>
      <div class="op-stats-period"><button type="button" class="op-icon-button" data-period="-1" aria-label="이전 ${statsMode==='month'?'달':'계절'}">${icon('chevron-left')}</button><div><h3 class="op-period-title">${title}</h3>${range?`<p class="op-date-range">${range}</p>`:''}</div><button type="button" class="op-icon-button" data-period="1" aria-label="다음 ${statsMode==='month'?'달':'계절'}">${icon('chevron-right')}</button></div>
      ${total?`<p class="op-totals"><strong>${days.length}일</strong> 동안 <strong>${total}회</strong> · ${ranking.length}개의 향수</p>
      <section class="op-stat-section" aria-label="많이 뿌린 향수"><div class="op-section-heading"><h3>많이 뿌린 향수</h3><span class="op-subtle op-small">사용 횟수</span></div><div class="op-ranking">${ranking.map(([id,count])=>{const p=perfume(id),rank=ranking.findIndex(([,n])=>n===count)+1;return `<div class="op-rank-row"><span class="op-rank-number">${rank}</span><div><span class="op-rank-name">${p.name}</span><div class="op-track" aria-hidden="true"><div class="op-track-fill op-${p.theme}" style="width:${count/max*100}%"></div></div></div><span class="op-rank-count">${count}회</span></div>`;}).join('')}</div></section>
      <section class="op-stat-section" aria-label="향 테마 비중"><div class="op-section-heading"><h3>손이 간 향 테마</h3></div><div class="op-theme-stack" aria-hidden="true">${themeRanking.map(([t,count])=>`<span class="op-theme-segment op-${t}" style="flex:${count}"></span>`).join('')}</div><div class="op-theme-values">${themeRanking.map(([t,count])=>`<div class="op-theme-value op-${t}" aria-label="${themes[t]} ${count}회, ${Math.round(count/total*100)}퍼센트"><span class="op-theme-value-label"><span class="op-dot" aria-hidden="true"></span>${themes[t]}</span><span>${Math.round(count/total*100)}%</span></div>`).join('')}</div></section><p class="op-stat-note">같은 날 여러 향수를 쓰면 각각 집계해요.<br>테마는 향수마다 정한 대표 테마를 기준으로 해요.</p>`:
      '<div class="op-empty"><p>아직 남긴 향수가 없어요.</p><button type="button" class="op-text-button" data-period-calendar>달력에서 기록하기</button></div>'}`;
  }
  function render() {
    screen.innerHTML=tab==='calendar'?calendarView():tab==='shelf'?shelfView():statsView();
    root.querySelectorAll('[data-nav]').forEach(button=>{if(button.dataset.nav===tab) button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    icons(); fitDialog();
  }
  function recentIds(ids) {
    const lastUsed={};
    Object.entries(records).forEach(([key,entry])=>entry.items.forEach(item=>{if(!lastUsed[item.id]||key>lastUsed[item.id])lastUsed[item.id]=key;}));
    return [...ids].sort((a,b)=>(lastUsed[b]||'').localeCompare(lastUsed[a]||'')||shelf.indexOf(a)-shelf.indexOf(b));
  }
  function openDialog(state,trigger) {
    hideToast(); modalState=state; lastTrigger=trigger;
    renderDialog(); dialog.showModal(); fitDialog();
  }
  function closeDialog(restore=true) {
    dialog.close(); modalState=null; fitDialog();
    if(restore && lastTrigger) {
      if(lastTrigger.isConnected) lastTrigger.focus({preventScroll:true});
      else if(lastTrigger.dataset.date) root.querySelector(`[data-date="${lastTrigger.dataset.date}"]`)?.focus({preventScroll:true});
      else root.querySelector(`[data-nav="${tab}"]`)?.focus({preventScroll:true});
    }
  }
  function openDay(key,trigger) {
    const original=records[key]?clone(records[key]):{items:[],memo:''};
    const owned=new Set([...shelf,...original.items.map(item=>item.id)]);
    const order=recentIds([...owned]);
    original.items.forEach(item=>{const index=order.indexOf(item.id);if(index>=0) order.splice(index,1);});
    order.unshift(...original.items.map(item=>item.id));
    openDialog({type:'day',key,original,chosen:new Map(original.items.map(item=>[item.id,item.count])),memo:original.memo,query:'',all:owned.size===0,order},trigger);
  }
  function openCatalog(trigger) { openDialog({type:'catalog',chosen:new Map(),query:'',all:true},trigger); }
  function dialogHeader(kicker,title) {
    return `<div class="op-dialog-header"><div>${kicker?`<p class="op-dialog-kicker">${kicker}</p>`:''}<h2 class="op-dialog-title" id="op-calm-dialog-title">${title}</h2></div><button type="button" class="op-icon-button" data-close aria-label="닫기, 변경 내용 취소" autofocus>${icon('x')}</button></div>`;
  }
  function renderDialog() {
    const state=modalState;
    if(state.type==='detail') {
      const p=perfume(state.id);
      dialog.innerHTML=dialogHeader('향수장','향수 정보')+`<div class="op-dialog-body"><div class="op-bottle op-detail-bottle op-${p.theme}" aria-hidden="true">${icon('spray-can')}</div><p class="op-detail-brand">${p.brandEn}</p><h3 class="op-detail-name">${p.name}</h3><p class="op-detail-en">${p.en}</p><div class="op-detail-field"><label class="op-field-label" for="op-calm-theme">대표 테마</label><select class="op-select" id="op-calm-theme">${Object.entries(themes).map(([t,name])=>`<option value="${t}" ${t===p.theme?'selected':''}>${name}</option>`).join('')}</select><p class="op-subtle op-small" style="margin-top:9px">달력 색상과 통계에 함께 반영돼요.</p></div></div><div class="op-dialog-footer"><button type="button" class="op-primary" data-save-theme disabled>변경 내용 저장</button><button type="button" class="op-remove" data-remove-shelf>향수장에서 빼기</button><p class="op-save-caption" style="margin:0">향수장에서 빼도 지난 기록은 남아요.</p></div>`;
      icons();return;
    }
    const isDay=state.type==='day',date=isDay?fromKey(state.key):null;
    const title=isDay?`${date.getMonth()+1}월 ${date.getDate()}일 ${['일','월','화','수','목','금','토'][date.getDay()]}요일`:'향수 찾아 담기';
    const kicker=isDay?(state.key===dateKey(today)?'오늘의 향수':'이날의 향수'):'예시 목록 · 7개 향수';
    dialog.innerHTML=dialogHeader(kicker,title)+`<div class="op-dialog-body"><label class="op-search">${icon('search')}<span class="op-reader">브랜드 또는 향수 검색</span><input id="op-calm-search" type="search" placeholder="브랜드 또는 향수 검색" autocomplete="off" value="${esc(state.query)}"></label><div class="op-choice-heading"><span id="op-calm-list-label"></span>${isDay?'<button type="button" data-all-catalog></button>':'<span>여러 개 선택 가능</span>'}</div><div class="op-choices" id="op-calm-choices"></div>${isDay?`<details class="op-extra"><summary>메모 · 사용 횟수</summary><div class="op-extra-inner"><label for="op-calm-memo">메모</label><textarea class="op-memo" id="op-calm-memo" rows="2" maxlength="240" placeholder="아침엔 블랑쉬, 저녁엔 오 듀엘">${esc(state.memo)}</textarea><div class="op-use-count" id="op-calm-counts"></div></div></details>`:''}</div><div class="op-dialog-footer"><p class="op-save-caption" id="op-calm-save-caption"></p><button type="button" class="op-primary" data-save-selection></button></div>`;
    renderChoices(); renderCounts(); updateSave(); icons();
  }
  function matchingPerfumes() {
    const state=modalState,q=normalize(state.query);
    const candidates=state.type==='day'&&!state.all&&!q?state.order.map(perfume):perfumes;
    const terms=state.query.split(/[\s·,]+/).map(normalize).filter(Boolean);
    return candidates.filter(p=>terms.every(term=>normalize(p.name+p.en+p.brand+p.brandEn+themes[p.theme]).includes(term)));
  }
  function renderChoices() {
    const state=modalState,list=matchingPerfumes(),isDay=state.type==='day';
    dialog.querySelector('#op-calm-list-label').textContent=state.query?`검색 결과 ${list.length}개`:isDay&&!state.all?'내 향수 · 최근 사용 순':`전체 향수 ${list.length}개`;
    const allButton=dialog.querySelector('[data-all-catalog]');
    if(allButton) allButton.textContent=state.all||state.query?'내 향수만 보기':'전체 목록';
    dialog.querySelector('#op-calm-choices').innerHTML=list.length?list.map(p=>{
      const already=state.type==='catalog'&&shelf.includes(p.id),checked=already||state.chosen.has(p.id);
      return `<label class="op-choice op-${p.theme}"><span class="op-choice-swatch" aria-hidden="true"></span><span class="op-info"><span class="op-perfume-name">${p.name}</span><span class="op-brand">${p.brand}<span aria-hidden="true">·</span><span class="op-theme-label">${themes[p.theme]}</span>${already?'<span>· 담김</span>':''}</span></span><input type="checkbox" data-pick="${p.id}" ${checked?'checked':''} ${already?'disabled':''} aria-label="${p.brand} ${p.name}${already?', 향수장에 있음':''}"></label>`;
    }).join(''):'<div class="op-empty"><p>일치하는 향수가 없어요.</p><p class="op-small">다른 이름이나 브랜드로 찾아보세요.</p></div>';
    fitDialog();
  }
  function renderCounts() {
    if(modalState.type!=='day')return;
    const target=dialog.querySelector('#op-calm-counts');
    target.innerHTML=modalState.chosen.size?`<p class="op-subtle op-small">같은 향수를 다시 뿌렸다면</p>${[...modalState.chosen].map(([id,count])=>`<div class="op-use-row"><span class="op-use-row-name">${perfume(id).name}</span><span class="op-stepper"><button type="button" data-count-id="${id}" data-delta="-1" aria-label="${perfume(id).name} 사용 횟수 줄이기" ${count<=1?'disabled':''}>−</button><output aria-label="${perfume(id).name} 사용 횟수">${count}회</output><button type="button" data-count-id="${id}" data-delta="1" aria-label="${perfume(id).name} 사용 횟수 늘리기">+</button></span></div>`).join('')}`:'';
  }
  function canonical(entry) { return JSON.stringify({items:[...entry.items].sort((a,b)=>a.id-b.id),memo:entry.memo.trim()}); }
  function draftEntry() { return {items:[...modalState.chosen].map(([id,count])=>({id,count})),memo:modalState.memo.trim()}; }
  function updateSave() {
    const state=modalState,button=dialog.querySelector('[data-save-selection]'),caption=dialog.querySelector('#op-calm-save-caption');
    const size=state.chosen.size;
    if(state.type==='day') {
      const existed=state.original.items.length>0;
      button.disabled=(!size&&!existed)||canonical(draftEntry())===canonical(state.original);
      button.textContent=size?(existed?'수정 완료':`${size}개 향수 기록하기`):(existed?'이날 기록 지우기':'향수를 골라주세요');
      const newToShelf=[...state.chosen.keys()].filter(id=>!shelf.includes(id)&&!state.original.items.some(item=>item.id===id));
      caption.hidden=!newToShelf.length;
      caption.textContent='처음 고른 향수는 향수장에도 담겨요.';
    } else {
      button.disabled=!size;button.textContent=size?`${size}개 향수 담기`:'향수를 골라주세요';
      caption.textContent='한 번 담아두면 다음 기록부터 바로 보여요.';
    }
  }
  function saveSelection() {
    const state=modalState;
    const previousRecords=clone(records),previousShelf=[...shelf];
    let message='';
    if(state.type==='day') {
      if(!state.chosen.size) {delete records[state.key];message='이날 기록을 지웠어요.';}
      else {records[state.key]=draftEntry();message=`${fromKey(state.key).getMonth()+1}월 ${fromKey(state.key).getDate()}일, 향수를 남겼어요.`;}
      state.chosen.forEach((count,id)=>{if(!shelf.includes(id)&&!state.original.items.some(item=>item.id===id))shelf.push(id);});
      hasSaved=true;
    } else {
      state.chosen.forEach((count,id)=>{if(!shelf.includes(id))shelf.push(id);});
      shelfTheme='all';message=`${state.chosen.size}개 향수를 담았어요.`;
    }
    closeDialog(false);render();
    if(state.type==='day')root.querySelector(`[data-date="${state.key}"]`)?.focus({preventScroll:true});
    else root.querySelector('[data-catalog]')?.focus({preventScroll:true});
    notify(message,()=>{records=previousRecords;shelf=previousShelf;shelfTheme='all';render();});
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button||button.disabled)return;
    const data=button.dataset;
    if(data.nav) {nav(data.nav);return;}
    if('close' in data) {closeDialog();return;}
    if(data.date) {openDay(data.date,button);return;}
    if(data.month) {hideToast();visibleMonth=new Date(visibleMonth.getFullYear(),visibleMonth.getMonth()+Number(data.month),1);render();root.querySelector(`[data-month="${data.month}"]`)?.focus({preventScroll:true});announce(`${visibleMonth.getFullYear()}년 ${visibleMonth.getMonth()+1}월`);return;}
    if('today' in data) {visibleMonth=monthStart(today);render();openDay(dateKey(today),root.querySelector(`[data-date="${dateKey(today)}"]`));return;}
    if(data.filter) {shelfTheme=data.filter;render();root.querySelector(`[data-filter="${data.filter}"]`)?.focus({preventScroll:true});return;}
    if('catalog' in data) {openCatalog(button);return;}
    if(data.detail) {openDialog({type:'detail',id:Number(data.detail),theme:perfume(data.detail).theme},button);return;}
    if(data.mode) {statsMode=data.mode;render();root.querySelector(`[data-mode="${data.mode}"]`)?.focus({preventScroll:true});announce(period().title);return;}
    if(data.period) {const {start}=period();statsAnchor=new Date(start.getFullYear(),start.getMonth()+Number(data.period)*(statsMode==='month'?1:3),1);render();root.querySelector(`[data-period="${data.period}"]`)?.focus({preventScroll:true});announce(period().title);return;}
    if('periodCalendar' in data) {visibleMonth=period().start;nav('calendar');return;}
    if('allCatalog' in data) {modalState.all=!(modalState.all||modalState.query);modalState.query='';dialog.querySelector('#op-calm-search').value='';renderChoices();return;}
    if('saveSelection' in data) {saveSelection();return;}
    if(data.countId) {
      const id=Number(data.countId),next=Math.max(1,modalState.chosen.get(id)+Number(data.delta));
      modalState.chosen.set(id,next);renderCounts();updateSave();
      dialog.querySelector(`[data-count-id="${id}"][data-delta="${next===1?'1':data.delta}"]`)?.focus({preventScroll:true});
      announce(`${perfume(id).name} ${next}회`);return;
    }
    if('saveTheme' in data) {
      const p=perfume(modalState.id),previous=p.theme;p.theme=modalState.theme;
      closeDialog(false);shelfTheme='all';render();root.querySelector(`[data-detail="${p.id}"]`)?.focus({preventScroll:true});
      notify('대표 테마를 바꿨어요.',()=>{p.theme=previous;render();});return;
    }
    if('removeShelf' in data) {
      const id=modalState.id,previous=[...shelf];shelf=shelf.filter(x=>x!==id);
      closeDialog(false);shelfTheme='all';render();root.querySelector('[data-catalog]')?.focus({preventScroll:true});
      notify('향수장에서 뺐어요. 기록은 남아 있어요.',()=>{shelf=previous;render();});return;
    }
    if('undo' in data) {const action=undoAction;hideToast();if(action)action();announce('이전 상태로 되돌렸어요.');root.querySelector(`[data-nav="${tab}"]`)?.focus({preventScroll:true});}
  });
  root.addEventListener('input',event=>{
    if(event.target.id==='op-calm-search') {modalState.query=event.target.value;renderChoices();announce(`검색 결과 ${matchingPerfumes().length}개`);}
    if(event.target.id==='op-calm-memo') {modalState.memo=event.target.value;updateSave();}
  });
  root.addEventListener('change',event=>{
    if(event.target.matches('[data-pick]')) {
      const id=Number(event.target.dataset.pick);
      if(event.target.checked) {
        modalState.chosen.set(id,modalState.original?.items.find(item=>item.id===id)?.count||1);
        if(modalState.type==='day'&&!modalState.order.includes(id))modalState.order.push(id);
      } else modalState.chosen.delete(id);
      renderCounts();updateSave();announce(`${modalState.chosen.size}개 향수 선택`);
    }
    if(event.target.id==='op-calm-theme') {modalState.theme=event.target.value;dialog.querySelector('[data-save-theme]').disabled=modalState.theme===perfume(modalState.id).theme;}
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const bounds=dialog.getBoundingClientRect();
    if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeDialog();
  });
  render();
})();
</script>
</div>

```
