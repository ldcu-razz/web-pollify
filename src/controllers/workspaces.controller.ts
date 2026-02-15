import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetPoll } from "@models/polls/polls.type";
import { GetUser } from "@models/users/users.type";
import { GetPaginatedWorkspaces, GetPaginatedWorkspacesFilters, GetWorkspace, PostWorkspace, PutWorkspace } from "@models/workspace/workspace.type";
import { SupabaseService } from "src/services/supabase.service";

@Injectable({
  providedIn: 'root'
})
export class WorkspacesController {
  private readonly supabase = inject(SupabaseService);
  private readonly workspacesTable = 'workspaces';
  private readonly usersTable = 'users';
  private readonly pollsTable = 'polls';
  private readonly getWorkspaceSelectQuery = '*, total_users:users(count), total_polls:polls(count)';

  public async getWorkspaces(pagination: Pagination, filters: GetPaginatedWorkspacesFilters): Promise<GetPaginatedWorkspaces> {
    const supabase = await this.supabase.supabaseClient();
    const query = filters.q ?? null;
  
    const getWorkspacesQuery = supabase.from(this.workspacesTable)
      .select(this.getWorkspaceSelectQuery)
      .range((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit)
      .order('createdAt', { ascending: false });
    if (query) {
      getWorkspacesQuery.filter('name', 'ilike', `%${query}%`);
    }

    const { data, error } = await getWorkspacesQuery;
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Workspaces not found');
    }

    const workspaces = data.map((workspace) => ({
      ...workspace,
      total_users: workspace.total_users[0]?.count ?? 0,
      total_polls: workspace.total_polls[0]?.count ?? 0,
    }));

    const totalWorkspacesQuery = supabase.from(this.workspacesTable).select('*', { count: 'exact' });
    if (query) {
      totalWorkspacesQuery.filter('name', 'ilike', `%${query}%`);
    }
    const { count, error: countError } = await totalWorkspacesQuery;
    if (countError) {
      throw countError;
    }
    const total = count ?? 0;

    const response: GetPaginatedWorkspaces = {
      data: workspaces,
      page: pagination.page,
      limit: pagination.limit,
      total,
    }
    return response;
  }

  public async createWorkspace(workspace: PostWorkspace): Promise<GetWorkspace> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.workspacesTable).insert(workspace).select().single();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Workspace not created');
    }

    return data;
  }

  public async getWorkspace(workspaceId: string): Promise<GetWorkspace> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.workspacesTable).select('*').eq('id', workspaceId).single();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Workspace not found');
    }

    return data;
  }

  public async updateWorkspace(workspaceId: string, workspace: PutWorkspace): Promise<GetWorkspace> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.workspacesTable).update(workspace).eq('id', workspaceId).select().single();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Workspace not updated');
    }

    return data;
  }

  public async deleteWorkspace(workspaceId: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.workspacesTable).delete().eq('id', workspaceId);
    if (error) {
      throw error;
    }
    
    return true;
  }

  public async getWorkspaceUsers(workspaceId: string): Promise<GetUser[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.usersTable).select('*').eq('workspace_id', workspaceId);
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Users not found');
    }

    return data;
  }

  public async getWorkspacePolls(workspaceId: string): Promise<GetPoll[]> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollsTable).select('*').eq('workspace_id', workspaceId);
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Polls not found');
    }

    return data;
  }

  public async removeWorkspaceUser(workspaceId: string, userId: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.usersTable).update({ workspace_id: null }).eq('id', userId).eq('workspace_id', workspaceId);
    if (error) {
      throw error;
    }
    return true;
  }
}