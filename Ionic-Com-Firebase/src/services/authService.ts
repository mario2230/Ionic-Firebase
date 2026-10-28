import { auth } from "@/main";
import { db } from "@/main";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";

export interface perfil {
    nome: string,
    dt_nascimento: string,
    nickname: string,
    foto_url: string
}

function formatarDataNascimento(valor: unknown): string {
    if (valor instanceof Timestamp) {
        return valor.toDate().toISOString().slice(0, 10);
    }

    if (valor instanceof Date) {
        return Number.isNaN(valor.getTime()) ? "" : valor.toISOString().slice(0, 10);
    }

    if (typeof valor === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
        const data = new Date(valor);
        return Number.isNaN(data.getTime()) ? "" : data.toISOString().slice(0, 10);
    }

    return "";
}

export async function recuperarSenha(email: string) {
    await sendPasswordResetEmail(auth, email);
}

export async function buscarPerfil(uid: string): Promise<perfil | null> {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) return null;

    const dados = snapshot.data();
    return {
        nome: typeof dados.nome === "string" ? dados.nome : "",
        dt_nascimento: formatarDataNascimento(dados.dt_nascimento),
        nickname: typeof dados.nickname === "string" ? dados.nickname : "",
        foto_url: typeof dados.foto_url === "string" ? dados.foto_url : "",
    };
}

export async function salvarPerfil(uid: string, dados: perfil): Promise<void> {
    const userRef = doc(db, "users", uid);
    const dtNascimento = dados.dt_nascimento
        ? new Date(`${dados.dt_nascimento}T00:00:00.000Z`)
        : null;

    if (dtNascimento && Number.isNaN(dtNascimento.getTime())) {
        throw new Error("Informe uma data de nascimento válida.");
    }

    await setDoc(
        userRef,
        {
            ...dados,
            dt_nascimento: dtNascimento,
            atualizadoEm: serverTimestamp(),
        },
        { merge: true }
    );
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
