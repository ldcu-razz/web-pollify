import { inject } from "@angular/core";
import { validate, validateHttp } from "@angular/forms/signals";
import { UserStore } from "@store/users/users.store";

export function isPasswordInvalid(passwordPath: Parameters<typeof validateHttp>[0], userId: string) {
  const userStore = inject(UserStore);
  validate(passwordPath, (ctx) => {
    const password = ctx.value() as string;
    userStore.checkUserPasswordIsValid(userId, password).then((result) => {
      if (!result) {
        return { kind: "passwordInvalid", message: "Your password is incorrect" };
      }
      return null;
    });
  });
}