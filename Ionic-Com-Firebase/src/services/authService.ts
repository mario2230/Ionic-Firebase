import { auth } from "@/main";
import { db } from "@/main";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export interface perfil {
    nome: string,
    dt_nascimento: Date,
    nickname: string,
    foto_url: string
}

export async function salvarPerfil(uid: string, dados: perfil): Promise<void> {
    const userRef = doc(db, "users", uid );

    await setDoc (
        userRef,
        {
            ...dados,
            atualizadoEm: serverTimestamp(),
        },
        { merge: true }
    )
}

export async function cadastrar(email:string, senha: string) {
    const credential  = await createUserWithEmailAndPassword(auth, email, senha);

    return credential.user;
}

export function login(email: string, senha: string) {
    return signInWithEmailAndPassword(auth, email, senha);
}

export function logout() {
    return signOut(auth);
}


export async  function atualizarPerfil(displayName: string) {
    const user = auth.currentUser;
    if(!user) throw new Error('Usuário não autenticado');
    await updateProfile(user, { displayName });
}


export function atualizarSenha(novaSenha: string) {
    const user = auth.currentUser;
    if(!user) throw new Error('Usuário não autenticado');
    return updatePassword(user, novaSenha);
}

