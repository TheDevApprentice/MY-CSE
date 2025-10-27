<template>
  <div class="tables-test-view">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Tables originales -->
      <div class="space-y-8">
        <!-- DataTable Card -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
        >
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
            @click="isBasicDataTableCollapsed = !isBasicDataTableCollapsed"
          >
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                Tableau Basique
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-300">
                Affichage simple des données
              </p>
            </div>
            <svg
              class="w-6 h-6 text-gray-500 transition-transform duration-200"
              :class="{ 'transform rotate-180': isBasicDataTableCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div class="p-6" v-if="!isBasicDataTableCollapsed">
            <DataTable
              :headers="mockTableData.headers"
              :items="mockTableData.items"
              :theme="isDark ? 'dark' : 'light'"
              :show-actions="false"
              :actions="[]"
              :lazy-loading="false"
              @row-click="handleDataClick"
              class="rounded-lg overflow-hidden"
            />
          </div>
        </div>

        <!-- SortableTable Card -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
        >
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
            @click="isSortableTableCollapsed = !isSortableTableCollapsed"
          >
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                Tableau Triable
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-300">
                Triez les colonnes par ordre croissant/décroissant
              </p>
            </div>
            <svg
              class="w-6 h-6 text-gray-500 transition-transform duration-200"
              :class="{ 'transform rotate-180': isSortableTableCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div class="p-6" v-if="!isSortableTableCollapsed">
            <SortableTable
              :headers="mockTableData.headers"
              :items="mockTableData.items"
              :theme="isDark ? 'dark' : 'light'"
              :show-actions="false"
              :actions="[]"
              :lazy-loading="false"
              :initial-sort="{ key: 'name', order: 'asc' }"
              @sort-change="handleSortChange"
              @row-click="handleDataClick"
              class="rounded-lg overflow-hidden"
            />
          </div>
        </div>

        <!-- PaginatedTable Card -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
        >
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
            @click="isPaginatedTableCollapsed = !isPaginatedTableCollapsed"
          >
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                Tableau Paginé
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-300">
                Navigation par pages de 10 éléments
              </p>
            </div>
            <svg
              class="w-6 h-6 text-gray-500 transition-transform duration-200"
              :class="{ 'transform rotate-180': isPaginatedTableCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div class="p-6" v-if="!isPaginatedTableCollapsed">
            <PaginatedTable
              :headers="mockTableData.headers"
              :items="mockTableData.items"
              :theme="isDark ? 'dark' : 'light'"
              :show-actions="false"
              :actions="[]"
              :lazy-loading="false"
              :items-per-page="10"
              :show-page-controls="true"
              @update:page="handlePageChange"
              @row-click="handleDataClick"
            />
          </div>
        </div>
      </div>

      <!-- Nouvelles tables avec lazy loading -->
      <div class="space-y-8">
        <!-- DataTable Lazy Card -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
        >
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
            @click="isDataTableLazyCollapsed = !isDataTableLazyCollapsed"
          >
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                Tableau Basique (Lazy Loading)
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-300">
                Chargement progressif des données (50 initiaux + 20 par chunk)
              </p>
            </div>
            <svg
              class="w-6 h-6 text-gray-500 transition-transform duration-200"
              :class="{ 'transform rotate-180': isDataTableLazyCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div class="p-6" v-if="!isDataTableLazyCollapsed">
            <DataTable
              :headers="mockTableData.headers"
              :items="largeDataset"
              :theme="isDark ? 'dark' : 'light'"
              :show-actions="false"
              :actions="[]"
              :lazy-loading="true"
              :initial-load="50"
              :chunk-size="20"
              @row-click="handleDataClick"
              @load-more="handleLoadMore"
              class="rounded-lg overflow-hidden"
            />
          </div>
        </div>

        <!-- SortableTable Lazy Card -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
        >
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
            @click="
              isSortableTableLazyCollapsed = !isSortableTableLazyCollapsed
            "
          >
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                Tableau Triable (Lazy Loading)
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-300">
                Tri avec chargement progressif (50 initiaux + 20 par chunk)
              </p>
            </div>
            <svg
              class="w-6 h-6 text-gray-500 transition-transform duration-200"
              :class="{ 'transform rotate-180': isSortableTableLazyCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div class="p-6" v-if="!isSortableTableLazyCollapsed">
            <SortableTable
              :headers="mockTableData.headers"
              :items="largeDataset"
              :theme="isDark ? 'dark' : 'light'"
              :show-actions="false"
              :actions="[]"
              :lazy-loading="true"
              :initial-load="50"
              :chunk-size="20"
              @row-click="handleDataClick"
              @sort-change="handleSortChange"
              @load-more="handleLoadMore"
              class="rounded-lg overflow-hidden"
            />
          </div>
        </div>

        <!-- PaginatedTable Lazy Card -->
        <div
          class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
        >
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
            @click="
              isPaginatedTableLazyCollapsed = !isPaginatedTableLazyCollapsed
            "
          >
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                Tableau Paginé (Lazy Loading)
              </h3>
              <p class="mt-1 text-gray-600 dark:text-gray-300">
                Chargement par pages (100 initiaux + 30 par page)
              </p>
            </div>
            <svg
              class="w-6 h-6 text-gray-500 transition-transform duration-200"
              :class="{ 'transform rotate-180': isPaginatedTableLazyCollapsed }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div class="p-6" v-if="!isPaginatedTableLazyCollapsed">
            <PaginatedTable
              :headers="mockTableData.headers"
              :items="largeDataset"
              :theme="isDark ? 'dark' : 'light'"
              :show-actions="false"
              :actions="[]"
              :lazy-loading="true"
              :initial-load="100"
              :chunk-size="30"
              :items-per-page="30"
              :show-page-controls="true"
              :show-items-per-page-selector="true"
              @update:page="handleLazyPageChange"
              @row-click="handleDataClick"
              @update:items-per-page="handleItemsPerPageChange"
              class="rounded-lg overflow-hidden"
            />
          </div>
        </div>
      </div>

      <!-- Nouvelle section pour tester les actions -->
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
      >
        <div
          class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
          @click="isActionsTableCollapsed = !isActionsTableCollapsed"
        >
          <div>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
              Tableau avec Actions
            </h3>
            <p class="mt-1 text-gray-600 dark:text-gray-300">
              Boutons d'actions intégrés
            </p>
          </div>
          <svg
            class="w-6 h-6 text-gray-500 transition-transform duration-200"
            :class="{ 'transform rotate-180': isActionsTableCollapsed }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div class="p-6" v-if="!isActionsTableCollapsed">
          <DataTable
            :headers="mockTableData.headers"
            :items="mockTableData.items"
            :theme="isDark ? 'dark' : 'light'"
            :show-actions="true"
            :actions="[
              { name: 'edit', handler: handleEdit },
              { name: 'delete', handler: handleDelete },
              { name: 'view', handler: handleView },
            ]"
            @action-click="handleActionClick"
            @row-click="handleDataClick"
            class="rounded-lg overflow-hidden"
          />
        </div>
      </div>

      <!-- Tableau Sortable avec Actions -->
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
      >
        <div
          class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
          @click="
            isActionsTableSortableCollapsed = !isActionsTableSortableCollapsed
          "
        >
          <div>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
              Tableau sortable avec Actions
            </h3>
            <p class="mt-1 text-gray-600 dark:text-gray-300">
              Boutons d'actions intégrés
            </p>
          </div>
          <svg
            class="w-6 h-6 text-gray-500 transition-transform duration-200"
            :class="{ 'transform rotate-180': isActionsTableSortableCollapsed }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div class="p-6" v-if="!isActionsTableSortableCollapsed">
          <SortableTable
            :headers="mockTableData.headers"
            :items="mockTableData.items"
            :theme="isDark ? 'dark' : 'light'"
            :show-actions="true"
            :actions="[
              { name: 'edit', handler: handleEdit },
              { name: 'delete', handler: handleDelete },
              { name: 'view', handler: handleView },
            ]"
            @action-click="handleActionClick"
          />
        </div>
      </div>

      <!-- Tableau Paginé avec Actions -->
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
      >
        <div
          class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex justify-between items-center"
          @click="
            isActionsTablePaginatedCollapsed = !isActionsTablePaginatedCollapsed
          "
        >
          <div>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
              Tableau Paginé avec Actions
            </h3>
            <p class="mt-1 text-gray-600 dark:text-gray-300">
              Boutons d'actions intégrés
            </p>
          </div>
          <svg
            class="w-6 h-6 text-gray-500 transition-transform duration-200"
            :class="{
              'transform rotate-180': isActionsTablePaginatedCollapsed,
            }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div class="p-6" v-if="!isActionsTablePaginatedCollapsed">
          <PaginatedTable
            :headers="mockTableData.headers"
            :items="mockTableData.items"
            :theme="isDark ? 'dark' : 'light'"
            :show-actions="true"
            :actions="[
              { name: 'edit', handler: handleEdit },
              { name: 'delete', handler: handleDelete },
            ]"
            :items-per-page="5"
            @action-click="handleActionClick"
          />
        </div>
      </div>
    </div>
    <ConfirmModal
      v-model:show="showDeleteModal"
      title="Confirmer la suppression"
      message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
      confirm-text="Supprimer"
      cancel-text="Annuler"
      type="danger"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  DataTable,
  SortableTable,
  PaginatedTable,
  TableItem,
  SortState,
  LoadMorePayload,
} from "@components/common/ui/tables";
import { mockTableData } from "@components/common/ui/tables/constants/MockDataTables";
import { useTheme } from "@/composables/useTheme";
import ConfirmModal from "@components/common/ui/modals/ConfirmModal.vue";

