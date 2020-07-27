
const Model = {
  namespace: 'tabs',
  state: {
    list: [],
    activityKey: null
  },
  // 异步改变state的值要在effects
  effects: {
  },
  // 同步改变state的值要在reducers
  reducers: {
    add(state, {payload}) {
      let b = false;
      console.log("zzzzzzz", state.list);
      state.list.forEach(t => {
        if (t.key === payload.key) b = true;
      });
      if (b || state.list.length >= 10) {
        return state;
      }
      return state.list.concat(payload);
    },
    setActivityKey(state, {payload}) {
      return payload;
    }
  },
};
export default Model;
