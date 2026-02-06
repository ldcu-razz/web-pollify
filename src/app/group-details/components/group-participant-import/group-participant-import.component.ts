import { Component, ElementRef, computed, inject, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BulkPostParticipants } from "@models/participants/participants.type";
import { SupabaseService } from "@services/supabase.service";
import { GroupDetailsStore } from "@store/groups/group-details.store";

interface GroupParticipantImportData {
  groupId: string;
}

@Component({
  selector: 'app-group-participant-import',
  templateUrl: './group-participant-import.component.html',
  styleUrls: ['./group-participant-import.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class GroupParticipantImportComponent {
  private readonly supabaseService = inject(SupabaseService);
  private readonly dialogRef = inject(MatDialogRef<GroupParticipantImportComponent>);
  private readonly data = inject<GroupParticipantImportData>(MAT_DIALOG_DATA);
  private readonly groupDetailsStore = inject(GroupDetailsStore);

  public fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  public groupId = computed(() => this.data.groupId);

  public importingParticipantsLoading = computed(() => this.groupDetailsStore.importingParticipantsLoading());

  public isDragOver = false;
  public selectedFile: File | null = null;
  public selectedFileName = '';

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public importParticipants(): void {
    if (!this.selectedFile) {
      return;
    }

    console.log('Importing participants from file:', this.selectedFile);
  }

  public onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.setFile(file);
      this.getGroupParticipantsDataFromImportedFile();
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const file = event.dataTransfer?.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv'))) {
      this.setFile(file);
    }
  }

  public triggerFileInput(): void {
    const inputRef = this.fileInput();
    inputRef?.nativeElement.click();
  }

  private setFile(file: File): void {
    this.selectedFile = file;
    this.selectedFileName = file.name;
  }

  public getGroupParticipantsDataFromImportedFile(): void {
    const file = this.selectedFile;
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) ?? '';
      const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (lines.length < 2) {
        console.warn('Imported file does not contain enough data rows.');
        return;
      }

      const headers = lines[0]
        .split(',')
        .map(header => header.trim().toLowerCase());

      const getIndex = (key: string): number => headers.indexOf(key);

      const rfidIndex = getIndex('rfid_number');
      const nameIndex = getIndex('name');
      const departmentIndex = getIndex('department');

      if (rfidIndex === -1 || nameIndex === -1 || departmentIndex === -1) {
        console.warn('CSV headers must include rfid_number, name, and department.');
        return;
      }

      const participants = lines.slice(1).map(line => {
        const columns = line.split(',').map(col => col.trim());

        return {
          id: crypto.randomUUID(),
          rfid_number: columns[rfidIndex] ?? '',
          name: columns[nameIndex] ?? '',
          department: columns[departmentIndex] ?? '',
          group_id: this.groupId(),
          workspace_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }).filter(participant =>
        participant.rfid_number !== '' ||
        participant.name !== '' ||
        participant.department !== ''
      );

      this.importGroupParticipants(participants);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsText(file);
  }

  public async importGroupParticipants(participants: BulkPostParticipants): Promise<void> {
    await this.groupDetailsStore.importGroupParticipants(participants, this.groupId());
    this.closeDialog();
  }

  public downloadTemplate(): void {
    this.supabaseService.signedUrl('files', 'assets/pollyfy_group_participant_template.csv').then(url => {
      window.open(url, '_blank');
    });
  }
}