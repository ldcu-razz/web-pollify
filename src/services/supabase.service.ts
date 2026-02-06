import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  
  private readonly supabase: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  public async supabaseClient(): Promise<SupabaseClient> {
    return this.supabase;
  }

  public async signedUrl(storage: string,path: string): Promise<string> {
    const expiration = 60 * 60 * 24 * 1; // 1 day
    const { data, error } = await this.supabase.storage.from(storage).createSignedUrl(`${path}`, expiration);
    if (error) {
      console.error('Error creating signed url:', error);
      throw error;
    }
    return data.signedUrl;
  }
}