const isDark = useTheme();

// États pour gérer le collapse/expand des tables
const isBasicDataTableCollapsed = ref(true);
const isSortableTableCollapsed = ref(true);
const isPaginatedTableCollapsed = ref(true);
const isDataTableLazyCollapsed = ref(true);
const isSortableTableLazyCollapsed = ref(true);
const isPaginatedTableLazyCollapsed = ref(true);
const isActionsTableCollapsed = ref(true);
const isActionsTableSortableCollapsed = ref(true);
const isActionsTablePaginatedCollapsed = ref(true);

// État pour la modale de suppression
const showDeleteModal = ref(false);
const itemToDelete = ref<TableItem | null>(null);

// Génération d'un grand dataset pour tester le lazy loading
const largeDataset = computed(() => {
  return [
    ...mockTableData.items,
    ...mockTableData.items.map((item) => ({
      ...item,
      id: item.id + 1000,
    })),
    ...mockTableData.items.map((item) => ({
      ...item,
      id: item.id + 2000,
    })),
  ];
});

const handleDataClick = (item: TableItem) => {
  console.log("Row clicked:", item);
};

const handleSortChange = (sort: SortState) => {
  console.log("Sort changed:", sort);
};

const handlePageChange = (page: number) => {
  console.log(
    "Page changed to:",
    page,
    "Total items:",
    mockTableData.items.length
  );
};

