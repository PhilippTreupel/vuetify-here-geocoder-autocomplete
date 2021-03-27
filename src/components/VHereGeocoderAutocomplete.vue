<template>
  <v-autocomplete
    v-model="place"
    v-bind="$attrs"
    :items="places"
    :loading="loading"
    :search-input.sync="query"
    :filter="filter"
    return-object
    item-text="title"
    :prepend-icon="prependIcon"
    v-on="$listeners"
    @click:clear="onClear"
  >
    <template slot="item" slot-scope="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content>{{ data.item }}</v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <slot name="highlight" :highlight="data.item.highlight">
            <v-list-item-title v-html="data.item.highlight" />
          </slot>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "VHereGeocoderAutocomplete",
  props: {
    value: {
      type: [Object, String],
      required: false,
      default() {
        return {};
      }
    },
    hereApiKey: {
      type: String,
      required: false,
      default: null
    },
    hereBearerOAuthToken: {
      type: String,
      required: false,
      default: null
    },
    at: {
      type: String,
      required: false,
      default: null
    },
    in: {
      type: String,
      required: false,
      default: null
    },
    limit: {
      type: Number,
      required: false,
      default: null
    },
    types: {
      type: String,
      required: false,
      default: null
    },
    lang: {
      type: String,
      required: false,
      default: navigator.language ? navigator.language : null
    },
    resultType: {
      type: String,
      required: false,
      default: null
    },
    houseNumberType: {
      type: String,
      required: false,
      default: null
    },
    localityType: {
      type: String,
      required: false,
      default: null
    },
    administrativeAreaType: {
      type: String,
      required: false,
      default: null
    },
    debounceTime: {
      type: [Boolean, Number, String],
      default: false
    },
    // Vuetify props
    prependIcon: {
      type: String,
      default: "mdi-map-marker"
    },
    customHighlight: {
      type: Function,
      default: placeItem => {
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
  },
  data() {
    // The initial value can be a string or an object
    // eslint-disable-next-line no-nested-ternary
    const initialValue = this.value
      ? typeof this.value === "string"
        ? this.value
        : this.value.title
      : null;
    const initialPlace = { title: initialValue };
    return {
      loading: false,
      query: initialValue,
      place: initialPlace,
      places: initialValue ? [initialPlace] : [],
      filter() {
        return true; // filtering is done right after the api request
      }
    };
  },
  computed: {
    searchQuery() {
      let finalSearchQuery =
        "https://autocomplete.search.hereapi.com/v1/autocomplete?q=";
      if (this.query != null) {
        finalSearchQuery += this.query.replace(/\s/g, "+");
      }
      if (this.hereBearerOAuthToken == null) {
        finalSearchQuery += "&apiKey=" + this.hereApiKey;
      }
      if (this.at !== null) {
        finalSearchQuery += "&at=" + this.at;
      }
      if (this.in !== null) {
        finalSearchQuery += "&in=" + this.in;
      }
      if (this.limit !== null) {
        finalSearchQuery += "&limit=" + this.limit;
      }
      if (this.types !== null) {
        finalSearchQuery += "&types=" + this.types;
      }
      if (this.lang !== null) {
        finalSearchQuery += "&lang=" + this.lang;
      }
      return finalSearchQuery;
    },
    queryReady() {
      return (
        this.query !== null && this.query !== undefined && this.query !== ""
      );
    },
    fetchCallOptions() {
      if (this.hereBearerOAuthToken == null) {
        return {};
      } else {
        return {
          headers: { Authorization: "Bearer " + this.hereBearerOAuthToken }
        };
      }
    }
  },
  watch: {
    $props: {
      immediate: true,
      handler() {
        this.validateProps();
      }
    },
    query(val) {
      if (val !== null && val !== undefined && val.length >= 1) {
        this.debouncedSearchPlaces();
      }
    },
    debounceTime: {
      immediate: true,
      handler(val) {
        if (val) {
          if (typeof val === "boolean") {
            this.debouncedSearchPlaces = this.debounce(this.searchPlaces, 250);
          } else if (typeof val === "number" || typeof val === "string") {
            this.debouncedSearchPlaces = this.debounce(
              this.searchPlaces,
              Number(val)
            );
          }
        } else {
          this.debouncedSearchPlaces = this.searchPlaces;
        }
      }
    },
    searchQuery: {
      deep: true,
      handler(newVal, oldVal) {
        const oldQuery = oldVal.split("?q=")[1].split("&")[0];
        const newQuery = newVal.split("?q=")[1].split("&")[0];
        if (newQuery !== "" && newQuery === oldQuery) {
          this.debouncedSearchPlaces(this.setPlace);
        }
      }
    }
  },
  mounted() {
    if (this.queryReady) {
      this.searchPlaces(this.emitInputOnMountedSearch);
    }
  },
  methods: {
    async searchPlaces(callback = () => {}) {
      this.loading = true;
      try {
        if (this.queryReady) {
          let searchResults = await (
            await fetch(this.searchQuery, this.fetchCallOptions)
          ).json();
          searchResults = searchResults.items;
          if (searchResults !== null && searchResults !== undefined) {
            this.loading = false;
            if (this.resultType !== null) {
              searchResults = searchResults.filter(item => {
                return (
                  item.resultType !== null &&
                  item.resultType === this.resultType
                );
              });
            }
            if (this.localityType !== null) {
              searchResults = searchResults.filter(item => {
                return (
                  item.localityType !== null &&
                  item.localityType === this.localityType
                );
              });
            }
            if (this.administrativeAreaType !== null) {
              searchResults = searchResults.filter(item => {
                return (
                  item.administrativeAreaType !== null &&
                  item.administrativeAreaType === this.administrativeAreaType
                );
              });
            }
            if (this.houseNumberType !== null) {
              searchResults = searchResults.filter(item => {
                return (
                  item.houseNumberType !== null &&
                  item.houseNumberType === this.houseNumberType
                );
              });
            }
            this.places = searchResults.map(item => {
              const highlight = this.customHighlight(item);
              delete item.highlights;
              return {
                ...item,
                highlight
              };
            });
            callback(this.places[0]);
          } else {
            this.loading = false;
            callback(this.place);
          }
        } else {
          this.loading = false;
          callback(this.place);
        }
      } catch (error) {
        this.loading = false;
        this.$emit("error", error);
      }
    },
    async debouncedSearchPlaces() {},
    onClear() {
      this.$emit("input", null);
      this.$emit("clear");
    },
    emitInputOnMountedSearch(place) {
      this.setPlace(place);
      this.$emit("input", this.place);
    },
    setPlace(place) {
      this.place = place;
    },
    debounce(callback, wait, immediate) {
      let timeout;
      return () => {
        let context = this,
          args = arguments;
        let later = () => {
          timeout = null;
          if (!immediate) callback.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) callback.apply(context, args);
      };
    },
    validateProps() {
      // validate that at least one auth method is defined
      if (this.hereApiKey == null && this.hereBearerOAuthToken == null) {
        console.error(
          "Component error <v-here-geocoder-autocomplete>: One of the Here API authentication properties is required and must be defined. \n" +
            "Either 'hereApiKey' with a valid API key or 'hereBearerOAuthToken' with an unexpired OAuth token that can be obtained via the Here API OAuth interface.  "
        );
      }
    }
  }
};
</script>
