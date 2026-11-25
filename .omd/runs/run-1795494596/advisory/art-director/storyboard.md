# storyboard.md — "Orbital Hierarchy" (recommended: Concept B)

One-page scroll-native landing for `grindr-plus-plus-mt`. All numbers are proposals —
the mission brief fixes sections, palette, motion tokens, and the 60fps mobile target;
vh 배분·data-speed·인스턴스 수는 구현자 실측으로 조정 가능 (가정 a8, a5).

---

## 밀도 예산 (숫자로)

| 항목 | 예산 | 근거 |
|---|---|---|
| 페이지 총 길이 | ~9.5vh-equivalents (7 섹션, 섹션별 0.75–2.0 스크린) | 미션 섹션 7개 고정; a8 |
| 미디어 개수 | 섹션당 ≥1, 히어로(폴드) ≥3, 페이지 전체 ≥9 | vh당 1개 이상, 폴드 3개 이상 규칙(로컬 확장, a1) |
| 가로 스크롤러 | 섹션 5에 채택 — 항목 **8개**(기능 8) | 가로 스크롤러 사용 시 8개 이상 규칙 |
| 모션 에셋 | ≥1 — 섹션 1 코어 6초 루프(pulse+궤도), reduced-motion 시 정지 프레임+라벨 교체 | 모션 에셋 1개 이상 규칙 |
| 섹션 잉크 목표 | 히어로 30% / 스택 28% / CENTERPIECE 34% / 성능 32% / 기능 30% / 타임라인 27% / fork credit 26% — 전부 ≥26% | 잉크 26% 이상 규칙; 피사체 면적 기준, 컨테이너 면적 아님 |
| 세로 패딩 | 히어로 하단 +1.2, CENTERPIECE 직전 +1.5 스크린 여백 — 나머지 섹션은 0.4–0.8로 압축 | 균일 vh 패딩 금지, 압도 지점 앞뒤에만 큰 여백 |

---

## 섹션 스토리보드

