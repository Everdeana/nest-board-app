import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { DataSource } from 'typeorm';

// import { BoardRepository } from './board.repository';
// import { DataSource } from 'typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Board])], // 이렇게 등록하면 데코레이터 없이도 인식 가능?
  controllers: [BoardsController],
  providers: [
    BoardsService,
    {
      provide: BoardRepository,
      useFactory: (dataSource: DataSource) => new BoardRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class BoardsModule {}
