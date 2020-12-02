Vue.config.devtools = true

const app = new Vue({
  el: '#root',
  data: {
    films:[],
    apikey: "5e0249fd83f2f5d1fe32d106abd0e176",
    genreSelected: "All",
    searchTitle: ""
  },
  methods:{
    searchMovies: function(){
      axios.get("https://api.themoviedb.org/3/search/movie", {
        params:{
          'api_key': this.apikey,
          query: this.searchTitle
        }
      })
      .then(response => this.films = response.data.results)
    }
  }
});
