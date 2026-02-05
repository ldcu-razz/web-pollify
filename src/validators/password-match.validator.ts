import { validate } from "@angular/forms/signals";

interface PasswordMatchOptions {
  message?: string;
}

export function passwordMatch(
  confirmPasswordPath: Parameters<typeof validate>[0],
  passwordPath: unknown,
  options: PasswordMatchOptions = {}
): void {
  const message = options.message ?? "Passwords must match";

  validate(confirmPasswordPath, (ctx) => {
    const value = ctx.value() as string;
    const passwordValue = (passwordPath as { value: () => string }).value();
    if (value && passwordValue && value !== passwordValue) {
      return { kind: "passwordMatch", message };
    }
    return;
  });
}
