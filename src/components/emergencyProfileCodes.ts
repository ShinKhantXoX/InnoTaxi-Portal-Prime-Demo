// ─── Emergency Profiles — Frontend Preview Codes ───

// ─── React (PrimeReact) — Table ───
export const emergencyReactTableCode = `// EmergencyProfileTable.tsx — PrimeReact DataTable
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';

interface EmergencyProfile {
  id: number;
  driver_id: number | null;
  customer_id: number | null;
  driver_name: string | null;
  customer_name: string | null;
  contact_name: string;
  prefix: string;
  phone_number: string;
  relationship: string;
  status: 'UNDER_REVIEW' | 'REJECT' | 'APPROVE';
  created_at: string;
}

const RELATIONSHIP_OPTIONS = [
  { label: 'All Relationships', value: '' },
  { label: 'Spouse', value: 'SPOUSE' },
  { label: 'Parent', value: 'PARENT' },
  { label: 'Sibling', value: 'SIBLING' },
  { label: 'Child', value: 'CHILD' },
  { label: 'Friend', value: 'FRIEND' },
  { label: 'Other', value: 'OTHER' },
];

const PREFIX_OPTIONS = [
  { label: '+95', value: '+95' },
  { label: '+66', value: '+66' },
  { label: '+1', value: '+1' },
  { label: '+44', value: '+44' },
  { label: '+81', value: '+81' },
];

export default function EmergencyProfileTable() {
  const [profiles, setProfiles] = useState<EmergencyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [selectedRelationship]);

  const fetchProfiles = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: '1', limit: '20' });
    if (selectedRelationship) params.append('relationship', selectedRelationship);
    const res = await fetch(\`/api/v1/emergency-profiles?\${params}\`);
    const json = await res.json();
    setProfiles(json.data);
    setLoading(false);
  };

  const statusTemplate = (row: EmergencyProfile) => {
    const severity = row.status === 'APPROVE' ? 'success' : row.status === 'REJECT' ? 'danger' : 'warn';
    return <Tag value={row.status} severity={severity} rounded />;
  };

  const phoneTemplate = (row: EmergencyProfile) => (
    <span className="font-mono text-sm">
      {row.prefix} {row.phone_number}
    </span>
  );

  const relationshipTemplate = (row: EmergencyProfile) => {
    const colors: Record<string, string> = {
      SPOUSE: '#e53935', PARENT: '#2196f3', SIBLING: '#4caf50',
      CHILD: '#ff9800', FRIEND: '#9c27b0', OTHER: '#607d8b',
    };
    return (
      <Tag
        value={row.relationship}
        style={{ backgroundColor: colors[row.relationship] + '20', color: colors[row.relationship] }}
        rounded
      />
    );
  };

  const header = (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search contacts..."
          />
        </span>
        <Dropdown
          value={selectedRelationship}
          options={RELATIONSHIP_OPTIONS}
          onChange={(e) => setSelectedRelationship(e.value)}
          placeholder="Filter by relationship"
        />
      </div>
      <Button label="Add Emergency Contact" icon="pi pi-plus" severity="danger" />
    </div>
  );

  return (
    <DataTable
      value={profiles}
      loading={loading}
      header={header}
      globalFilter={globalFilter}
      paginator rows={10}
      rowsPerPageOptions={[10, 20, 50]}
      emptyMessage="No emergency contacts found"
      stripedRows
    >
      <Column header="Owner" body={(row: EmergencyProfile) => row.driver_name || row.customer_name || '—'} sortable />
      <Column field="contact_name" header="Contact Name" sortable />
      <Column field="relationship" header="Relationship" body={relationshipTemplate} sortable />
      <Column header="Phone Number" body={phoneTemplate} />
      <Column field="status" header="Status" body={statusTemplate} sortable />
      <Column field="created_at" header="Created" sortable />
    </DataTable>
  );
}`;

