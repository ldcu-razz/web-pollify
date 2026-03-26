import { inject, Injectable } from "@angular/core";
import { GetPollPartylist, PatchPollPartylist, PostPollPartylist } from "@models/polls/poll-partylist.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class PollPartylistController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollPartylistsTable = 'poll_partylists';

  public async getPollPartylists(pollId: string): Promise<GetPollPartylist[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollPartylistsTable).select('*').eq('poll_id', pollId)
    if (error) {
      throw error;
    }


    const response: GetPollPartylist[] = data ?? [];
    return response;  
  }

  public async createPollPartylist(pollPartylist: PostPollPartylist): Promise<GetPollPartylist> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollPartylistsTable).insert(pollPartylist).select().single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async updatePollPartylist(pollPartylistId: string, pollPartylist: PatchPollPartylist): Promise<GetPollPartylist> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollPartylistsTable).update(pollPartylist).eq('id', pollPartylistId).select().single();
    if (error) {
      throw error;
    }
    return data;
  }
  
  public async deletePollPartylist(pollPartylistId: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.pollPartylistsTable).delete().eq('id', pollPartylistId);
    if (error) {
      throw error;
    }
    return true;
  }
}