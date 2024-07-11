import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
// Local Memory가 아니라 DB를 사용하기 때문에 board.model에 있는 Board가 아니라 board.entity에 있는 Board를 사용한다.
// import { Board, BoardStatus } from './boards.model';
import { BoardStatus } from './boards.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { Response } from 'express'; // 추가

@Controller('boards')
export class BoardsController {
  // 접근제한자(private, public, protected)를 생성자(constructor) 파라미터에 선언하면 접근제한자가 사용된 생성자 파라미터는 암묵적으로 클래스 프로퍼티로 선언됨
  // 프로퍼티 자체를 이 클래스 안에서만 사용 -> private
  // constructor(private boardsService: BoardsService) {} --> 이 코드가 만들어지는 과정 ↓
  //   boardsService: BoardsService;

  //   constructor(boardsService: BoardsService) {
  //     this.boardsService = boardsService;
  //   }

  constructor(private readonly boardsService: BoardsService) {}

  /*// Local Memory //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // @Get()
  // getAllBoard(): Board[] {
  //   return this.boardsService.getAllBoards();
  // }

  // //   @Post()
  // //   createBoard(
  // //     @Body('title') title: string,
  // //     @Body('description') description: string,
  // //   ): Board {
  // //     // 전체 글이 아니라 Board[] 사용 X
  // //     return this.boardsService.createBoard(title, description);
  // //   }

  // @Post()
  // @UsePipes(ValidationPipe)
  // createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //   // 전체 글이 아니라 Board[] 사용 X
  //   return this.boardsService.createBoard(createBoardDto);
  // }

  // @Get(':id')
  // getBoardById(@Param('id') id: string): Board {
  //   return this.boardsService.getBoardById(id);
  // }

  // @Delete(':id')
  // deleteBoard(@Param('id') id: string) {
  //   return this.boardsService.deleteBoard(id);
  // }

  // //   @Patch(':id')
  // //   updateBoard(@Param('id') id: string, @Body() updateBoard: UpdateBoardDTO) {
  // //     return this.boardsService.updateBoard(id, updateBoard);
  // //   }

  // @Patch(':id/status')
  // updateBoardStatus(
  //   @Param('id') id: string,
  //   @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  // ) {
  //   return this.boardsService.updateBoardStatus(id, status);
  // }

  // Local Memory //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  // TypeORM /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto);
  }

  // @Get(':id')
  // getBoardById(@Param('id') id: number): Promise<Board> {
  //   return this.boardsService.getBoardById(id);
  // }

  @Get(':id')
  async getBoardById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const board = await this.boardsService.getBoardById(id);
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${board.title}</title>
      </head>
      <body>
        <h1>${board.title}</h1>
        <p>${board.description}</p>
        ${board.imagePath ? `<img src="/images/${board.imagePath}" alt="Board Image" width="300" />` : ''}
      </body>
      </html>
    `;
    res.send(html);
  }

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) id): Promise<void> {
    // method로 오는 parameter가 int인지 확인
    return this.boardsService.deleteBoard(id);
  }

  @Patch(':id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status);
  }

  @Get()
  getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  @Patch(':id')
  updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.boardsService.updateBoard(id, updateBoardDto);
  }
}