// ─── Vue (PrimeVue) — Table ───
export const emergencyVueTableCode = `<!-- EmergencyProfileTable.vue — PrimeVue DataTable -->
<template>
  <DataTable
    :value="profiles"
    :loading="loading"
    :globalFilterFields="['contact_name', 'driver_name', 'relationship']"
    v-model:filters="filters"
    paginator
    :rows="10"
    :rowsPerPageOptions="[10, 20, 50]"
    stripedRows
  >
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters.global.value" placeholder="Search contacts..." />
          </IconField>
          <Dropdown
            v-model="selectedRelationship"
            :options="relationshipOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Filter by relationship"
          />
        </div>
        <Button label="Add Emergency Contact" icon="pi pi-plus" severity="danger" />
      </div>
    </template>

    <Column header="Owner">
      <template #body="{ data }">
        {{ data.driver_name || data.customer_name || '—' }}
      </template>
    </Column>
    <Column field="contact_name" header="Contact Name" sortable />
    <Column field="relationship" header="Relationship" sortable>
      <template #body="{ data }">
        <Tag :value="data.relationship" :style="getRelationshipStyle(data.relationship)" rounded />
      </template>
    </Column>
    <Column header="Phone Number">
      <template #body="{ data }">
        <span class="font-mono text-sm">{{ data.prefix }} {{ data.phone_number }}</span>
      </template>
    </Column>
    <Column field="status" header="Status" sortable>
      <template #body="{ data }">
        <Tag :value="data.status" :severity="data.status === 'APPROVE' ? 'success' : data.status === 'REJECT' ? 'danger' : 'warn'" rounded />
      </template>
    </Column>
    <Column field="created_at" header="Created" sortable />
  </DataTable>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

const profiles = ref([]);
const loading = ref(true);
const selectedRelationship = ref('');
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

const relationshipOptions = [
  { label: 'All Relationships', value: '' },
  { label: 'Spouse', value: 'SPOUSE' },
  { label: 'Parent', value: 'PARENT' },
  { label: 'Sibling', value: 'SIBLING' },
  { label: 'Child', value: 'CHILD' },
  { label: 'Friend', value: 'FRIEND' },
  { label: 'Other', value: 'OTHER' },
];

const relationshipColors = {
  SPOUSE: '#e53935', PARENT: '#2196f3', SIBLING: '#4caf50',
  CHILD: '#ff9800', FRIEND: '#9c27b0', OTHER: '#607d8b',
};

const getRelationshipStyle = (rel: string) => ({
  backgroundColor: (relationshipColors[rel] || '#607d8b') + '20',
  color: relationshipColors[rel] || '#607d8b',
});

const fetchProfiles = async () => {
  loading.value = true;
  const params = new URLSearchParams({ page: '1', limit: '20' });
  if (selectedRelationship.value) params.append('relationship', selectedRelationship.value);
  const res = await fetch(\`/api/v1/emergency-profiles?\${params}\`);
  const json = await res.json();
  profiles.value = json.data;
  loading.value = false;
};

watch(selectedRelationship, fetchProfiles);
onMounted(fetchProfiles);
</script>`;

// ─── Angular (PrimeAngular) — Table ───
export const emergencyAngularTableCode = `// emergency-profile-table.component.ts — PrimeNG DataTable
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

interface EmergencyProfile {
  id: number;
  driver_id: number | null;
  customer_id: number | null;
  driver_name: string | null;
  customer_name: string | null;
  contact_name: string;
  prefix: string;
  phone_number: string;
  relationship: string;
  status: 'UNDER_REVIEW' | 'REJECT' | 'APPROVE';
  created_at: string;
}

@Component({
  selector: 'app-emergency-profile-table',
  standalone: true,
  imports: [TableModule, TagModule, InputTextModule, DropdownModule, ButtonModule],
  template: \`
    <p-table
      [value]="profiles"
      [loading]="loading"
      [paginator]="true"
      [rows]="10"
      [rowsPerPageOptions]="[10, 20, 50]"
      [globalFilterFields]="['contact_name', 'driver_name', 'customer_name', 'relationship']"
      [stripedRows]="true"
    >
      <ng-template pTemplate="header">
        <tr>
          <th>Owner</th>
          <th pSortableColumn="contact_name">Contact Name <p-sortIcon field="contact_name" /></th>
          <th pSortableColumn="relationship">Relationship <p-sortIcon field="relationship" /></th>
          <th>Phone Number</th>
          <th pSortableColumn="status">Status <p-sortIcon field="status" /></th>
          <th pSortableColumn="created_at">Created <p-sortIcon field="created_at" /></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-profile>
        <tr>
          <td>{{ profile.driver_name || profile.customer_name || '—' }}</td>
          <td>{{ profile.contact_name }}</td>
          <td>
            <p-tag [value]="profile.relationship"
              [style]="getRelationshipStyle(profile.relationship)"
              [rounded]="true" />
          </td>
          <td><span class="font-mono text-sm">{{ profile.prefix }} {{ profile.phone_number }}</span></td>
          <td>
            <p-tag [value]="profile.status"
              [severity]="profile.status === 'APPROVE' ? 'success' : profile.status === 'REJECT' ? 'danger' : 'warn'"
              [rounded]="true" />
          </td>
          <td>{{ profile.created_at }}</td>
        </tr>
      </ng-template>
    </p-table>
  \`
})
export class EmergencyProfileTableComponent implements OnInit {
  profiles: EmergencyProfile[] = [];
  loading = true;
  selectedRelationship = '';

  relationshipColors: Record<string, string> = {
    SPOUSE: '#e53935', PARENT: '#2196f3', SIBLING: '#4caf50',
    CHILD: '#ff9800', FRIEND: '#9c27b0', OTHER: '#607d8b',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.fetchProfiles(); }

  fetchProfiles(): void {
    this.loading = true;
    let params = new HttpParams().set('page', '1').set('limit', '20');
    if (this.selectedRelationship) params = params.set('relationship', this.selectedRelationship);
    this.http.get<any>('/api/v1/emergency-profiles', { params }).subscribe(res => {
      this.profiles = res.data;
      this.loading = false;
    });
  }

  getRelationshipStyle(rel: string) {
    const color = this.relationshipColors[rel] || '#607d8b';
    return { backgroundColor: color + '20', color };
  }
}`;

