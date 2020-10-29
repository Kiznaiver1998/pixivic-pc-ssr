
<template>
  <div id="app">
    app
  </div>
</template>

<script>
// import HeaderBar from './components/PublicComponents/HeaderBar.vue';
// import LeftSide from './components/PublicComponents/LeftSide.vue';
// import cookie from 'js-cookie';
// import CollectPicture from './components/Collections/CollectPicture';

export default {
  name: 'App',
  components: {
    // HeaderBar,
    // LeftSide,
    // CollectPicture
  },
  data() {
    return {

    };
  },
  computed: {
    // key() {
    //   return this.$route.fullPath;
    // }
  },
  mounted() {
    // if (!cookie.get('alert')) {
    //   this.$notify({
    //     title: this.$tc('news.title'),
    //     message: this.$tc('news.content')
    //   });
    //   this.$notify({
    //     title: this.$tc('wechatImg'),
    //     duration: 0,
    //     dangerouslyUseHTMLString: true,
    //     message: '<img src="https://cdn.jsdelivr.net/gh/OysterQAQ/Blog-Image/wechat.jpg" style="height:200px;width:200px;"/>'
    //   });
    //   cookie.set('alert', true, {
    //     expires: 365
    //   });
    // }
    // this.$i18n.locale = cookie.get('lang') || 'zh';
  }
};
</script>
