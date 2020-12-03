Vue.config.devtools = true

const app = new Vue({
  el: '#root',
  data: {
    language: "it",
    films:[],
    languages: [
      {
        name: "Italian",
        code: "it"
      },{
        name: "English",
        code: "en"
      },{
        name: "Espanish",
        code: "es"
      },{
        name: "German",
        code: "de"
      },{
        name: "Japanese",
        code: "ja"
      },{
        name: "Portuguese",
        code: "pt"
      },{
        name: "Korean",
        code: "ko"
      },{
        name: "Czech",
        code: "cs"
      }
    ],
    apikey: "5e0249fd83f2f5d1fe32d106abd0e176",
    genreSelected: "All",
    searchTitle: "",
    searchedTitle: "",
    page: 1,
    maxPages: 1
  },
  methods:{
    searchMovies: function(){
      this.page = 1
      this.searchedTitle = this.searchTitle
      if(!this.searchedTitle){
      }else{
        this.searchFilm()
        this.searchTv()
      }
    },
    validateFilm: function(el){
      return ((el.vote_average > 2) && (el.poster_path != null) && ((el.original_language == this.language) || (el.original_language == "en" )))
    },
    searchFilm: function(){
      axios.get("https://api.themoviedb.org/3/search/movie", {
        params:{
          'api_key': this.apikey,
          query: this.searchTitle,
          language: this.language,
          region: this.language,
          page: this.page
        }
      })
      .then(response => {
        let arr = response.data.results
        arr.sort(function (a, b) {return b.vote_average - a.vote_average;})
        this.films = arr.filter(this.validateFilm)
        this.maxPages = response.data.total_pages
      })
    },
    searchTv: function(){
      axios.get("https://api.themoviedb.org/3/search/tv", {
        params:{
          'api_key': this.apikey,
          query: this.searchTitle,
          language: this.language,
          region: this.language,
          page: this.page
        }
      })
      .then(response => {
        let arr = response.data.results
        arr.map(el => el.title = el.name)
        arr.sort(function (a, b) {return a.vote_average - b.vote_average;})
        this.films = this.films.concat(arr.filter(this.validateFilm))
        this.maxPages = response.data.total_pages
      })
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
    },
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight - 200);

        if (bottomOfWindow) {
          this.page++
          if(this.page <= this.maxPages){
            axios.get("https://api.themoviedb.org/3/search/movie", {
              params:{
                'api_key': this.apikey,
                query: this.searchTitle,
                language: this.language,
                region: this.language,
                page: this.page
              }
            })
            .then(response => {
              let arr = response.data.results
              arr = arr.filter(this.validateFilm)
              arr.sort(function (a, b) {return a.vote_average - b.vote_average;})
              this.films = this.films.concat(arr)
            })

          }

        }
      };
    }
  },
  mounted() {
    this.scroll()
  }
});
