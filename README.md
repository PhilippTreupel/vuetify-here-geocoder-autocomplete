# Vuetify Here Geocoder Autocomplete

> A wrapper for the v-autocomplete component from [Vuetify](https://vuetifyjs.com) to use the **autocomplete feature of the new [HERE Geocoding & Search API](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-autocomplete-brief.html)**

>![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/PhilippTreupel/vuetify-here-geocoder-autocomplete/release-library/main?logo=github&style=for-the-badge)
>![Codecov branch](https://img.shields.io/codecov/c/github/PhilippTreupel/vuetify-here-geocoder-autocomplete/main?color=green&style=for-the-badge&logo=codecov)
>[![VueJS 2.x](https://img.shields.io/badge/vue-2.x-brightgreen.svg?style=for-the-badge)](https://vuejs.org)
>[![npm](https://img.shields.io/npm/v/vuetify-here-geocoder-autocomplete.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/vuetify-here-geocoder-autocomplete)
>![GitHub](https://img.shields.io/github/license/PhilippTreupel/vuetify-here-geocoder-autocomplete?style=for-the-badge)


## Demo

A demo is available [here](https://philipptreupel.github.io/vuetify-here-geocoder-autocomplete/).

## Installation

Run in your terminal:

```bash
# npm
npm install vuetify-cleave

# Yarn
yarn add vuetify-cleave
```

You also need to sign up for a free account with [Here](https://developer.here.com/sign-up?create=Freemium-Basic&keepState=true&step=account) which offers you 250K transactions per month for free (as of 2021) to generate an API key.

:warning: Warning: The autocomplete function of the HERE Geocoding & Search API is currently still in BETA state. But works fine in combination with this library. :warning:

## Usage

```vue
<template
  ><v-here-geocoder-autocomplete
    :here-api-key="myHereApiKey"
    v-model="place"
    debounce-time
    clearable
  />
</template>
<script>
import VHereGeocoderAutocomplete from "vuetify-here-geocoder-autocomplete";
export default {
  name: "App",
  components: {
    VHereGeocoderAutocomplete
  },
  data() {
    return {
      place: null,
      myHereApiKey: "API_KEY" // I highly recommend you to inject the API key via an environment variable
    };
  }
};
</script>
```

The variable `place` looks like this:

```json
{
  "title": "Deutschland, 10557, Berlin, Platz der Republik 1",
  "id": "here:af:streetsection:yS70afKYO41l5M.aTlXOQD:CgcIBCDVrstQEAEaATE",
  "resultType": "houseNumber",
  "houseNumberType": "PA",
  "address": {
    "label": "Platz der Republik 1, 10557 Berlin, Deutschland",
    "countryCode": "DEU",
    "countryName": "Deutschland",
    "stateCode": "BE",
    "state": "Berlin",
    "countyCode": "B",
    "county": "Berlin",
    "city": "Berlin",
    "district": "Tiergarten",
    "street": "Platz der Republik",
    "postalCode": "10557",
    "houseNumber": "1"
  },
  "highlight": "<b>Deutschland</b>, 10557, Berlin, <b>Platz der Republik 1</b>"
}
```

However, this depends on the type of search result, the fields `title`, `id` and `address` will always be included in the result.

The `highlight` field is the string that is displayed to the user and converts the highlight details provided by the API to the value of the `title` field. However, this field can also be set with a custom highlighting using the `customHighlight` property (see [Custom Highlighting](#custom-highlighting)).

#### Note for initial value

If you don't store this kind of object in your application, you can still pass a plain string that is equivalent to the value `title`, e.g.: `Deutschland, 10557, Berlin, Platz der Republik 1`.

If this value is not `null` during the initialization of the component, it will automatically request the Here API and use the first hit.

That means if `place` is equal to `Deutschland, 10557, Berlin, Platz der Republik 1`, it will be automatically transformed to the above JSON object.

### Props

#### Required Properties

| Property       | Type     | Default | Description                                                                                                                          |
| :------------- | :------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| `here-api-key` | `String` |         | [Sign up](https://developer.here.com/sign-up?create=Freemium-Basic&keepState=true&step=account) with Here to generate a free API key |

#### Here API Query Properties

These properties can be used to directly configure the search query to the here autocomplete API. The values are inserted unchanged into the query.
The documentation for the usage can be found in the [API Reference](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html) in the autocomplete section.

| Property | Type     | Default                                               | Description                                                                                                                                                                                             |
| :------- | :------- | :---------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `at`     | `String` | `null`                                                | Check the `at` parameter in the [API Reference](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html) &rarr; Autocomplete &rarr; QUERY PARAMETERS &rarr; `at`       |
| `in`     | `String` | `null`                                                | Check the `limit` parameter in the [API Reference](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html) &rarr; Autocomplete &rarr; QUERY PARAMETERS &rarr; `in`    |
| `limit`  | `Number` | `null`                                                | Check the `in` parameter in the [API Reference](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html) &rarr; Autocomplete &rarr; QUERY PARAMETERS &rarr; `limit`    |
| `types`  | `String` | `null`                                                | Check the `types` parameter in the [API Reference](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html) &rarr; Autocomplete &rarr; QUERY PARAMETERS &rarr; `types` |
| `lang`   | `String` | `navigator.language` (if available, otherwise `null`) | Check the `lang` parameter in the [API Reference](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html) &rarr; Autocomplete &rarr; QUERY PARAMETERS &rarr; `lang`   |

#### Filter Properties

Since the `types` property of the Here Autocomplete API offers only limited possibilities to build for example a country picker, the search results can be filtered by the properties contained in the search result object.

**CAUTION** the fields in the result objects are not always consistent. For what exactly to filter for in order to achieve the desired restriction, see the [examples of the API](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics-api/code-autocomplete-examples.html) and the [API Reference](https://developer.here.com/documentation/geocoding-search-api/api-reference-swagger.html).

**In any case, the `types` property must also be set**, since the filtering is based only on the 5 (default) results returned by the API.

Example: To limit the results to countries, the properties `types="area"` and `administrative-area-type="country"` must be set.

| Property                 | Type     | Default | Description                                                                                                               |
| :----------------------- | :------- | :------ | :------------------------------------------------------------------------------------------------------------------------ |
| `resultType`             | `String` | `null`  | Filters for results where `resultType` exists in the search result object and matches the value defined here.             |
| `houseNumberType`        | `String` | `null`  | Filters for results where `houseNumberType` exists in the search result object and matches the value defined here.        |
| `localityType`           | `String` | `null`  | Filters for results where `localityType` exists in the search result object and matches the value defined here.           |
| `administrativeAreaType` | `String` | `null`  | Filters for results where `administrativeAreaType` exists in the search result object and matches the value defined here. |

#### Other Properties

| Property           | Type                             | Default            | Description                                                                 |
| :----------------- | :------------------------------- | :----------------- | :-------------------------------------------------------------------------- |
| `debounceTime`     | <code>Number&#124;Boolean</code> | `false`            | Pass `true` to debounce the API requests for 250ms, or pass a custom delay. |
| `custom-highlight` | `Function`                       |                    | See [Custom Highlighting](#custom-highlighting)                             |
| `prependIcon`      | `String`                         | `"mdi-map-marker"` | Default styling, you can overwrite it like every other Vuetify property     |

######**Furthermore, every prop from [Vuetify Autocomplete component](https://vuetifyjs.com/en/api/v-autocomplete/#props) is supported**, except `items`, `search-input.sync`, `filter`, `loading`, and `return-object` which are used internally.

### Events

| Name    | Description                                                                    | Arguments                                |
| ------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| `input` | Emitted when the user selects a place                                          | `@input="onInput"`, `onInput(place) { }` |
| `clear` | Emitted when the user click on the _clear button_ (used with prop `clearable`) | `@clear="onClear"`, `onClear() { }`      |
| `error` | Emitted when there is an error with the Here API                               | `@error="onError"`, `onError(error) { }` |

### Custom highlighting

You can override the default behavior of highlighted search query hits via a custom function and/or slot. When using both, the returned value of your custom highlight function will become the `highlight` prop in the slot.

The Here API provides the highlighting details in the form of the `highlights` field in each search result as seen in the Response sample in the API Reference.

For example like this:

```json
{
  "title": "Deutschland, 10557, Berlin, Platz der Republik 1",
  "id": "here:af:streetsection:yS70afKYO41l5M.aTlXOQD:CgcIBCDVrstQEAEaATE",
  "resultType": "houseNumber",
  "houseNumberType": "PA",
  "address": {},
  "highlights": {
    "title": [
      {
        "start": 0,
        "end": 11
      },
      {
        "start": 13,
        "end": 18
      },
      {
        "start": 47,
        "end": 48
      }
    ],
    "address": {
      "label": [
        {
          "start": 0,
          "end": 18
        }
      ],
      "country": [
        {
          "start": 0,
          "end": 11
        }
      ]
    }
  }
}
```

This complicates the implementation by inserting for example HTML tags.

#### With a custom function

```vue
<v-here-geocoder-autocomplete :custom-highlight="yourCustomHighlightFunction" />
```

If custom highlighting is required, I highly recommend checking out the default function and understanding how highlighting is possible.

The custom highlight function gets the unmodified search result object and returns a string.

The default highlight function:

```js
placeItem => {
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
};
```

#### With the slot

Note that this slot's parent element is a `<v-list-tile-content>`

```vue
<v-here-geocoder-autocomplete>
  <template slot="highlight" slot-scope="{ highlight }">
    <v-list-tile-title>{{ highlight }}</v-list-tile-title>
  </template>
</v-here-geocoder-autocomplete>
```