| # | 목적 | 뷰포트 높이 | 구도 패턴 | 에셋 (종류 · 제품 상태/의미 · 피사체 점유 · 비율 · 배치 · 생성 프롬프트 원문) | 스크롤 연출 | 카피 골격 |
|---|---|---|---|---|---|---|
| 1 | Hero — "계기가 점등된다" | 1.25 스크린 | 중앙 지배 오브제 + 좌하단 타이포 블록 (LC 관측형 1/3 오프센터 — 가정 a1) | **(a) 실시간 3D 코어**: R3F 구체+emissive 헤일로, "fork의 존재 자체" — 점유 38% 화면폭, 중앙 상단 1/3. **(b) 파티션 노드 링**: InstancedMesh 320, "커뮤니티" — 코어를 도는 반경 1.6x 링. **(c) fog 레이어**: 씬 fog #12100f, "아직 밝혀지지 않은 깊이" — 하단 40%. 프롬프트 원문(텍스처용 헤일로 스프라이트): `radial glow sprite, warm ember core #ff8a3d fading to #ffb887 then transparent, soft falloff, 512px, no banding` | 코어 pulse 6s 루프(모션 에셋①); 마크 parallax data-speed 0.15, 타이틀 0.45, 파티션 링 0.25 (역방향 미세 회전); fog 0.05. 리빌: 타이틀 라인별 y+24px, power2.out/0.6s | 제목: "The mod, measured." 본문 방향: 무엇인지 한 줄 + fork/GPL 한 줄 (muted) |
| 2 | Stack — "무엇으로 만들었나" | 1.0 스크린 | 카드가 지그재그 부유, 우측 2/3에 3D 카드 3장, 좌측 타이포 | **플로팅 3D 테크 카드 3장**: Next.js / R3F+drei / GSAP+Remotion — 각 카드는 panel #1d1613 반투명 슬랩에 ui-monospace 기술명. "구현 스택의 계층". 점유 각 20% 화면폭, 우측 3열 깊이 스택(카메라 랙각 15°). 프롬프트 원문(카드 에지 텍스처): `dark basalt slab edge #1d1613, brushed micro-grain, single warm rim light #ff8a3d from lower left, seamless tiling, 1024px` | 스크롤 시 카드 3장이 서로 다른 data-speed(0.6/0.75/0.9)로 미세 부유; 진입 리빌 80ms 스태거, power2.out/0.6s | 제목: "Built on rails that don't move." 본문: 스택 3줄 요약 |
| 3 | **CENTERPIECE — Orbital Hierarchy** | 2.0 스크린 (pinned) | 카메라 공전 3회 락온 → 축 방향 조감도 정점 | **(a) 궤도 시스템 3D**: Free 위성(muted, 반경 0.35x, 불완전 궤도선) / Xtra 행성(panel+accent_light 링 torus) / fork 코어(accent emissive + 파티션 InstancedMesh 240 "좌표 노드") — "세 등급의 질량". 코어 점유 30% 화면폭. **(b) 핀 라벨 3개**: ui-monospace, 천체에 CSS2D 핀 — "등급의 이름". **(c) 정점 조감 프레임**: 동심원 3개 + 원호 게이지 그래픽(2D 오버레이) — "측정의 시작". 프롬프트 원문(노드 마커): `small square coordinate marker #ffb887, 1px crisp edge, technical drawing style, 64px, transparent bg` | **pinned 2.0 스크린 scrub**: beat1 카메라 궤도면 공전 -40°→ Free 락온(나머지 디밍, 라벨 점등) / beat2 +40° → Xtra 락온(링 회전 강조) / beat3 fork 락온(코어 발광 상승, 노드 아크 180°→270°) / beat4 카메라 수직 상승 60° → 조감도, 노드 아크가 완전한 원을 닫음. 이징: 스크럽이므로 scroll에 위임, 락온 스냅만 power2.out/0.6s | 각 락온: 등급명(제목 1줄) + 한 줄 서술 — Free "What everyone gets." / Xtra "What money buys." / fork "What the source gives." |
| 4 | Performance proof — "측정값이 들어온다" | 1.25 스크린 | 좌: 대형 ms 카운터 3종 세로 스택 / 우: 다이얼 그래픽 (§3 정점의 원이 이어짐) | **(a) 다이얼 그래픽**: §3 정점 동심원의 반경 눈금 위에 ms 카운터가 탑승 — "측정의 연속성". 점유 30%. **(b) 카운터 3개**: tabular-nums 대형 수치 — "실측 증거". **(c) 측정 조건 캡션**: 기기/조건 한 줄 (muted). 수치는 미션 브리프 미제공 — **구현자가 실측값 주입, 숫자 만들지 않음** | 카운터가 스크롤 진입 시 0→실측값 count-up (0.6s, power2.out); 다이얼 원호가 값 비율로 sweep | 제목: "Numbers, not vibes." 본문: 측정 조건 1줄 |
| 5 | Feature highlights — "가로 서랍" | 1.0 스크린 | 수평 스크롤러 8항목, 세로 중앙 정렬 | **기능 카드 8장** (가로 스크롤러 8개 이상 규칙): 각 카드 panel #1d1613, radius 14, 기능명(ui-monospace) + 한 줄 서술 + 상태 라인. "fork가 추가한 층". 카드 점유 각 18% 화면폭. **아이콘 타일 금지** — 텍스트 상태 라인이 시각 역할. 프롬프트 원문(카드 배경): `matte dark panel #1d1613, subtle noise grain, warm edge highlight #ff8a3d top edge only, 512px` | 스크롤 세로 진행을 수평 이동으로 변환(scrub); 카드 진입 시 순차 점등(활성 카드만 accent 보더); 마지막 카드에서 수평축이 풀리며 세로로 복귀 | 제목: "What it adds." 본문: 카드당 1문장 |
| 6 | Install timeline — "설치의 순서" | 1.0 스크린 | 수직 타임라인 좌측 진행선 + 우측 스텝 | **타임라인 진행선**: accent 수직선이 스크롤에 따라 그려짐(scrub) — "순서가 절차". **스텝 마커 5개**: 원형 마커, 완료 시 점등. **각 스텝 코드 블록 1줄**: ui-monospace 명령어. "재현 가능한 설치". 점유: 라인 2% 화면폭, 코드 블록 각 55% | 진행선 height 0→100% scrub; 마커 점등 power2.out/0.6s; 코드 블록 리빌 60ms 스태거 | 제목: "Five steps. No account." 본문: 명령어 5줄 |
| 7 | Fork credit — "출처를 밝힌다" | 0.75 스크린 | 중앙 하단 정렬, 조용한 마감 | **(a) upstream 로고 자리**: 텍스트로만 — "GrindrPlus 계열 프로젝트" (로고 이미지 미사용, 저작권 안전 a3). **(b) GPL notice 라인**: muted, ui-monospace — "법적 성실성". **(c) repo 링크 CTA**: accent 보더 버튼 radius 14 — "행동 유출구". 점유: 텍스트 블록 40% 화면폭 | 페이드 리빌만 (power2.out/0.6s); CTA hover 시 accent→accent_light | 제목: "A fork, credited." 본문: GPL-3.0 한 줄 + upstream 링크 + repo 링크 |

