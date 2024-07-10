import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './boards.model';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardsService {
  constructor(
    @Inject('BoardRepository') private boardRepository: BoardRepository,
  ) {}
  // 다른 컴포넌트에서 수정할 수 없도록 private로 선언
  private boards: Board[] = [];

  getAllBoards(): Board[] {
    return this.boards;
  }

  createBoard(createBoardDto: CreateBoardDto) {
    // const title = createBoardDto.title;
    // const description = createBoardDto.description;
    const { title, description } = createBoardDto;
    const board: Board = {
      //   title: title,
      //   description: description, --> 이름이 똑같으면 아래와 같이 사용해도 됨
      id: uuid(), // npm install uuid --save
      title,
      description,
      status: BoardStatus.PUBLIC,
    };
    this.boards.push(board);
    return board;
  }

  getBoardById(id: string): Board {
    const found = this.boards.find((board) => board.id === id);
    if (!found) {
      throw new NotFoundException(`Board With ID ${id} Not Found.`);
    }
    return found;
  }

  deleteBoard(id: string): void {
    // this.getBoardById(id);
    // filter로 특정 ID를 가진 데이터를 거른 뒤에 나머지를 boards에 저장 -> 삭제
    const found = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== found.id);
  }

  //   updateBoard(id: string, updateBoard: UpdateBoardDTO) {
  //     const board = this.getBoardById(id);
  //     this.deleteBoard(id);
  //     this.boards.push({ ...board, ...updateBoard });
  //   }

  updateBoardStatus(id: string, status: BoardStatus): Board {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }
}
