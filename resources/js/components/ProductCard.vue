<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid="product-card">
    <!-- Card Header with Type Badge -->
    <div class="relative">
      <div :class="[
        'h-3',
        typeColors[product.type] || 'bg-gray-500'
      ]"></div>
      <span :class="[
        'absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
        typeBadgeColors[product.type] || 'bg-gray-100 text-gray-800'
      ]">
        {{ product.type }}
      </span>
    </div>

    <!-- Card Content -->
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ product.coverage }}</p>
        </div>
      </div>

      <!-- Description -->
      <p v-if="product.description" class="text-sm text-gray-500 mb-4 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Price Section -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <span class="text-2xl font-bold text-indigo-600">KES {{ formatPrice(product.price) }}</span>
          <span class="text-sm text-gray-500">/month</span>
        </div>
        <button class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Get Quote
        </button>
      </div>

      <!-- Product ID -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <span class="text-xs text-gray-400">ID: {{ product.product_id }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const typeColors = {
  HEALTH: 'bg-green-500',
  LIFE: 'bg-blue-500',
  AUTO: 'bg-orange-500',
  HOME: 'bg-purple-500',
  TRAVEL: 'bg-teal-500',
  PET: 'bg-pink-500'
};

const typeBadgeColors = {
  HEALTH: 'bg-green-100 text-green-800',
  LIFE: 'bg-blue-100 text-blue-800',
  AUTO: 'bg-orange-100 text-orange-800',
  HOME: 'bg-purple-100 text-purple-800',
  TRAVEL: 'bg-teal-100 text-teal-800',
  PET: 'bg-pink-100 text-pink-800'
};

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
