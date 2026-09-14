import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Observable } from 'rxjs';
import { GN3Service } from '../../services/gn3service';
import { Salary } from '../../models/Salary';

@Component({
  imports: [    
    CommonModule,
    FormsModule],
  selector: 'app-salaries',
  styleUrl: './salaries.css',
  templateUrl: './salaries.html',
})

export class Salaries {

  Salary_:Salary = new Salary();
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

   this.GN3Service_.getSalary().subscribe(res => {
      this.datatable.set(res); // = res;
      console.log(res);
    });


  }

  onSave(): void {
    if (!this.editing) return;

    this.GN3Service_.updateSalary(this.editRow.EmpId,  this.editRow).subscribe({
      next: () => {

        const currentData = this.datatable();
        const updatedData = currentData.map((emp: { EmpId: number | null; }) => 
          emp.EmpId === this.editing ? { ...this.editRow } : emp
        );
        this.datatable.set(updatedData);

        this.onCancel();
      },
      error: (err) => console.error('Error al actualizar sueldo:', err)
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
      this.GN3Service_.deleteSalary(id).subscribe({
        next: () => {
          // Filtramos el registro eliminado de la lista
          const updatedData = this.datatable().filter((emp: { EmpId: number; }) => emp.EmpId !== id);
          this.datatable.set(updatedData);
        },
        error: (err) => console.error('Error al eliminar el sueldo:', err)
      });
    }
  }

  dialogAddSalary(){
    this.showdialog = true;
  }

  onAddSalary(Salary_:Salary):void{
    this.GN3Service_.addSalary(Salary_).subscribe(res => {
      if(res){
        alert(`El sueldo del Empleado con Clave ${Salary_.EmpId} se ha registrado con exito!`);
        this.clear();
        this.onDataTable();
      } else {
        alert('Error! :(')
      }
    });
  }

  onUpdateSalary(Salary_:Salary):void{
    this.GN3Service_.updateSalary(Salary_.EmpId, Salary_).subscribe(res => {
      if(res){
        alert(`El sueldo del Empleado con Clave ${Salary_.EmpId} se ha modificado con exito!`);
        this.clear();
        this.onDataTable();
      } else {
        alert('Error! :(')
      }
    });
  }


  onSetData(select:any){
    this.Salary_.EmpId = select.EmpId;
    this.Salary_.Qty = select.Qty;
    this.Salary_.PayId = select.PayId;
  }

  clear(){
    this.Salary_.EmpId = 0;
    this.Salary_.Qty = 0;
    this.Salary_.PayId = 0;
  }
}