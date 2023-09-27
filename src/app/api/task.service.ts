import { Injectable } from '@angular/core';
import { TaskItemTypes } from './collection';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  API_URL: string =
    'https://test-api-gateway.vlinkgroup.net/customer-service/api/todolist';
  constructor(private http: HttpClient) {}

  createNewTask(params: TaskItemTypes) {
    return this.http.post(this.API_URL, params);
  }

  getTasks() {
    return this.http.get<TaskItemTypes[]>(this.API_URL);
  }

  updateTask(body: TaskItemTypes) {
    return this.http.put(this.API_URL, body);
  }

  updateTasksList(body: TaskItemTypes[]) {
    return this.http.put(this.API_URL, body);
  }

  deleteTask(taskId: string) {
    return this.http.delete(`${this.API_URL}/${taskId}`);
  }
}
