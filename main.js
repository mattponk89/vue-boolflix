Vue.config.devtools = true

const app = new Vue({
  el: '#root',
  data: {
    language: "it",
    films:[],
    languages: [],
    apikey: "5e0249fd83f2f5d1fe32d106abd0e176",
    genreSelected: "All",
    searchTitle: "samurai"
  },
  methods:{
    searchMovies: function(){
      axios.get("https://api.themoviedb.org/3/search/movie", {
        params:{
          'api_key': this.apikey,
          query: this.searchTitle,
          language: this.language,
          region: this.language
        }
      })
      .then(response => this.films = response.data.results)
    },
    checkImg: function(el){
      let pathImg = el.poster_path
      let img = ""
      if(!pathImg){
        img = "no-img.png"
      }else{
        img = 'https://image.tmdb.org/t/p/w500/'+ pathImg
      }
      return img
    }
  },
  created: function(){
      axios.get("https://api.themoviedb.org/3/configuration/languages", {
        params:{
          'api_key': this.apikey
        }
      })
      .then(response => this.languages = response.data)
    }
});
