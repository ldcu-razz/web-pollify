import { Component, computed, inject, signal } from "@angular/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { form, required, FormField } from '@angular/forms/signals';

interface WorkspaceForm {
  name: string;
  description: string;
}

@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html',
  styleUrls: ['./workspace-form.component.scss'],
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField]
})
export class WorkspaceFormComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkspaceFormComponent>);

  public workspaceFormData = signal<WorkspaceForm>({
    name: "",
    description: ""
  })

  public workspaceForm = form(this.workspaceFormData, (schemaPath) => {
    required(schemaPath.name, {message: "Name is required"});
    required(schemaPath.description, {message: "Description is required"});
  })

  public isFormInvalid = computed(() => this.workspaceForm().invalid());
  public isFormTouched = computed(() => this.workspaceForm().touched());

  public closeDialog(): void {
    this.dialogRef.close();
  }
}