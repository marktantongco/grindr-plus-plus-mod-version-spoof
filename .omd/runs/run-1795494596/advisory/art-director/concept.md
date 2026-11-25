# concept.md — CENTERPIECE art direction (section 3, 3-segment comparison)

Scope: art direction for the CENTERPIECE section of the `grindr-plus-plus-mt` one-page
scroll-native landing, plus its handoff into section 4 (performance proof). Read-only
advisory; no tokens, no code, no DESIGN.md edits.

---

## 적용 범위 표 (decision ledger)

| 결정 | 근거 종류 | 출처·surface | 이번 적용/미해결 | 검증 방법 |
|---|---|---|---|---|
| 팔레트 6색 잠금 (bg #12100f / panel #1d1613 / ink #f4ece6 / muted #a08b7f / accent #ff8a3d / accent_light #ffb887) | 브랜드 사실 | 미션 브리프 → 전체 랜딩 | 적용 | 1440·390 캡처에서 hex 대조 |
| heading ui-monospace / body ui-sans-serif | 브랜드 사실 | 미션 브리프 → 전체 타이포 | 적용 | computed style 검사 (구현자) |
| motion: power2.out / 0.6s, reduced-motion 필수 | 브랜드 사실 | 미션 브리프 → 모션 토큰 | 적용 (스크럽 구간은 스크롤에 위임, 0.6s는 discrete reveal에) | prefers-reduced-motion 토글 시 정지 프레임 확인 |
| radius 14 | 브랜드 사실 | 미션 브리프 → 패널·카드 | 적용 | CSS 값 검사 |
| 3세그먼트 비교 구조 (Free / Xtra / fork) | 권한 있는 프로젝트 결정 | 미션 브리프 §3 | 적용 | 섹션 DOM에 3 레이블 존재 |
| "rotating tri-prism"은 디폴트이나 교체 허용 | 권한 있는 프로젝트 결정 | 미션 브리프 TASK 문단 | 적용 — 본 문서에서 3안 제시, 1안은 프리즘 유지 | — |
| R3F/drei 기술 제약 (instancing, transmission 회피 등) | 코덱스 관측 아님 — 일반 Three.js 실무 지식 | **가정 a1** | 적용 (feasibility 노트로 근거 병기) | 구현자 모바일 실측 (FrameTime ms) |
| fork credit + GPL notice 노출 | 브랜드 사실 | 미션 브리프 → section 7 | 적용 | 390px 캡처에서 가독 확인 |
| 통계 수치·ms 값 | 미제공 | 미션 브리프에 없음 | **미해결** — 스토리보드는 수치 자리만 지정, 숫자는 구현자가 측정값으로 | 카운터가 실측 소스와 일치하는지 |

---

## 컨셉 한 문장 (페이지 전체)

> **"광산 속 계기판"** — 한 권의 검은 현무암 속에서 발광하는 주황 계기가 차례로 점등되는
> 페이지. 위계가 아니라 *점등 순서*로 정보를 읽게 만든다.
> 근거: 브랜드 voice "technical-luxe, confident, no fluff" — 계기판은 장식이 아니라
> 상태를 말하는 기물이고, 기술 럭셔리의 조명은 스포트라이트가 아니라 지시등이다.
> (voice 문구는 미션 브리프 voice 항목에서 그대로 인용.)

CENTERPIECE는 이 문장의 정점이다: 세 가지 "등급의 불빛" — Free(꺼진 등), Xtra(유리 등),
fork(용암 등) — 이 하나의 장치 안에서 교대로 점등된다.

## 무드

- **빛**: *ember on charcoal* — bg #12100f 위에 accent #ff8a3d가 연소 지점으로만 찍힌다.
  근거: 팔레트 자체가 암배경+단일 주황 악센트 구조 (브랜드 사실).
- **질감**: *brushed basalt* — panel #1d1613의 무광 깊이, 반사는 프레넬 가장자리에만.
  근거: radius 14 + 무광 패널 토큰이 암시하는 matte 패널 시스템 (브랜드 사실의 확장 해석, 가정 a2).
- **속도**: *damped, measured* — power2.out / 0.6s. 미끄러지지 않고 제동되는 모션.
  근거: motion 토큰 그대로 (브랜드 사실).

## 팔레트 사용법 (CENTERPIECE 기준)

| 역할 | 토큰 | hex | CENTERPIECE에서의 쓰임 |
|---|---|---|---|
| 캔버스 | bg | `#12100f` | 3D 씬 클리어 컬러·fog 색. 섹션 전체 지분 ≥70% |
| 잉크 | ink | `#f4ece6` | 세그먼트 타이틀·수치. 절대 발광체 위에 올리지 않음(콘트라스트 보존) |
| 보조 잉크 | muted | `#a08b7f` | 캡션·단서 ("GPL-3.0 fork" 등), 3D 라벨의 비활성 상태 |
| 악센트 | accent | `#ff8a3d` | **유일한 발광색.** fork 세그먼트의 코어·활성 라인·게이지 |
| 악센트 보조 | accent_light | `#ffb887` | 발광의 하이라이트 단계(코어 중심부, hover 상태). 독립 색으로 쓰지 않고 accent의 밝은 끝으로만 |
| 패널 | panel | `#1d1613` | 3D 유리 패널의 베이스톤, 2D 오버레이 카드 |
| 압도 지점 | — | — | 정점 프레임에서 bg:#12100f : 발광 accent 면적 ≈ 9:1 (어두움이 지배, 발광이 침투) |

## 에셋 방향

**추상 UI + 실시간 3D (사진·얼굴·로고·스톡 전면 배제).** 근거: (1) 대상이 오픈소스
모디파이드 앱 — 제품 실물 스크린샷은 브랜드 저작물이라 쓸 수 없고(가정 a3), 얼굴·스톡은
technical-luxe와 충돌. (2) 스택이 R3F/drei — 랜더가 곧 에셋이므로 60fps 예산 안에서
geometry로 상태를 말하는 것이 정확히 이 페이지의 논리. (3) 코덱스 계열 관측으로 제품
랜딩의 3D는 "기술 페이지의 셰이더 장면" 정당성을 갖는다 — 이 페이지는 정확히 기술·소프트웨어
페이지다. **가정 a4**로 표기.

이모지·아이콘 타일 금지. 세그먼트 구분은 라벨(ui-monospace)과 3D 장치의 상태가 담당.

## CENTERPIECE 3안 (구조적으로 다른 장치들)

각 안: 무드어 / technical-luxe 적합성 / 모바일 60fps feasibility / §4 전이.

---

### Concept A — "Obsidian Tri-Prism" (미션 디폴트 유지, 재연출)

**장치**: 회전하는 삼각 단면 프리즘. 세 면 = Free / Xtra / fork. 스크롤에 120°씩
스텝 로테이션하며 활성 면이 카메라를 향한다. 프리즘은 검은 흑요석, 모서리만
accent 프레넬 림.

- **무드어**: monolithic · refracted · ceremonial
- **technical-luxe 적합성**: "하나의 결정, 세 개의 면"은 no-fluff 서사 — 비교 구조가
  오브제의 기하학 그 자체로 설명된다. 모서리 림 발광은 계기 지시등 논리와 일치.
- **feasibility**: 기하 ExytrudedGeometry 1개 (~1.2k tris). MeshPhysicalMaterial의
  transmission은 모바일에서 expensive — **금지**, 대신 프레넬 림 커스텀 셰이더 + 저해상도
  env map(64px 큐브)로 유리감 위장. 라이트 1개(directional)+emissive 림. 프레임 예산
  여유 큼(그림자 없음, fog 1개). 60fps 안전도 ★★★★★.
- **§4 전이**: 프리즘이 마지막 120° 회전 후 정면 고정 → 면의 fork 발광 림이 화면 하단의
  게이지 바로 "굳어지는" 매치컷. 림 곡률 → 카운터 바 곡률.
- **약점**: 히어로(볼류메트릭 마크)·스택(플로팅 카드)이 이미 "3D 오브제 하나가 뜬다"는
  같은 어휘 — CENTERPIECE까지 가면 섹션 1·2·3이 같은 문장을 세 번 말하게 됨.

---

### Concept B — "Orbital Hierarchy" (구조 교체 — 궤도 비교) ★ 추천

**장치**: 하나의 중심축에 세 천체가 공중전원처럼 배치된 궤도 시스템.
- **Free** = 작고 어두운 위성(muted 톤, 발광 없음, 불완전한 궤도선)
- **Xtra** = 금속 링을 낀 행성(panel 톤 + accent_light 림, 유료 등급의 "장착" 이미지)
- **fork** = 중심에 가까운 밝은 코어(accent 발광 + InstancedMesh 파티션 아크리노드 —
  커뮤니티가 코어를 두르는 이미지)

스크롤 = 카메라가 궤도면을 따라 공전하며 3회 락온. 각 락온에서 해당 천체만
발광·라벨 점등, 나머지는 muted로 디밍. 마지막에 카메라가 축 방향으로 올라가
세 궤도가 동심원으로 겹쳐 보이는 "조감도 프레임" — 이것이 정점.

- **무드어**: astronomical · precise · ruthless
- **technical-luxe 적합성**: 비교를 "등급"이 아니라 "질량과 궤도"로 서술 — 위계가
  수식처럼 읽힌다. ui-monospace 라벨이 항공 계기 좌표처럼 천체에 핀으로 붙는다.
  동심원 조감도는 계기판의 원형 다이얼 어휘와 직결.
- **feasibility**: 구형 3개(low-seg sphere, 세그 24×16 ≈ 각 800 tris) + 링 2개
  (torus, thin) + 파티션 InstancedMesh 1개(인스턴스 240개, 단일 draw call).
  포스트프로세싱 없음 — 발광은 emissive + 스프라이트 헤일로 텍스처 1장으로 위장.
  총 ~3.5k tris, draw call ~8개. 중급 폰에서 안정 60fps. 궤도 애니메이션은
  uniform 시간 기반이므로 스크럽과 독립(가벼움). **가정 a5**: 파티션 인스턴스 수는
  구현자가 GPU 계층별 160/240/320으로 스케일.
- **§4 전이 (이 안의 핵심 강점)**: 조감도 프레임의 fork 코어를 두른 파티션 아크가
  "완전한 원"을 닫는 순간, 그 원이 카메라 조감 아래에서 **게이지 다이얼**로 읽히도록
  배치 — 섹션 4의 첫 카운터(ms)가 이 동심원의 반경 눈금 위에 탑승해서 들어온다.
  시각 어휘(원형 계기)가 섹션을 넘어 연속됨. 스크롤 연속성 끊김 없음.
- **약점**: "천체" 소재가 SF 클리셰로 미끄러질 위험 — 파티션을 별이 아니라
  **좌표 노드**(작은 사각 마커 + 연결선 없음)로 처리해 기술 도면 톤을 유지해야 함.

---

### Concept C — "Strata Cutaway" (구조 교체 — 심도 적층 패널)

**장치**: 세 장의 유리 슬랩이 z축 깊이로 적층된 단면(시컷) 구조. 앞→뒤가 곧
Free→Xtra→fork. 스크롤이 슬랩 사이를 벌려(전개) 포커스를 앞에서 뒤로 랙해간다.
fork 슬랩만 emissive 잉크가 내각에 흐른다. 단면 테두리에 accent 라인.

- **무드어**: stratified · surgical · quiet
- **technical-luxe 적합성**: "절개해서 층을 보인다"는 해부학 어휘 — mod의 본질
  (기존 제품을 뜯어서 층을 추가한다)과 형상이 일치. 가장 문학적인 안.
- **feasibility**: 3개의 rounded-plane 메시(각 ~200 tris) + 프레넬 유리 셰이더.
  라이트 사실상 불필요(발광은 emissive). 전체 <1k tris로 **3안 중 최저예산,
  저가 폰까지 60fps**. depth-of-field는 진짜 Bokeh pass 대신 전면 슬랩에만
  블러 텍스처 오버레이로 위장(가정 a6).
- **§4 전이**: 가장 뒤 fork 슬랩의 내각 발광선이 슬랩에서 "떨어져 나와" 수평
  게이지 바로 수평 이동. 선 → 바.
- **약점**: 섹션 2 "floating 3D tech cards"와 평면 카드 어휘이 겹친다. 섹션 2를
  통과한 직후의 섹션이라 "또 카드가 뜬다"로 읽힐 위험이 3안 중 가장 큼.

---

## 추천: Concept B — Orbital Hierarchy

근거 3가지:
1. **인접 섹션과의 차별화**: A는 히어로·스택과 같은 어휘(단일 3D 오브제 부유), C는
   스택과 같은 어휘(플로팅 패널). B만이 페이지에서 유일한 *다중 신체 시스템*으로,
   CENTERPIECE가 "이 페이지의 중심이다"를 구조로 증명한다.
2. **§4 전이의 논리적 강도**: 원 → 게이지 다이얼 → ms 카운터는 장식적 매치컷이 아니라
   "측정"이라는 의미의 연속. performance proof 섹션의 서사(측정된 숫자)가 궤도
   관측이라는 은유에서 자연 발생한다.
3. **모바일 예산 현실적**: InstancedMesh 단일 드로우콜 파티션 + 저해상도 발광 위장으로
   60fps 달성 가능한 규모 (feasibility 노트 참조). C보다 무겁지만 A·C가 가진
   차별화 문제를 사지 않고 산다.

A는 폴백으로 문서화: 구현자가 파티션 시스템에서 프레임 드랍을 못 잡을 경우 A로
강등해도 서사가 유지된다(면 = 천체, 회전 = 공전).

## 금지 목록 (이 브랜드에 특히 위험한 anti-pattern)

1. **발광 과다**: accent는 점등 지점에만. 전체 섹션에 오렌지 글로우를 뿌리면
   ember-on-charcoal이 무너진다 (가정 a7: 코덱스 glow-anti-pattern의 로컬 확장).
2. **3열 균등 카드**: 이 섹션의 존재 이유 자체가 "균등 3분할의 대안" — Free/Xtra/fork를
   같은 크기 카드 3장으로 표현하는 순간 CENTERPIECE가 죽는다.
3. **아이콘 타일 그리드**: 기능 나열을 아이콘+짧은 문장 타일로 채우는 패턴 금지
   (기능은 섹션 5의 몫).
4. **스톡 얼굴·스톡 도시 야경**: technical-luxe 파괴. 사람·장소 사진 전면 배제.
5. **그라디언트 배너/히어로 그라데이션**: bg #12100f 단일 캔버스 유지. 발광은
   3D emissive로만, CSS 그라데이션 배경으로 흉내 내지 않는다.

## 가정 (전부 명시)

- **a1**: 랜딩 크래프트 코덱스 파일이 레포·node_modules 어디에도 존재하지 않아
  (검색 확인) LC-n 규칙을 직접 인용하지 못한다. 본 문서의 구도 근거는 미션 브리프
  (권한 있는 프로젝트 결정) + 일반 실무 지식으로 대체하고, 코덱스 계열 판단은
  모두 "가정"으로 표기했다.
- **a2**: "무광 패널" 질감은 radius 14·panel 토큰에서의 해석 확장이며 DESIGN 문서
  수준의 명시 근거는 없다.
- **a3**: mod 대상 앱(Grindr)의 UI 스크린샷을 랜딩에 쓸 수 있는지의 법적 판단은
  미확정 — 안전 쪽으로 추상 UI만 채택.
- **a4**: "기술·소프트웨어 페이지는 3D/셰이더 장면의 정당성이 있다"는 코덱스 계열
  통념의 로컬 확장.
- **a5**: 파티션 인스턴스 수 계층(160/240/320)은 구현자가 실측으로 조정할 값.
- **a6**: 진짜 DoF pass 대신 블러 오버레이 위장은 C안 한정 트릭.
- **a7**: glow 절제 규칙은 코덱스 미독 상태의 경험칙.
- **a8**: 페이지 총 길이 약 7~9vh 구간, 데스크톱 폴드 100vh — 미션 브리프가
  정확한 vh 배분을 주지 않아 스토리보드의 vh 수치는 제안값.

ART_DIRECTION_DONE sections=3 lc_rules=0 assumptions=8
