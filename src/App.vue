<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <v-app-bar-title>Vuetify Here Geocoder Autocomplete</v-app-bar-title>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Github</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-btn
        href="https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autocomplete-brief.html"
        target="_blank"
        text
      >
        <span class="mr-2">Here Geocoder API</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row
          ><v-col cols="12" xs="12">
            <v-card class="pa-8">
              <v-row
                ><v-col cols="12" xs="12">
                  <div class="display-1 text-center">Usage Example:</div>
                </v-col>
                <v-col cols="12" xs="12">
                  <v-here-geocoder-autocomplete
                    :here-api-key="hereApiKey"
                    v-model="place"
                    debounce-time
                    clearable
                    types="area"
                    administrative-area-type="country"
                  >
                  </v-here-geocoder-autocomplete>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" xs="12">
            <v-card class="pa-8">
              <v-row
                ><v-col cols="12" xs="12">
                  <div class="display-1 text-center">Code:</div>
                </v-col>
                <v-col cols="12" xs="12">
                  <code class="pa-3 mb-3 d-block">{{ installationCode }}</code>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import VHereGeocoderAutocomplete from "./components/VHereGeocoderAutocomplete";

export default {
  name: "App",

  components: {
    VHereGeocoderAutocomplete
  },

  data: () => ({
    hereApiKey: process.env.VUE_APP_HERE_API_KEY,
    installationCode: "hi",
    place: "Zaberfeld"
  }),
  methods: {
    customHighlight(placeItem) {
      if (placeItem.highlights.title != null) {
        let ret = placeItem.title;
        // this is necessary because adding a bold tags displaces the highlight indexes delivered by the here api
        let incrementCounter = 0;
        placeItem.highlights.title.forEach(highlight => {
          ret = [
            ret.slice(0, highlight.start + incrementCounter),
            "<b>",
            ret.slice(
              highlight.start + incrementCounter,
              highlight.end + incrementCounter
            ),
            "</b>",
            ret.slice(highlight.end + incrementCounter)
          ].join("");
          // number of characters added with the bold tag
          incrementCounter += 7;
        });
        return ret;
      } else {
        return placeItem.title;
      }
    }
  }
};
</script>
