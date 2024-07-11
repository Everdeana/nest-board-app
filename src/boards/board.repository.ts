import { DataSource, Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './boards.model';

export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.manager);
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description, imagePath } = createBoardDto;
    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      imagePath,
    });

    await this.save(board);

    return board;
  }
}
