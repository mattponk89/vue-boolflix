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
    maxPages: 1,
    hoverFilm: "",
    catSearch:['All', 'Films', 'Tv Shows']
  },
  methods:{
    // ricerco con controllo del tipo selezionato
    searchMovies(){
      document.documentElement.scrollTop = 0
      this.page = 1
      this.films = []
      this.searchedTitle = this.searchTitle
        if(this.genreSelected === "All"){
          this.searchFilm()
          this.searchTv()
        } else if(this.genreSelected === "Films") {
          this.searchFilm()
        } else {
          this.searchTv()
        }
    },
    // filtro il film per non far vedere film troppo brutti o senza img
    validateFilm(el){
      return ((el.vote_average > 1) && (el.poster_path != null) && ((el.original_language == this.language) || (el.original_language == "en" )))
    },
    //richiesta film
    searchFilm(){
      axios.get("https://api.themoviedb.org/3/search/movie", {
        params:{
          'api_key': this.apikey,
          query: this.searchTitle,
          language: this.language,
          region: this.language,
          sort_by: "vote_average.desc",
          page: this.page
        }
      })
      .then(response => {
        let arr = response.data.results
        arr.sort(function (a, b) {return b.vote_average - a.vote_average;})
        this.films = this.films.concat(arr.filter(this.validateFilm))
        this.maxPages = response.data.total_pages

      })
    },
    // reset della pagina prima della ricerca
    resetPage(){
      document.documentElement.scrollTop = 0
      this.page = 1
      this.films = []
      this.searchedTitle = ""
    },
    // visualizzo i più popolari
    searchPopular(){
      let sel = ""
        if(this.genreSelected === "All"){
          select = "all"
        } else if(this.genreSelected === "Films") {
          select = "movie"
        } else {
          select = "tv"
        }
      const url = "https://api.themoviedb.org/3/trending/"+select+"/week"
      axios.get(url, {
        params:{
          'api_key': this.apikey,
          page: this.page
        }
      })
      .then(response => {
        let arr = response.data.results
        arr.map(el => {if(!el.title){el.title = el.name}})
        arr.sort(function (a, b) {return b.vote_average - a.vote_average;})
        this.films = this.films.concat(arr.filter(this.validateFilm))
        this.maxPages = response.data.total_pages
      })
    },
    //ricerca delle serie tv
    searchTv(){
      axios.get("https://api.themoviedb.org/3/search/tv", {
        params:{
          'api_key': this.apikey,
          query: this.searchTitle,
          language: this.language,
          region: this.language,
          sort_by: "vote_average.desc",
          page: this.page
        }
      })
      .then(response => {
        let arr = response.data.results
        arr.map(el => el.title = el.name)
        arr.sort(function (a, b) {return b.vote_average - a.vote_average;})
        this.films = this.films.concat(arr.filter(this.validateFilm))
        this.maxPages = response.data.total_pages
      })
    },
    //controllo se presente il path dell' immagine
    checkImg(el){
      let pathImg = el.poster_path
      let img = ""
      if(!pathImg){
        img = "no-img.png"
      }else{
        img = 'https://image.tmdb.org/t/p/w342/'+ pathImg
      }
      return img
    },
    //funzione di controllo per endless scroll
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight - 200);
        if (bottomOfWindow) {
          this.page++
            if(this.searchedTitle === ""){
              this.searchPopular()
            } else if(this.genreSelected === "All"){
              this.searchFilm()
              this.searchTv()
            } else if(this.genreSelected === "Films") {
              this.searchFilm()
            } else {
              this.searchTv()
            }
        }
      };
    }
  },
  mounted() {
    //una volta montato resetto la pagina e avvio la ricerca dei popolari
    this.resetPage()
    this.searchPopular()
    this.scroll()
  }
});
