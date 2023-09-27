import { Component } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService } from '../api/task.service';
import { ErrorResponseTypes, TaskItemTypes } from '../api/collection';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class HomePage {
  tasks: TaskItemTypes[] = [];
  tasksSearch: TaskItemTypes[] = [];
  isOpenModal: boolean = false;

  //Create new task
  createTaskForm: FormGroup;

  constructor(
    private taskAPI: TaskService,
    private loading: LoadingController
  ) {
    this.showLoading('Getting tasks list ....');
    this.getTasksList();

    this.createTaskForm = new FormGroup({
      Title: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Description: new FormControl('', Validators.maxLength(500)),
      Order: new FormControl(0, Validators.min(0)),
      IsDone: new FormControl(false),
    });
  }

  async showLoading(message: string) {
    const loading = await this.loading.create({
      message: message,
      duration: 1000,
    });
    loading.present();
  }

  getTasksList() {
    this.taskAPI.getTasks().subscribe({
      next: (taskResponse: TaskItemTypes[]) => {
        this.tasks = taskResponse;
        this.tasksSearch = taskResponse;
        this.loading.dismiss();
      },
      error: (errors: ErrorResponseTypes) => {
        console.error(errors.error.detail);
      },
    });
  }

  setIsOpen(isOpen: boolean) {
    this.isOpenModal = isOpen;
  }

  searchTask(event: Event) {
    const keySearch = (event.target as HTMLInputElement).value.toLowerCase();
    const result = this.tasksSearch.filter((task) =>
      task.Title.toLowerCase().includes(keySearch)
    );
    this.tasks = result;
  }

  removeTask(taskId: string | undefined) {
    this.showLoading('The system is deleting task...');
    this.taskAPI.deleteTask(taskId as string).subscribe({
      next: () => {
        this.getTasksList();
        this.loading.dismiss();
      },
      error: (errors: ErrorResponseTypes) => {
        console.warn(errors.error.detail);
      },
    });
  }

  updateTask(event: any, taskId: string | undefined) {
    const checked = event.detail.checked;
    const taskIsFound = this.tasks.find((task) => task.Id === taskId);

    if (taskIsFound) {
      this.showLoading('Updating task....');
      this.taskAPI.updateTask({ ...taskIsFound, IsDone: checked }).subscribe({
        next: () => {
          this.getTasksList();
          this.loading.dismiss();
        },
        error: (errors: ErrorResponseTypes) => {
          console.warn(errors.error.detail);
        },
      });
    }
  }

  onSubmit() {
    this.showLoading('The system is creating new task...');
    this.taskAPI.createNewTask(this.createTaskForm.value).subscribe({
      next: () => {
        this.getTasksList();
        this.loading.dismiss();
        this.isOpenModal = false;
      },
      error: (errors: ErrorResponseTypes) => {
        console.warn(errors.error.detail);
      },
    });
  }
}
