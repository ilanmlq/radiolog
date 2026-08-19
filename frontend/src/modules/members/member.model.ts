import { AuditFields } from '@/modules/common.model'
import { Address } from '@/modules/common.model';

export type MemberID = string;
export type TeamID = string;
export type UserID = string;

export interface MemberSummary {
    id: MemberID;
    teamId: TeamID[];
    userId?: UserID;

    name: string;
    surnames: string[]

    email: string[];
    phone: string[];
    address?: Address;

    roleTitles: string[];
    teamName: string;
    isResponsable: boolean;
}

export interface Member extends MemberSummary, AuditFields {}

export interface CreateMemberDTO {
    teamId: string[];
    userId?: UserID;

    name: string;
    surnames: string[];

    email: string[];
    phone: string[];
    address?: Address;

    roleTitles: string[];
}

export interface UpdateMemberDTO {
    teamId: string[];
    userId?: UserID;

    name: string;
    surnames: string[];

    email: string[];
    phone: string[];
    address?: Address;

    roleTitles: string[];
}
