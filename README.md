## 스터디 기본 요구사항

### /create-account :

- 계정 생성

### /log-in :

- 로그인

## /:

- 로그인 시에만 접근 가능
- 로그인이 완료되었을 경우, 사용자는 데이터베이스에 존재하는 모든 트윗을 볼 수 있어야 한다.
- 트윗을 작성할 수 있어야 한다.

## /tweet/[id]:

- 사용자는 id에 해당하는 트윗의 내용과 좋아요 버튼을 볼 수 있어야 한다.
- 좋아요 버튼을 클릭했을 경우 좋아요의 상태값이 데이터베이스에 저장되어야 하며 useSWR의 mutate를 사용하여 업데이트를 반영해야 합니다.

## 그 외 구현 사항

#### 그냥 요구사항만 구현하고 말면 재미 없으니 이거저거 더 해봤습니다.

- zod를 이용한 backend측 validation
- react-hook-form에 zod resolver를 붙여 front/backend에서 같은 schema를 이용하여 validation
- 트윗 작성 시 작성한 트윗 optimistic update
- /에서 트윗 detail page 접근 시(=캐시에 정보가 있을 때), /에서 받아온 tweet 정보를 가져와 따로 API 호출하지 않게 작성
- 로그인/회원가입 시 이메일로 인증코드 보내는 부분 AWS lambda에 배포한 nodemailer 서비스 이용. 굳이 이렇게 한 이유는 과제 제출할 때 code sandbox에 민감한 정보를 노출하고 싶지 않기 때문
- 작성한 코드가 로그인/회원가입 로직이 같아서 next의 rewrites 기능으로 로그인 destination을 회원가입 쪽으로
- route guard 작성하여 로그인/회원가입은 비 로그인 사용자만, 나머지 페이지는 로그인 유저만 접속 가능하게 작성
