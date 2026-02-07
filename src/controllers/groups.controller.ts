import { computed, inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetGroup, GetGroupsFilter, GetPaginatedGroups, PatchGroup, PostGroup } from "@models/groups/groups.type";
import { SupabaseService } from "@services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class GroupsController {
  private readonly supabaseService = inject(SupabaseService);
  private readonly groupsTable = 'groups';

  private readonly supabase = computed(() => this.supabaseService.supabaseClient());

  public async getGroups(pagination: Pagination, filters: GetGroupsFilter): Promise<GetPaginatedGroups> {
    const supabase = await this.supabaseService.supabaseClient();
    const page = pagination.page;
    const limit = pagination.limit;

    const query = filters.q ?? null;
    const workspaceId = filters.workspace_id ?? null;

    const getGroupsQuery = supabase
      .from(this.groupsTable)
      .select('*, total_participants:participants(count)')
      .range((page - 1) * limit, (page * limit) - 1);
    
    if (query) {
      getGroupsQuery.filter('name', 'ilike', `%${query}%`);
    }
    if (workspaceId) {
      getGroupsQuery.filter('workspace_id', 'eq', workspaceId);
    }

    const { data, error } = await getGroupsQuery;
    if (error) {
      throw new Error(error.message);
    }

    const groups = (data ?? []).map((group) => ({
      ...group,
      total_participants: Array.isArray(group.total_participants)
        ? (group.total_participants[0]?.count ?? 0)
        : (group.total_participants ?? 0),
    }));

    const totalGroupsQuery = supabase.from(this.groupsTable).select('*', { count: 'exact' });
    if (query) {
      totalGroupsQuery.filter('name', 'ilike', `%${query}%`);
    }
    
    if (workspaceId) {
      totalGroupsQuery.filter('workspace_id', 'eq', workspaceId);
    }

    const { count, error: countError } = await totalGroupsQuery;
    if (countError) {
      throw new Error(countError.message);
    }

    const response: GetPaginatedGroups = {
      data: groups,
      page: pagination.page,
      limit: pagination.limit,
      total: count ?? 0,
    }
    return response;
  }

  public async getGroup(groupId: string): Promise<GetGroup> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from(this.groupsTable).select('*, workspace:workspace_id(id, name)').eq('id', groupId).single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  public async createGroup(group: PostGroup): Promise<GetGroup> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from(this.groupsTable).insert(group).select('*, workspace:workspace_id(id, name)').single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  public async updateGroup(groupId: string, group: PatchGroup): Promise<GetGroup> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from(this.groupsTable).update(group).eq('id', groupId).select('*, workspace:workspace_id(id, name)').single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  public async deleteGroup(groupId: string): Promise<boolean> {
    const supabase = await this.supabaseService.supabaseClient();
    const { error } = await supabase.from(this.groupsTable).delete().eq('id', groupId);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
}