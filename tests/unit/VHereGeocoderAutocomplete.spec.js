import { mount, createLocalVue } from "@vue/test-utils";
import VHereGeocoderAutocomplete from "@/components/VHereGeocoderAutocomplete";
import Vuetify from "vuetify";
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
        hereApiKey: "AN_API_KEY"
      }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
