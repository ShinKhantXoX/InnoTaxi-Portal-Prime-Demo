import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Copy, Check, FileCode2 } from "lucide-react";

// ─── PrimeVue Code ───
export const vueTemplate = `<template>
  <div class="flex min-h-screen font-inter">
    <!-- Left Panel -->
    <div class="hidden lg:flex lg:w-[48%] relative min-h-screen
      bg-gradient-to-b from-[#d32f2f] via-[#e53935] to-[#ef5350]
      overflow-hidden flex-col justify-between p-12">
      <!-- decorative circles -->
      <div class="absolute top-[-80px] right-[80px] w-[360px] h-[360px] rounded-full border-[50px] border-white opacity-[0.06]" />
      <div class="absolute bottom-[-80px] left-[-80px] w-[480px] h-[480px] rounded-full border-[50px] border-white opacity-[0.06]" />

      <!-- Logo -->
      <div class="relative z-10 flex items-center gap-3">
        <img src="/logo.png" alt="InnoTaxi" class="w-11 h-11 rounded-[14px] shadow-lg object-cover" />
        <div>
          <p class="text-[22px] text-white"><span class="font-medium">Inno</span><span class="text-white/60">Taxi</span></p>
          <p class="text-[10px] tracking-[1.5px] uppercase text-white/40 font-medium">Admin Portal</p>
        </div>
      </div>

      <!-- Hero -->
      <div class="relative z-10 flex flex-col gap-6">
        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 w-fit">
          <div class="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
          <span class="text-[11px] text-white/70 font-medium">System Online</span>
        </div>
        <div>
          <h1 class="text-[40px] text-white font-medium leading-[48px]">Your ride,</h1>
          <h1 class="text-[40px] text-white/50 font-medium leading-[48px]">your way.</h1>
        </div>
        <p class="text-[14px] text-white/55 max-w-[330px]">
          Admin dashboard for managing fleet operations, drivers, passengers, and ride analytics.
        </p>
        <div class="flex gap-2.5 flex-wrap">
          <div v-for="f in features" :key="f.label"
            class="flex items-center gap-2 bg-white/15 border border-white/10 rounded-full px-4 py-2">
            <i :class="f.icon" class="text-[#fecaca] text-xs" />
            <span class="text-[12px] text-white/90 font-medium">{{ f.label }}</span>
          </div>
        </div>
      </div>

      <div class="relative z-10 flex items-center justify-between">
        <p class="text-[11px] text-white/30">© 2026 InnoTaxi Service</p>
      </div>
    </div>

    <!-- Right Panel – Login Form -->
    <div class="flex-1 flex items-center justify-center min-h-screen bg-[#f1f5f9] p-8">
      <div class="w-full max-w-[440px]">
        <div class="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-8">
          <div class="flex items-center gap-2.5 mb-4">
            <img src="/logo.png" alt="InnoTaxi" class="w-8 h-8 rounded-[10px] object-cover" />
            <p class="text-[11px] tracking-[0.88px] uppercase text-[#e53935] font-medium">Admin Portal</p>
          </div>
          <h2 class="text-[24px] text-[#0f172a] font-medium mb-1">Welcome back</h2>
          <p class="text-[13.5px] text-[#64748b] mb-8">Sign in to the InnoTaxi admin dashboard</p>

          <div class="flex flex-col gap-5">
            <!-- Email -->
            <div>
              <IconField>
                <InputIcon class="pi pi-envelope" />
                <InputText v-model="email" placeholder="Email Address"
                  :class="{'!border-red-500': errors.email && touched.email}"
                  class="w-full !h-[52px] !bg-[#f8fafc] !border-[#cbd5e1] !rounded-[10px]" />
              </IconField>
              <small v-if="errors.email && touched.email" class="text-red-500 text-xs mt-1 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-xs" /> {{ errors.email }}
              </small>
            </div>

            <!-- Password -->
            <div>
              <IconField>
                <InputIcon class="pi pi-lock" />
                <Password v-model="password" placeholder="Password" :feedback="false" toggleMask
                  :class="{'!border-red-500': errors.password && touched.password}"
                  inputClass="w-full !h-[52px] !bg-[#f8fafc] !border-[#cbd5e1] !rounded-[10px]"
                  class="w-full" @blur="touchField('password')" />
              </IconField>
              <small v-if="errors.password && touched.password" class="text-red-500 text-xs mt-1 flex items-center gap-1">
                <i class="pi pi-exclamation-circle text-xs" /> {{ errors.password }}
              </small>
              <div class="flex justify-end mt-1.5">
                <button class="text-[12px] text-[#e53935] font-medium hover:underline">Forgot password?</button>
              </div>
            </div>

            <!-- Checkbox -->
            <div class="flex items-center gap-2.5">
              <Checkbox v-model="keepSignedIn" inputId="keepSignedIn" :binary="true" />
              <label for="keepSignedIn" class="text-[13px] text-[#475569] font-medium cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            <!-- Sign In -->
            <PrimeButton label="Sign In" icon="pi pi-arrow-right" iconPos="right" @click="handleSignIn"
              class="!w-full !h-[46px] !bg-[#e53935] !border-[#e53935] !rounded-[10px] !font-medium" />
          </div>

          <Divider align="center" class="!my-5">
            <span class="text-[11px] tracking-[0.88px] uppercase text-[#94a3b8] font-medium">Demo Access</span>
          </Divider>

          <!-- Demo Credentials -->
          <div class="bg-[#fef2f2] rounded-[10px] border border-[rgba(254,202,202,0.6)] p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[12px] text-[#e53935] font-semibold">Demo Credentials</span>
              <PrimeButton label="Auto Fill" @click="handleAutoFill" size="small"
                class="!h-7 !bg-[#fef2f2] !border-[#fecaca] !text-[#e53935] !text-[11px]" />
            </div>
            <div class="bg-white/60 rounded-lg border border-[rgba(254,202,202,0.3)] px-3 py-2.5">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[11px] text-[#94a3b8] w-[58px]">Email</span>
                <code class="text-[12px] text-[#991b1b] font-mono">admin@innotaxi.com</code>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-[#94a3b8] w-[58px]">Password</span>
                <code class="text-[12px] text-[#991b1b] font-mono">admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>`;

