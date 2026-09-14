import { Injectable, Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Employee } from '../models/Employee';
import { Observable } from 'rxjs';
import { Department } from '../models/Department';
import { Salary } from '../models/Salary';


@Injectable({
  providedIn: 'root'
})

export class GN3Service {

  private http = inject(HttpClient);

  url:string = "https://localhost:44372/api/";

  getEmployee(){
    return this.http.get(this.url + 'Employee');
  }

  addEmployee(Employee_:Employee):Observable<Employee>{
    return this.http.post<Employee>(this.url + 'Employee', Employee_);
  }

  updateEmployee(id:number, Employee_:Employee):Observable<Employee>{
    return this.http.put<Employee>(this.url + 'Employee' + `/${id}`, Employee_);
  }

  deleteEmployee(id:number){
    return this.http.delete(this.url + 'Employee' + `/${id}`);
  }

  getDepartment(){
    return this.http.get(this.url + 'Department');
  }

  addDepartment(Department_:Department):Observable<Department>{
    return this.http.post<Department>(this.url + 'Department', Department_);
  }

  updateDepartment(id:number, Department_:Department):Observable<Department>{
    return this.http.put<Department>(this.url + 'Department' + `/${id}`, Department_);
  }

  deleteDepartment(id:number){
    return this.http.delete(this.url + 'Department' + `/${id}`);
  }

  getSalary(){
    return this.http.get(this.url + 'Salary');
  }

  addSalary(Salary_:Salary):Observable<Salary>{
    return this.http.post<Salary>(this.url + 'Salary', Salary_);
  }

  updateSalary(id:number, Salary_:Salary):Observable<Salary>{
    return this.http.put<Salary>(this.url + 'Salary' + `/${id}`, Salary_);
  }

  deleteSalary(id:number){
    return this.http.delete(this.url + 'Salary' + `/${id}`);
  }

}

