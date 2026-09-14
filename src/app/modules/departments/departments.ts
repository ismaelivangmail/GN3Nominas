import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';
import { GN3Service } from '../../services/gn3service';
import { Department } from '../../models/Department';

@Component({
  imports: [    
    CommonModule,
    FormsModule],
  selector: 'app-departments',
  styleUrl: './departments.css',
  templateUrl: './departments.html',
})

export class Departments {

  Department_:Department = new Department();
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

   this.GN3Service_.getDepartment().subscribe(res => {
      this.datatable.set(res); // = res;
      console.log(res);
    });


  }

  onSave(): void {
    if (!this.editing) return;

    this.GN3Service_.updateDepartment(this.editRow.DeptId,  this.editRow).subscribe({
      next: () => {

        const currentData = this.datatable();
        const updatedData = currentData.map((emp: { DeptId: number | null; }) => 
          emp.DeptId === this.editing ? { ...this.editRow } : emp
        );
        this.datatable.set(updatedData);
        
        this.onCancel();
      },
      error: (err) => console.error('Error al actualizar departamento:', err)
    });
  }

  onCancel(): void {
    this.editing = null;
    this.editRow = {};
  }
  onEdit(item: any): void {
    this.editing = item.DeptId;
    this.editRow = item;
  }
  onDelete(id: number): void {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      this.GN3Service_.deleteDepartment(id).subscribe({
        next: () => {
          // Filtramos el registro eliminado de la lista
          const updatedData = this.datatable().filter((emp: { DeptId: number; }) => emp.DeptId !== id);
          this.datatable.set(updatedData);
        },
        error: (err) => console.error('Error al eliminar departamento:', err)
      });
    }
  }

  dialogAddDepartment(){
    this.showdialog = true;
  }

  onAddDepartment(Department_:Department):void{
    this.GN3Service_.addDepartment(Department_).subscribe(res => {
      if(res){
        alert(`El Departamento ${Department_.DeptDesc} se ha registrado con exito!`);
        this.clear();
        this.onDataTable();
      } else {
        alert('Error! :(')
      }
    });
  }


  onSetData(select:any){
    this.Department_.DeptId = select.EmpId;
    this.Department_.DeptDesc = select.FullName;
  }

  clear(){
    this.Department_.DeptId = 0;
    this.Department_.DeptDesc = "";
  }
}