export const vueScript = `<script setup>
import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import PrimeButton from 'primevue/button'
import Divider from 'primevue/divider'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

const email = ref('')
const password = ref('')
const keepSignedIn = ref(false)
const touched = ref({ email: false, password: false })

const features = [
  { icon: 'pi pi-map-marker', label: 'Live Tracking' },
  { icon: 'pi pi-clock', label: '24/7 Operations' },
  { icon: 'pi pi-shield', label: 'Secure Platform' },
]

const errors = computed(() => ({
  email: !email.value.trim()
    ? 'Email is required'
    : !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value)
      ? 'Please enter a valid email'
      : undefined,
  password: !password.value
    ? 'Password is required'
    : password.value.length < 6
      ? 'Password must be at least 6 characters'
      : undefined,
}))

const touchField = (field) => { touched.value[field] = true }

const handleAutoFill = () => {
  email.value = 'admin@innotaxi.com'
  password.value = 'admin123'
  touched.value = { email: false, password: false }
}

const handleSignIn = () => {
  touched.value = { email: true, password: true }
  if (errors.value.email || errors.value.password) return
  alert(\`Signing in: \${email.value}\`)
}
</script>`;

export const vueSetup = `// main.js
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import App from './App.vue'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: false }
  }
})
app.mount('#app')

// npm install primevue @primevue/themes primeicons`;

