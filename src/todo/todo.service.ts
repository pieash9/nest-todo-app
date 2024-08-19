import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './entities/todo.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TodoService {
  private readonly todoRepository: Repository<Todo>;
  constructor(
    @InjectRepository(Todo) private readonly baseRepository: Repository<Todo>,
    private readonly userService: UserService,
  ) {
    this.todoRepository = baseRepository.extend({});
  }

  async create(createTodoDto: CreateTodoDto, userId: number) {
    let todo: Todo = new Todo();
    todo.title = createTodoDto.title;
    todo.date = new Date().toLocaleString();
    todo.completed = false;
    todo.user = await this.userService.findUserById(userId);
    return this.todoRepository.save(todo);
  }

  findAllTodoByUserNotCompleted(userId: number) {
    // userId not completed
    return this.todoRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: userId,
        },
        completed: false,
      },
    });
  }

  findAllTodoByUserCompleted(userId: number) {
    // userId not completed
    return this.todoRepository.find({
      relations: ['user'],
      where: {
        user: {
          id: userId,
        },
        completed: true,
      },
    });
  }

  update(todoId: number) {
    return this.todoRepository.update(todoId, {
      completed: true,
    });
  }

  remove(todId: number) {
    return this.todoRepository.delete(todId);
  }
}
