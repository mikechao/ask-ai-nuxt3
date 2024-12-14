<script setup lang="ts">

function sendQuestion() {
    console.log("Send question")
}
</script>

<template>
    <div>
      <div class="flex rounded-md mt-4">
        <div class="relative flex flex-col flex-grow items-stretch">
          <div>
            <div class="flex shadow-sm mb-4">
                <textarea
                 id="chat" rows="1"
                 placeholder="Send a message"/>
              <AwesomeButton size="md" @click="sendQuestion"/>
            </div>
          </div>
          <!-- chat back and forth goes here-->
        </div>
      </div>
    </div>
</template>