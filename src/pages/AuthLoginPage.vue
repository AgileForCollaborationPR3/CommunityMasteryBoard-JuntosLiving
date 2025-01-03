<script setup>
import { login } from '../utils/firebaseAuth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthCommunityStore } from '../stores/auth-community-store';
import { useFormErrors } from '../utils/formErrors';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthCommunityStore();

const formData = ref({
  email: '',
  password: '',
});

const loading = ref(false);

const { handleServerError, realtimeErrors, handleLoginForm } = useFormErrors();

const debounceFormValidation = () => {
  clearTimeout(debounceFormValidation.timer);
  debounceFormValidation.timer = setTimeout(() => {
    handleLoginForm(formData.value);
  }, 1000);
};

const signin = async () => {
  try {
    loading.value = true;

    // Attempt login
    await login(formData.value);

    // Update session and fetch user profile
    await authStore.getSession();

    // Redirect user based on their state
    if (authStore.profile?.currentCommunityId) {
      router.push('/board'); // Redirect to board if active community is set
    } else {
      router.push('/community'); // Redirect to community setup if no active community
    }

    $q.notify({ type: 'positive', message: 'Login successful!' });
  } catch (error) {
    console.error('Login error:', error.message);
    $q.notify({ type: 'negative', message: error.message || 'An error occurred during login.' });
    handleServerError(error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="q-pa-lg flex flex-center min-h-90vh">
    <q-card class="q-pa-md" style="max-width: 400px; width: 100%;">
      <q-card-section>
        <div class="text-center">
          <div class="text-h5">Login</div>
          <div class="text-subtitle1">Access your account</div>
        </div>
      </q-card-section>

      <q-card-section class="q-mt-md">
        <q-btn class="full-width q-mb-md" color="primary" flat label="Login with Google"
          @click="() => $q.notify({ type: 'info', message: 'Google login not implemented yet.' })" />
        <div class="text-center text-caption q-my-md">Or</div>

        <q-form @submit.prevent="signin">
          <q-input v-model="formData.email" type="email" label="Email" placeholder="youremail@example.com" outlined
            dense class="q-mb-md" required :error="realtimeErrors?.email?.length > 0" @input="debounceFormValidation" />
          <ul class="text-red-500 text-caption" v-if="realtimeErrors?.email?.length">
            <li v-for="error in realtimeErrors.email" :key="error">{{ error }}</li>
          </ul>

          <q-input v-model="formData.password" type="password" label="Password" placeholder="••••••••" outlined dense
            class="q-mb-md" required :error="realtimeErrors?.password?.length > 0" @input="debounceFormValidation" />
          <ul class="text-red-500 text-caption" v-if="realtimeErrors?.password?.length">
            <li v-for="error in realtimeErrors.password" :key="error">{{ error }}</li>
          </ul>

          <q-btn type="submit" :loading="loading" label="Login" color="primary" class="full-width">
            <template v-if="loading" #loading>
              <q-spinner-dots size="sm" color="white" />
            </template>
          </q-btn>
        </q-form>

        <div class="text-caption text-center q-mt-md">
          Don't have an account?
          <router-link to="/register" class="text-primary">Register</router-link>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
