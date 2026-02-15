import { inject, Injectable } from "@angular/core";
import { SignJWT } from "jose";
import { AuthAccessToken, AuthAdminSession, AuthParticipantSession } from "@models/auth/auth.type";
import { environment } from "@environments/environment";
import { SupabaseService } from "@services/supabase.service";
import { GetPollParticipant } from "@models/polls/poll-participants.type";
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class AuthController {
  private readonly supabase = inject(SupabaseService);
  private readonly pollParticipantsTable = 'poll_participants';
  private readonly pollsTable = 'polls';
  private readonly usersTable = 'users';

  public async loginAdmin(email: string, password: string): Promise<AuthAccessToken> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.usersTable).select('*').eq('email', email).maybeSingle();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days;
    const authAdminSession: AuthAdminSession = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      status: data.status,
      avatar: data.avatar,
      role: data.role,
      workspace_id: data.workspace_id,
      expires_at: expiresAt,
    };

    const secret = new TextEncoder().encode(environment.jwtSecret);
    const accessToken = await new SignJWT(authAdminSession as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(new Date(expiresAt).getTime() / 1000)
      .setIssuedAt(new Date().getTime() / 1000)
      .sign(secret);

    return {
      access_token: accessToken,
    };
  }

  public async loginParticipants(rfidNumber: string, code: string): Promise<AuthAccessToken> {
    const supabase = await this.supabase.supabaseClient();
    const { data: participantData, error } = await supabase.from(this.pollParticipantsTable).select('*').eq('rfid_number', rfidNumber).maybeSingle();
    if (error) {
      throw error;
    }

    if (!participantData) {
      throw new Error('Invalid RFID number or code');
    }

    const { data: pollData, error: pollError } = await supabase.from(this.pollsTable).select('*').eq('code', code).maybeSingle();
    if (pollError) {
      throw pollError;
    }

    if (!pollData) {
      throw new Error('Invalid RFID number or code');
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString();
    const authParticipantSession: AuthParticipantSession = {
      poll_participant_id: participantData.id,
      poll_participant_status: participantData.poll_status,
      name: participantData.name,
      department: participantData.department,
      code: code,
      poll_id: pollData.id,
      expires_at: expiresAt,
    };

    const secret = new TextEncoder().encode(environment.jwtSecret);
    const accessToken = await new SignJWT(authParticipantSession as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(new Date(expiresAt).getTime() / 1000)
      .setIssuedAt(new Date().getTime() / 1000)
      .sign(secret);

    return {
      access_token: accessToken,
    };
  }
  
  public async getPollParticipant(pollParticipantId: string): Promise<GetPollParticipant> {
    const supabase = await this.supabase.supabaseClient();
    const { data, error } = await supabase.from(this.pollParticipantsTable).select('*').eq('id', pollParticipantId).single();
    if (error) {
      throw error;
    }
    return data;
  }
}