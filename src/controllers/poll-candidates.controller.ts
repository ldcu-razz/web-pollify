import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetPollCandidate, GetPollCandidatePagination, PatchPollCandidate, PostPollCandidate } from "@models/polls/poll-candidate.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class PollCandidatesController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollCandidatesTable = 'poll_candidates';
  private readonly pollPositionsTable = 'poll_positions';

  public async getPollCandidates(pollId: string, pagination: Pagination): Promise<GetPollCandidatePagination> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollCandidatesTable).select(`*, poll_position:${this.pollPositionsTable}(*)`).eq('poll_id', pollId)
      .range((pagination.page - 1) * pagination.limit, (pagination.page * pagination.limit) - 1);

    if (error) {
      throw error;
    }

    const totalPollCandidatesQuery = supabase.from(this.pollCandidatesTable).select('*', { count: 'exact' }).eq('poll_id', pollId);
    const { count, error: countError } = await totalPollCandidatesQuery;
    if (countError) {
      throw countError;
    }
    const total = count ?? 0;

    const response: GetPollCandidatePagination = {
      data,
      page: pagination.page,
      limit: pagination.limit,
      total,
    }
    return response;
  }

  public async createPollCandidate(pollId: string, payload: PostPollCandidate): Promise<GetPollCandidate> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollCandidatesTable).insert(payload).eq('poll_id', pollId).select(`*, poll_position:${this.pollPositionsTable}(*)`).single();
    if (error) {
      throw error;
    }

    return data;
  }

  public async updatePollCandidate(pollCandidateId: string, payload: PatchPollCandidate): Promise<GetPollCandidate> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollCandidatesTable).update(payload).eq('id', pollCandidateId).select(`*, poll_position:${this.pollPositionsTable}(*)`).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async deletePollCandidate(pollCandidateId: string): Promise<void> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.pollCandidatesTable).delete().eq('id', pollCandidateId);
    if (error) {
      throw error;
    }
  }
}