const handleLazyPageChange = (page: number) => {
  console.log("Lazy page changed:", page);
};

const handleItemsPerPageChange = (itemsPerPage: number) => {
  console.log("Items per page changed:", itemsPerPage);
};

const handleLoadMore = async (payload: LoadMorePayload) => {
  console.log("Loading more items:", payload);
  // Simuler un chargement asynchrone
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockTableData.items.map((item, index) => ({
    ...item,
    id: item.id + payload.startIndex + 1000,
  }));
};

const handleActionClick = (payload: any) => {
  console.log("Action clicked:", payload.action, "on item:", payload.item);
  // Ajouter ici la logique pour chaque action
  if (payload.action === "edit") {
    // Ouvrir un modal d'édition
  } else if (payload.action === "delete") {
    // Confirmer la suppression
  }
};

const handleView = async (item: TableItem) => {
  console.log("View action on item:", item);
};

const handleEdit = async (item: TableItem) => {
  console.log("Edit action on item:", item);
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

const handleDelete = async (item: TableItem) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  const scrollto = document.getElementById("confirm-modal");
  if (scrollto) {
    scrollto.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const handleDeleteConfirm = () => {
  if (itemToDelete.value) {
    console.log("Deleting item:", itemToDelete.value);
    // Logique de suppression ici
  }
  showDeleteModal.value = false;
};

const handleDeleteCancel = () => {
  showDeleteModal.value = false;
};
</script>

<style scoped>
.tables-test-view {
  min-height: 100vh;
  background-color: #f9fafb;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
