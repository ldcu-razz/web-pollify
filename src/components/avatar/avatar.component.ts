import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  host: {
    '[class]': 'hostClasses()',
  },
})
export class AvatarComponent {
  public avatar = input<string | null>(null);
  public name = input<string>('');
  public size = input<AvatarSize>('md');
  public alt = input<string>('User avatar');

  protected initial = computed(() => {
    const name = this.name();
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  protected sizeClasses = computed(() => {
    const sizeMap: Record<AvatarSize, string> = {
      xs: 'size-6 text-xs',
      sm: 'size-8 text-sm',
      md: 'size-10 text-base',
      lg: 'size-12 text-lg',
      xl: 'size-16 text-xl',
    };
    return sizeMap[this.size()];
  });

  protected pixelSize = computed(() => {
    const sizeMap: Record<AvatarSize, number> = {
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
    };
    return sizeMap[this.size()];
  });

  protected hostClasses = computed(() => {
    return `inline-flex items-center justify-center rounded-full overflow-hidden bg-[var(--mat-sys-secondary)] text-[var(--mat-sys-on-secondary)] font-medium ${this.sizeClasses()}`;
  });
}