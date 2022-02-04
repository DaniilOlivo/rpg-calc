import { init } from "./actions";
import store from "./store";

export function initCharMain(data) {
    store.dispatch(init(data))
}
