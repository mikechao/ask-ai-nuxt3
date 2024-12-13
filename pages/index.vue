<script setup>
</script>

<template>
  <LayoutPageWrapper class="flex-1 flex">
    <LayoutPageSection class="flex-1 flex">
      <div class="flex-1 flex flex-col items-center justify-center">
        <AwesomeButton
          size="lg"
          text="I want to ask questions about written text"
          to="/text"
          class="font-extrabold"
        />
        <AwesomeButton
          size="lg"
          text="I want to ask questions about audio"
          to="/audio"
          class="font-extrabold"
        />
      </div>
    </LayoutPageSection>
  </LayoutPageWrapper>
</template>