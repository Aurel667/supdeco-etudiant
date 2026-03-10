export interface LoginPayload { email?: string; email_ecole?: string; password: string; plateforme?: string; device_type?: string; }
export interface AuthResponse { token: string; user: import('./user.interface').User; }

export interface UserInfo {
    actived_at: true, 
    coordonnees: null | any, 
    created_at: string, 
    deleted_at: null | string, 
    email: string, 
    email_ecole: string, 
    first_login: number, 
    first_login_etudiant: boolean, 
    id: number, 
    is_en_ligne: boolean, 
    last_login_at: string, 
    last_login_ip_address: string, 
    last_notified_at: null | string, 
    matricule: string, 
    matricule_etudiant: string, 
    mot_de_passe_email: string, 
    nom_user: null | string, 
    pics: string, 
    plateformes: null | any, 
    prenom_user: null | string, 
    role: {created_at: string, id: number, libelle_role: string, updated_at: string}, 
    role_id: number, 
    role_names: null | any, 
    roles: [], 
    token: string, 
    updated_at: string
}

export interface ForgotPasswordRequest {
  identifier: string
  user_type?: 'etudiant' | 'enseignant'
}