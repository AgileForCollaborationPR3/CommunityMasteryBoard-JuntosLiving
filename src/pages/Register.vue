<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

// Form data
const username = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Registration handler
const handleRegister = () => {
  if (
    !username.value ||
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    $q.notify({
      type: "negative",
      message: "Please fill in all required fields.",
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    $q.notify({
      type: "negative",
      message: "Passwords do not match.",
    });
    return;
  }

  // Simulate API call (replace with actual implementation)
  $q.notify({
    type: "positive",
    message: "Registration successful! Redirecting to login...",
  });

  setTimeout(() => {
    router.push("/login");
  }, 1500);
};
</script>

<template>
  <div class="q-pa-lg flex flex-center min-h-90vh">
    <q-card class="q-pa-md" style="max-width: 400px; width: 100%">
      <q-card-section>
        <div class="text-center">
          <div class="text-h5">Register</div>
          <div class="text-subtitle1">Create a new account</div>
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
                message: 'Google registration not implemented.',
              })
          "
        />
        <div class="text-center text-caption q-my-md">Or</div>

        <q-form @submit.prevent="handleRegister">
          <q-input
            v-model="username"
            label="Username"
            placeholder="johndoe19"
            outlined
            dense
            class="q-mb-md"
            required
          />
          <div class="row q-col-gutter-sm q-mb-md">
            <q-input
              v-model="firstName"
              label="First Name"
              placeholder="John"
              outlined
              dense
              class="col"
              required
            />
            <q-input
              v-model="lastName"
              label="Last Name"
              placeholder="Doe"
              outlined
              dense
              class="col"
              required
            />
          </div>
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
            placeholder="*****"
            outlined
            dense
            class="q-mb-md"
            required
          />
          <q-input
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="*****"
            outlined
            dense
            class="q-mb-md"
            required
          />
          <q-btn
            type="submit"
            label="Register"
            color="primary"
            class="full-width"
          />
        </q-form>
      </q-card-section>

      <q-card-section>
        <div class="text-center text-caption q-mt-md">
          Already have an account?
          <router-link to="/login" class="text-primary"> Login </router-link>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
