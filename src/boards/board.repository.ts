import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Board } from './board.entity';

export class BoardRepository extends Repository<Board> {
  constructor(dataSource: DataSource) {
    super(Board, dataSource.manager);
  }
}
