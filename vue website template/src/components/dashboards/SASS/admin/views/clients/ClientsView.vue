<!-- components/dashboards/SASS/admin/views/clients/ClientsView.vue -->
<template>
  <div id="clients-view" href="#clients-view" class="view" ref="clientsRef">
    <div id="view-header" href="#view-header" class="view-header">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <p class="page-subtitle">{{ pageSubtitle }}</p>
    </div>

    <div
      id="clients-content"
      href="#clients-content"
      class="content"
      ref="clientsRef"
    >
      <!-- Actions de la vue -->
      <div id="actions-bar" href="#actions-bar" class="actions-bar">
        <button @click="openCreateModal" class="btn btn-primary">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nouveau client
        </button>

        <div id="filters" class="filters">
          <select v-model="selectedFilter" class="filter-select">
            <option value="all">Tous les clients</option>
            <option value="Active">Actifs</option>
            <option value="Inactive">Inactifs</option>
          </select>
        </div>
      </div>

      <div id="table-container" href="#table-container" class="table-container">
        <!-- Tableau des clients -->
        <DataTable
          id="clients-table"
          href="#clients-table"
          :headers="headers"
          :items="filteredClients"
          :show-actions="true"
          :actions="[{ name: 'edit', handler: editClient }]"
          @sort="handleSort"
        />
      </div>
    </div>
  </div>

  <!-- Modale de création/édition -->
  <FormModal
    v-model:show="showClientModal"
    :title="clientForm.id ? 'Modifier client' : 'Nouveau client'"
    v-bind="clientForm"
    submit-text="Enregistrer"
    cancel-text="Annuler"
    @submit="saveClient"
    @cancel="closeClientModal"
  >
    <div id="client-form" class="flex items-start max-w-8xl w-full">
      <!-- Navigation latérale -->
      <div class="form-nav">
        <!-- Identité -->
        <div
          class="mb-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
        >
          Identité
        </div>
        <div
          class="form-nav-item"
          :class="{ active: clientForm.currentPage === 'personal' }"
          @click="clientForm.currentPage = 'personal'"
        >
          <svg
            class="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Informations personnelles
        </div>

        <!-- Entreprise -->
        <div
          class="mt-4 mb-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
        >
          Entreprise
        </div>
        <div
          class="form-nav-item"
          :class="{ active: clientForm.currentPage === 'company' }"
          @click="clientForm.currentPage = 'company'"
        >
          <svg
            class="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Fiche entreprise
        </div>
        <div
          class="form-nav-item"
          :class="{ active: clientForm.currentPage === 'email' }"
          @click="clientForm.currentPage = 'email'"
        >
          <svg
            class="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Email & Téléphones
        </div>
        <div
          class="form-nav-item"
          :class="{ active: clientForm.currentPage === 'address' }"
          @click="clientForm.currentPage = 'address'"
        >
          <svg
            class="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Adresse
        </div>

        <!-- Facturation -->
        <div
          class="mt-4 mb-2 ml-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
        >
          Abonnement
        </div>
        <div
          class="form-nav-item"
          :class="{ active: clientForm.currentPage === 'billing' }"
          @click="clientForm.currentPage = 'billing'"
        >
          <svg
            class="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Facturation
        </div>
        <div
          class="form-nav-item"
          :class="{ active: clientForm.currentPage === 'billing-adresse' }"
          @click="clientForm.currentPage = 'billing-adresse'"
        >
          <svg
            class="w-5 h-5 mr-2 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Addresse
        </div>
      </div>

      <!-- Contenu des pages -->
      <div class="form-content">
        <!-- Page Informations -->
        <div
          class="form-page"
          :class="{ active: clientForm.currentPage === 'personal' }"
        >
          <div class="form-group">
            <label class="form-label">Civilité</label>
            <select v-model="clientForm.civility" class="form-select">
              <option value="M.">M.</option>
              <option value="Mme">Mme</option>
              <option value="Mlle">Mlle</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Prénom</label>
            <input
              v-model="clientForm.firstName"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Nom</label>
            <input
              v-model="clientForm.lastName"
              type="text"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Date du premier contact</label>
            <input
              v-model="clientForm.firstContactDate"
              type="date"
              class="form-input"
            />
          </div>
        </div>

        <!-- Page Fiche entreprise -->
        <div
          class="form-page"
          :class="{ active: clientForm.currentPage === 'company' }"
        >
          <div class="form-group">
            <label class="form-label">Société</label>
            <input
              v-model="clientForm.companyName"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Secteur d'activité</label>
            <input
              v-model="clientForm.businessSector"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Taille de l'entreprise</label>
            <select v-model="clientForm.companySize" class="form-select">
              <option value="Small">Petite (1-10 employés)</option>
              <option value="Medium">Moyenne (11-50 employés)</option>
              <option value="Large">Grande (50+ employés)</option>
            </select>
          </div>
        </div>

        <!-- Page Email & Téléphones -->
        <div
          class="form-page"
          :class="{ active: clientForm.currentPage === 'email' }"
        >
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              v-model="clientForm.email"
              type="email"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Téléphone principal</label>
            <input
              v-model="clientForm.phones[0]"
              type="tel"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Téléphone secondaire</label>
            <input
              v-model="clientForm.phones[1]"
              type="tel"
              class="form-input"
              placeholder="Optionnel"
            />
          </div>
        </div>

        <!-- Page Adresse -->
        <div
          class="form-page"
          :class="{ active: clientForm.currentPage === 'address' }"
        >
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input
              v-model="clientForm.address.street"
              type="text"
              class="form-input"
              placeholder="Rue"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Code postal</label>
            <input
              v-model="clientForm.address.zip"
              type="text"
              class="form-input"
              placeholder="Code postal"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Ville</label>
            <input
              v-model="clientForm.address.city"
              type="text"
              class="form-input"
              placeholder="Ville"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Pays</label>
            <input
              v-model="clientForm.address.country"
              type="text"
              class="form-input"
              placeholder="Pays"
            />
          </div>
        </div>

        <!-- Page Facturation -->
        <div
          class="form-page"
          :class="{ active: clientForm.currentPage === 'billing' }"
        >
          <div class="form-group">
            <label class="form-label">Plan</label>
            <select v-model="clientForm.plan" class="form-select">
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Nombre d'utilisateurs</label>
            <input
              v-model="clientForm.users"
              type="number"
              class="form-input"
              min="0"
            />
          </div>
          <div class="form-group"></div>
        </div>
        <div
          class="form-page"
          :class="{ active: clientForm.currentPage === 'billing-adresse' }"
        >
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input
              v-model="clientForm.facturationAddresse.street"
              type="text"
              class="form-input"
              placeholder="Rue"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Code postal</label>
            <input
              v-model="clientForm.facturationAddresse.zip"
              type="text"
              class="form-input"
              placeholder="Code postal"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Ville</label>
            <input
              v-model="clientForm.facturationAddresse.city"
              type="text"
              class="form-input"
              placeholder="Ville"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Pays</label>
            <input
              v-model="clientForm.facturationAddresse.country"
              type="text"
              class="form-input"
              placeholder="Pays"
            />
          </div>
        </div>
      </div>
    </div>
  </FormModal>

  <!-- Modale de confirmation de suppression -->
  <ConfirmModal
    v-model:show="showDeleteModal"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    title="Confirmer la suppression"
    message="Êtes-vous sûr de vouloir supprimer ce client ?"
    type="danger"
    confirm-text="Supprimer"
    cancel-text="Annuler"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import DataTable from "@/components/common/ui/tables/DataTable.vue";
