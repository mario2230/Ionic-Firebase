<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Recuperar senha</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <main class="recovery-container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Esqueceu sua senha?</ion-card-title>
            <ion-card-subtitle>
              Informe seu e-mail para receber um link de recuperação.
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="enviarLinkRecuperacao">
              <ion-item>
                <ion-label position="stacked">E-mail</ion-label>
                <ion-input
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="seu@email.com"
                  :disabled="isLoading"
                  required
                />
              </ion-item>

              <ion-note v-if="error" class="message" color="danger" role="alert">
                {{ error }}
              </ion-note>
              <ion-note v-if="success" class="message" color="success" role="status">
                {{ success }}
              </ion-note>

              <div class="actions">
                <ion-button
                  type="submit"
                  expand="block"
                  :disabled="isLoading || !email.trim()"
                >
                  <ion-spinner v-if="isLoading" name="crescent" />
                  <template v-else>Enviar link de recuperação</template>
                </ion-button>

                <ion-button
                  type="button"
                  expand="block"
                  fill="clear"
                  :disabled="isLoading"
                  @click="voltarParaLogin"
                >
                  Voltar para o login
                </ion-button>
              </div>
            </form>
          </ion-card-content>
        </ion-card>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonButton,
  IonSpinner,
} from '@ionic/vue';
import { recuperarSenha } from '@/services/authService';

const router = useRouter();
const email = ref('');
const isLoading = ref(false);
const error = ref('');
const success = ref('');

async function enviarLinkRecuperacao() {
  error.value = '';
  success.value = '';
  isLoading.value = true;

  try {
    await recuperarSenha(email.value.trim());
    success.value = 'Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha.';
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : 'Não foi possível enviar o link de recuperação.';
  } finally {
    isLoading.value = false;
  }
}

function voltarParaLogin() {
  router.push('/tabs/login');
}
</script>

<style scoped>
.recovery-container {
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
}

ion-card {
  width: 100%;
  max-width: 440px;
}

.message {
  display: block;
  margin: 12px 0;
}

.actions {
  margin-top: 20px;
}
</style>
