import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { participantRoutes } from "./participant.routes";

@NgModule({
    imports: [
      RouterModule.forChild(participantRoutes),
    ],
})
export class ParticipantModule {
}