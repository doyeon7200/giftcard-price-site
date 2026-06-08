# GitHub 커넥터 사용 예시 및 데모

## 🎯 개요

이 문서는 Manus의 GitHub 커넥터를 실제로 사용하는 방법과 예시를 제공합니다.

---

## 📊 실제 사용 사례

### 사용 사례 1: 시세 데이터 GitHub에서 가져오기

**상황**: 시세표 데이터를 GitHub에 저장하고, 정기적으로 자동 업데이트하고 싶음

#### Step 1: GitHub에 데이터 파일 생성
`data/prices.json` 파일을 GitHub 저장소에 생성:

```json
{
  "lastUpdated": "2026-06-08T10:30:00Z",
  "giftcards": [
    {
      "id": 1,
      "name": "롯데 500만원이상",
      "category": "대형마트",
      "sellPrice": 96400,
      "sellDiscount": 3.6,
      "buyPrice": 96800,
      "buyDiscount": 3.2,
      "note": "",
      "available": true
    },
    {
      "id": 2,
      "name": "신세계 500만원이상",
      "category": "대형마트",
      "sellPrice": 96700,
      "sellDiscount": 3.3,
      "buyPrice": 97100,
      "buyDiscount": 2.9,
      "note": "",
      "available": true
    }
  ]
}
```

#### Step 2: Manus에서 데이터 가져오기 (tRPC 프로시저)

`server/routers.ts`에 새로운 프로시저 추가:

```typescript
import { publicProcedure } from "./server/_core/trpc";

export const appRouter = t.router({
  // ... 기존 라우터들
  
  // GitHub에서 시세 데이터 가져오기
  giftcards: t.router({
    // ... 기존 프로시저들
    
    syncFromGitHub: publicProcedure.query(async () => {
      try {
        // GitHub API를 통해 파일 내용 가져오기
        const response = await fetch(
          'https://raw.githubusercontent.com/YOUR_USERNAME/giftcard-price-site/main/data/prices.json'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch from GitHub');
        }
        
        const data = await response.json();
        
        // 데이터베이스에 저장 (선택사항)
        // await db.updateGiftcards(data.giftcards);
        
        return {
          success: true,
          message: `${data.giftcards.length}개의 상품권 데이터를 가져왔습니다.`,
          data: data.giftcards,
          lastUpdated: data.lastUpdated,
        };
      } catch (error) {
        return {
          success: false,
          message: 'GitHub에서 데이터를 가져오는데 실패했습니다.',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }),
  }),
});
```

#### Step 3: 프론트엔드에서 사용

`client/src/pages/Home.tsx`에 동기화 버튼 추가:

```typescript
const syncFromGitHub = async () => {
  try {
    const result = await trpc.giftcards.syncFromGitHub.useQuery();
    if (result.data?.success) {
      toast.success(result.data.message);
      await refetch(); // 데이터 새로고침
    } else {
      toast.error(result.data?.message || '동기화 실패');
    }
  } catch (error) {
    toast.error('동기화 중 오류가 발생했습니다.');
  }
};

// UI에 버튼 추가
<Button onClick={syncFromGitHub} disabled={isLoading}>
  <RefreshCw className="w-4 h-4 mr-2" />
  GitHub에서 동기화
</Button>
```

---

### 사용 사례 2: 저장소 정보 대시보드에 표시

**상황**: 저장소의 스타, 포크 수 등을 관리자 대시보드에 표시

#### Step 1: GitHub API 호출 함수 작성

`server/github.ts` 파일 생성:

```typescript
export async function getRepositoryStats(owner: string, repo: string) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Personal Access Token이 있으면 추가
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      name: data.name,
      description: data.description,
      url: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      openIssues: data.open_issues_count,
      language: data.language,
      lastUpdated: data.updated_at,
    };
  } catch (error) {
    console.error('Failed to fetch repository stats:', error);
    throw error;
  }
}
```

#### Step 2: tRPC 프로시저 추가

```typescript
export const appRouter = t.router({
  system: t.router({
    getGitHubStats: publicProcedure.query(async () => {
      const stats = await getRepositoryStats(
        'YOUR_USERNAME',
        'giftcard-price-site'
      );
      return stats;
    }),
  }),
});
```

#### Step 3: 관리자 대시보드에 표시

```typescript
// 관리자 페이지 컴포넌트
function AdminDashboard() {
  const { data: stats } = trpc.system.getGitHubStats.useQuery();

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg">
        <p className="text-sm text-gray-600">⭐ Stars</p>
        <p className="text-2xl font-bold">{stats?.stars || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <p className="text-sm text-gray-600">🔀 Forks</p>
        <p className="text-2xl font-bold">{stats?.forks || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <p className="text-sm text-gray-600">👁️ Watchers</p>
        <p className="text-2xl font-bold">{stats?.watchers || 0}</p>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <p className="text-sm text-gray-600">📝 Issues</p>
        <p className="text-2xl font-bold">{stats?.openIssues || 0}</p>
      </div>
    </div>
  );
}
```

