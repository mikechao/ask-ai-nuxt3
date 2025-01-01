<template>
    <div class="overflow-x-hidden">
      <LayoutPageNavbar class="h-[52px] max-h-[52px]" />
      <LayoutPageContent class="max-w-[68rem] m-auto h-full">
        <slot />
      </LayoutPageContent>
      <LayoutPageFooter class="h-[52px] md:h-[42px]" />
    </div>
  </template>