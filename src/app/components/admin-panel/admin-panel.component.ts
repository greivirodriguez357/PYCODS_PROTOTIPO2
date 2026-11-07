import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, AgGridModule, ButtonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  // Todas las columnas se reparten el ancho disponible (flex) -> tabla 100% fluida
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    sortable: true,
    filter: true,
    resizable: true
  };

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0, width: 80, minWidth: 70 },
    { field: 'nombre', headerName: 'Estudiante', minWidth: 180 },
    { field: 'email', headerName: 'Correo Electrónico', minWidth: 220 },
    { field: 'rol', headerName: 'Rol' },
    { field: 'nivel', headerName: 'Nivel' },
    { field: 'xp', headerName: 'XP Acumulado' },
    { field: 'monedas', headerName: 'Monedas' },
    { field: 'racha', headerName: 'Racha (Días)' }
  ];

  rowData: User[] = [];
  errorMessage = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe({
      next: (users) => this.rowData = users,
      error: () => this.errorMessage = 'No se pudo cargar la lista de usuarios.'
    });
  }

  onGridReady(event: GridReadyEvent) {
    event.api.sizeColumnsToFit();
    // Reajusta al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => setTimeout(() => event.api.sizeColumnsToFit()));
  }

  exportData() {
    alert('📥 Exportando informe detallado de estudiantes a formato CSV...');
  }
}