import ConfirmModal from "@/components/common/ui/modals/ConfirmModal.vue";
import FormModal from "@/components/common/ui/modals/FormModal.vue";
import { useView } from "@/components/dashboards/SASS/admin/composables/useView";
import { formatDateForInput, parseDateFromInput } from "@/utils/dateFormatter";
import { TableItem } from "@/components/common/ui/tables/types/types";
import { AdminView } from "@/components/dashboards/SASS/admin/types/admin";
import { useClients } from "@/components/dashboards/SASS/admin/composables/useClients";

// Utilisation du composable useView
const { animateViewEnter } = useView([AdminView.CLIENTS]);

const { clients, loadBillingData, updateClient, createClient } = useClients();

// Page info
const pageTitle = ref("Clients");
const pageSubtitle = ref("Gestion des clients");

const clientsRef = ref<HTMLElement | null>(null);

// State
const showClientModal = ref(false);
const showDeleteModal = ref(false);
const clientToDelete = ref<any>(null);
const searchQuery = ref("");
const selectedFilter = ref("all");
const sortBy = ref("name");
const sortDesc = ref(false);

const clientForm = ref({
  id: null as number | null,
  civility: "M.",
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phones: [],
  address: {
    street: "",
    zip: "",
    city: "",
    country: "",
  },
  facturationAddresse: {
    street: "",
    zip: "",
    city: "",
    country: "",
  },
  businessSector: "",
  companySize: "",
  status: "",
  nextPayment: formatDateForInput(new Date()),
  firstContactDate: formatDateForInput(new Date()),
  plan: "Standard",
  users: 0,
  currentPage: "personal",
});

// En-têtes du tableau
const headers = ref([
  {
    text: "Civilité",
    value: "civility",
    sortable: true,
  },
  {
    text: "Prénom",
    value: "firstName",
    sortable: true,
  },
  {
    text: "Nom",
    value: "lastName",
    sortable: true,
  },
  {
    text: "Société",
    value: "companyName",
    sortable: true,
  },
  {
    text: "Email",
    value: "email",
    sortable: true,
  },
  {
    text: "Statut",
    value: "status",
    sortable: true,
    formatter: (value: string) => {
      return value === "Actif" ? "Actif" : "Inactif";
    },
    class: (value: string) => {
      return value === "Active"
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400";
    },
  },
  {
    text: "Plan",
    value: "plan",
    sortable: true,
  },
  {
    text: "Utilisateurs",
    value: "users",
    sortable: true,
  },
  // {
  //   text: "Dernière activité",
  //   value: "lastActivity",
  //   sortable: true,
  //   formatter: (value: Date) => {
  //     return formatDate(value);
  //   },
  // },
]);

