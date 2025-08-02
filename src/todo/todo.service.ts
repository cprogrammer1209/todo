import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './interfaces/todo.interface';

@Injectable()
export class TodoService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<any>  {
    const newTodo: Todo = {
      userId: new ObjectId(userId),
      task: createTodoDto.task,
      status: createTodoDto.status || 'inprogress',
      createdAt: new Date(),
    };
    const result = await this.db.collection('todos').insertOne(newTodo);
    return this.db.collection('todos').findOne({ _id: result.insertedId });
  }

  async findAll(userId: string): Promise<any>  {
    return this.db
      .collection('todos')
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<any> {
    await this.db
      .collection('todos')
      .updateOne(
        { _id: new ObjectId(id), userId: new ObjectId(userId) },
        { $set: updateTodoDto },
      );
    return this.db
      .collection('todos')
      .findOne({ _id: new ObjectId(id) });
  }
}