// ─── PrimeReact Code ───
export const reactComponent = `import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Mail, Eye, EyeOff, ArrowRight, AlertCircle, Info } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (v) => {
    if (!v.trim()) return 'Email is required';
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return 'Please enter a valid email';
    return undefined;
  };

  const validatePassword = (v) => {
    if (!v) return 'Password is required';
    if (v.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const handleSignIn = () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passErr });
    if (emailErr || passErr) return;
    alert(\`Signing in: \${email}\`);
  };

  const handleAutoFill = () => {
    setEmail('admin@innotaxi.com');
    setPassword('admin123');
    setErrors({});
    setTouched({});
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9] p-8">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <img src="/logo.png" alt="InnoTaxi" className="w-8 h-8 rounded-[10px]" />
            <p className="text-[11px] tracking-[0.88px] uppercase text-[#e53935] font-medium">
              Admin Portal
            </p>
          </div>
          <h2 className="text-[24px] text-[#0f172a] font-medium mb-1">Welcome back</h2>
          <p className="text-[13.5px] text-[#64748b] mb-8">
            Sign in to the InnoTaxi admin dashboard
          </p>

          <div className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <Mail className={\`w-4 h-4 \${errors.email && touched.email ? 'text-[#e53935]' : 'text-[#94a3b8]'}\`} />
                </span>
                <InputText value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => { setTouched(p => ({...p, email:true})); setErrors(p => ({...p, email: validateEmail(email)})) }}
                  placeholder="Email Address"
                  className={\`w-full !pl-10 !h-[52px] !bg-[#f8fafc] !rounded-[10px] \${
                    errors.email && touched.email ? '!border-[#e53935]' : '!border-[#cbd5e1]'
                  }\`}
                />
              </div>
              {errors.email && touched.email && (
                <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#e53935]" />
                  <span className="text-[12px] text-[#e53935]">{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <InputText type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => { setTouched(p => ({...p, password:true})); setErrors(p => ({...p, password: validatePassword(password)})) }}
                  placeholder="Password"
                  className={\`w-full !pl-10 !pr-10 !h-[52px] !bg-[#f8fafc] !rounded-[10px] \${
                    errors.password && touched.password ? '!border-[#e53935]' : '!border-[#cbd5e1]'
                  }\`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#e53935]" />
                  <span className="text-[12px] text-[#e53935]">{errors.password}</span>
                </div>
              )}
              <div className="flex justify-end mt-1.5">
                <button className="text-[12px] text-[#e53935] font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Checkbox & Sign In */}
            <div className="flex items-center gap-2.5">
              <Checkbox inputId="keepSignedIn" checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.checked)} />
              <label htmlFor="keepSignedIn" className="text-[13px] text-[#475569] font-medium cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            <Button label="Sign In" icon={<ArrowRight className="w-4 h-4 ml-2" />} iconPos="right"
              onClick={handleSignIn}
              className="!w-full !h-[46px] !bg-[#e53935] !border-[#e53935] !rounded-[10px] !font-medium" />
          </div>

          <Divider align="center" className="!my-5">
            <span className="text-[11px] tracking-[0.88px] uppercase text-[#94a3b8]">Demo Access</span>
          </Divider>

          {/* Demo Credentials */}
          <div className="bg-[#fef2f2] rounded-[10px] border border-[rgba(254,202,202,0.6)] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-[#e53935] font-semibold">Demo Credentials</span>
              <Button label="Auto Fill" onClick={handleAutoFill} size="small"
                className="!h-7 !bg-[#fef2f2] !border-[#fecaca] !text-[#e53935] !text-[11px]" />
            </div>
            <div className="bg-white/60 rounded-lg px-3 py-2.5">
              <p className="text-[11px] text-[#94a3b8]">Email: <code className="text-[#991b1b]">admin@innotaxi.com</code></p>
              <p className="text-[11px] text-[#94a3b8]">Password: <code className="text-[#991b1b]">admin123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`;

export const reactSetup = `// App.tsx
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { PrimeReactProvider } from 'primereact/api';
import { LeftPanel } from './components/LeftPanel';
import { LoginForm } from './components/LoginForm';

export default function App() {
  return (
    <PrimeReactProvider>
      <div className="flex min-h-screen font-['Inter',sans-serif]">
        <div className="hidden lg:block lg:w-[48%]">
          <LeftPanel />
        </div>
        <div className="flex-1">
          <LoginForm />
        </div>
      </div>
    </PrimeReactProvider>
  );
}

// npm install primereact primeicons lucide-react`;

