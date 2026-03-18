import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetPoll, GetPollsFilter, GetPollsPagination, PatchPoll, PostPoll } from "@models/polls/polls.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class PollsController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollsTable = 'polls';

  public async getPolls(pagination: Pagination, filters: GetPollsFilter): Promise<GetPollsPagination> { 
    const supabase = await this.supabase.supabaseClient();
    const query = filters.q ?? null;
    const status = filters.status ?? null;
    const workspaceId = filters.workspace_id ?? null;

    const getPollsQuery = supabase.from(this.pollsTable).select('*')
      .range((pagination.page - 1) * pagination.limit, (pagination.page * pagination.limit) - 1)
      .order('created_at', { ascending: false });

    if (query) {
      getPollsQuery.filter('name', 'ilike', `%${query}%`);
    }
    if (status) {
      getPollsQuery.filter('status', 'eq', status);
    }
    if (workspaceId) {
      getPollsQuery.filter('workspace_id', 'eq', workspaceId);
    }

    const { data, error } = await getPollsQuery;
    if (error) {
      throw error;
    }

    const totalPollsQuery = supabase.from(this.pollsTable).select('*', { count: 'exact' });
    if (query) {
      totalPollsQuery.filter('name', 'ilike', `%${query}%`);
    }
    if (status) {
      totalPollsQuery.filter('status', 'eq', status);
    }
    if (workspaceId) {
      totalPollsQuery.filter('workspace_id', 'eq', workspaceId);
    }
    const { count, error: countError } = await totalPollsQuery;
    if (countError) {
      throw countError;
    }
    const total = count ?? 0;

    const response: GetPollsPagination = {
      data,
      page: pagination.page,
      limit: pagination.limit,
      total,
    }

    return response;
  }

  public async getPoll(id: string): Promise<GetPoll> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollsTable).select('*').eq('id', id).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async createPoll(poll: PostPoll): Promise<GetPoll> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollsTable).insert(poll).select().single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async updatePoll(id: string, poll: PatchPoll): Promise<GetPoll> {
    const supabase = await this.supabase.supabaseClient();

   
    const { data: currentData, error: currentError } = await supabase
      .from(this.pollsTable)
      .select('status')
      .eq('id', id)
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
        .eq('poll_id', id);
      if (positionsError) throw positionsError;

      const { count: candidatesCount, error: candidatesError } = await supabase
        .from('poll_candidates')
        .select('*', { count: 'exact', head: true })
        .eq('poll_id', id)
        .not('poll_position_id', 'is', null);
      if (candidatesError) throw candidatesError;

      if ((positionsCount ?? 0) === 0 || (candidatesCount ?? 0) === 0) {
        throw new Error('Poll must have at least one position and at least one candidate assigned to a position before it can be published.');
      }
    }

    const { data, error } = await supabase.from(this.pollsTable).update(poll).eq('id', id).select('*').single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async deletePoll(id: string): Promise<void> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.pollsTable).delete().eq('id', id);
    if (error) {
      throw error;
    }
  }
}
