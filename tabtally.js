/**
 * TabTally
 * @version 1.0.0
 * @author George Mandis <george@mand.is>
 * @description A simple utility to keep track of the number of tabs open for a given origin.
 * @license MIT
 * @copyright 2024
 */
const TabTally = {
  tabMap: new Map(Object.entries({ [location.href]: 1 })),
  bc: new BroadcastChannel("TabTally"),
  updateMap(inc, data) {
    if (this.tabMap.has(data[1])) {
      this.tabMap.set(data[1], this.tabMap.get(data[1]) + inc);
    } else {
      this.tabMap.set(data[1], 1);
    }
  },
  getTotal() {
    return [...this.tabMap.values()].reduce((a, b) => a + b);
  },
  getTabs() {
    return Object.fromEntries(TabTally.tabMap);
  },
  init(callback = () => { }) {
    window.addEventListener("load", () => {
      this.bc.postMessage(["hello", location.href]);
    });

    window.addEventListener("beforeunload", () => {
      this.bc.postMessage(["bye", location.href]);
    });

    this.bc.onmessage = (event) => {
      const { data } = event;

      if (data[0] === "hello") {
        this.tabMap = new Map(Object.entries({ [location.href]: 1 }));
        this.updateMap(1, data);
        this.bc.postMessage(["hi", location.href]);
      }

      if (data[0] === "hi") {
        this.updateMap(1, data);
      }

      if (data[0] === "bye") {
        this.updateMap(-1, data);
      }

      callback();
    };

    callback();
  },
};