// ─── PrimeNG (Angular) Code ───
export const angularTemplate = `<!-- login-page.component.html -->
<div class="flex min-h-screen font-inter">
  <!-- Left Panel -->
  <div class="hidden lg:flex lg:w-[48%] relative min-h-screen
    bg-gradient-to-b from-[#d32f2f] via-[#e53935] to-[#ef5350]
    overflow-hidden flex-col justify-between p-12">

    <div class="absolute top-[-80px] right-[80px] w-[360px] h-[360px] rounded-full border-[50px] border-white opacity-[0.06]"></div>
    <div class="absolute bottom-[-80px] left-[-80px] w-[480px] h-[480px] rounded-full border-[50px] border-white opacity-[0.06]"></div>

    <!-- Logo -->
    <div class="relative z-10 flex items-center gap-3">
      <img src="assets/logo.png" alt="InnoTaxi" class="w-11 h-11 rounded-[14px] shadow-lg object-cover" />
      <div>
        <p class="text-[22px] text-white"><span class="font-medium">Inno</span><span class="text-white/60">Taxi</span></p>
        <p class="text-[10px] tracking-[1.5px] uppercase text-white/40 font-medium">Admin Portal</p>
      </div>
    </div>

    <!-- Hero -->
    <div class="relative z-10 flex flex-col gap-6">
      <div class="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 w-fit">
        <div class="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></div>
        <span class="text-[11px] text-white/70 font-medium">System Online</span>
      </div>
      <div>
        <h1 class="text-[40px] text-white font-medium leading-[48px]">Your ride,</h1>
        <h1 class="text-[40px] text-white/50 font-medium leading-[48px]">your way.</h1>
      </div>
      <p class="text-[14px] text-white/55 max-w-[330px]">
        Admin dashboard for managing fleet operations, drivers, passengers, and ride analytics.
      </p>
      <div class="flex gap-2.5 flex-wrap">
        <div *ngFor="let f of features"
          class="flex items-center gap-2 bg-white/15 border border-white/10 rounded-full px-4 py-2">
          <i [class]="f.icon + ' text-[#fecaca] text-xs'"></i>
          <span class="text-[12px] text-white/90 font-medium">{{ f.label }}</span>
        </div>
      </div>
    </div>

    <div class="relative z-10">
      <p class="text-[11px] text-white/30">© 2026 InnoTaxi Service</p>
    </div>
  </div>

  <!-- Right Panel – Login Form -->
  <div class="flex-1 flex items-center justify-center min-h-screen bg-[#f1f5f9] p-8">
    <div class="w-full max-w-[440px]">
      <div class="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-8">
        <div class="flex items-center gap-2.5 mb-4">
          <img src="assets/logo.png" alt="InnoTaxi" class="w-8 h-8 rounded-[10px] object-cover" />
          <p class="text-[11px] tracking-[0.88px] uppercase text-[#e53935] font-medium">Admin Portal</p>
        </div>
        <h2 class="text-[24px] text-[#0f172a] font-medium mb-1">Welcome back</h2>
        <p class="text-[13.5px] text-[#64748b] mb-8">Sign in to the InnoTaxi admin dashboard</p>

        <form [formGroup]="loginForm" (ngSubmit)="handleSignIn()" class="flex flex-col gap-5">
          <!-- Email -->
          <div>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-envelope"></i>
              <input pInputText formControlName="email" placeholder="Email Address"
                [ngClass]="{'!border-red-500': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}"
                class="w-full !h-[52px] !bg-[#f8fafc] !border-[#cbd5e1] !rounded-[10px]" />
            </span>
            <small *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              class="text-red-500 text-xs mt-1 flex items-center gap-1">
              <i class="pi pi-exclamation-circle text-xs"></i>
              {{ loginForm.get('email')?.errors?.['required'] ? 'Email is required' : 'Please enter a valid email' }}
            </small>
          </div>

          <!-- Password -->
          <div>
            <span class="p-input-icon-left p-input-icon-right w-full">
              <i class="pi pi-lock"></i>
              <input pInputText [type]="showPassword ? 'text' : 'password'"
                formControlName="password" placeholder="Password"
                [ngClass]="{'!border-red-500': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}"
                class="w-full !h-[52px] !bg-[#f8fafc] !border-[#cbd5e1] !rounded-[10px]" />
              <i [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                (click)="showPassword = !showPassword" class="cursor-pointer"></i>
            </span>
            <small *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              class="text-red-500 text-xs mt-1 flex items-center gap-1">
              <i class="pi pi-exclamation-circle text-xs"></i>
              {{ loginForm.get('password')?.errors?.['required'] ? 'Password is required' : 'Min 6 characters' }}
            </small>
            <div class="flex justify-end mt-1.5">
              <button type="button" class="text-[12px] text-[#e53935] font-medium hover:underline">
                Forgot password?
              </button>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="flex items-center gap-2.5">
            <p-checkbox formControlName="keepSignedIn" [binary]="true" inputId="keepSignedIn"></p-checkbox>
            <label for="keepSignedIn" class="text-[13px] text-[#475569] font-medium cursor-pointer">
              Keep me signed in for 30 days
            </label>
          </div>

          <!-- Sign In -->
          <p-button label="Sign In" icon="pi pi-arrow-right" iconPos="right" type="submit"
            styleClass="!w-full !h-[46px] !bg-[#e53935] !border-[#e53935] !rounded-[10px] !font-medium">
          </p-button>
        </form>

        <p-divider align="center" styleClass="!my-5">
          <span class="text-[11px] tracking-[0.88px] uppercase text-[#94a3b8] font-medium">Demo Access</span>
        </p-divider>

        <!-- Demo Credentials -->
        <div class="bg-[#fef2f2] rounded-[10px] border border-[rgba(254,202,202,0.6)] p-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[12px] text-[#e53935] font-semibold">Demo Credentials</span>
            <p-button label="Auto Fill" (onClick)="handleAutoFill()" size="small"
              styleClass="!h-7 !bg-[#fef2f2] !border-[#fecaca] !text-[#e53935] !text-[11px]">
            </p-button>
          </div>
          <div class="bg-white/60 rounded-lg px-3 py-2.5">
            <p class="text-[11px] text-[#94a3b8]">Email: <code class="text-[#991b1b]">admin&#64;innotaxi.com</code></p>
            <p class="text-[11px] text-[#94a3b8]">Password: <code class="text-[#991b1b]">admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

export const angularComponent = `// login-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  showPassword = false;
  loginForm: FormGroup;

  features = [
    { icon: 'pi pi-map-marker', label: 'Live Tracking' },
    { icon: 'pi pi-clock', label: '24/7 Operations' },
    { icon: 'pi pi-shield', label: 'Secure Platform' },
  ];

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      keepSignedIn: [false],
    });
  }

  handleAutoFill() {
    this.loginForm.patchValue({
      email: 'admin@innotaxi.com',
      password: 'admin123',
    });
    this.loginForm.markAsUntouched();
  }

  handleSignIn() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    alert(\`Signing in: \${email}\`);
  }
}`;

export const angularSetup = `// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: false }
      }
    })
  ]
};

// Install dependencies:
// ng add primeng
// npm install primeicons @primeng/themes`;

// ─── Framework Definitions ───
export type FrameworkKey = "vue" | "react" | "angular";

interface FrameworkDef {
  key: FrameworkKey;
  name: string;
  subtitle: string;
  color: string;
  hoverColor: string;
  bgColor: string;
  gradientFrom: string;
  gradientTo: string;
  installCmd: string;
  tabs: { key: string; label: string; fileName: string; code: string }[];
}

const frameworks: Record<FrameworkKey, FrameworkDef> = {
  vue: {
    key: "vue",
    name: "PrimeVue",
    subtitle: "Vue 3 + PrimeVue 4 + Tailwind CSS",
    color: "#42b883",
    hoverColor: "#38a576",
    bgColor: "#f0fdf4",
    gradientFrom: "#42b883",
    gradientTo: "#35495e",
    installCmd: "npm install primevue @primevue/themes primeicons",
    tabs: [
      { key: "template", label: "Template", fileName: "LoginPage.vue", code: vueTemplate },
      { key: "script", label: "Script", fileName: "LoginPage.vue", code: vueScript },
      { key: "setup", label: "Setup", fileName: "main.js", code: vueSetup },
    ],
  },
  react: {
    key: "react",
    name: "PrimeReact",
    subtitle: "React 18 + PrimeReact 10 + Tailwind CSS",
    color: "#61dafb",
    hoverColor: "#4fc3e0",
    bgColor: "#f0f9ff",
    gradientFrom: "#61dafb",
    gradientTo: "#282c34",
    installCmd: "npm install primereact primeicons lucide-react",
    tabs: [
      { key: "component", label: "Component", fileName: "LoginForm.tsx", code: reactComponent },
      { key: "setup", label: "Setup", fileName: "App.tsx", code: reactSetup },
    ],
  },
  angular: {
    key: "angular",
    name: "PrimeNG",
    subtitle: "Angular 17+ + PrimeNG 17 + Tailwind CSS",
    color: "#DD0031",
    hoverColor: "#c3002f",
    bgColor: "#fef2f2",
    gradientFrom: "#DD0031",
    gradientTo: "#c3002f",
    installCmd: "ng add primeng && npm install @primeng/themes primeicons",
    tabs: [
      { key: "template", label: "Template", fileName: "login-page.component.html", code: angularTemplate },
      { key: "component", label: "Component", fileName: "login-page.component.ts", code: angularComponent },
      { key: "setup", label: "Setup", fileName: "app.config.ts", code: angularSetup },
    ],
  },
};

interface CodePreviewDialogProps {
  visible: boolean;
  onHide: () => void;
  initialFramework?: FrameworkKey;
}

export function CodePreviewDialog({ visible, onHide, initialFramework = "vue" }: CodePreviewDialogProps) {
  const [activeFramework, setActiveFramework] = useState<FrameworkKey>(initialFramework);
  const [activeTabKey, setActiveTabKey] = useState<string>("template");
  const [copied, setCopied] = useState(false);

  const fw = frameworks[activeFramework];
  const activeTabs = fw.tabs;
  const activeTab = activeTabs.find((t) => t.key === activeTabKey) ?? activeTabs[0];

  useEffect(() => {
    setActiveFramework(initialFramework);
  }, [initialFramework]);

  useEffect(() => {
    setActiveTabKey(fw.tabs[0].key);
    setCopied(false);
  }, [activeFramework]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    const all = fw.tabs.map((t) => `// --- ${t.fileName} ---\n${t.code}`).join("\n\n");
    handleCopy(all);
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${fw.gradientFrom}, ${fw.gradientTo})` }}
          >
            <FileCode2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[15px] text-[#0f172a]">{fw.name} Code Preview</span>
            <p className="text-[11px] text-[#94a3b8] mt-0.5">{fw.subtitle}</p>
          </div>
        </div>
      }
      visible={visible}
      onHide={onHide}
      modal
      dismissableMask
      draggable={false}
      className="!w-[90vw] !max-w-[820px]"
      contentClassName="!p-0"
      headerClassName="!px-5 !py-4 !border-b !border-[#e2e8f0]"
    >
      <div className="flex flex-col">
        {/* Framework Switcher */}
        <div className="flex items-center gap-2 px-4 pt-4">
          {(Object.values(frameworks) as FrameworkDef[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFramework(f.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[12px] font-medium transition-all cursor-pointer border ${
                activeFramework === f.key
                  ? "text-white shadow-sm"
                  : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#cbd5e1]"
              }`}
              style={
                activeFramework === f.key
                  ? { backgroundColor: f.color, borderColor: f.color }
                  : undefined
              }
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeFramework === f.key ? "white" : f.color }}
              />
              {f.name}
            </button>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-0">
          <div className="flex gap-1 bg-[#f1f5f9] rounded-lg p-1">
            {activeTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTabKey(tab.key); setCopied(false); }}
                className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer ${
                  activeTabKey === tab.key
                    ? "bg-white text-[#0f172a] shadow-sm"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleCopy(activeTab.code)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#0f172a] transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Tab"}
            </button>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white transition-all cursor-pointer"
              style={{ backgroundColor: fw.color }}
            >
              <Copy className="w-3.5 h-3.5" />
              Copy All
            </button>
          </div>
        </div>

        {/* File name indicator */}
        <div className="px-4 pt-2.5 pb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-md text-[11px] text-[#64748b] font-mono">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fw.color }} />
            {activeTab.fileName}
          </span>
        </div>

        {/* Code block */}
        <div className="px-4 pb-4 pt-1">
          <div className="relative bg-[#0f172a] rounded-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/70" />
            </div>
            <pre className="overflow-auto max-h-[50vh] p-4 text-[12.5px] leading-[20px]">
              <code className="text-[#e2e8f0] font-mono whitespace-pre">{activeTab.code}</code>
            </pre>
          </div>
        </div>

        {/* Info bar */}
        <div className="px-4 pb-4">
          <div
            className="flex items-start gap-2.5 border rounded-lg px-3.5 py-2.5"
            style={{ backgroundColor: fw.bgColor, borderColor: `${fw.color}33` }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: fw.color }}
            >
              <Check className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-[12px] font-medium" style={{ color: fw.gradientTo }}>
                Ready to use with {fw.name}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: `${fw.color}cc` }}>
                Install with:{" "}
                <code
                  className="px-1 rounded text-[10px]"
                  style={{ backgroundColor: `${fw.color}15` }}
                >
                  {fw.installCmd}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}