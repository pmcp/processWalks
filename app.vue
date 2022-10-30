<template>
  <div class="container" >
    <!--    <sandbox-formkit />-->
    <process-all />
    <Account v-if="user" />
    <Auth v-else />

  </div>
</template>

<script setup>
import Process_All from "./components/ProcessAll";
import ProcessAll from "./components/ProcessAll";
import SandboxFormkit from "./components/sandboxFormkit";

const user = useSupabaseUser()
</script>