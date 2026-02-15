import { inject, Injectable } from "@angular/core";
import { GetParticipantVote } from "@models/participants/participant-vote.type";
import { PollParticipantStatusSchema } from "@models/polls/poll-participants.schema";
import { BulkPostPollVoting, GetPollVoting } from "@models/polls/poll-votings.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class ParticipantVoteController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollsTable = 'polls';
  private readonly pollPositionsTable = 'poll_positions';
  private readonly pollCandidatesTable = 'poll_candidates';
  private readonly pollVotingsTable = 'poll_votings';
  private readonly pollParticipantsTable = 'poll_participants';
  private readonly pollVotingsSelectQuery = '*,poll_participant:poll_participants(id,name,poll_status), poll_candidate:poll_candidates(id,name), poll_position:poll_positions(id,name)';

  public async getParticipantVote(pollId: string): Promise<GetParticipantVote> {
    const supabase = await this.supabase.supabaseClient();
    const { data: pollData, error } = await supabase.from(this.pollsTable).select('*').eq('id', pollId).single();
    if (error) {
      throw error;
    }

    const { data: pollPositionsData, error: pollPositionsError } = await supabase.from(this.pollPositionsTable).select('*').eq('poll_id', pollId);
    if (pollPositionsError) {
      throw pollPositionsError;
    }

    const { data: pollCandidatesData, error: pollCandidatesError } = await supabase.from(this.pollCandidatesTable).select('*').eq('poll_id', pollId);
    if (pollCandidatesError) {
      throw pollCandidatesError;
    }

    const response: GetParticipantVote = {
      pool: pollData,
      poll_positions: pollPositionsData,
      poll_candidates: pollCandidatesData,
    }
    return response;
  }

  public async getParticipantVotings(participantId: string): Promise<GetPollVoting[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollVotingsTable).select(this.pollVotingsSelectQuery).eq('poll_participant_id', participantId);
    if (error) {
      throw error;
    }
    return data;
  }

  public async createParticipantVote(participantId: string, payload: BulkPostPollVoting): Promise<GetPollVoting[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollVotingsTable).insert(payload).select(this.pollVotingsSelectQuery);
    if (error) {
      throw error;
    }

    const { error: participantError } = await supabase.from(this.pollParticipantsTable).update({ poll_status: PollParticipantStatusSchema.enum.voted }).eq('id', participantId);
    if (participantError) {
      throw participantError;
    }

    return data;
  }
}