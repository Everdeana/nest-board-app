// 게시물에 필요한 데이터 정의
// 모델을 정의할 때 -> Class, Interface
// Interface : 변수의 타입만 체크
// Class : 변수의 타입 체크, 인스턴스 생성

export interface Board {
  id: string;
  title: string;
  description: string;
  status: BoardStatus; // 공개 / 비공개
}

export enum BoardStatus { // enumerate
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
