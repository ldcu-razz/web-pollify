import { Injectable, inject } from "@angular/core";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class ImageStorageController {
  private readonly supabase = inject(SupabaseService);
  private readonly bucketName = 'files';

  public async uploadAvatar(file: Blob, extension = 'png'): Promise<string> {
    const supabase = await this.supabase.supabaseClient();
    const filePath = `images/avatars/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(this.bucketName).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: `image/${extension}`,
    });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(this.bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  }
}
