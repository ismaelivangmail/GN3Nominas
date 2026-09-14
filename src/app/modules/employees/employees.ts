import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';
import { GN3Service } from '../../services/gn3service';
import { Employee } from '../../models/Employee';

@Component({
  imports: [    
    CommonModule,
    FormsModule],
  selector: 'app-employees',
  styleUrl: './employees.css',
  templateUrl: './employees.html',
})

export class Employees {

  Employee_:Employee = new Employee();
  //datatable:any = [];
  datatable = signal<any>([]);
  editing: number | null = null;
  editRow: any = {};
  showdialog: boolean = false;
  

  constructor(private GN3Service_:GN3Service){

  }

  ngOnInit(): void {
    this.onDataTable();
  }


  onDataTable(){

   this.GN3Service_.getEmployee().subscribe(res => {
      this.datatable.set(res); // = res;
      console.log(res);
    });


  }

  onSave(): void {
    if (!this.editing) return;

    this.GN3Service_.updateEmployee(this.editRow.EmpId,  this.editRow).subscribe({
      next: () => {

        const currentData = this.datatable();
        const updatedData = currentData.map((emp: { EmpId: number | null; }) => 
          emp.EmpId === this.editing ? { ...this.editRow } : emp
        );
        this.datatable.set(updatedData);

        this.onCancel();
      },
      error: (err) => console.error('Error al actualizar empleado:', err)
    });
  }

  onCancel(): void {
    this.editing = null;
    this.editRow = {};
  }
  onEdit(item: any): void {
    this.editing = item.EmpId;
    this.editRow = item;
  }
  onDelete(id: number): void {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.GN3Service_.deleteEmployee(id).subscribe({
        next: () => {
          // Filtramos el registro eliminado de la lista
          const updatedData = this.datatable().filter((emp: { EmpId: number; }) => emp.EmpId !== id);
          this.datatable.set(updatedData);
        },
        error: (err) => console.error('Error al eliminar empleado:', err)
      });
    }
  }

  dialogAddEmployee(){
    this.showdialog = true;
  }

  onAddEmployee(Employee_:Employee):void{
    this.GN3Service_.addEmployee(Employee_).subscribe(res => {
      if(res){
        alert(`El Empleado ${Employee_.FullName} se ha registrado con exito!`);
        this.clear();
        this.onDataTable();
      } else {
        alert('Error! :(')
      }
    });
  }

  onUpdateEmployee(Employee_:Employee):void{
    this.GN3Service_.updateEmployee(Employee_.EmpId, Employee_).subscribe(res => {
      if(res){
        alert(`El empleado numero ${Employee_.EmpId} se ha modificado con exito!`);
        this.clear();
        this.onDataTable();
      } else {
        alert('Error! :(')
      }
    });
  }


  onSetData(select:any){
    this.Employee_.EmpId = select.EmpId;
    this.Employee_.FullName = select.FullName;
    this.Employee_.JoinDate = select.JoinDate;
    this.Employee_.BirthDate = select.BirthDate;
    this.Employee_.DeptId = select.DeptId;
  }

  clear(){
    this.Employee_.EmpId =0;
    this.Employee_.FullName = "";
    this.Employee_.JoinDate = new Date();
    this.Employee_.BirthDate = new Date();
    this.Employee_.DeptId = 0;
  }
}