// ─── React (PrimeReact) — Create Form ───
export const emergencyReactFormCode = `// EmergencyProfileForm.tsx — PrimeReact Create/Edit Form
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

interface EmergencyProfileForm {
  contact_name: string;
  prefix: string;
  phone_number: string;
  relationship: string;
}

const RELATIONSHIP_OPTIONS = [
  { label: 'Spouse', value: 'SPOUSE' },
  { label: 'Parent', value: 'PARENT' },
  { label: 'Sibling', value: 'SIBLING' },
  { label: 'Child', value: 'CHILD' },
  { label: 'Friend', value: 'FRIEND' },
  { label: 'Other', value: 'OTHER' },
];

const PREFIX_OPTIONS = [
  { label: '🇲🇲 +95 (Myanmar)', value: '+95' },
  { label: '🇹🇭 +66 (Thailand)', value: '+66' },
  { label: '🇺🇸 +1 (USA)', value: '+1' },
  { label: '🇬🇧 +44 (UK)', value: '+44' },
  { label: '🇯🇵 +81 (Japan)', value: '+81' },
  { label: '🇸🇬 +65 (Singapore)', value: '+65' },
  { label: '🇲🇾 +60 (Malaysia)', value: '+60' },
];

interface Props {
  driverId: number;
  onSuccess?: () => void;
}

export default function EmergencyProfileForm({ driverId, onSuccess }: Props) {
  const [form, setForm] = useState<EmergencyProfileForm>({
    contact_name: '',
    prefix: '+95',
    phone_number: '',
    relationship: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.contact_name.trim()) newErrors.contact_name = 'Contact name is required';
    if (!form.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!/^[0-9]{6,15}$/.test(form.phone_number)) newErrors.phone_number = 'Invalid phone number format';
    if (!form.relationship) newErrors.relationship = 'Relationship is required';
    if (!form.prefix) newErrors.prefix = 'Country prefix is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/emergency-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: driverId, ...form }),
      });
      if (!res.ok) throw new Error('Failed to create');
      setSuccess(true);
      setTimeout(() => onSuccess?.(), 1500);
    } catch {
      setErrors({ submit: 'Failed to create emergency contact' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add Emergency Contact" subTitle="Required: contact name, relationship, and phone number with prefix">
      {success && <Message severity="success" text="Emergency contact created successfully!" className="mb-4 w-full" />}
      {errors.submit && <Message severity="error" text={errors.submit} className="mb-4 w-full" />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Contact Name *</label>
          <InputText
            value={form.contact_name}
            onChange={(e) => setForm(prev => ({ ...prev, contact_name: e.target.value }))}
            placeholder="Enter contact person's full name"
            className={errors.contact_name ? 'p-invalid' : ''}
          />
          {errors.contact_name && <small className="p-error">{errors.contact_name}</small>}
        </div>

        {/* Relationship */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Relationship *</label>
          <Dropdown
            value={form.relationship}
            options={RELATIONSHIP_OPTIONS}
            onChange={(e) => setForm(prev => ({ ...prev, relationship: e.value }))}
            placeholder="Select relationship"
            className={errors.relationship ? 'p-invalid' : ''}
          />
          {errors.relationship && <small className="p-error">{errors.relationship}</small>}
        </div>

        {/* Prefix */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Country Prefix *</label>
          <Dropdown
            value={form.prefix}
            options={PREFIX_OPTIONS}
            onChange={(e) => setForm(prev => ({ ...prev, prefix: e.value }))}
            placeholder="Select country code"
            className={errors.prefix ? 'p-invalid' : ''}
          />
          {errors.prefix && <small className="p-error">{errors.prefix}</small>}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Phone Number *</label>
          <InputText
            value={form.phone_number}
            onChange={(e) => setForm(prev => ({ ...prev, phone_number: e.target.value }))}
            placeholder="e.g. 912345678"
            keyfilter="pint"
            className={errors.phone_number ? 'p-invalid' : ''}
          />
          {errors.phone_number && <small className="p-error">{errors.phone_number}</small>}
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-2">
        <Button label="Cancel" severity="secondary" outlined />
        <Button label="Save Emergency Contact" icon="pi pi-check" severity="danger" loading={loading} onClick={handleSubmit} />
      </div>
    </Card>
  );
}`;

