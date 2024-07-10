import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { DataSource } from 'typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    {
      provide: 'BoardRepository',
      useFactory: (dataSource: DataSource) => new BoardRepository(dataSource),
      inject: [DataSource],
    },
  ],
})
export class BoardsModule {}
