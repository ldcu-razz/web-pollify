import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetPollParticipantsPagination, GetPollParticipant, BulkPostPollParticipants, GetPollParticipantFilters, PatchPollParticipants, DeleteBulkPollParticipants } from "@models/polls/poll-participants.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class PollParticipantsController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollParticipantsTable = 'poll_participants';

  public async getPollParticipants(pollId: string, pagination: Pagination, filters: GetPollParticipantFilters): Promise<GetPollParticipantsPagination> {
    const supabase = await this.supabase.supabaseClient();
    const query = filters.q ?? null;

    const getPollParticipantsQuery = supabase.from(this.pollParticipantsTable).select('*').eq('poll_id', pollId)
      .range((pagination.page - 1) * pagination.limit, (pagination.page * pagination.limit) - 1);

    if (query) {
      getPollParticipantsQuery.filter('name', 'ilike', `%${query}%`);
    }

    const { data, error } = await getPollParticipantsQuery;

    if (error) {
      throw error;
    }

    const totalPollParticipantsQuery = supabase.from(this.pollParticipantsTable).select('*', { count: 'exact' }).eq('poll_id', pollId);

    if (query) {
      totalPollParticipantsQuery.filter('name', 'ilike', `%${query}%`);
    }

    const { count, error: countError } = await totalPollParticipantsQuery;
    if (countError) {
      throw countError;
    }
    const total = count ?? 0;

    const response: GetPollParticipantsPagination = {
      data,
      page: pagination.page,
      limit: pagination.limit,
      total,
    }
    return response;
  }

  public async getPollParticipant(pollParticipantId: string): Promise<GetPollParticipant> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollParticipantsTable).select('*').eq('id', pollParticipantId).single();

    if (error) {
      throw error;
    }
    return data;
  }

  public async postPollParticipant(pollParticipant: GetPollParticipant): Promise<GetPollParticipant> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollParticipantsTable).insert(pollParticipant).select('*').single();

    if (error) {
      throw error;
    }
    return data;
  }

  public async bulkPostPollParticipants(pollParticipants: BulkPostPollParticipants): Promise<GetPollParticipant[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollParticipantsTable).insert(pollParticipants).select('*');

    if (error) {
      throw error;
    }
    return data;
  }

  public async patchPollParticipant(pollParticipantId: string, pollParticipant: PatchPollParticipants): Promise<GetPollParticipant> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollParticipantsTable).update(pollParticipant).eq('id', pollParticipantId).select('*').single();

    if (error) {
      throw error;
    }
    return data;
  }

  public async deletePollParticipant(pollParticipantId: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.pollParticipantsTable).delete().eq('id', pollParticipantId);

    if (error) {
      throw error;
    }

    return true;
  }

  public async deleteBulkPollParticipants(payload: DeleteBulkPollParticipants): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const ids = payload;
    const { error } = await supabase.from(this.pollParticipantsTable).delete().in('id', ids);

    if (error) {
      throw error;
    }
    return true;
  }
}