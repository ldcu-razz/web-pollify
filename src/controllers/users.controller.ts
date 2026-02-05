import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetPaginatedUsers, GetPaginatedUsersFilters, GetUser, PostUser, User } from "@models/users/users.type";
import { SupabaseService } from "@services/supabase.service";
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class UsersController {
  private readonly supabase = inject(SupabaseService);
  private readonly usersTable = 'users';

  public async getUsers(pagination: Pagination, filters: GetPaginatedUsersFilters): Promise<GetPaginatedUsers> {
    const supabase = await this.supabase.supabaseClient();
    const query = filters.q ?? null;
    const status = filters.status ?? null;
    const role = filters.role ?? null;

    const getUsersQuery = supabase.from(this.usersTable).select('*').range((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);
    if (query) {
      getUsersQuery.or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`);
    }

    if (status) {
      getUsersQuery.filter('status', 'eq', status);
    }
    if (role) {
      getUsersQuery.filter('role', 'eq', role);
    }

    const { data, error } = await getUsersQuery;
    if (error) {
      throw error;
    }

    const totalUsersQuery = supabase.from(this.usersTable).select('*', { count: 'exact' });
    if (query) {
      totalUsersQuery.or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`);
    }
    if (status) {
      totalUsersQuery.filter('status', 'eq', status);
    }
    if (role) {
      totalUsersQuery.filter('role', 'eq', role);
    }
    const { count, error: countError } = await totalUsersQuery;
    if (countError) {
      throw countError;
    }
    const total = count ?? 0;

    const response: GetPaginatedUsers = {
      data,
      page: pagination.page,
      limit: pagination.limit,
      total,
    }
    return response;
  }

  public async getUser(userId: string): Promise<GetUser> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.usersTable).select('*').eq('id', userId).single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async createUser(payload: PostUser): Promise<User> {
    const supabase = await this.supabase.supabaseClient();
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const { data, error } = await supabase.from(this.usersTable).insert({
      ...payload,
      password: hashedPassword,
    }).select().single();

    if (error) {
      throw error;
    }
    return data;
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { error } = await supabase.from(this.usersTable).delete().eq('id', userId);
    if (error) {
      throw error;
    }
    return true;
  }
}