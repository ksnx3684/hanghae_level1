# hanghae_level1
항해99 주특기 level1


### Directory Structure

![캡처](https://user-images.githubusercontent.com/84880772/232359237-1110974b-c76f-41b4-a9da-15cb82ab2cf3.PNG)

---

### 1. 수정, 삭제 API에서 Resource를 구분하기 위해서 Request를 어떤 방식으로 사용하셨나요? (`param`, `query`, `body`)

- 수정 API에서는 _postId, _commentId와 같은 고유 값을 기준으로 DB에서 데이터를 조회하기 위해 req.params를 통해 불러왔으며, 사용자가 보낸 JSON값들은 req.body를 통해 불러왔습니다.

- 삭제 API에서도 마찬가지로 req.params를 통해 고유 값을 불러왔고 req.body를 통해 사용자가 입력한 password 값을 불러왔습니다.

---

### 2. HTTP Method의 대표적인 4가지는 `GET`, `POST`, `PUT`, `DELETE` 가있는데 각각 어떤 상황에서 사용하셨나요?

- GET : 게시글 조회, 게시글 상세 조회, 댓글 목록 조회
- POST : 게시글 작성, 댓글 생성
- PUT : 게시글 수정, 댓글 수정
- DELETE : 게시글 삭제, 댓글 삭제

---

### 3. RESTful한 API를 설계했나요? 어떤 부분이 그런가요? 어떤 부분이 그렇지 않나요?

- 조회, 생성, 수정, 삭제와 같이 각 기능 별에 맞는 HTTP Method를 사용하여 express.js 미들웨어를 구성하였으며, REST API 설계 규칙에 맞게 Restful한 시스템을 구성하였습니다.

---

### 4. 역할별로 Directory Structure를 분리하였을 경우 어떠한 이점이 있을까요?

- 디렉토리 구조를 분리할 경우 각 기능 별로 라우터 및 스키마 관리가 용이합니다. 또한 구조 분리를 하지 않고 한 파일에만 기능을 구현하면 웹 어플리케이션 오류 발생 시 시스템이 전체적으로 정지할 수 있는 위험성이 있습니다. 구조 분리를 하면 어플리케이션 내부에 한 기능이 에러를 발생시켜도 발생한 부분에 대해서만 오류 수정을 진행하면 되기 때문에 전반적으로 유지보수에도 장점이 있습니다.