// Clients filtrés et triés
const filteredClients = computed(() => {
  let result = [...clients.value];

  // Filtre par statut
  if (selectedFilter.value !== "all") {
    result = result.filter((client) => client.status === selectedFilter.value);
  }

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (client) =>
        client.firstName.toLowerCase().includes(query) ||
        client.lastName.toLowerCase().includes(query) ||
        client.company.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.facturationAddresse.toLowerCase().includes(query) ||
        client.phones.toLowerCase().includes(query) ||
        client.businessSector.toLowerCase().includes(query) ||
        client.companySize.toLowerCase().includes(query) ||
        client.firstContactDate.toLowerCase().includes(query) ||
        client.plan.toLowerCase().includes(query) ||
        client.users.toLowerCase().includes(query) ||
        client.status.toLowerCase().includes(query)
    );
  }

  // Tri
  result.sort((a, b) => {
    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];

    if (aValue < bValue) return sortDesc.value ? 1 : -1;
    if (aValue > bValue) return sortDesc.value ? -1 : 1;
    return 0;
  });

  return result;
});

const handleSort = ({ sortBy: field, sortDesc: desc }: any) => {
  sortBy.value = field;
  sortDesc.value = desc;
};

const openCreateModal = () => {
  clientForm.value = {
    id: null as number | null,
    civility: "M.",
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    phones: [],
    address: {
      street: "",
      zip: "",
      city: "",
      country: "",
    },
    facturationAddresse: {
      street: "",
      zip: "",
      city: "",
      country: "",
    },
    businessSector: "",
    companySize: "",
    firstContactDate: formatDateForInput(new Date()),
    plan: "Standard",
    users: 0,
    currentPage: "personal",
  };

  showClientModal.value = true;
};

const editClient = async (client: TableItem) => {
  console.log("client editing: ", client);
  clientForm.value = {
    id: client.id,
    civility: client.civility,
    firstName: client.firstName,
    lastName: client.lastName,
    companyName: client.companyName,
    email: client.email,
    phones: client.phones,
    address: client.address,
    facturationAddresse: client.facturationAddresse,
    businessSector: client.businessSector,
    companySize: client.companySize,
    firstContactDate: formatDateForInput(client.firstContactDate),
    plan: client.plan,
    users: client.users,
    currentPage: "personal", // Réinitialisation à la page par défaut
  };
  showClientModal.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  const scrollto = document.getElementById("form-modal");
  if (scrollto) {
    scrollto.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const saveClient = async () => {
  const client = clientForm.value;
  console.log("client saving: ", client);
  if (client.id) {
    // Édition
    const index = clients.value.findIndex((c) => c.id === client.id);
    if (index !== -1) {
      clients.value[index] = { ...client };
      clients.value[index].firstContactDate = parseDateFromInput(
        client.firstContactDate
      );
    }
    await updateClient(client);
  } else {
    // Création
    client.id = Math.max(...clients.value.map((c) => c.id), 0) + 1;
    clients.value.unshift({ ...client });
    clients.value[clients.value.length - 1].firstContactDate =
      parseDateFromInput(client.firstContactDate);
  }
  await createClient(client);
  closeClientModal();
};

const closeClientModal = () => {
  showClientModal.value = false;
};

const confirmDelete = () => {
  if (clientToDelete.value) {
    clients.value = clients.value.filter(
      (client) => client.id !== clientToDelete.value.id
    );
  }
  showDeleteModal.value = false;
  clientToDelete.value = null;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  clientToDelete.value = null;
};

// Lifecycle
onMounted(async () => {
  await loadBillingData()
  .then(async () => {
    if (clientsRef.value) {
      animateViewEnter(clientsRef.value);
    }
    await nextTick();
  })  
  .catch((error) => {
    console.error("Error loading clients data:", error);
  });
});
</script>

<style scoped>
@import "tailwindcss";

/* Styles du formulaire */
.form-container {
  @apply min-w-[900px] max-w-6xl w-full;
}

.dark .form-container {
  @apply bg-gray-800;
}

.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.dark .form-label {
  @apply text-gray-300;
}

.form-input,
.form-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md 
         bg-white text-gray-900 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
         transition-all duration-200;
}

.dark .form-input,
.dark .form-select {
  @apply border-gray-600 bg-gray-700 text-white;
}

.form-input:focus,
.form-select:focus {
  @apply ring-2 ring-blue-500 border-transparent;
}

.form-actions {
  @apply flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200;
}

.dark .form-actions {
  @apply border-gray-700;
}

/* Styles multi-pages formulaire */
.form-nav {
  @apply w-[220px] min-w-[220px] pr-4;
}

.form-nav-item {
  @apply px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors;
  @apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.form-nav-item.active {
  @apply bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300;
}

.form-content {
  @apply pl-6 pr-4 flex-1;
}

.form-page {
  @apply space-y-4;
  display: none;
}

.form-page.active {
  display: block;
}

.form-grid {
  @apply grid grid-cols-2 gap-6;
}
</style>
