// npm i @nestjs/mapped-types
import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDTO extends PartialType(CreateBoardDto) {}
