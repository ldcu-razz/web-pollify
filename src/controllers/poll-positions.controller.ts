import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetPollCandidate } from "@models/polls/poll-candidate.type";
import { GetPollPosition, GetPollPositionsPagination, PatchPollPosition, PostPollPosition } from "@models/polls/poll-positions.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class PollPositionsController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollPositionsTable = 'poll_positions';
  private readonly pollCandidatesTable = 'poll_candidates';

  public async getPollPositions(pollId: string, pagination: Pagination): Promise<GetPollPositionsPagination> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollPositionsTable).select(`*, poll_candidates:${this.pollCandidatesTable}(*)`).eq('poll_id', pollId)
      .range((pagination.page - 1) * pagination.limit, (pagination.page * pagination.limit) - 1);

    if (error) {
      throw error;
    }

    const totalPollPositionsQuery = supabase.from(this.pollPositionsTable).select('*', { count: 'exact' }).eq('poll_id', pollId);
    const { count, error: countError } = await totalPollPositionsQuery;
    if (countError) {
      throw countError;
    }
    const total = count ?? 0;

    const response: GetPollPositionsPagination = {
      data,
      page: pagination.page,
      limit: pagination.limit,
      total,
    }
    return response;
  }

  public async createPollPosition(pollPosition: PostPollPosition): Promise<GetPollPosition> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollPositionsTable).insert(pollPosition).select(`*, poll_candidates:${this.pollCandidatesTable}(*)`).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async updatePollPosition(pollPositionId: string, pollPosition: PatchPollPosition): Promise<GetPollPosition> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollPositionsTable).update(pollPosition).eq('id', pollPositionId).select(`*, poll_candidates:${this.pollCandidatesTable}(*)`).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async deletePollPosition(pollPositionId: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.pollPositionsTable).delete().eq('id', pollPositionId);
    if (error) {
      throw error;
    }
    return true;
  }

  public async modifyPollPositionCandidates(pollPositionId: string, addedCandidateIds: string[], removedCandidateIds: string[]): Promise<GetPollCandidate[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data: updatedCandidates, error } = await supabase.from(this.pollCandidatesTable)
      .update({ poll_position_id: pollPositionId })
      .in('id', addedCandidateIds)
      .select('*');
    if (error) {
      throw error;
    }

    if (removedCandidateIds.length > 0) {
      const { error: removedCandidatesError } = await supabase.from(this.pollCandidatesTable)
        .update({ poll_position_id: null })
        .in('id', removedCandidateIds)
        .select('*');
      if (removedCandidatesError) {
        throw removedCandidatesError;
      }
    }

    return [...updatedCandidates];
  }
}