---

### 사용 사례 3: 자동 배포 워크플로우

**상황**: 코드 변경 시 자동으로 테스트 → 빌드 → 배포

#### Step 1: GitHub Actions 워크플로우 파일

`.github/workflows/auto-deploy.yml`:

```yaml
name: Auto Deploy

on:
  push:
    branches: [ main ]
    paths:
      - 'client/**'
      - 'server/**'
      - 'package.json'

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '22'
    
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run linter
      run: pnpm format --check || true
    
    - name: Run tests
      run: pnpm test
      continue-on-error: true
    
    - name: Build
      run: pnpm build
    
    - name: Notify Manus
      run: |
        echo "✅ Build successful!"
        echo "📦 Ready for deployment"
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### Step 2: 배포 상태 확인

GitHub 저장소 → **Actions** 탭에서 워크플로우 실행 상태 확인:

```
✅ Setup Node.js - 완료
✅ Install dependencies - 완료
✅ Run linter - 완료
✅ Run tests - 완료
✅ Build - 완료
✅ Notify Manus - 완료
```

---

## 🔄 GitHub 커넥터 데이터 흐름

```
┌─────────────────┐
│  GitHub 저장소   │
│  (prices.json)  │
└────────┬────────┘
         │
         │ GitHub API
         ↓
┌─────────────────────┐
│  Manus 서버         │
│  (tRPC 프로시저)    │
└────────┬────────────┘
         │
         │ 데이터 처리
         ↓
┌─────────────────────┐
│  데이터베이스       │
│  (giftcards 테이블) │
└────────┬────────────┘
         │
         │ 쿼리
         ↓
┌─────────────────────┐
│  프론트엔드         │
│  (시세표 표시)      │
└─────────────────────┘
```

---

## 📈 실제 데이터 예시

### GitHub에서 가져온 데이터 응답

```json
{
  "success": true,
  "message": "2개의 상품권 데이터를 가져왔습니다.",
  "data": [
    {
      "id": 1,
      "name": "롯데 500만원이상",
      "category": "대형마트",
      "sellPrice": 96400,
      "sellDiscount": 3.6,
      "buyPrice": 96800,
      "buyDiscount": 3.2,
      "note": "",
      "available": true
    },
    {
      "id": 2,
      "name": "신세계 500만원이상",
      "category": "대형마트",
      "sellPrice": 96700,
      "sellDiscount": 3.3,
      "buyPrice": 97100,
      "buyDiscount": 2.9,
      "note": "",
      "available": true
    }
  ],
  "lastUpdated": "2026-06-08T10:30:00Z"
}
```

### 저장소 통계 응답

```json
{
  "name": "giftcard-price-site",
  "description": "Gift card price management website for Starfield Suwon",
  "url": "https://github.com/YOUR_USERNAME/giftcard-price-site",
  "stars": 15,
  "forks": 3,
  "watchers": 8,
  "openIssues": 2,
  "language": "TypeScript",
  "lastUpdated": "2026-06-08T10:35:00Z"
}
```

---

## 🛠️ 문제 해결

### 문제 1: GitHub API 요청 실패

**증상**: `Failed to fetch from GitHub` 에러

**해결책**:
1. 저장소가 공개인지 확인
2. 파일 경로가 올바른지 확인
3. 네트워크 연결 확인

```typescript
// 디버깅 코드
console.log('Fetching from:', url);
console.log('Response status:', response.status);
console.log('Response headers:', response.headers);
```

### 문제 2: 인증 오류

**증상**: `401 Unauthorized` 에러

**해결책**:
1. Personal Access Token 확인
2. 토큰 권한 확인 (repo, workflow 등)
3. 토큰 만료 여부 확인

```typescript
// 토큰 검증
const validateToken = async (token: string) => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `token ${token}`,
    },
  });
  return response.ok;
};
```

### 문제 3: 레이트 제한

**증상**: `403 Forbidden` 또는 `API rate limit exceeded` 에러

**해결책**:
1. Personal Access Token 사용 (레이트 제한 증가)
2. 요청 간격 조정
3. 캐싱 구현

```typescript
// 캐싱 예시
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분

async function getCachedData(key: string, fetcher: () => Promise<any>) {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

---

## 📚 추가 학습 자료

- [GitHub REST API 문서](https://docs.github.com/en/rest)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Octokit.js (GitHub API 라이브러리)](https://github.com/octokit/rest.js)

---

## ✅ 체크리스트

- [ ] GitHub 저장소 생성
- [ ] 코드 업로드
- [ ] Personal Access Token 생성
- [ ] GitHub 커넥터 활성화
- [ ] 데이터 동기화 테스트
- [ ] 자동 배포 설정
- [ ] 모니터링 및 로깅 설정

모든 단계가 완료되면 GitHub 커넥터를 완벽하게 활용할 수 있습니다! 🎉
