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


    const { data: currentData, error: currentError } = await supabase
      .from(this.pollsTable)
      .select('status')
      .eq('id', pollId)
      .single();
    if (currentError || !currentData) {
      throw new Error('Poll not found');
    }

    const currentStatus = currentData.status as string;
    const newStatus = (poll as any).status;

    if (currentStatus !== 'published' && newStatus === 'published') {

      const { count: positionsCount, error: positionsError } = await supabase
        .from('poll_positions')
        .select('*', { count: 'exact', head: true })
        .eq('poll_id', pollId);
      if (positionsError) throw positionsError;

      const { count: candidatesCount, error: candidatesError } = await supabase
        .from('poll_candidates')
        .select('*', { count: 'exact', head: true })
        .eq('poll_id', pollId)
        .not('poll_position_id', 'is', null);
      if (candidatesError) throw candidatesError;

      if ((positionsCount ?? 0) === 0 || (candidatesCount ?? 0) === 0) {
        throw new Error('Poll must have at least one position and at least one candidate assigned to a position before it can be published.');
      }
    }

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