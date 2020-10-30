import Vue from 'vue'
import 'es6-promise/auto'
import VueCropper from 'vue-cropper'
import { createApp } from './app'
import ProgressBar from './components/ProgressBar.vue'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp()

Vue.use(VueCropper)

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    bar.start()
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        bar.finish()
        next()
      })
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  try {
    if (isChunkLoadFailed) {
      const LoadingChunk = window.sessionStorage.getItem('LoadingChunk');
      if (LoadingChunk) {
        window.sessionStorage.setItem('LoadingChunk', LoadingChunk - 0 + 1);
      } else {
        window.sessionStorage.setItem('LoadingChunk', 1);
      }
      if (LoadingChunk - 0 > 1) {
        // 防止 死循环
        return false;
      }
      router.replace(targetPath);
      window.sessionStorage.setItem('LoadingChunkPath', targetPath);
      const sa = window.sa;
      if (sa && sa.track) {
        sa.track('element_click', {
          page_title: 'LoadingChunk',
          element_type: 'view',
          page_source: targetPath, // 当前路由
          element_name: `刷新页面${LoadingChunk - 0}次` // 尝试 打开次数
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

router.onReady(vm => {
  try {
    const LoadingChunkPath = window.sessionStorage.getItem('LoadingChunkPath');
    const path = vm.path;
    if (LoadingChunkPath) {
      if (path !== LoadingChunkPath && path !== '/') {
        window.sessionStorage.setItem('LoadingChunkPath', vm.path);
        router.replace(vm.path);
      } else {
        router.replace(LoadingChunkPath);
      }
    }
  } catch (e) {
    console.log(e);
  }
});

// service worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/dist/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