---

## 압도 지점 (peak)

- **직전 여백**: 섹션 2 끝 → 섹션 3 시작 사이에 **1.5 스크린의 빈 캔버스** (#12100f
  순수 지대, 잉크 거의 0). 이 여백이 비어 있어야 CENTERPIECE pinned 진입의 낙차가 생긴다.
- **정점**: 섹션 3 beat4 — 조감도 프레임에서 노드 아크가 완전한 원을 닫는 프레임.
  이 프레임에서 화면은 bg #12100f 70% + 발광 accent 원 1개 + mono 라벨. 원이 곧
  게이지로 읽히는 설계라 §4로 떨어지지 않고 "넘어간다".

## 리듬 곡선

```
높이: 1.25 → 1.0 → [여백 1.5] → 2.0(pinned) → 1.25 → 1.0 → 1.0 → 0.75
텐션: 중간 ─ 낮음 ─ (숨) ─ ██████ 정점 ─ 높음 ─ 흐름 ─ 절차 ─ 낮음(마감)
```

## 구현자 검증 지정 (1440 · 390 캡처에서 확인할 것)

| 지점 | 1440에서 확인 | 390에서 확인 |
|---|---|---|
| hero | 타이틀 1줄 유지 + 코어가 폴드 상단 1/3에 위치 | 코어가 폴드 내 점유 ≤50% 높이, 타이틀 겹침 없음 |
| peak (§3 beat4) | 동심원 3개 + 닫힌 아크가 중앙 프레임 | 조감도가 화면폭 90% 이내로 수축, 라벨 핀 3개 모두 가독 |
| control | §6 코드 블록 텍스트 선택·복사 가능 (실제 `<code>`) | CTA 버터 터치 타깃 ≥44px |
| 결과 (§4) | 카운터 3개가 모두 실측 소스와 일치 | 카운터 count-up이 reduced-motion에서 즉시 최종값 |

- 실제 행동: §7 repo 링크 CTA만 실제 링크. 인라인 오류·수정·저장/재열기·키보드
  경로는 이 랜딩에 해당 상태가 없으므로 **적용 대상 아님**(task에서 정한 바).
- 접근성: prefers-reduced-motion 시 ① 모든 scrub 고정(최종 프레임) ② 코어 루프
  정지 프레임 ③ 핀 라벨은 항상 표시. 캡처·행동 검증은 구현자 몫; 사용자 시각적
  채택은 별도 결정.

## 데이터-스피드 요약 (ScrollSmoother parallax)

| 요소 | data-speed |
|---|---|
| hero fog | 0.05 |
| hero 코어(마크) | 0.15 |
| hero 파티션 링 | 0.25 |
| hero 타이틀 | 0.45 |
| stack 카드 3장 | 0.6 / 0.75 / 0.9 |
| §3 pinned | scrub (data-speed 미적용) |
| §4 다이얼 | 0.85 (미세 뒤처짐) |
| §5 수평 트랙 | scrub 변환 |
| §7 전체 | 1.0 (고정 마감) |

ART_DIRECTION_DONE sections=7 lc_rules=0 assumptions=8
