import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { BulkPostPollVoting, GetPollVoting, GetPollVotingsPaginated, PostPollVoting } from "@models/polls/poll-votings.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class PollVotingsController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollVotingsTable = 'poll_votings';
  private readonly pollParticipantsTable = 'poll_participants';
  private readonly pollVotingsSelectQuery = '*,poll_participant:poll_participants(id,name,poll_status,rfid_number), poll_candidate:poll_candidates(id,name), poll_position:poll_positions(id,name)';

  public async getPollVotings(pollId: string, pagination: Pagination): Promise<GetPollVotingsPaginated> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollVotingsTable).select(this.pollVotingsSelectQuery).eq('poll_id', pollId)
      .range((pagination.page - 1) * pagination.limit, (pagination.page * pagination.limit) - 1);

    if (error) {
      throw error;
    }

    const totalPollVotingsQuery = supabase.from(this.pollVotingsTable).select('*', { count: 'exact' }).eq('poll_id', pollId);
    const { count, error: countError } = await totalPollVotingsQuery;
    if (countError) {
      throw countError;
    }
    const total = count ?? 0;

    const totalPollParticipantsQuery = supabase.from(this.pollParticipantsTable).select('*', { count: 'exact' }).eq('poll_id', pollId);
    const { count: totalParticipantsCount, error: totalParticipantsError } = await totalPollParticipantsQuery;
    if (totalParticipantsError) {
      throw totalParticipantsError;
    }
    const totalParticipants = totalParticipantsCount ?? 0;

    const response: GetPollVotingsPaginated = {
      data,
      page: pagination.page,
      limit: pagination.limit,
      total,
      total_votings: totalParticipants,
    }
    return response;
  }

  public async getPollVoting(id: string): Promise<GetPollVoting> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollVotingsTable).select(this.pollVotingsSelectQuery).eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async createPollVoting(pollVoting: PostPollVoting): Promise<GetPollVoting> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollVotingsTable).insert(pollVoting).select(this.pollVotingsSelectQuery).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async bulkCreatePollVotings(pollVotings: BulkPostPollVoting): Promise<GetPollVoting[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollVotingsTable).insert(pollVotings).select(this.pollVotingsSelectQuery);
    if (error) {
      throw error;
    }
    return data;
  }
}