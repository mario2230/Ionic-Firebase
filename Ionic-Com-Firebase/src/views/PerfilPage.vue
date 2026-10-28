<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-grid class="profile-page">
        <ion-row class="page-heading ion-align-items-center">
          <ion-col>
            <ion-text class="eyebrow">SUA CONTA</ion-text>
            <ion-title class="page-title">Meu perfil</ion-title>
          </ion-col>
          <ion-col size="auto">
            <ion-button @click="deslogar" expand="block" fill="outline">
              <ion-icon name="log-out-outline" slot="start"></ion-icon>
              Deslogar
            </ion-button>
          </ion-col>
        </ion-row>

        <ion-card class="profile-card">
          <ion-card-content>
            <ion-grid class="profile-hero">
              <ion-row>
                <ion-col class="ion-text-center">
                  <ion-avatar class="avatar">
                    <ion-img
                      v-if="perfil.foto_url"
                      :src="perfil.foto_url"
                      alt="Foto de perfil"
                    ></ion-img>
                    <ion-text v-else class="avatar-placeholder">
                      {{ perfil.nome.charAt(0).toUpperCase() || "?" }}
                    </ion-text>
                  </ion-avatar>
                  <ion-title class="profile-name">{{ perfil.nome || "Seu nome" }}</ion-title>
                  <ion-text class="profile-nickname">
                    @{{ perfil.nickname || "seu apelido" }}
                  </ion-text>
                </ion-col>
              </ion-row>
            </ion-grid>

            <form @submit.prevent="concluirPreenchimento">
              <ion-list class="profile-details">
                <ion-item>
                  <ion-label position="stacked">Nome</ion-label>
                  <ion-input
                    v-model="perfil.nome"
                    name="nome"
                    type="text"
                    placeholder="Digite seu nome"
                    autocomplete="name"
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Apelido</ion-label>
                  <ion-input
                    v-model="perfil.nickname"
                    name="nickname"
                    type="text"
                    placeholder="Digite seu apelido"
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Data de nascimento</ion-label>
                  <ion-input
                    v-model="perfil.dt_nascimento"
                    name="dt_nascimento"
                    type="date"
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">URL da foto de perfil</ion-label>
                  <ion-input
                    v-model="perfil.foto_url"
                    name="foto_url"
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                  ></ion-input>
                </ion-item>
              </ion-list>

              <ion-text v-if="preenchimentoConcluido" class="form-message">
                Preenchimento concluído.
              </ion-text>

              <ion-button type="submit" expand="block">
                Concluir preenchimento
              </ion-button>
            </form>
          </ion-card-content>
        </ion-card>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/services/authService';
import { salvarPerfil } from '@/services/authService';
import { auth } from '@/main';

const router = useRouter();

const perfil = ref({
  nome: '',
  nickname: '',
  dt_nascimento: '',
  foto_url: '',
});
const preenchimentoConcluido = ref(false);
const user = auth.currentUser;


async function concluirPreenchimento() {
  if (!user) return;

  await salvarPerfil(user.uid, {
    ...perfil.value,
    dt_nascimento: new Date(perfil.value.dt_nascimento),
  });
  preenchimentoConcluido.value = true;

}

function deslogar() {
  logout();
  router.push('/tabs/login');
}
</script>
