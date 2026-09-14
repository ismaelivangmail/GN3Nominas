import { Component } from '@angular/core';
import { Employees } from './modules/employees/employees';
import { Departments } from './modules/departments/departments';
import { Salaries } from './modules/salaries/salaries';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],

  imports: [ 
    Employees,
    Departments,
    Salaries],
    providers: []
})
export class app {

  constructor(){
  }

}