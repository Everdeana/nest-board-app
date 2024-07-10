import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board, BoardStatus } from './boards.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDTO } from './dto/update-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

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

  @Get()
  getAllBoard(): Board[] {
    return this.boardsService.getAllBoards();
  }

  //   @Post()
  //   createBoard(
  //     @Body('title') title: string,
  //     @Body('description') description: string,
  //   ): Board {
  //     // 전체 글이 아니라 Board[] 사용 X
  //     return this.boardsService.createBoard(title, description);
  //   }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Board {
    // 전체 글이 아니라 Board[] 사용 X
    return this.boardsService.createBoard(createBoardDto);
  }

  @Get(':id')
  getBoardById(@Param('id') id: string): Board {
    return this.boardsService.getBoardById(id);
  }

  @Delete(':id')
  deleteBoard(@Param('id') id: string) {
    return this.boardsService.deleteBoard(id);
  }

  //   @Patch(':id')
  //   updateBoard(@Param('id') id: string, @Body() updateBoard: UpdateBoardDTO) {
  //     return this.boardsService.updateBoard(id, updateBoard);
  //   }

  @Patch(':id/status')
  updateBoardStatus(
    @Param('id') id: string,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }
}
