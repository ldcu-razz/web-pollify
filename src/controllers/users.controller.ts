import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetPaginatedUsers, GetPaginatedUsersFilters, GetUser, PatchUser, PostUser, User } from "@models/users/users.type";
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

    const getUsersQuery = supabase.from(this.usersTable).select('*')
      .range((pagination.page - 1) * pagination.limit, (pagination.page * pagination.limit) - 1).order('createdAt', { ascending: false });
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

  public async updateUser(userId: string, payload: PatchUser): Promise<User> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.usersTable).update(payload).eq('id', userId).select().single();
    if (error) {
      throw error;
    }
    return data;
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.usersTable).delete().eq('id', userId).select();
    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('User not found or delete not permitted');
    }
    return true;
  }

  public async checkUserPasswordIsValid(userId: string, password: string): Promise<boolean> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.usersTable).select('password').eq('id', userId).single();
    if (error) {
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, data.password);
    return isPasswordValid;
  }
}