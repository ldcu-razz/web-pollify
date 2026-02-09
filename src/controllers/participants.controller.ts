import { inject, Injectable } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { SupabaseService } from "@services/supabase.service";
import { GetParticipantsPagination, GetParticipant, PostParticipants, PatchParticipants, BulkPostParticipants, GetParticipantsFilter } from "@models/participants/participants.type";
import { GetGroup, PatchGroup } from "@models/groups/groups.type";

@Injectable({
  providedIn: 'root',
})
export class ParticipantsController {
  private readonly supabaseService = inject(SupabaseService);
  private readonly participantsTable = 'participants';

  public async getGroupDetails(groupId: string): Promise<GetGroup> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from('groups').select('*,workspace:workspace_id(id,name)').eq('id', groupId).single();

    if (error) {
      throw error;
    }

    return data;
  }

  public async updateGroupDetails(groupId: string, payload: PatchGroup): Promise<GetGroup> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from('groups').update(payload).eq('id', groupId).select('*,workspace:workspace_id(id,name)').single();

    if (error) {
      throw error;
    }

    return data;
  }

  public async getParticipants(pagination: Pagination, filters: GetParticipantsFilter, groupId: string): Promise<GetParticipantsPagination> {
    const supabase = await this.supabaseService.supabaseClient();

    const query = filters.q ?? null;

    const getParticipantsQuery = supabase.from(this.participantsTable).select('*,workspace:workspace_id(id,name),group:group_id(id,name)')
      .eq('group_id', groupId)
      .range((pagination.page - 1) * pagination.limit, (pagination.page * pagination.limit) - 1);

    if (query) {
      getParticipantsQuery.filter('name', 'ilike', `%${query}%`);
    }

    const { data, error } = await getParticipantsQuery;

    if (error) {
      throw error;
    }

    const countQuery = supabase.from(this.participantsTable).select('*', { count: 'exact' }).eq('group_id', groupId);

    if (query) {
      countQuery.filter('name', 'ilike', `%${query}%`);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw countError;
    }

    const response: GetParticipantsPagination = {
      data: data,
      page: pagination.page,
      limit: pagination.limit,
      total: count ?? 0,
    }
    
    return response;
  }

  public async getAllParticipants(groupId: string): Promise<GetParticipant[]> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from(this.participantsTable).select('*,workspace:workspace_id(id,name),group:group_id(id,name)').eq('group_id', groupId);

    if (error) {
      throw error;
    }
    return data;
  }

  public async getParticipant(participantId: string): Promise<GetParticipant> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from(this.participantsTable).select('*,workspace:workspace_id(id,name),group:group_id(id,name)')
      .eq('id', participantId).single();

    if (error) {
      throw error;
    }

    return data;
  }

  public async createParticipant(payload: PostParticipants): Promise<GetParticipant> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from(this.participantsTable).insert(payload).select('*,workspace:workspace_id(id,name),group:group_id(id,name)')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  public async bulkCreateParticipants(payload: BulkPostParticipants, groupId: string): Promise<GetParticipant[]> {
    const supabase = await this.supabaseService.supabaseClient();

    const { data: participantsData, error: participantsError } = await supabase.from('participants').select('id, rfid_number').eq('group_id', groupId);
    if (participantsError) {
      throw participantsError;
    }
    const participantsDataRFID = participantsData.map((participant) => participant.rfid_number);
    const nonExistingParticipantsPayload = payload.filter((participant) => !participantsDataRFID.includes(participant.rfid_number));


    const { data, error } = await supabase.from(this.participantsTable).insert(nonExistingParticipantsPayload).select('*,workspace:workspace_id(id,name),group:group_id(id,name)');

    if (error) {
      throw error;
    }

    return data;
  }

  public async updateParticipant(participantId: string, payload: PatchParticipants): Promise<GetParticipant> {
    const supabase = await this.supabaseService.supabaseClient();
    const { data, error } = await supabase.from(this.participantsTable).update(payload).eq('id', participantId).select('*,workspace:workspace_id(id,name),group:group_id(id,name)')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  public async deleteParticipant(participantId: string): Promise<boolean> {
    const supabase = await this.supabaseService.supabaseClient();
    const { error } = await supabase.from(this.participantsTable).delete().eq('id', participantId);

    if (error) {
      throw error;
    }

    return true;
  }

  public async deleteBulkParticipants(participantIds: string[]): Promise<boolean> {
    const supabase = await this.supabaseService.supabaseClient();
    const { error } = await supabase.from(this.participantsTable).delete().in('id', participantIds);

    if (error) {
      throw error;
    }

    return true;
  }
}