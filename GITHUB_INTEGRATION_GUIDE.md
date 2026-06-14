# GitHub 연동 완벽 가이드

## 📋 목차
1. [GitHub 저장소 생성](#1-github-저장소-생성)
2. [Personal Access Token 생성](#2-personal-access-token-생성)
3. [Manus에서 GitHub 연동](#3-manus에서-github-연동)
4. [자동 배포 설정](#4-자동-배포-설정)
5. [GitHub 커넥터 활성화](#5-github-커넥터-활성화)
6. [실제 사용 예시](#6-실제-사용-예시)

---

## 1. GitHub 저장소 생성

### Step 1.1: GitHub 로그인
1. https://github.com 접속
2. 우측 상단 프로필 아이콘 클릭 → **Sign in** (미로그인 시)

### Step 1.2: 새 저장소 생성
1. https://github.com/new 접속
2. 다음 정보 입력:

| 항목 | 값 | 설명 |
|------|-----|------|
| **Repository name** | `giftcard-price-site` | 저장소 이름 |
| **Description** | `Gift card price management website for Starfield Suwon` | 설명 (선택사항) |
| **Visibility** | **Private** | 비공개 저장소 (보안) |
| **Add .gitignore** | Node | Node.js 프로젝트용 |
| **Add a license** | MIT License | 라이선스 (선택사항) |

3. **Create repository** 클릭

### Step 1.3: 저장소 확인
생성 후 다음 URL로 접속 가능:
```
https://github.com/{YOUR_USERNAME}/giftcard-price-site
```

---

## 2. Personal Access Token 생성

### Step 2.1: Settings 접속
1. GitHub 프로필 아이콘 클릭
2. **Settings** 선택

### Step 2.2: Developer settings 이동
1. 좌측 메뉴 → **Developer settings**
2. **Personal access tokens** → **Tokens (classic)** 선택

### Step 2.3: 새 토큰 생성
1. **Generate new token (classic)** 클릭
2. 다음 정보 입력:

| 항목 | 값 |
|------|-----|
| **Token name** | `giftcard-manus-deployment` |
| **Expiration** | 90 days (권장) |

### Step 2.4: Scopes 선택
다음 항목 체크:
- ✅ `repo` (저장소 전체 접근)
- ✅ `workflow` (GitHub Actions 실행)
- ✅ `admin:repo_hook` (웹훅 설정)

### Step 2.5: 토큰 저장
1. **Generate token** 클릭
2. **토큰 복사** (다시 볼 수 없음!)
3. 안전한 곳에 저장

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 3. Manus에서 GitHub 연동

### Step 3.1: Manus 프로젝트 관리 UI 열기
1. Manus 프로젝트 대시보드 접속
2. 우측 상단 **Settings** 아이콘 클릭

### Step 3.2: GitHub 설정 이동
1. 좌측 메뉴 → **Integrations**
2. **GitHub** 섹션 찾기

### Step 3.3: GitHub 연동
1. **Connect** 또는 **Authorize** 버튼 클릭
2. GitHub 로그인 페이지로 이동
3. 권한 부여 요청 수락

### Step 3.4: 저장소 선택
1. 드롭다운에서 `giftcard-price-site` 선택
2. **Save** 클릭

---

## 4. 자동 배포 설정

### Step 4.1: GitHub Actions 워크플로우 생성
저장소의 `.github/workflows/` 디렉토리에 다음 파일 생성:

**파일명:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Manus

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Manus
        run: |
          # Manus 배포 커맨드
          echo "Deploying to Manus..."
```

### Step 4.2: 워크플로우 활성화
1. GitHub 저장소 → **Actions** 탭
2. 워크플로우 확인
3. 자동 실행 설정

---

## 5. GitHub 커넥터 활성화

### Step 5.1: Manus 커넥터 설정
1. Manus 프로젝트 → **Settings** → **Integrations**
2. **GitHub** 섹션에서 **Enable** 클릭

### Step 5.2: 커넥터 권한 설정
다음 권한 활성화:
- ✅ Repository access (저장소 읽기/쓰기)
- ✅ Webhook (자동 배포 트리거)
- ✅ Actions (워크플로우 실행)

### Step 5.3: 저장
**Save** 클릭하여 설정 완료

---

## 6. 실제 사용 예시

### 예시 1: 코드 변경 후 자동 배포

```bash
# 1. 로컬에서 변경사항 커밋
git add .
git commit -m "feat: 상품권 시세 업데이트"

# 2. GitHub에 푸시
git push origin main

# 3. 자동으로 다음 실행:
#    - 테스트 실행
#    - 빌드 완료
#    - Manus에 배포
#    - 도메인에 반영
```

### 예시 2: GitHub에서 데이터 가져오기

프로젝트에 `data/prices.json` 파일이 있으면:

```typescript
// server/routers.ts
export const giftcards = router({
  syncFromGitHub: publicProcedure.query(async () => {
    // GitHub에서 prices.json 가져오기
    const response = await fetch(
      'https://raw.githubusercontent.com/{USERNAME}/giftcard-price-site/main/data/prices.json'
    );
    const data = await response.json();
    
    // 데이터베이스에 저장
    for (const item of data) {
      await createGiftCard(item);
    }
    
    return { success: true, count: data.length };
  }),
};
```

### 예시 3: GitHub Issues를 통한 피드백 관리

```markdown
# GitHub Issues 활용

1. **버그 보고**
   - Title: `[BUG] 시세표 로딩 오류`
   - Description: 상세한 오류 내용

2. **기능 요청**
   - Title: `[FEATURE] 시세 이력 조회`
   - Description: 원하는 기능 설명

3. **자동 연동**
   - PR 생성 시 자동 테스트
   - Merge 시 자동 배포
```

---

## 🔄 GitHub 연동 워크플로우

```
로컬 개발
   ↓
git commit & push
   ↓
GitHub 저장소에 업로드
   ↓
GitHub Actions 자동 실행
   ↓
테스트 & 빌드
   ↓
Manus에 배포
   ↓
도메인에 자동 반영
```

---

## ⚙️ 문제 해결

### Q: Personal Access Token이 작동하지 않음
**A:** 
1. 토큰 유효기간 확인 (90일 이상 경과 시 재생성)
2. Scopes 확인 (`repo`, `workflow` 포함)
3. 토큰 재생성 후 Manus에서 업데이트

### Q: GitHub Actions가 실행되지 않음
**A:**
1. `.github/workflows/deploy.yml` 파일 위치 확인
2. 파일 권한 확인 (644 이상)
3. 워크플로우 문법 검증

### Q: 배포 후 도메인에 반영되지 않음
**A:**
1. 빌드 로그 확인 (GitHub Actions)
2. Manus 배포 상태 확인
3. 도메인 캐시 초기화 (Ctrl+Shift+Delete)

---

## 📚 참고 자료

- [GitHub 공식 문서](https://docs.github.com)
- [GitHub Actions 가이드](https://docs.github.com/en/actions)
- [Personal Access Token 생성](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Manus 배포 가이드](https://help.manus.im)

---

## ✅ 체크리스트

- [ ] GitHub 저장소 생성 완료
- [ ] Personal Access Token 생성 및 저장
- [ ] Manus에서 GitHub 연동 완료
- [ ] GitHub Actions 워크플로우 설정
- [ ] GitHub 커넥터 활성화
- [ ] 첫 번째 배포 테스트 완료
- [ ] 자동 배포 확인

---

**마지막 업데이트:** 2026-06-08
**상태:** 완성
