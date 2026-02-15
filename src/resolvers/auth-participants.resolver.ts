import { ResolveFn} from "@angular/router";
import { inject } from "@angular/core";
import { AuthParticipantsStore } from "@store/auth/auth-participants.store";

export const authParticipantsResolver: ResolveFn<boolean> = async () => {
  const authParticipantsStore = inject(AuthParticipantsStore);
  const session = authParticipantsStore.getSessionFromStorage();

  if (!session) {
    return false;
  }

  return true;
};