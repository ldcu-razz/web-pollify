import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, signal, ViewChild } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { ImageStorageController } from "@controllers/image-storage.controller";
import { MatSliderModule } from "@angular/material/slider";

export type AvatarSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, MatSliderModule],
  host: {
    '[class]': 'hostClasses()',
  },
})
export class AvatarComponent {
  private readonly imageStorageController = inject(ImageStorageController);

  public avatar = input<string | null>(null);
  public name = input<string>('');
  public size = input<AvatarSize>('md');
  public alt = input<string>('User avatar');
  public editable = input<boolean>(false);

  public savedImage = output<string>();

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  protected isCropModalOpen = signal(false);
  protected isUploading = signal(false);
  protected previewUrl = signal<string | null>(null);

  protected zoom = signal(1);
  protected positionX = signal(0);
  protected positionY = signal(0);
  protected readonly minZoom = 1;
  protected readonly maxZoom = 3;

  protected cropContainerSize = 280;
  protected isDragging = signal(false);
  private dragStartX = 0;
  private dragStartY = 0;
  private dragOriginX = 0;
  private dragOriginY = 0;
  private pinchStartDistance = 0;
  private pinchStartZoom = 1;

  protected initial = computed(() => {
    const name = this.name();
    return name ? name.charAt(0).toUpperCase() : 'UN';
  });

  protected sizeClasses = computed(() => {
    const sizeMap: Record<AvatarSize, string> = {
      xxs: 'size-4 text-xs',
      xs: 'size-6 text-xs',
      sm: 'size-8 text-sm',
      md: 'size-10 text-base',
      lg: 'size-12 text-lg',
      xl: 'size-16 text-xl',
      xxl: 'size-20 text-2xl',
    };
    return sizeMap[this.size()];
  });

  protected pixelSize = computed(() => {
    const sizeMap: Record<AvatarSize, number> = {
      xxs: 16,
      xs: 24,
      sm: 32,
      md: 40,
      lg: 48,
      xl: 64,
      xxl: 80,
    };
    return sizeMap[this.size()];
  });

  protected hostClasses = computed(() => {
    return 'relative inline-flex items-center';
  });

  protected avatarClasses = computed(() => {
    return `inline-flex items-center justify-center rounded-full overflow-hidden bg-[var(--mat-sys-secondary)] text-[var(--mat-sys-on-secondary)] font-medium ${this.sizeClasses()}`;
  });

  protected openFileDialog(): void {
    this.fileInput?.nativeElement.click();
  }

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      input.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    this.previewUrl.set(objectUrl);
    this.zoom.set(1);
    this.positionX.set(0);
    this.positionY.set(0);
    this.isCropModalOpen.set(true);
    input.value = '';
  }

  protected closeCropModal(): void {
    const previewUrl = this.previewUrl();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    this.previewUrl.set(null);
    this.isCropModalOpen.set(false);
  }

  protected async saveCroppedImage(): Promise<void> {
    const previewUrl = this.previewUrl();
    if (!previewUrl || this.isUploading()) {
      return;
    }

    this.isUploading.set(true);
    try {
      const blob = await this.createCroppedBlob(previewUrl);
      const publicUrl = await this.imageStorageController.uploadAvatar(blob, 'png');
      this.savedImage.emit(publicUrl);
      this.closeCropModal();
    } finally {
      this.isUploading.set(false);
    }
  }

  private async createCroppedBlob(sourceUrl: string): Promise<Blob> {
    const image = await this.loadImage(sourceUrl);
    const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = cropSize;
    canvas.height = cropSize;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context is not available');
    }

    const scale = this.zoom();
    const displayBase = Math.max(
      this.cropContainerSize / image.naturalWidth,
      this.cropContainerSize / image.naturalHeight
    );
    const displayScale = displayBase * scale;
    const displayWidth = image.naturalWidth * displayScale;
    const displayHeight = image.naturalHeight * displayScale;
    const offsetX = (this.cropContainerSize - displayWidth) / 2 + this.positionX();
    const offsetY = (this.cropContainerSize - displayHeight) / 2 + this.positionY();

    const sourceX = Math.max(0, (-offsetX / displayWidth) * image.naturalWidth);
    const sourceY = Math.max(0, (-offsetY / displayHeight) * image.naturalHeight);
    const sourceWidth = Math.min(
      image.naturalWidth - sourceX,
      (this.cropContainerSize / displayWidth) * image.naturalWidth
    );
    const sourceHeight = Math.min(
      image.naturalHeight - sourceY,
      (this.cropContainerSize / displayHeight) * image.naturalHeight
    );

    context.clearRect(0, 0, cropSize, cropSize);
    context.save();
    context.beginPath();
    context.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, cropSize, cropSize);
    context.restore();

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create cropped image'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  }

  private async loadImage(sourceUrl: string): Promise<HTMLImageElement> {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();
    return image;
  }

  protected onZoomSliderChange(value: number): void {
    this.zoom.set(this.clamp(value, this.minZoom, this.maxZoom));
  }

  protected onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragOriginX = this.positionX();
    this.dragOriginY = this.positionY();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) {
      return;
    }
    const nextX = this.dragOriginX + (event.clientX - this.dragStartX);
    const nextY = this.dragOriginY + (event.clientY - this.dragStartY);
    this.positionX.set(nextX);
    this.positionY.set(nextY);
  }

  protected onPointerUp(): void {
    this.isDragging.set(false);
  }

  protected onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    this.onZoomSliderChange(this.zoom() + delta);
  }

  protected onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      this.pinchStartDistance = this.touchDistance(event.touches[0], event.touches[1]);
      this.pinchStartZoom = this.zoom();
      this.isDragging.set(false);
      return;
    }
    if (event.touches.length === 1) {
      this.isDragging.set(true);
      this.dragStartX = event.touches[0].clientX;
      this.dragStartY = event.touches[0].clientY;
      this.dragOriginX = this.positionX();
      this.dragOriginY = this.positionY();
    }
  }

  protected onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 2 && this.pinchStartDistance > 0) {
      event.preventDefault();
      const currentDistance = this.touchDistance(event.touches[0], event.touches[1]);
      const ratio = currentDistance / this.pinchStartDistance;
      this.onZoomSliderChange(this.pinchStartZoom * ratio);
      return;
    }

    if (event.touches.length === 1 && this.isDragging()) {
      event.preventDefault();
      const nextX = this.dragOriginX + (event.touches[0].clientX - this.dragStartX);
      const nextY = this.dragOriginY + (event.touches[0].clientY - this.dragStartY);
      this.positionX.set(nextX);
      this.positionY.set(nextY);
    }
  }

  protected onTouchEnd(): void {
    this.pinchStartDistance = 0;
    this.isDragging.set(false);
  }

  private touchDistance(a: Touch, b: Touch): number {
    const dx = b.clientX - a.clientX;
    const dy = b.clientY - a.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}