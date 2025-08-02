import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './interfaces/todo.interface';
import { stat } from 'fs';

@Injectable()
export class TodoService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<any> {
    try {
      if (!createTodoDto.task) {
        throw new Error('Task is required');
      }
      const newTodo: Todo = {
        userId: new ObjectId(userId),
        task: createTodoDto.task,
        status: createTodoDto.status || 'inprogress',
        createdAt: new Date(),
      };
      const result = await this.db.collection('todos').insertOne(newTodo);
      let response = await this.db
        .collection('todos')
        .findOne({ _id: result.insertedId });
      return { status: 'success', data: response };
    } catch (error) {
      return { status: 'Error ', e: 'Error creating todo: ' + error.message };
    }
  }

  async findAll(userId: string): Promise<any> {
    try {
      let todos = await this.db
        .collection('todos')
        .find({ userId: new ObjectId(userId) })
        .toArray();
        if (todos.length === 0) {
          return { status: 'success', data: [], message: 'No todos found' };
        }
      return { status: 'success', data: todos };
    } catch (error) {
      return { status: 'Error', e: 'Error fetching todos: ' + error.message };
    }
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<any> {
    try {
      if (!updateTodoDto.task) {
        throw new Error('(task  is required to update');
      }
      await this.db
        .collection('todos')
        .updateOne(
          { _id: new ObjectId(id), userId: new ObjectId(userId) },
          { $set: updateTodoDto },
        );
      let response = await this.db
        .collection('todos')
        .findOne({ _id: new ObjectId(id) });
        if (!response) {
          throw new Error('Todo not found');
        }
      return { status: 'success', data: response };
    } catch (error) {
      return { status: 'Error', e: 'Error updating todo: ' + error.message };
    }
  }
}