// ─── Vue (PrimeVue) — Create Form ───
export const emergencyVueFormCode = `<!-- EmergencyProfileForm.vue — PrimeVue Create/Edit Form -->
<template>
  <Card>
    <template #title>Add Emergency Contact</template>
    <template #subtitle>Required: contact name, relationship, and phone number with prefix</template>
    <template #content>
      <Message v-if="success" severity="success" class="mb-4 w-full">Emergency contact created successfully!</Message>
      <Message v-if="errors.submit" severity="error" class="mb-4 w-full">{{ errors.submit }}</Message>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Contact Name *</label>
          <InputText v-model="form.contact_name" placeholder="Enter contact person's full name" :class="{ 'p-invalid': errors.contact_name }" />
          <small v-if="errors.contact_name" class="p-error">{{ errors.contact_name }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Relationship *</label>
          <Dropdown v-model="form.relationship" :options="relationshipOptions" optionLabel="label" optionValue="value"
            placeholder="Select relationship" :class="{ 'p-invalid': errors.relationship }" />
          <small v-if="errors.relationship" class="p-error">{{ errors.relationship }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Country Prefix *</label>
          <Dropdown v-model="form.prefix" :options="prefixOptions" optionLabel="label" optionValue="value"
            placeholder="Select country code" :class="{ 'p-invalid': errors.prefix }" />
          <small v-if="errors.prefix" class="p-error">{{ errors.prefix }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Phone Number *</label>
          <InputText v-model="form.phone_number" placeholder="e.g. 912345678" :class="{ 'p-invalid': errors.phone_number }" />
          <small v-if="errors.phone_number" class="p-error">{{ errors.phone_number }}</small>
        </div>
      </div>

      <div class="flex justify-end mt-6 gap-2">
        <Button label="Cancel" severity="secondary" outlined />
        <Button label="Save Emergency Contact" icon="pi pi-check" severity="danger" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const props = defineProps<{ driverId: number }>();
const emit = defineEmits(['success']);

const form = reactive({ contact_name: '', prefix: '+95', phone_number: '', relationship: '' });
const errors = reactive<Record<string, string>>({});
const loading = ref(false);
const success = ref(false);

const relationshipOptions = [
  { label: 'Spouse', value: 'SPOUSE' }, { label: 'Parent', value: 'PARENT' },
  { label: 'Sibling', value: 'SIBLING' }, { label: 'Child', value: 'CHILD' },
  { label: 'Friend', value: 'FRIEND' }, { label: 'Other', value: 'OTHER' },
];

const prefixOptions = [
  { label: '+95 (Myanmar)', value: '+95' }, { label: '+66 (Thailand)', value: '+66' },
  { label: '+1 (USA)', value: '+1' }, { label: '+44 (UK)', value: '+44' },
  { label: '+81 (Japan)', value: '+81' },
];

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (!form.contact_name.trim()) errors.contact_name = 'Contact name is required';
  if (!form.phone_number.trim()) errors.phone_number = 'Phone number is required';
  if (!form.relationship) errors.relationship = 'Relationship is required';
  return Object.keys(errors).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;
  loading.value = true;
  try {
    await fetch('/api/v1/emergency-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id: props.driverId, ...form }),
    });
    success.value = true;
    setTimeout(() => emit('success'), 1500);
  } catch { errors.submit = 'Failed to create emergency contact'; }
  finally { loading.value = false; }
};
</script>`;

