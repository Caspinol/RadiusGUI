<template>

  <v-card class="ma-2">
    <v-card-title class="headline accent--text">Last logins</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :total-items="items.length"
        item-key="username"
        hide-actions
      >
        <template
          slot="items"
          slot-scope="props"
        >
          <tr>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.reply }}</td>
            <td>{{ props.item.macaddress }}</td>
            <td>{{ formatTimeStamp(props.item.authdate) }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

</template>

<script>
  import { formatDate } from "../../utils";
  export default {
    props: {
      items: {
        required: true,
        type: Array
      }
    },
    data() {
      return {
        headers: [
          { text: "Username", value: "username" },
          { text: "Result", value: "reply" },
          { text: "MAC", value: "macaddress" },
          { text: "Time", value: "authdate" }
        ]
      };
    },
    methods: {
      formatTimeStamp: formatDate
    }
  };
</script>

<style scoped>
</style>
