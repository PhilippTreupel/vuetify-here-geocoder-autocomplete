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
        <v-toolbar-title>Vuetify Here Geocoder Autocomplete</v-toolbar-title>
      </div>

      <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>

      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        href="https://github.com/PhilippTreupel/vuetify-here-geocoder-autocomplete"
        target="_blank"
        text
      >
        <span class="mr-2">Github</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-btn
        v-if="$vuetify.breakpoint.mdAndUp"
        href="https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autocomplete-brief.html"
        target="_blank"
        text
      >
        <span class="mr-2">Here Geocoder API</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <template v-if="$vuetify.breakpoint.smAndDown" v-slot:extension>
        <div class="d-flex justify-center align-center">
          <div>
            <v-btn
              class="mx-4"
              href="https://github.com/PhilippTreupel/vuetify-here-geocoder-autocomplete"
              target="_blank"
              text
            >
              <span class="mr-2">Github</span>
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
          <div>
            <v-btn
              class="mx-4"
              href="https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autocomplete-brief.html"
              target="_blank"
              text
            >
              <span class="mr-2">Here Geocoder API</span>
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" xs="12" class="text-center pa-8">
            <div class="pa-4 display-2">
              Vuetify Here Geocoder Autocomplete Demo
            </div>

            <div class="px-4 pb-8 subtitle-1">
              A wrapper library for the v-autocomplete component from Vuetify to
              use the autocomplete feature of the new HERE Geocoding & Search
              API
            </div>
          </v-col>
          <v-col cols="12" xs="12">
            <v-card class="pa-8">
              <v-row
                ><v-col cols="12" xs="12">
                  <div class="display-1 text-center">Usage Example</div>
                </v-col>
                <v-col cols="12" xs="12">
                  <v-here-geocoder-autocomplete
                    :here-api-key="hereApiKey"
                    v-model="place"
                    label="Search for any place..."
                    debounce-time
                    append-icon=""
                    hide-no-data
                    clearable
                    outlined
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" xs="12">
            <v-card class="pa-8">
              <v-row
                ><v-col cols="12" xs="12">
                  <div class="display-1 text-center">Result object</div>
                </v-col>
                <v-col cols="12" xs="12">
                  <pre class="pa-3 mb-3 d-block font-weight-bold text-block">{{
                    JSON.stringify(place, null, 2)
                  }}</pre>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" xs="12">
            <v-card class="pa-8">
              <v-row
                ><v-col cols="12" xs="12">
                  <div class="display-1 text-center">Used configuration</div>
                </v-col>
                <v-col cols="12" xs="12">
                  <code class="pa-3 mb-3 d-block font-weight-bold text-block">{{
                    installationCode
                  }}</code>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" xs="12">
            <v-card class="pa-8 d-flex justify-center align-center" flat>
              <v-btn
                x-large
                color="primary"
                href="https://github.com/PhilippTreupel/vuetify-here-geocoder-autocomplete#vuetify-here-geocoder-autocomplete"
                >Read the docs
                <v-icon right>mdi-file-document-outline</v-icon></v-btn
              >
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
    installationCode:
      '<v-here-geocoder-autocomplete\n  :here-api-key="hereApiKey"\n  v-model="place"\n  label="Search for any place..."\n  debounce-time\n  append-icon=""\n  hide-no-data\n  clearable\n  outlined\n/>',
    place: "DC, DC, 20003, Washington DC, 1600 Pennsylvania Ave SE"
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
<style>
.text-block {
  white-space: pre;
  overflow-wrap: break-word;
  word-wrap: break-word;
  overflow-x: auto;
}

.v-toolbar__extension {
  display: flex;
  justify-content: center;
}
</style>
