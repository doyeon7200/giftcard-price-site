# 티켓나라 스타필드수원 풀스택 전환 TODO

## 데이터베이스 및 백엔드 설정
- [x] 데이터베이스 스키마 설계 (giftcards, priceHistories 테이블)
- [x] Drizzle ORM 마이그레이션 실행 (`pnpm db:push`)
- [x] 기본 데이터 시드 작성

## 백엔드 tRPC 프로시저 구현
- [x] 상품권 목록 조회 프로시저 (giftcards.list)
- [x] 상품권 생성 프로시저 (giftcards.create)
- [x] 상품권 업데이트 프로시저 (giftcards.update)
- [x] 상품권 삭제 프로시저 (giftcards.delete)
- [x] 상품권 순서 변경 프로시저 (giftcards.reorder)
- [x] 관리자 인증 프로시저 (기존 auth 시스템 활용)
- [x] 시세 이력 조회 프로시저 (priceHistory.list)

## 프론트엔드 UI 업데이트
- [x] Home.tsx 리팩토링 - tRPC 훅으로 전환
- [x] 관리자 로그인 다이얼로그 - 서버 인증 연동
- [x] 상품권 목록 - 서버 데이터 바인딩
- [x] 상품권 추가/수정/삭제 - tRPC 뮤테이션 연동
- [x] 실시간 저장 상태 표시
- [x] 로딩 및 에러 상태 처리

## 파일 저장 및 내보내기 기능
- [x] CSV 내보내기 기능 구현
- [x] JSON 내보내기 기능 구현
- [x] 파일 다운로드 버튼 추가
- [x] 내보내기 UI 컴포넌트 생성

## 테스트 작성
- [x] 백엔드 tRPC 프로시저 테스트 (vitest)
- [x] 프론트엔드 컴포넌트 테스트
- [x] 통합 테스트

## 배포 및 최종화
- [x] 모든 기능 통합 테스트
- [x] 에러 처리 및 엣지 케이스 확인
- [x] 체크포인트 저장

## 시세표 UI 개선 (추가 요청)
- [x] 상품권섹션행을 공란으로 변경
- [x] 행삭제 버튼 추가 (Trash2 아이콘)
- [x] 헤더 정보 수정 기능 추가 (로그인 시 Edit3 아이콘)
- [x] 헤더 정보 편집 다이얼로그 구현

## GitHub 커넥터 및 배포
- [x] GitHub 커넥터 개요 및 설명 문서 작성
- [x] GitHub 배포 가이드 작성 (GITHUB_DEPLOYMENT_GUIDE.md)
- [x] GitHub 커넥터 사용 예시 작성 (GITHUB_CONNECTOR_EXAMPLES.md)
- [x] GitHub 업로드 단계별 가이드 작성 (GITHUB_UPLOAD_STEP_BY_STEP.md)
- [ ] GitHub 저장소 생성 및 코드 업로드
- [ ] GitHub 커넥터 활성화
- [ ] 자동 배포 워크플로우 설정 (선택사항)

## 최종 체크리스트
- [x] 모든 기능 구현 완료
- [x] 문서 작성 완료
- [ ] 최종 체크포인트 저장
