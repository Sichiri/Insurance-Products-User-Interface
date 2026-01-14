<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Insurance Products</h1>
        <p class="mt-2 text-gray-600">Browse our comprehensive range of insurance plans</p>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="type in productStore.productTypes"
            :key="type"
            @click="productStore.setSelectedType(type)"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              productStore.selectedType === type
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            ]"
            :data-testid="`filter-${type.toLowerCase()}`"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productStore.loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="productStore.error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
        <div class="flex items-center">
          <svg class="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <p class="ml-3 text-red-700">{{ productStore.error }}</p>
          <button @click="productStore.fetchProducts()" class="ml-auto text-red-600 hover:text-red-800 font-medium">
            Retry
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in productStore.filteredProducts"
          :key="product.product_id"
          :product="product"
          data-testid="product-card"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!productStore.loading && !productStore.error && productStore.filteredProducts.length === 0" class="text-center py-20">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">No products found</h3>
        <p class="mt-2 text-gray-500">Try selecting a different category</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '../stores/products';
import ProductCard from '../components/ProductCard.vue';

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProducts();
});
</script>
