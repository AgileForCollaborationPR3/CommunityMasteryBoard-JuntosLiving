<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

// Form data
const email = ref("");
const password = ref("");

// Login handler
const handleLogin = () => {
  if (!email.value || !password.value) {
    $q.notify({
      type: "negative",
      message: "Please fill in all required fields.",
    });
    return;
  }

  // Simulate authentication (replace with real API call)
  if (
    email.value === "johndoe19@example.com" &&
    password.value === "password123"
  ) {
    $q.notify({
      type: "positive",
      message: "Login successful!",
    });
    router.push("/dashboard"); // Redirect after successful login
  } else {
    $q.notify({
      type: "negative",
      message: "Invalid email or password.",
    });
  }
};
</script>

<template>
  <div class="q-pa-lg flex flex-center min-h-90vh">
    <q-card class="q-pa-md" style="max-width: 400px; width: 100%">
      <q-card-section>
        <div class="text-center">
          <div class="text-h5">Login</div>
          <div class="text-subtitle1">Login to your account</div>
        </div>
      </q-card-section>

      <q-card-section class="q-mt-md">
        <q-btn
          class="full-width q-mb-md"
          color="primary"
          flat
          label="Register with Google"
          @click="
            () =>
              $q.notify({
                type: 'info',
                message: 'Google login not implemented.',
              })
          "
        />
        <div class="text-center text-caption q-my-md">Or</div>

        <q-form @submit.prevent="handleLogin">
          <q-input
            v-model="email"
            type="email"
            label="Email"
            placeholder="johndoe19@example.com"
            outlined
            dense
            class="q-mb-md"
            required
          />
          <q-input
            v-model="password"
            type="password"
            label="Password"
            outlined
            dense
            class="q-mb-md"
            required
          >
            <template #after>
              <q-btn
                flat
                dense
                size="sm"
                label="Forgot?"
                @click="
                  () =>
                    $q.notify({
                      type: 'info',
                      message: 'Forgot password not implemented.',
                    })
                "
              />
            </template>
          </q-input>
          <q-btn
            type="submit"
            label="Login"
            color="primary"
            class="full-width"
          />
        </q-form>
      </q-card-section>

      <q-card-section>
        <div class="text-center text-caption q-mt-md">
          Don't have an account?
          <router-link to="/register" class="text-primary">
            Register
          </router-link>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
