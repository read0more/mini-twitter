# my-next-template

next 프로젝트 시작할 때 개발 환경 다시 설정하기 귀찮아서 만든 template 레파지토리.

`yarn PnP + eslint(airbnb) + prettier + vitest + lint-staged`적용

# Getting Started

### PnP라 zero-install이지만 lint-staged 관련해서는 추가로 설정해줘야 합니다.

1. yarn husky install
2. ./husky/pre-commit 파일을 열어보면 undefined가 생겼을 수도 있는데, 있다면 제거한다.
3. yarn husky add .husky/pre-commit
