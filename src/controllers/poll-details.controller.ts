import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "@services/supabase.service";
import { GetPoll, PatchPoll } from "@models/polls/polls.type";

@Injectable({
  providedIn: 'root',
})
export class PollDetailsController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollsTable = 'polls';

  public async getPollDetails(pollId: string): Promise<GetPoll> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollsTable).select('*').eq('id', pollId).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async updatePoll(pollId: string, poll: PatchPoll): Promise<GetPoll> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollsTable).update(poll).eq('id', pollId).select().single();
    if (error) {
      throw error;
    }
    return data;
  }
}