// ─── Angular (PrimeAngular) — Create Form ───
export const emergencyAngularFormCode = `// emergency-profile-form.component.ts — PrimeNG Create/Edit Form
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-emergency-profile-form',
  standalone: true,
  imports: [FormsModule, CardModule, InputTextModule, DropdownModule, ButtonModule, MessageModule],
  template: \`
    <p-card header="Add Emergency Contact" subheader="Required: contact name, relationship, and phone number with prefix">
      <p-message *ngIf="success" severity="success" text="Emergency contact created!" styleClass="mb-4 w-full" />
      <p-message *ngIf="errors['submit']" severity="error" [text]="errors['submit']" styleClass="mb-4 w-full" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Contact Name *</label>
          <input pInputText [(ngModel)]="form.contact_name" placeholder="Full name" [ngClass]="{'p-invalid': errors['contact_name']}" />
          <small *ngIf="errors['contact_name']" class="p-error">{{ errors['contact_name'] }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Relationship *</label>
          <p-dropdown [(ngModel)]="form.relationship" [options]="relationshipOptions" optionLabel="label" optionValue="value"
            placeholder="Select relationship" [ngClass]="{'p-invalid': errors['relationship']}" />
          <small *ngIf="errors['relationship']" class="p-error">{{ errors['relationship'] }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Country Prefix *</label>
          <p-dropdown [(ngModel)]="form.prefix" [options]="prefixOptions" optionLabel="label" optionValue="value"
            placeholder="Select country code" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium">Phone Number *</label>
          <input pInputText [(ngModel)]="form.phone_number" placeholder="e.g. 912345678" [ngClass]="{'p-invalid': errors['phone_number']}" />
          <small *ngIf="errors['phone_number']" class="p-error">{{ errors['phone_number'] }}</small>
        </div>
      </div>

      <div class="flex justify-end mt-6 gap-2">
        <p-button label="Cancel" severity="secondary" [outlined]="true" />
        <p-button label="Save Emergency Contact" icon="pi pi-check" severity="danger" [loading]="loading" (onClick)="handleSubmit()" />
      </div>
    </p-card>
  \`
})
export class EmergencyProfileFormComponent {
  @Input() driverId!: number;
  @Output() onSuccess = new EventEmitter<void>();

  form = { contact_name: '', prefix: '+95', phone_number: '', relationship: '' };
  errors: Record<string, string> = {};
  loading = false;
  success = false;

  relationshipOptions = [
    { label: 'Spouse', value: 'SPOUSE' }, { label: 'Parent', value: 'PARENT' },
    { label: 'Sibling', value: 'SIBLING' }, { label: 'Child', value: 'CHILD' },
    { label: 'Friend', value: 'FRIEND' }, { label: 'Other', value: 'OTHER' },
  ];

  prefixOptions = [
    { label: '+95 (Myanmar)', value: '+95' }, { label: '+66 (Thailand)', value: '+66' },
    { label: '+1 (USA)', value: '+1' }, { label: '+44 (UK)', value: '+44' },
  ];

  constructor(private http: HttpClient) {}

  handleSubmit(): void {
    this.errors = {};
    if (!this.form.contact_name.trim()) this.errors['contact_name'] = 'Contact name is required';
    if (!this.form.phone_number.trim()) this.errors['phone_number'] = 'Phone number is required';
    if (!this.form.relationship) this.errors['relationship'] = 'Relationship is required';
    if (Object.keys(this.errors).length > 0) return;

    this.loading = true;
    this.http.post('/api/v1/emergency-profiles', { driver_id: this.driverId, ...this.form }).subscribe({
      next: () => { this.success = true; setTimeout(() => this.onSuccess.emit(), 1500); },
      error: () => { this.errors['submit'] = 'Failed to create emergency contact'; },
      complete: () => { this.loading = false; },
    });
  }
}`;