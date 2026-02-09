import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "@services/supabase.service";
import { GetPoll, PatchPoll } from "@models/polls/polls.type";

@Injectable({
  providedIn: 'root',
})
export class PollDetailsController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollsTable = 'polls';
  private readonly selectPollQuery = '*, total_candidates:poll_candidates(count), total_participants:poll_participants(count), total_positions:poll_positions(count)';

  public async getPollDetails(pollId: string): Promise<GetPoll> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollsTable).select(this.selectPollQuery).eq('id', pollId).single();
    if (error) {
      throw error;
    }

    const pollDetails: GetPoll = {
      ...data,
      total_candidates: data.total_candidates[0]?.count ?? 0,
      total_participants: data.total_participants[0]?.count ?? 0,
      total_positions: data.total_positions[0]?.count ?? 0,
    };
    return pollDetails;
  }

  public async updatePoll(pollId: string, poll: PatchPoll): Promise<GetPoll> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollsTable).update(poll).eq('id', pollId).select(this.selectPollQuery).single();
    if (error) {
      throw error;
    }

    const pollDetails: GetPoll = {
      ...data,
      total_candidates: data.total_candidates[0]?.count ?? 0,
      total_participants: data.total_participants[0]?.count ?? 0,
      total_positions: data.total_positions[0]?.count ?? 0,
    };
    return pollDetails;
  }
}