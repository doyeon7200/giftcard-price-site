# GitHub 배포 가이드 - 티켓나라 스타필드수원

## 📋 목차
1. [GitHub 커넥터 개요](#github-커넥터-개요)
2. [사전 준비](#사전-준비)
3. [GitHub에 코드 올리기](#github에-코드-올리기)
4. [GitHub 커넥터 사용법](#github-커넥터-사용법)
5. [자동 배포 설정](#자동-배포-설정)

---

## GitHub 커넥터 개요

### 🎯 GitHub 커넥터란?

**GitHub 커넥터**는 Manus에서 제공하는 통합 도구로, 다음과 같은 기능을 제공합니다:

| 기능 | 설명 |
|------|------|
| **저장소 접근** | GitHub의 공개/비공개 저장소에서 파일, 코드, 데이터 조회 |
| **데이터 가져오기** | GitHub API를 통해 저장소 정보, 이슈, PR, 커밋 등 조회 |
| **자동화** | 워크플로우와 연동하여 자동 배포, 업데이트 등 수행 |
| **코드 분석** | 저장소의 코드를 분석하고 인사이트 제공 |
| **버전 관리** | 코드 변경 이력 추적 및 협업 지원 |

### 💡 사용 사례

- 📊 **데이터 동기화**: GitHub에서 가격 데이터를 정기적으로 가져와 시세표 업데이트
- 🔄 **자동 배포**: 코드 변경 시 자동으로 웹사이트 배포
- 📝 **문서 관리**: README, 가이드 등을 GitHub에서 중앙 관리
- 👥 **팀 협업**: 여러 사람이 함께 코드 수정 및 관리

---

## 사전 준비

### ✅ 필요한 것들

1. **GitHub 계정** - https://github.com 에서 무료 가입
2. **Git 설치** - 로컬 컴퓨터에 Git 설치 (이미 설치됨)
3. **Personal Access Token (PAT)** - GitHub API 접근 권한

### 🔑 Personal Access Token 생성하기

#### Step 1: GitHub 설정 페이지 접속
1. GitHub 로그인 후 우측 상단 프로필 → **Settings** 클릭
2. 좌측 메뉴에서 **Developer settings** → **Personal access tokens** → **Tokens (classic)** 선택

#### Step 2: 새 토큰 생성
1. **Generate new token (classic)** 클릭
2. **Token name**: `giftcard-manus-deployment` 입력
3. **Expiration**: `No expiration` 선택 (또는 필요시 기간 설정)
4. **Select scopes**: 다음 항목 체크
   - ✅ `repo` (전체 저장소 접근)
   - ✅ `workflow` (GitHub Actions 접근)
   - ✅ `read:org` (조직 정보 읽기)

#### Step 3: 토큰 저장
1. **Generate token** 클릭
2. 생성된 토큰을 **안전한 곳에 복사해서 저장** (다시 볼 수 없음)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## GitHub에 코드 올리기

### 📤 방법 1: Manus UI를 통한 자동 배포 (권장)

#### Step 1: 체크포인트 생성
1. Manus 웹사이트 → 프로젝트 관리 UI 열기
2. **Dashboard** → **Checkpoint** 섹션
3. **Create Checkpoint** 클릭
4. 설명 입력 (예: "시세표 UI 개선 및 헤더 편집 기능 추가")
5. **Save** 클릭

#### Step 2: GitHub에 내보내기
1. 체크포인트 생성 후 **Export to GitHub** 버튼 클릭
2. 다음 정보 입력:
   - **Repository Owner**: 본인의 GitHub 사용자명
   - **Repository Name**: `giftcard-price-site` (또는 원하는 이름)
   - **Personal Access Token**: 위에서 생성한 토큰 입력
3. **Export** 클릭

#### Step 3: 확인
1. GitHub 로그인 후 본인의 저장소 확인
2. 코드가 정상적으로 업로드되었는지 확인

---

### 📤 방법 2: 명령어를 통한 수동 배포

#### Step 1: 로컬 저장소 초기화
```bash
cd /home/ubuntu/giftcard-price-site
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### Step 2: 파일 추가 및 커밋
```bash
git add .
git commit -m "Initial commit: 티켓나라 스타필드수원 풀스택 웹사이트"
```

#### Step 3: GitHub 저장소 생성
1. GitHub 로그인
2. 우측 상단 **+** → **New repository** 클릭
3. **Repository name**: `giftcard-price-site`
4. **Description**: `Gift card price management website for Starfield Suwon`
5. **Private** 선택 (비공개 저장소)
6. **Create repository** 클릭

#### Step 4: 원격 저장소 연결 및 푸시
```bash
git remote add origin https://github.com/YOUR_USERNAME/giftcard-price-site.git
git branch -M main
git push -u origin main
```

#### Step 5: 인증 (처음 푸시 시)
```bash
# 토큰 입력 방식
# Username: YOUR_USERNAME
# Password: 위에서 생성한 Personal Access Token 입력
```

---

## GitHub 커넥터 사용법

### 🔌 Manus에서 GitHub 커넥터 활성화

#### Step 1: 커넥터 설정 페이지 접속
1. Manus 프로젝트 → **Settings** → **Integrations**
2. **GitHub** 섹션 찾기
3. **Connect** 또는 **Enable** 클릭

#### Step 2: GitHub 권한 부여
1. GitHub 로그인 화면 표시
2. 권한 요청 확인 후 **Authorize** 클릭
3. Manus로 자동 리다이렉트

#### Step 3: 저장소 선택
1. 연결할 저장소 선택: `giftcard-price-site`
2. **Save** 클릭

### 📊 GitHub에서 데이터 가져오기

#### 예시 1: 저장소 정보 조회
```javascript
// Manus 스크립트에서 사용 가능
const repoInfo = await github.getRepository({
  owner: 'YOUR_USERNAME',
  repo: 'giftcard-price-site'
});

console.log(`⭐ Stars: ${repoInfo.stargazers_count}`);
console.log(`👁️ Watchers: ${repoInfo.watchers_count}`);
console.log(`🔀 Forks: ${repoInfo.forks_count}`);
```

#### 예시 2: 최신 커밋 조회
```javascript
const commits = await github.getCommits({
  owner: 'YOUR_USERNAME',
  repo: 'giftcard-price-site',
  per_page: 5
});

commits.forEach(commit => {
  console.log(`📝 ${commit.message} by ${commit.author.name}`);
  console.log(`📅 ${commit.date}`);
});
```

#### 예시 3: 파일 내용 읽기
```javascript
const fileContent = await github.getFileContent({
  owner: 'YOUR_USERNAME',
  repo: 'giftcard-price-site',
  path: 'client/src/pages/Home.tsx'
});

console.log(fileContent);
```

---

## 자동 배포 설정

### 🤖 GitHub Actions를 통한 자동 배포

#### Step 1: 워크플로우 파일 생성
프로젝트 루트에 `.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy to Manus

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

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
      env:
        MANUS_API_KEY: ${{ secrets.MANUS_API_KEY }}
      run: |
        echo "Deploying to Manus..."
        # Manus 배포 명령어 실행
```

#### Step 2: GitHub Secrets 설정
1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. **Name**: `MANUS_API_KEY`
4. **Value**: Manus API 키 입력
5. **Add secret** 클릭

#### Step 3: 자동 배포 확인
1. 코드 변경 후 `git push`
2. GitHub 저장소 → **Actions** 탭에서 워크플로우 실행 상태 확인
3. 배포 완료 후 웹사이트 자동 업데이트

---

## 📚 추가 리소스

### 유용한 링크
- [GitHub 공식 문서](https://docs.github.com)
- [Git 사용 가이드](https://git-scm.com/book/ko/v2)
- [GitHub API 레퍼런스](https://docs.github.com/en/rest)
- [GitHub Actions 문서](https://docs.github.com/en/actions)

### 자주 묻는 질문 (FAQ)

**Q: 토큰을 잃어버렸어요. 어떻게 하나요?**
A: GitHub Settings → Developer settings → Personal access tokens에서 기존 토큰을 삭제하고 새로운 토큰을 생성하세요.

**Q: 비공개 저장소를 공개로 변경할 수 있나요?**
A: 네, GitHub 저장소 Settings → Visibility에서 변경 가능합니다.

**Q: 여러 사람이 함께 작업할 수 있나요?**
A: 네, GitHub 저장소 Settings → Collaborators에서 팀원을 추가할 수 있습니다.

**Q: 배포 실패 시 이전 버전으로 롤백할 수 있나요?**
A: 네, Manus 대시보드에서 이전 체크포인트로 롤백 가능합니다.

---

## 🎯 다음 단계

1. ✅ Personal Access Token 생성
2. ✅ GitHub 저장소 생성
3. ✅ 코드 업로드
4. ✅ GitHub 커넥터 활성화
5. ✅ 자동 배포 설정 (선택사항)

모든 단계가 완료되면 GitHub에서 코드를 관리하고, Manus에서 자동으로 배포할 수 있습니다!
