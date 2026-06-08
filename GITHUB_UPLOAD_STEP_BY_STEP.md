# GitHub에 코드 올리는 방법 - 완벽 가이드

## 📋 목차
1. [5분 만에 시작하기 (빠른 방법)](#5분-만에-시작하기-빠른-방법)
2. [상세 단계별 가이드](#상세-단계별-가이드)
3. [자주 하는 실수와 해결법](#자주-하는-실수와-해결법)
4. [팀 협업 설정](#팀-협업-설정)

---

## 5분 만에 시작하기 (빠른 방법)

### 🎯 Manus UI를 이용한 자동 배포 (권장)

**가장 쉬운 방법입니다!**

#### Step 1: 체크포인트 생성
```
Manus 웹사이트 
→ 프로젝트 관리 UI (우측 패널)
→ "Dashboard" 클릭
→ "Create Checkpoint" 버튼
→ 설명 입력: "시세표 UI 개선 및 헤더 편집 기능"
→ "Save" 클릭
```

#### Step 2: GitHub 내보내기
```
체크포인트 생성 후 
→ "Export to GitHub" 버튼 클릭
→ GitHub 사용자명 입력
→ 저장소명 입력: giftcard-price-site
→ Personal Access Token 입력
→ "Export" 클릭
```

#### Step 3: 완료!
GitHub 저장소에 자동으로 업로드됩니다.

---

## 상세 단계별 가이드

### 📱 방법 1: GitHub 웹사이트에서 직접 업로드

**장점**: 가장 간단함, 추가 설치 불필요
**단점**: 파일 개수가 많으면 번거로움

#### Step 1: GitHub 저장소 생성

1. **GitHub 로그인**
   - https://github.com 접속
   - 우측 상단 프로필 아이콘 클릭
   - "Sign in" 또는 로그인

2. **새 저장소 생성**
   ```
   우측 상단 "+" 아이콘
   → "New repository" 클릭
   ```

3. **저장소 설정**
   ```
   Repository name: giftcard-price-site
   Description: Gift card price management website
   Visibility: Private (비공개)
   Initialize: 아무것도 체크 안 함
   → "Create repository" 클릭
   ```

4. **저장소 URL 확인**
   ```
   생성 후 표시되는 URL:
   https://github.com/YOUR_USERNAME/giftcard-price-site
   ```

#### Step 2: 파일 업로드

1. **"Add file" 클릭**
   ```
   저장소 페이지 → "Add file" 드롭다운
   → "Upload files" 선택
   ```

2. **파일 선택**
   ```
   프로젝트 폴더의 모든 파일 드래그 & 드롭
   또는 "choose your files" 클릭하여 선택
   ```

3. **커밋 메시지 작성**
   ```
   "Commit message": 
   "Initial commit: 티켓나라 스타필드수원 풀스택 웹사이트"
   
   "Extended description":
   "- 시세표 UI 개선
    - 헤더 정보 수정 기능
    - GitHub 커넥터 통합"
   ```

4. **업로드 완료**
   ```
   "Commit changes" 클릭
   ```

---

### 💻 방법 2: 명령어를 이용한 업로드 (권장)

**장점**: 정확함, 버전 관리 가능
**단점**: 명령어 학습 필요

#### Step 1: Git 설정

터미널을 열고 다음 명령어 실행:

```bash
# 1. 프로젝트 폴더로 이동
cd /home/ubuntu/giftcard-price-site

# 2. Git 초기화
git init

# 3. 사용자 정보 설정 (GitHub 계정과 동일)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 전역 설정 (모든 프로젝트에 적용)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Step 2: 파일 추가 및 커밋

```bash
# 1. 모든 파일 추가
git add .

# 2. 커밋 (변경 사항 저장)
git commit -m "Initial commit: 티켓나라 스타필드수원 풀스택 웹사이트

- 시세표 UI 개선
- 헤더 정보 수정 기능
- GitHub 커넥터 통합
- 풀스택 전환 완료"
```

**커밋 메시지 작성 팁**:
- 첫 줄: 간단한 설명 (50자 이내)
- 빈 줄
- 상세 설명 (각 줄 72자 이내)

#### Step 3: GitHub 저장소 생성

웹사이트에서:
1. https://github.com/new 접속
2. Repository name: `giftcard-price-site`
3. Private 선택
4. "Create repository" 클릭

#### Step 4: 원격 저장소 연결 및 푸시

```bash
# 1. 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/giftcard-price-site.git

# 2. 브랜치명 변경 (main으로 통일)
git branch -M main

# 3. 코드 업로드
git push -u origin main
```

**인증 방법**:

**방법 A: Personal Access Token (권장)**
```bash
# 푸시 시 다음과 같이 입력됨
Username: YOUR_USERNAME
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**방법 B: SSH 키 (더 안전함)**
```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# 공개 키 복사
cat ~/.ssh/id_ed25519.pub

# GitHub Settings → SSH and GPG keys → New SSH key
# 공개 키 붙여넣기

# SSH로 푸시
git remote set-url origin git@github.com:YOUR_USERNAME/giftcard-price-site.git
git push -u origin main
```

---

### 🔄 이후 업데이트 방법

코드를 수정한 후 GitHub에 업로드:

```bash
# 1. 변경 사항 확인
git status

# 2. 변경된 파일 추가
git add .

# 3. 커밋
git commit -m "기능 설명: 무엇을 수정했는지"

# 4. 업로드
git push
```

**자주 사용하는 커밋 메시지 예시**:
```
git commit -m "feat: 시세표 행삭제 버튼 추가"
git commit -m "fix: 헤더 정보 저장 오류 수정"
git commit -m "docs: GitHub 배포 가이드 작성"
git commit -m "refactor: Home.tsx 코드 정리"
git commit -m "style: 시세표 스타일 개선"
```

---

## 자주 하는 실수와 해결법

### ❌ 실수 1: 대용량 파일 포함

**문제**: `node_modules` 폴더를 실수로 업로드

**해결책**:

1. **`.gitignore` 파일 생성**
   ```bash
   # 프로젝트 루트에 .gitignore 파일 생성
   cat > .gitignore << EOF
   node_modules/
   dist/
   .env
   .env.local
   *.log
   .DS_Store
   EOF
   ```

2. **이미 업로드된 경우 제거**
   ```bash
   git rm -r --cached node_modules
   git commit -m "Remove node_modules from git"
   git push
   ```

### ❌ 실수 2: 민감한 정보 업로드

**문제**: API 키, 비밀번호 등이 포함된 파일 업로드

**해결책**:

1. **`.env` 파일 무시**
   ```bash
   # .gitignore에 추가
   echo ".env" >> .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **이미 업로드된 경우**
   ```bash
   # GitHub Settings → Security → Secret scanning
   # 또는 git-filter-branch로 히스토리 제거
   ```

### ❌ 실수 3: 잘못된 커밋

**문제**: 실수로 잘못된 파일을 커밋함

**해결책**:

```bash
# 마지막 커밋 취소 (로컬에서만)
git reset --soft HEAD~1

# 마지막 커밋 수정
git commit --amend -m "올바른 메시지"

# 이미 푸시한 경우 (주의: 팀원과 협업 중이면 피할 것)
git push --force-with-lease
```

### ❌ 실수 4: 브랜치 혼동

**문제**: 여러 브랜치가 있어서 어디에 푸시해야 할지 모름

**해결책**:

```bash
# 현재 브랜치 확인
git branch

# 브랜치 목록 보기
git branch -a

# main 브랜치로 이동
git checkout main

# 브랜치 생성 및 이동
git checkout -b feature/새-기능
```

---

## 팀 협업 설정

### 👥 팀원 추가하기

#### Step 1: 저장소 설정 접속
```
GitHub 저장소 → Settings → Collaborators
```

#### Step 2: 팀원 초대
```
"Add people" 클릭
→ GitHub 사용자명 입력
→ 권한 선택 (Write 권장)
→ "Add [username] to this repository" 클릭
```

#### Step 3: 팀원이 수락
팀원이 이메일 초대를 받고 수락

### 🔀 Pull Request (PR) 워크플로우

**팀 협업 시 권장 방식**:

#### Step 1: 새 브랜치 생성
```bash
git checkout -b feature/새-기능
```

#### Step 2: 코드 수정 및 커밋
```bash
git add .
git commit -m "feat: 새로운 기능 추가"
```

#### Step 3: 브랜치 푸시
```bash
git push -u origin feature/새-기능
```

#### Step 4: GitHub에서 PR 생성
```
GitHub 저장소 → "Compare & pull request" 클릭
→ 제목 및 설명 작성
→ "Create pull request" 클릭
```

#### Step 5: 코드 리뷰 및 병합
```
팀원 리뷰 → 승인 → "Merge pull request" 클릭
```

---

## 📊 Git 명령어 치트시트

| 명령어 | 설명 |
|--------|------|
| `git init` | 새 저장소 초기화 |
| `git clone <url>` | 저장소 복제 |
| `git status` | 변경 사항 확인 |
| `git add .` | 모든 파일 추가 |
| `git add <file>` | 특정 파일 추가 |
| `git commit -m "메시지"` | 커밋 |
| `git push` | 원격 저장소에 푸시 |
| `git pull` | 원격 저장소에서 가져오기 |
| `git branch` | 브랜치 목록 |
| `git checkout -b <branch>` | 새 브랜치 생성 및 이동 |
| `git merge <branch>` | 브랜치 병합 |
| `git log` | 커밋 히스토리 |
| `git diff` | 변경 사항 비교 |
| `git reset --hard HEAD~1` | 마지막 커밋 취소 |

---

## ✅ 체크리스트

### 첫 번째 업로드
- [ ] GitHub 계정 생성
- [ ] Personal Access Token 생성
- [ ] 저장소 생성
- [ ] Git 설정 (user.name, user.email)
- [ ] 파일 추가 (git add .)
- [ ] 커밋 (git commit)
- [ ] 원격 저장소 연결 (git remote add)
- [ ] 푸시 (git push)
- [ ] GitHub에서 파일 확인

### 이후 관리
- [ ] 정기적으로 코드 업데이트
- [ ] 의미 있는 커밋 메시지 작성
- [ ] 브랜치 활용 (기능별 브랜치)
- [ ] PR 코드 리뷰 (팀 협업 시)
- [ ] 릴리스 태그 생성

---

## 🎓 추가 학습

### 유용한 리소스
- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub 공식 튜토리얼](https://docs.github.com/en/get-started)
- [Pro Git 책 (무료)](https://git-scm.com/book/ko/v2)
- [GitHub Skills](https://skills.github.com/)

### 추천 학습 순서
1. Git 기본 개념 이해
2. 로컬 저장소 생성 및 커밋
3. 원격 저장소 연결 및 푸시
4. 브랜치 생성 및 병합
5. Pull Request 워크플로우
6. 충돌 해결 (merge conflicts)

---

## 🚀 다음 단계

1. ✅ GitHub 저장소 생성
2. ✅ 코드 업로드
3. ✅ GitHub 커넥터 활성화
4. ✅ 자동 배포 설정
5. ✅ 팀원 추가 (선택사항)

모든 단계가 완료되면 GitHub를 통해 효과적으로 코드를 관리하고 배포할 수 있습니다! 🎉
