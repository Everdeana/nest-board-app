import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// Local Memory가 아니라 DB를 사용하기 때문에 board.model에 있는 Board가 아니라 board.entity에 있는 Board를 사용한다.
// import { Board, BoardStatus } from './boards.model';
// import { v1 as uuid } from 'uuid';
import { BoardStatus } from './boards.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  /*// Local Memory //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // constructor(
  //   @Inject('BoardRepository') private boardRepository: BoardRepository,
  // ) {}
  // // 다른 컴포넌트에서 수정할 수 없도록 private로 선언
  // private boards: Board[] = [];
  // getAllBoards(): Board[] {
  //   return this.boards;
  // }
  // createBoard(createBoardDto: CreateBoardDto) {
  //   // const title = createBoardDto.title;
  //   // const description = createBoardDto.description;
  //   const { title, description } = createBoardDto;
  //   const board: Board = {
  //     //   title: title,
  //     //   description: description, --> 이름이 똑같으면 아래와 같이 사용해도 됨
  //     id: uuid(), // npm install uuid --save
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(board);
  //   return board;
  // }
  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Board With ID ${id} Not Found.`);
  //   }
  //   return found;
  // }
  // deleteBoard(id: string): void {
  //   // this.getBoardById(id);
  //   // filter로 특정 ID를 가진 데이터를 거른 뒤에 나머지를 boards에 저장 -> 삭제
  //   const found = this.getBoardById(id);
  //   this.boards = this.boards.filter((board) => board.id !== found.id);
  // }
  // //   updateBoard(id: string, updateBoard: UpdateBoardDTO) {
  // //     const board = this.getBoardById(id);
  // //     this.deleteBoard(id);
  // //     this.boards.push({ ...board, ...updateBoard });
  // //   }
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
  // Local Memory //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  // TypeORM /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* constructor(
  //   @InjectRepository(Board)
  //   private boardRepository: Repository<Board>,
  // ) {}*/
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  // async createBoard(createBoardDto: CreateBoardDto): Promise<Board> { // await 사용하지 않음 -> XasyncX
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    /* board.repository에서 처리
    // const { title, description } = createBoardDto;
    // const board = this.boardRepository.create({
    //   title,
    //   description,
    //   status: BoardStatus.PUBLIC,
    // });

    // await this.boardRepository.save(board);*/
    return this.boardRepository.createBoard(createBoardDto);
  }

  // TypeORM의 findOne Method 사용
  // async, await을 이용해서 DB 작업이 끝난 후의 결과값을 받음
  async getBoardById(id: number): Promise<Board> {
    try {
      const found = await this.boardRepository.findOneBy({ id });
      // 조건 객체 사용시
      // const found = await this.boardRepository.findOne({ where: { id } });

      if (!found) {
        throw new NotFoundException(`Can't find Board With ID ${id}`);
      }

      return found;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteBoard(id: number): Promise<void> {
    try {
      const result = await this.boardRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Board With ID: ${id}`);
      }
      console.log('result : ', result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    try {
      const board = await this.getBoardById(id);

      board.status = status;
      await this.boardRepository.save(board);
      // console.log(board);

      return board;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async updateBoard(
    id: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const { title, description, imagePath } = updateBoardDto;
    const board = await this.getBoardById(id);

    if (title) {
      board.title = title;
    }
    if (description) {
      board.description = description;
    }
    if (imagePath) {
      board.imagePath = imagePath;
    }

    await this.boardRepository.save(board);
    return board;
  }
}
