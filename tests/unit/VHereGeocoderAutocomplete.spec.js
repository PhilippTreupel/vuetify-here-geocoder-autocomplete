import { mount, createLocalVue } from "@vue/test-utils";
import VHereGeocoderAutocomplete from "@/components/VHereGeocoderAutocomplete";
import Vuetify from "vuetify";
const flushPromises = require("flush-promises");
const sinon = require("sinon");
describe("VHereGeocoderAutocomplete.vue", () => {
  let localVue;
  let wrapper;
  let vuetify;
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    localVue = createLocalVue();
    vuetify = new Vuetify();
    localVue.use(vuetify);
  });
  it("renders and match snapshot", () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY"
      }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it("is searching results for a given entry", async () => {
    let place = "Berlin";
    const searchPlacesMock = sinon.fake();
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        value: place,
        hereApiKey: "HERE_API_KEY"
      },
      methods: {
        searchPlaces: searchPlacesMock
      }
    });
    expect(wrapper.vm.query).toBe(place);
    await flushPromises();
    expect(searchPlacesMock.called).toBe(true);
  });
  it("sets default data properties as expected", async () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY"
      }
    });
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.query).toBeUndefined();
    expect(wrapper.vm.place.title).toBeUndefined();
    expect(wrapper.vm.places.length).toBe(0);
    expect(wrapper.vm.filter()).toBe(true);
  });
  it("sets default component props as expected", async () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY"
      }
    });
    expect(Object.keys(wrapper.vm.$props.value).length).toBe(0);
    expect(wrapper.vm.$props.hereApiKey).toEqual("HERE_API_KEY");
    expect(wrapper.vm.$props.at).toBeNull();
    expect(wrapper.vm.$props.in).toBeNull();
    expect(wrapper.vm.$props.limit).toBeNull();
    expect(wrapper.vm.$props.types).toBeNull();
    expect(wrapper.vm.$props.lang).toBe(navigator.language);
    expect(wrapper.vm.$props.resultType).toBeNull();
    expect(wrapper.vm.$props.houseNumberType).toBeNull();
    expect(wrapper.vm.$props.localityType).toBeNull();
    expect(wrapper.vm.$props.administrativeAreaType).toBeNull();
    expect(wrapper.vm.$props.debounceTime).toBe(false);
    expect(wrapper.vm.$props.prependIcon).toEqual("mdi-map-marker");
    expect(
      wrapper.vm.$props.customHighlight({
        title: "TESTTESTTEST",
        highlights: {
          title: [
            { start: 0, end: 4 },
            { start: 8, end: 12 }
          ]
        }
      })
    ).toEqual("<b>TEST</b>TEST<b>TEST</b>");
  });
  it("has working debounce function", async () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY"
      }
    });
    const testFunction = sinon.fake();
    const debounceTestFunction = wrapper.vm.debounce(testFunction, 200);
    debounceTestFunction();
    debounceTestFunction();
    await new Promise(r => setTimeout(r, 300));
    expect(testFunction.calledOnce).toBe(true);
  });
  it("has working debouncedSearchPlaces function", async () => {
    const searchPlacesMock = sinon.fake();
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY"
      },
      methods: {
        searchPlaces: searchPlacesMock
      }
    });
    await wrapper.vm.debouncedSearchPlaces();
    expect(searchPlacesMock.called).toBe(true);
  });
  it("clears input onClear()", async () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY"
      }
    });
    wrapper.vm.onClear();
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().input[0][0]).toBeNull();
    expect(wrapper.emitted().clear).toBeTruthy();
  });
  it("has working emitInputOnMountedSearch function", async () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY"
      }
    });
    const place = "TEST";
    wrapper.vm.emitInputOnMountedSearch(place);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.place).toEqual(place);
    expect(wrapper.emitted().input[0][0]).toEqual(place);
  });
  it("has working searchPlaces function", async () => {
    const resultType = "resultType";
    const houseNumberType = "houseNumberType";
    const localityType = "localityType";
    const administrativeAreaType = "administrativeAreaType";
    const foundItem = {
      resultType,
      houseNumberType,
      localityType,
      administrativeAreaType,
      title: "TEST1",
      highlights: {}
    };
    const error = new Error("TEST ERROR");
    require("jest-fetch-mock").enableMocks();
    fetch.enableMocks();
    fetch.mockResponse(
      JSON.stringify({
        items: [
          foundItem,
          {
            title: "TEST2",
            highlights: {}
          },
          {
            resultType,
            houseNumberType,
            localityType,
            administrativeAreaType: "OTHER VALUE",
            title: "TEST3",
            highlights: {}
          }
        ]
      })
    );
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY",
        resultType,
        houseNumberType,
        localityType,
        administrativeAreaType
      }
    });
    wrapper.vm.query = "TEST";
    await wrapper.vm.searchPlaces(firstItem => {
      expect(firstItem.title).toBe(foundItem.title);
    });
    expect(wrapper.vm.places.length).toBe(1);

    // test else block if searchResults==null
    fetch.mockResponseOnce(JSON.stringify({}));
    await wrapper.vm.searchPlaces(place => {
      expect(place).toEqual(wrapper.vm.place);
    });
    // test else block if queryReady === false
    wrapper.vm.query = null;
    await wrapper.vm.searchPlaces(place => {
      expect(place).toEqual(wrapper.vm.place);
    });
    // test the catch block
    fetch.mockRejectOnce(error);
    wrapper.vm.query = "TEST";
    await wrapper.vm.searchPlaces(() => {});
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted().error[0][0]).toBe(error);
  });
  it("has a working watcher on computed prop searchQuery", async () => {
    let place = "Berlin";
    const searchPlacesMock = sinon.fake();
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        value: place,
        hereApiKey: "HERE_API_KEY"
      },
      methods: {
        searchPlaces: searchPlacesMock
      }
    });
    expect(wrapper.vm.query).toBe("Berlin");
    await flushPromises();
    // now the actually test of the edge case in searchQuery watcher
    wrapper.vm.$props.limit = 1;
    await flushPromises();
    expect(searchPlacesMock.calledTwice).toBe(true);
  });
  it("has a working watcher on the prop debounceTime", async () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        debounceTime: true,
        hereApiKey: "HERE_API_KEY"
      }
    });
    expect(wrapper.vm.$props.debounceTime).toBe(true);
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        debounceTime: 250,
        hereApiKey: "HERE_API_KEY"
      }
    });
    expect(wrapper.vm.$props.debounceTime).toBe(250);
  });
  it("configures the searchQuery correctly depending on the prop values", async () => {
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereApiKey: "HERE_API_KEY",
        at: "AT",
        in: "IN",
        limit: 1,
        types: "TYPES",
        lang: "LANG"
      }
    });
    wrapper.vm.query = "QUERY QUERY";
    expect(wrapper.vm.searchQuery).toBe(
      "https://autocomplete.search.hereapi.com/v1/autocomplete?q=QUERY+QUERY&apiKey=HERE_API_KEY&at=AT&in=IN&limit=1&types=TYPES&lang=LANG"
    );
  });
  it("logs an error if none of the auth props are set", async () => {
    jest.spyOn(console, "error").mockImplementationOnce(() => {});
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {}
    });
    expect(console.error).toHaveBeenCalled();
  });
  it("returns the right options for fetch() if 'hereBearerOAuthToken' is set", async () => {
    const authToken = "OAUTH_TOKEN";
    wrapper = mount(VHereGeocoderAutocomplete, {
      localVue,
      vuetify,
      propsData: {
        hereBearerOAuthToken: authToken
      }
    });

    expect(wrapper.vm.fetchCallOptions.headers.Authorization).toEqual(
      "Bearer " + authToken
    );
  });
});
