import { Component, computed, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { form, FormField, required } from "@angular/forms/signals";
import { GetPollPartylist, PatchPollPartylist, PostPollPartylist } from "@models/polls/poll-partylist.type";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { PollPartylistStore } from "@store/poll-details/poll-partylist.store";

interface PollPartylistFormData {
  mode: "create" | "update";
  partylist: GetPollPartylist;
}

@Component({
  selector: "app-poll-partylist-form",
  templateUrl: "./poll-partylist-form.component.html",
  styleUrls: ["./poll-partylist-form.component.scss"],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormField,
  ],
})
export class PollPartylistFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PollPartylistFormComponent>);
  private readonly data = inject<PollPartylistFormData>(MAT_DIALOG_DATA);

  private readonly pollPartylistStore = inject(PollPartylistStore);
  private readonly pollDetailsStore = inject(PollDetailsStore);

  public mode = computed(() => this.data.mode ?? "create");
  public isCreateMode = computed(() => this.mode() === "create");
  public isUpdateMode = computed(() => this.mode() === "update");
  public title = computed(() => (this.isCreateMode() ? "Create Partylist" : "Update Partylist"));

  public partylist = computed(() => this.data.partylist);
  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? "");

  public partylistFormData = signal({
    name: this.isUpdateMode() ? this.partylist()?.name ?? "" : "",
    description: this.isUpdateMode() ? this.partylist()?.description ?? "" : "",
    avatar: this.isUpdateMode() ? this.partylist()?.avatar ?? "" : "",
  });

  public partylistForm = form(this.partylistFormData, (schemaPath) => {
    required(schemaPath.name, { message: "Name is required" });
  });

  public isFormInvalid = computed(() => this.partylistForm().invalid());
  public isFormTouched = computed(() => this.partylistForm().touched());
  public formLoading = computed(() => this.pollPartylistStore.formLoading());

  public submitFormLabel = computed(() => (this.isCreateMode() ? "Create Partylist" : "Update Partylist"));

  public submitForm(): void {
    if (this.isCreateMode()) {
      this.createPartylist();
    } else {
      this.updatePartylist();
    }
  }

  public createPartylist(): void {
    const payload: PostPollPartylist = {
      id: crypto.randomUUID(),
      poll_id: this.pollId(),
      name: this.partylistFormData().name,
      description: this.partylistFormData().description,
      avatar: this.partylistFormData().avatar,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.pollPartylistStore.createPollPartylist(payload);
    this.closeDialog();
  }

  public updatePartylist(): void {
    const payload: PatchPollPartylist = {
      name: this.partylistFormData().name,
      description: this.partylistFormData().description,
      avatar: this.partylistFormData().avatar,
      updated_at: new Date(),
    };

    this.pollPartylistStore.updatePollPartylist(this.partylist()?.id ?? "", payload);
    this.closeDialog();
  }

  public onAvatarSaved(avatar: string): void {
    this.partylistFormData.set({
      ...this.partylistFormData(),
      avatar,
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}

